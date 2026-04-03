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

    const complaints = await localDb.complaints.find(filter);
    // Sort by date descending
    complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return NextResponse.json({ complaints });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'citizen') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const newComplaint = await localDb.complaints.create({
      citizenId: session.user.id,
      type: data.type,
      description: data.description,
      ward: data.ward || 'Unknown',
      location: data.location || null,
      status: 'open'
    });

    return NextResponse.json({ message: 'Complaint filed successfully', complaint: newComplaint }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
