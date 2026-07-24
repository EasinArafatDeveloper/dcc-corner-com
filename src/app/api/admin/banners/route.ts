import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const isAdmin = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { role: string };
    return decoded.role === 'ADMIN' || decoded.role === 'admin';
  } catch (error) {
    return false;
  }
};

export async function GET() {
  try {
    await connectToDatabase();
    const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    if (!data.title || !data.imageUrl) {
      return NextResponse.json({ message: 'Title and image URL are required' }, { status: 400 });
    }

    const banner = await Banner.create(data);

    return NextResponse.json({ message: 'Banner created successfully', banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}
