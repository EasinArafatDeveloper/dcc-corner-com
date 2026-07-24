import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import PopupOffer from '@/models/PopupOffer';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Find the popup offer
    const popup = await PopupOffer.findOne();
    
    // If no popup exists or it's not active, return null
    if (!popup || !popup.isActive) {
      return NextResponse.json({ popup: null });
    }

    return NextResponse.json({ popup });
  } catch (error) {
    console.error('Frontend Popup GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popup offer settings' },
      { status: 500 }
    );
  }
}
