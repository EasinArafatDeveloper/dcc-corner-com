import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
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
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
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

    if (!data.name) {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }

    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const category = await Category.create(data);

    return NextResponse.json({ message: 'Category created successfully', category }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Category with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}
