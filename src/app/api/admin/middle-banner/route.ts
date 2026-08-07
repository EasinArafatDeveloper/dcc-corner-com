import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await connectToDatabase();
    // Return the middle poster banner (whether active or not for admin preview)
    let middleBanner = await Banner.findOne({ isMiddleBanner: true }).sort({ updatedAt: -1 });

    if (!middleBanner) {
      // Check if a banner was created via generic form with title containing "Middle Section"
      middleBanner = await Banner.findOne({ title: { $regex: /Middle Section/i } }).sort({ updatedAt: -1 });
      if (middleBanner) {
        middleBanner.isMiddleBanner = true;
        middleBanner.isSideOffer = false;
        await middleBanner.save();
      }
    }

    return NextResponse.json({ middleBanner });
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

    const title = data.title || 'Middle Section Promo Banner';
    const linkUrl = data.linkUrl || '/shop';
    const isActive = data.isActive !== undefined ? Boolean(data.isActive) : true;

    // Check if middle banner already exists
    let middleBanner = await Banner.findOne({ isMiddleBanner: true });
    if (!middleBanner) {
      middleBanner = await Banner.findOne({ title: { $regex: /Middle Section/i } });
    }

    if (middleBanner) {
      middleBanner.title = title;
      middleBanner.imageUrl = data.imageUrl;
      middleBanner.linkUrl = linkUrl;
      middleBanner.isActive = isActive;
      middleBanner.isMiddleBanner = true;
      middleBanner.isSideOffer = false;
      await middleBanner.save();
    } else {
      middleBanner = await Banner.create({
        title,
        imageUrl: data.imageUrl,
        linkUrl,
        isMiddleBanner: true,
        isSideOffer: false,
        isActive,
      });
    }

    return NextResponse.json({ message: 'Middle section poster banner updated successfully', middleBanner }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    await Banner.updateMany({ isMiddleBanner: true }, { isActive: false });
    return NextResponse.json({ message: 'Middle section poster banner deactivated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
  }
}
