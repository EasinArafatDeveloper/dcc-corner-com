import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, phone, password } = body;
    let { email } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { message: 'Please provide your full name and phone number' },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? phone.trim().replace(/\s+/g, '') : '';
    
    // Auto-generate unique placeholder email if not explicitly provided
    if (!email || !email.trim()) {
      const sanitizedPhone = cleanPhone.replace(/\D/g, '') || Date.now().toString();
      email = `${sanitizedPhone}@dcccorner.com`;
    } else {
      email = email.trim().toLowerCase();
    }

    // Default password to phone or a minimum 6 char fallback if user didn't enter one
    const userPassword = password && password.length >= 6 ? password : (cleanPhone || 'dcc123456');

    // Check if user exists by phone or email
    const queryConditions: any[] = [{ email }];
    if (cleanPhone) {
      queryConditions.push({ phone: cleanPhone });
    }

    const userExists = await User.findOne({ $or: queryConditions });

    if (userExists) {
      return NextResponse.json(
        { message: 'An account with this phone number or email already exists. Please sign in instead.' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name: name.trim(),
      email,
      phone: cleanPhone,
      password: userPassword,
      role: 'USER',
    });

    if (user) {
      const token = generateToken(user._id.toString(), user.role);
      await setAuthCookie(token);

      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        message: 'Account created successfully',
      }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
