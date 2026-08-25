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

    const mediaType = data.mediaType === 'video' ? 'video' : 'image';
    const videoUrl = mediaType === 'video' ? (data.videoUrl || '') : '';
    // For video mode, provide a valid fallback image url so any strict schema validator passes effortlessly
    const imageUrl = mediaType === 'image' 
      ? (data.imageUrl || '') 
      : (data.imageUrl || data.videoUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1600&auto=format&fit=crop');

    if (mediaType === 'video' && !videoUrl) {
      return NextResponse.json({ message: 'Please upload or provide a video URL' }, { status: 400 });
    }

    if (mediaType === 'image' && !imageUrl) {
      return NextResponse.json({ message: 'Please upload or provide an image URL' }, { status: 400 });
    }

    const title = data.title || 'Middle Section Promo Banner';
    const subtitle = data.subtitle || '';
    const badgeText = data.badgeText || '';
    const buttonText = data.buttonText || 'Shop Wholesale Deals';
    const overlayOpacity = typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 40;
    const linkUrl = data.linkUrl || '/shop';
    const isActive = data.isActive !== undefined ? Boolean(data.isActive) : true;

    // Check if middle banner already exists
    let middleBanner = await Banner.findOne({ isMiddleBanner: true });
    if (!middleBanner) {
      middleBanner = await Banner.findOne({ title: { $regex: /Middle Section/i } });
    }

    if (middleBanner) {
      middleBanner.title = title;
      middleBanner.subtitle = subtitle;
      middleBanner.badgeText = badgeText;
      middleBanner.buttonText = buttonText;
      middleBanner.overlayOpacity = overlayOpacity;
      middleBanner.mediaType = mediaType;
      middleBanner.imageUrl = imageUrl;
      middleBanner.videoUrl = videoUrl;
      middleBanner.linkUrl = linkUrl;
      middleBanner.isActive = isActive;
      middleBanner.isMiddleBanner = true;
      middleBanner.isSideOffer = false;
      await middleBanner.save();
    } else {
      middleBanner = await Banner.create({
        title,
        subtitle,
        badgeText,
        buttonText,
        overlayOpacity,
        mediaType,
        imageUrl,
        videoUrl,
        linkUrl,
        isMiddleBanner: true,
        isSideOffer: false,
        isActive,
      });
    }

    return NextResponse.json({ message: 'Middle section banner updated successfully', middleBanner }, { status: 200 });
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
