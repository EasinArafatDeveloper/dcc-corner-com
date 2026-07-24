import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import PushSubscription from '@/models/PushSubscription';

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    await connectToDatabase();

    // Upsert subscription
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Subscription saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Subscription save error:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}
