import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import PopupOffer from '@/models/PopupOffer';

// Get current popup settings
export async function GET() {
  try {
    await connectToDatabase();
    
    // Find the first (and only) popup offer config
    let popup = await PopupOffer.findOne();
    
    if (!popup) {
      // Create a default one if none exists
      popup = await PopupOffer.create({
        imageUrl: 'https://via.placeholder.com/600x600?text=Offer+Image',
        linkUrl: '/shop',
        isActive: false
      });
    }

    return NextResponse.json(popup);
  } catch (error) {
    console.error('Popup GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popup offer settings' },
      { status: 500 }
    );
  }
}

// Update popup settings
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { imageUrl, linkUrl, isActive } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Find and update the single popup document, or create if missing
    const popup = await PopupOffer.findOneAndUpdate(
      {}, // empty filter targets the first doc
      {
        imageUrl,
        linkUrl: linkUrl || '/shop',
        isActive: Boolean(isActive)
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(popup);
  } catch (error) {
    console.error('Popup PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update popup offer settings' },
      { status: 500 }
    );
  }
}
