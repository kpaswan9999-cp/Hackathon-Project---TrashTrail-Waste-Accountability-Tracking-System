import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import localDb from '@/lib/localDb';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const db = await localDb.getRawData();
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. STATS
    const activeCollectors = db.users.filter(u => u.role === 'collector').length;
    const activeCitizens = db.users.filter(u => u.role === 'citizen').length;
    const openComplaints = db.complaints.filter(c => c.status === 'open').length;
    const anomaliesToday = db.anomalies.filter(a => new Date(a.createdAt) >= startOfToday).length;

    // 2. Total waste today
    const totalWasteToday = db.wastebags
      .filter(b => new Date(b.createdAt) >= startOfToday)
      .reduce((sum, b) => sum + (b.weightAtSource || 0), 0);

    // 3. Recycling Rate
    const totalBags = db.wastebags.length;
    const recycledBags = db.wastebags.filter(b => b.status === 'recycled').length;
    const recyclingRate = totalBags ? Math.round((recycledBags / totalBags) * 100) : 0;

    // 4. Daily Collection Trend (Last 7 Days)
    const dailyCollection = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const weight = db.wastebags
        .filter(b => {
          const bd = new Date(b.createdAt);
          return bd.toDateString() === d.toDateString();
        })
        .reduce((sum, b) => sum + (b.weightAtSource || 0), 0);
      dailyCollection.push({ name: dayName, weight });
    }

    // 5. Waste Classification
    const typeCounts = db.wastebags.reduce((acc, b) => {
      acc[b.wasteType] = (acc[b.wasteType] || 0) + 1;
      return acc;
    }, {});
    const colors = { dry: '#3b82f6', wet: '#10b981', hazardous: '#ef4444', mixed: '#64748b' };
    const wasteTypes = Object.entries(typeCounts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1) + " Waste",
      value: totalBags ? Math.round((count / totalBags) * 100) : 0,
      color: colors[type] || '#cbd5e1'
    }));

    // 6. Ward-wise Collection
    const wardWeights = {};
    db.wastebags.forEach(b => {
      const citizen = db.users.find(u => u.id === b.citizenId || u._id === b.citizenId);
      const ward = citizen?.ward || 'Unassigned';
      wardWeights[ward] = (wardWeights[ward] || 0) + (b.weightAtSource || 0);
    });
    const wardCollection = Object.entries(wardWeights).map(([ward, weight]) => ({ ward, weight }));

    // 7. Recent Activity (Latest 8 events across all bags and anomalies)
    const allEvents = [];
    
    // Extract recent timeline events
    db.wastebags.forEach(b => {
      (b.timeline || []).forEach(t => {
        const user = db.users.find(u => u.id === t.updatedBy || u._id === t.updatedBy);
        allEvents.push({
          id: `t-${b._id}-${t.timestamp}`,
          text: `Bag ${b.qrCode}: ${t.status.replace('_', ' ')} by ${user?.name || 'System'}`,
          time: t.timestamp,
          type: t.status === 'recycled' ? 'recycle' : t.status === 'collected' ? 'bag' : 'transit'
        });
      });
    });

    // Add anomalies
    db.anomalies.forEach(a => {
      const user = db.users.find(u => u.id === a.collectorId || u._id === a.collectorId);
      allEvents.push({
        id: `a-${a._id}`,
        text: `${a.type.replace('_', ' ')} detected — ${user?.name || 'Collector'}`,
        time: a.createdAt,
        type: 'anomaly'
      });
    });

    const recentActivity = allEvents
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    // 8. Top Collectors
    const collectorStats = {};
    db.wastebags.forEach(b => {
      if (b.collectorId) {
        if (!collectorStats[b.collectorId]) collectorStats[b.collectorId] = { pickups: 0, anomalies: 0 };
        collectorStats[b.collectorId].pickups++;
        if (b.anomalyFlag) collectorStats[b.collectorId].anomalies++;
      }
    });

    const topCollectors = Object.entries(collectorStats).map(([id, stats]) => {
      const user = db.users.find(u => u.id === id || u._id === id);
      const score = stats.pickups ? Math.round(((stats.pickups - stats.anomalies) / stats.pickups) * 100) : 0;
      return {
        id,
        name: user?.name || 'Unknown Agent',
        pickups: stats.pickups,
        score: score
      };
    }).sort((a, b) => b.pickups - a.pickups).slice(0, 5);

    return NextResponse.json({
      stats: {
        totalWasteToday: Math.round(totalWasteToday * 10) / 10,
        recyclingRate,
        activeCollectors,
        anomaliesToday,
        activeCitizens,
        openComplaints
      },
      dailyCollection,
      wasteTypes,
      wardCollection,
      recentActivity,
      topCollectors
    });

  } catch (err) {
    console.error('Analytics Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
