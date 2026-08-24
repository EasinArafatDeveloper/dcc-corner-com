import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft } from "lucide-react";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ProductCard } from "@/components/storefront/ProductCard";
import { notFound } from "next/navigation";

import { cache } from "react";

export const revalidate = 60;

const getCategoryData = cache(async (slug: string) => {
  await connectToDatabase();
  const category = await Category.findOne({ slug }).lean();
  
  if (!category) return null;

  const products = await Product.find({ category: category._id }).lean();

  return {
    category: JSON.parse(JSON.stringify(category)),
    products: JSON.parse(JSON.stringify(products)),
  };
});

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getCategoryData(resolvedParams.slug);

  if (!data || !data.category) {
    return {
      title: 'Category Not Found | DCC Corner',
    };
  }

  const categoryName = data.category.name;

  return {
    title: `${categoryName} — Imported Collection | DCC Corner`,
    description: `Shop authentic imported ${categoryName} at DCC Corner. Discover top global brands with 2-Hour Express Delivery in Bashundhara R/A, Dhaka.`,
    keywords: [
      categoryName,
      `Imported ${categoryName} Bangladesh`,
      `Buy ${categoryName} Dhaka`,
      'DCC Corner',
      'DCC Corner Bashundhara',
      'Bashundhara express delivery'
    ],
    alternates: {
      canonical: `https://dcccorner.com/category/${data.category.slug}`,
    },
    openGraph: {
      title: `${categoryName} — Imported Collection | DCC Corner`,
      description: `Shop authentic imported ${categoryName} at DCC Corner with 2-Hour Express Delivery.`,
      url: `https://dcccorner.com/category/${data.category.slug}`,
      siteName: 'DCC Corner',
      images: [
        {
          url: data.category.image || '/og-image.jpg',
          width: 800,
          height: 600,
          alt: categoryName,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | DCC Corner`,
      description: `Shop authentic imported ${categoryName} at DCC Corner.`,
      images: [data.category.image || '/og-image.jpg'],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getCategoryData(resolvedParams.slug);

  if (!data) {
    notFound();
  }

  const { category, products } = data;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://dcccorner.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": "https://dcccorner.com/shop"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.name,
        "item": `https://dcccorner.com/category/${category.slug}`
      }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Collection`,
    "description": `Browse authentic imported ${category.name} products at DCC Corner.`,
    "url": `https://dcccorner.com/category/${category.slug}`
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="mb-8">
        <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shop
        </Link>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground mt-1">{products.length} Products Available</p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl">
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground">We are currently out of stock for {category.name}. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5.5">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
