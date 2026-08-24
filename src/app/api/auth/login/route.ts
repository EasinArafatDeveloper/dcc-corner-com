import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, phone, identifier, password } = await req.json();

    const loginId = (identifier || email || phone || '').trim();

    if (!loginId || !password) {
      return NextResponse.json({ message: 'Please provide phone/email and password' }, { status: 400 });
    }

    const cleanPhone = loginId.replace(/\s+/g, '');
    const cleanEmail = loginId.toLowerCase();

    // Find user by email, phone, or generated phone-email
    const user = await User.findOne({
      $or: [
        { email: cleanEmail },
        { phone: cleanPhone },
        { email: `${cleanPhone.replace(/\D/g, '')}@dcccorner.com` }
      ]
    }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id.toString(), user.role);
      await setAuthCookie(token);

      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        message: 'Login successful',
      });
    } else {
      return NextResponse.json({ message: 'Invalid phone number/email or password' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
