import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import localDb from '@/lib/localDb';

export async function POST(req) {
  try {
    const { name, email, password, role, phone, address, ward } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 400 });
    }

    const existingUser = await localDb.users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await localDb.users.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'citizen',
      phone,
      address,
      ward,
    });

    return NextResponse.json(
      { message: 'User registered successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
