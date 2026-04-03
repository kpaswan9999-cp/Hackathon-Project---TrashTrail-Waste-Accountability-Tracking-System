import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import localDb from '@/lib/localDb';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    let filter = {};
    if (session.user.role === 'citizen') {
      filter = { citizenId: session.user.id };
    }

    const wasteBags = await localDb.wastebags.find(filter);
    // Sort by date descending
    wasteBags.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return NextResponse.json({ wasteBags });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'citizen') {
      return NextResponse.json({ message: 'Unauthorized - Only citizens can create bags' }, { status: 401 });
    }

    const { wasteType, weightAtSource, photoUrl } = await req.json();

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const qrCode = `TT-2025-${randomSuffix}`;

    const newBag = await localDb.wastebags.create({
      qrCode,
      citizenId: session.user.id,
      wasteType,
      weightAtSource: Number(weightAtSource),
      photoUrl,
      status: 'created',
      timeline: [{
        status: 'created',
        note: 'Waste bag registered by citizen',
        updatedBy: session.user.id,
        timestamp: new Date().toISOString()
      }]
    });

    // Update green score (+10)
    const user = await localDb.users.findById(session.user.id);
    if (user) {
      await localDb.users.updateById(session.user.id, { 
        greenScore: (user.greenScore || 0) + 10 
      });
    }

    return NextResponse.json({ message: 'Generated successfully', wasteBag: newBag }, { status: 201 });
  } catch (err) {
    console.error('Waste Create Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
