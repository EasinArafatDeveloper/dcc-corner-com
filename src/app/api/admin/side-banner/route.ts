import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await connectToDatabase();
    const sideBanner = await Banner.findOne({ isSideOffer: true, isActive: true }).sort({ updatedAt: -1 });
    return NextResponse.json({ sideBanner });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.imageUrl) {
      return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
    }

    // Deactivate previous side banners
    await Banner.updateMany({ isSideOffer: true }, { isActive: false });

    // Create or update side offer banner
    const sideBanner = await Banner.create({
      title: data.title || 'Hero Side Offer Poster',
      imageUrl: data.imageUrl,
      linkUrl: data.linkUrl || '/shop?offers=true',
      isSideOffer: true,
      isActive: true,
    });

    return NextResponse.json({ message: 'Side offer poster updated successfully', sideBanner }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    await Banner.updateMany({ isSideOffer: true }, { isActive: false });
    return NextResponse.json({ message: 'Side offer poster removed successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}
