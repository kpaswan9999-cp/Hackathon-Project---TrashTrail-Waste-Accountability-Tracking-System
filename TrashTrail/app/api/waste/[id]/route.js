import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import localDb from '@/lib/localDb';

async function resolveTimeline(timeline) {
  const db = await localDb.getRawData();
  return timeline.map(entry => {
    const user = db.users.find(u => u.id === entry.updatedBy || u._id === entry.updatedBy);
    return {
      ...entry,
      updatedBy: user ? { name: user.name, role: user.role } : { name: 'Unknown', role: 'system' }
    };
  });
}

export async function GET(req, { params }) {
  try {
    const idOrQr = params.id;
    let bag = await localDb.wastebags.findOne({ qrCode: idOrQr });
    if (!bag) {
        bag = await localDb.wastebags.findById(idOrQr);
    }
    
    if (!bag) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const resolvedTimeline = await resolveTimeline(bag.timeline || []);

    return NextResponse.json({ 
      wasteBag: { ...bag, timeline: resolvedTimeline } 
    });
  } catch (err) {
    console.error(`[GET] Waste Bag Fetch Error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const { status, weight, note, location } = await req.json();
    const idOrQr = params.id;

    let bag = await localDb.wastebags.findOne({ qrCode: idOrQr });
    if (!bag) {
        bag = await localDb.wastebags.findById(idOrQr);
    }

    if (!bag) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const updates = { status: status || bag.status };

    // Handle Collector Flow specifically
    if (status === 'collected') {
      updates.collectorId = session.user.id;
      updates.weightAtCollection = Number(weight);
      
      // Anomaly Detection: Weight mismatch > 20%
      if (weight && bag.weightAtSource) {
        const diff = Math.abs(weight - bag.weightAtSource);
        const percentDiff = (diff / bag.weightAtSource) * 100;
        
        if (percentDiff > 20) {
          updates.anomalyFlag = true;
          updates.anomalyReason = `Weight mismatch detected: Source ${bag.weightAtSource}kg vs Collected ${weight}kg`;
          
          await localDb.anomalies.create({
            wasteBagId: bag._id,
            type: 'weight_mismatch',
            description: updates.anomalyReason,
            severity: 'medium',
            collectorId: session.user.id
          });
        }
      }
    } else if (weight) {
       updates.weightAtFacility = Number(weight);
    }

    // Handle Citizen Rewards when Recycled
    if (status === 'recycled' && bag.status !== 'recycled') {
      const citizen = await localDb.users.findById(bag.citizenId);
      if (citizen) {
        const weight = bag.weightAtCollection || bag.weightAtSource || 0;
        const co2Saved = weight * 0.5; // 0.5kg CO2 per 1kg recycled
        
        await localDb.users.updateById(bag.citizenId, {
          greenScore: (citizen.greenScore || 0) + 50, // Massive bonus for completion
          totalWasteRecycled: (citizen.totalWasteRecycled || 0) + weight,
          carbonSaved: (citizen.carbonSaved || 0) + co2Saved
        });
      }
    }

    // Update Timeline
    const newTimeline = [...(bag.timeline || [])];
    newTimeline.push({
      status: updates.status,
      note: note || `Package status updated to ${updates.status.replace('_', ' ')}`,
      updatedBy: session.user.id,
      location: location || null,
      timestamp: new Date().toISOString()
    });
    updates.timeline = newTimeline;

    const updatedBag = await localDb.wastebags.updateById(bag._id, updates);
    const resolvedTimeline = await resolveTimeline(updatedBag.timeline);

    return NextResponse.json({ 
      wasteBag: { ...updatedBag, timeline: resolvedTimeline } 
    });
  } catch (err) {
    console.error(`[PUT] Waste Bag Update Error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
