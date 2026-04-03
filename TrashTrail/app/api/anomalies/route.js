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

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');

    let anomalies = await localDb.anomalies.find();
    
    // Apply filters
    if (type) anomalies = anomalies.filter(a => a.type === type);
    if (severity) anomalies = anomalies.filter(a => a.severity === severity);
    if (status) anomalies = anomalies.filter(a => a.status === status);

    // Sort by date descending
    anomalies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Manual Join
    const rawData = await localDb.getRawData();
    const joinedAnomalies = anomalies.map(a => {
      const wasteBag = rawData.wastebags.find(w => w._id === a.wasteBagId || w.id === a.wasteBagId);
      const collector = rawData.users.find(u => u._id === a.collectorId || u.id === a.collectorId);
      return {
        ...a,
        wasteBag: wasteBag || { qrCode: 'N/A', wasteType: 'Unknown' },
        collector: collector ? { name: collector.name, email: collector.email, phone: collector.phone } : { name: 'System / Automated', email: 'support@trashtrail.com' }
      };
    });

    return NextResponse.json({ anomalies: joinedAnomalies });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();

    const updatedAnomaly = await localDb.anomalies.updateById(id, { status });
    if (!updatedAnomaly) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    return NextResponse.json({ anomaly: updatedAnomaly });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
