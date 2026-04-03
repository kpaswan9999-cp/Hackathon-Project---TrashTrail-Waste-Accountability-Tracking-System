import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import localDb from '@/lib/localDb';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await localDb.users.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Profile API Error Details:', err);
    return NextResponse.json({ 
      message: 'Internal Server Error', 
      error: err.message,
      stack: err.stack 
    }, { status: 500 });
  }
}
