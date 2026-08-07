import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Banner from '@/models/Banner';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Fake Data for Seeding
const categoriesData = [
  { name: 'Imported Chocolates', slug: 'imported-chocolates', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=400&auto=format&fit=crop' },
  { name: 'Coffee & Beverages', slug: 'beverages', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop' },
  { name: 'Chips & Snacks', slug: 'chips-snacks', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=400&auto=format&fit=crop' },
  { name: 'Biscuits & Cookies', slug: 'cookies', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&auto=format&fit=crop' },
  { name: 'Candies & Sweets', slug: 'candies', image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400&auto=format&fit=crop' },
  { name: 'Instant Noodles', slug: 'instant-noodles', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=400&auto=format&fit=crop' },
];

const bannersData = [
  {
    title: 'Discover Premium Global Snacks & Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1600&auto=format&fit=crop',
    linkUrl: '/shop',
    order: 1,
  },
  {
    title: 'Exclusive Imported Chocolates',
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1600&auto=format&fit=crop',
    linkUrl: '/category/imported-chocolates',
    order: 2,
  },
  {
    title: 'Refreshing Global Beverages & Matcha',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1600&auto=format&fit=crop',
    linkUrl: '/category/beverages',
    order: 3,
  }
];

const getProductsData = (categoryDocs: any[]) => {
  const getCatId = (slug: string) => categoryDocs.find(c => c.slug === slug)?._id;
  
  return [
    {
      name: 'Lindt Excellence Dark Chocolate 85% Cocoa',
      slug: 'lindt-excellence-dark-85',
      images: ['https://placehold.co/600x600/DDD/333?text=Lindt+85'],
      brand: 'Lindt',
      category: getCatId('imported-chocolates'),
      description: 'Experience the finest Swiss dark chocolate with 85% cocoa. Intensely dark with full-bodied cocoa flavor.',
      price: 6.99,
      discountPrice: 5.99,
      rating: 4.8,
      numReviews: 120,
      countInStock: 50,
      sku: 'LINDT-85',
      isFeatured: true,
    },
    {
      name: 'Ferrero Rocher Fine Hazelnut Chocolates',
      slug: 'ferrero-rocher-hazelnut',
      images: ['https://placehold.co/600x600/DDD/333?text=Ferrero+Rocher'],
      brand: 'Ferrero',
      category: getCatId('imported-chocolates'),
      description: 'A tempting combination of luscious, creamy, chocolaty filling surrounding a whole hazelnut, within a delicate, crisp wafer all enveloped in milk chocolate and finely chopped hazelnuts.',
      price: 14.99,
      rating: 4.9,
      numReviews: 340,
      countInStock: 25,
      sku: 'FERR-ROCH',
      isFeatured: true,
    },
    {
      name: 'Pringles Original Potato Crisps (Imported)',
      slug: 'pringles-original',
      images: ['https://placehold.co/600x600/DDD/333?text=Pringles+Org'],
      brand: 'Pringles',
      category: getCatId('chips-snacks'),
      description: 'The original, stackable potato crisp. Deliciously salty and crunchy.',
      price: 3.49,
      rating: 4.5,
      numReviews: 89,
      countInStock: 100,
      sku: 'PRIN-ORG',
      isFeatured: false,
    },
    {
      name: 'Oreo Double Stuf Chocolate Sandwich Cookies',
      slug: 'oreo-double-stuf',
      images: ['https://placehold.co/600x600/DDD/333?text=Oreo+Double'],
      brand: 'Oreo',
      category: getCatId('cookies'),
      description: 'Twice the Stuf! OREO Double Stuf Chocolate Sandwich Cookies are supremely dunkable.',
      price: 5.29,
      discountPrice: 4.50,
      rating: 4.7,
      numReviews: 210,
      countInStock: 60,
      sku: 'OREO-DBL',
      isFeatured: false,
    },
    {
      name: 'Samyang Buldak Hot Chicken Flavor Ramen',
      slug: 'samyang-buldak-ramen',
      images: ['https://placehold.co/600x600/DDD/333?text=Buldak+Ramen'],
      brand: 'Samyang',
      category: getCatId('instant-noodles'),
      description: 'Extremely spicy chicken flavor ramen from Korea. Are you ready for the fire noodle challenge?',
      price: 7.99,
      rating: 4.6,
      numReviews: 450,
      countInStock: 200,
      sku: 'SAM-BUL',
      isFeatured: true,
    },
    {
      name: 'Red Bull Energy Drink (Austria Import)',
      slug: 'red-bull-austria',
      images: ['https://placehold.co/600x600/DDD/333?text=Red+Bull'],
      brand: 'Red Bull',
      category: getCatId('beverages'),
      description: 'Red Bull Energy Drink gives you wings. The original Austrian formula.',
      price: 2.99,
      rating: 4.8,
      numReviews: 310,
      countInStock: 150,
      sku: 'RDB-AUS',
      isFeatured: false,
    },
    {
      name: 'Toblerone Swiss Milk Chocolate with Honey & Almond Nougat',
      slug: 'toblerone-milk',
      images: ['https://placehold.co/600x600/DDD/333?text=Toblerone'],
      brand: 'Toblerone',
      category: getCatId('imported-chocolates'),
      description: 'Distinctive triangular chocolate from Switzerland.',
      price: 4.99,
      discountPrice: 3.99,
      rating: 4.7,
      numReviews: 180,
      countInStock: 80,
      sku: 'TOB-MLK',
      isFeatured: true,
    },
    {
      name: 'Cheetos Flamin Hot Crunchy (US Import)',
      slug: 'cheetos-flamin-hot',
      images: ['https://placehold.co/600x600/DDD/333?text=Cheetos+Hot'],
      brand: 'Frito-Lay',
      category: getCatId('chips-snacks'),
      description: 'Dangerously cheesy and flaming hot crunchy snacks imported directly from the US.',
      price: 6.49,
      rating: 4.9,
      numReviews: 500,
      countInStock: 40,
      sku: 'CHE-HOT',
      isFeatured: true,
    }
  ];
};

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    await Banner.deleteMany();
    await User.deleteMany();

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@dcccorner.com',
      password: 'admin123',
      role: 'ADMIN',
    });

    // Insert new data
    const insertedCategories = await Category.insertMany(categoriesData);
    
    const productsData = getProductsData(insertedCategories);
    const insertedProducts = await Product.insertMany(productsData);
    const insertedBanners = await Banner.insertMany(bannersData);
    
    // Seed Middle Promo Poster Banner
    await Banner.create({
      title: 'Special Imported Spice & Culinary Collection Offer',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1600&auto=format&fit=crop',
      linkUrl: '/shop',
      isMiddleBanner: true,
      isSideOffer: false,
      isActive: true,
    });

    return NextResponse.json({
      message: 'Database seeded successfully!',
      categoriesCount: insertedCategories.length,
      productsCount: insertedProducts.length,
      bannersCount: insertedBanners.length,
      adminUser: {
        email: adminUser.email,
        role: adminUser.role,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
