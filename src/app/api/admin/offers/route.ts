import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { sendPushNotificationToAll } from '@/lib/push';

// Get all products with an active offer
export async function GET() {
  try {
    await connectToDatabase();
    const offers = await Product.find({ discountPrice: { $gt: 0 } })
      .select('name slug images price discountPrice discountPercent')
      .sort({ updatedAt: -1 });

    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Offers GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// Apply an offer
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { productId, discountPercent } = body;

    if (!productId || discountPercent === undefined || discountPercent <= 0 || discountPercent > 100) {
      return NextResponse.json(
        { error: 'Valid product ID and discount percentage (1-100) are required' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate new price
    const discountPrice = product.price - (product.price * (discountPercent / 100));

    product.discountPercent = discountPercent;
    product.discountPrice = discountPrice;
    await product.save();

    // Send push notification in the background
    sendPushNotificationToAll({
      title: 'New Offer Available! 🏷️',
      body: `Get ${discountPercent}% off on ${product.name}! Now only ${discountPrice}`,
      url: `/products/${product.slug}`
    });

    return NextResponse.json({ message: 'Offer applied successfully', product });
  } catch (error) {
    console.error('Offers PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to apply offer' },
      { status: 500 }
    );
  }
}

// Remove an offer
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    product.discountPercent = 0;
    product.discountPrice = 0;
    await product.save();

    return NextResponse.json({ message: 'Offer removed successfully' });
  } catch (error) {
    console.error('Offers DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to remove offer' },
      { status: 500 }
    );
  }
}
