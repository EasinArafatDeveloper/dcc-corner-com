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

const getCategoryData = cache(async (rawSlug: string) => {
  await connectToDatabase();
  const slug = decodeURIComponent(rawSlug).trim();
  
  // Case-insensitive match on slug
  const category = await Category.findOne({ 
    slug: { $regex: new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
  }).lean();
  
  if (!category) return null;

  const products = await Product.find({
    $or: [
      { category: category._id },
      { category: category._id.toString() }
    ]
  }).sort({ createdAt: -1 }).lean();

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
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      
      {/* Category Hero Banner Header */}
      <div className="mb-6 sm:mb-8 bg-gradient-to-r from-[#F7F8F5] via-white to-[#F7F8F5] border border-[#E5E7EB] rounded-3xl p-5 sm:p-8 shadow-xs">
        <Link 
          href="/shop" 
          className="text-xs font-bold text-[#6B8F71] hover:text-[#163A32] flex items-center mb-4 transition-colors w-fit group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to All Products</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {category.image ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-sm border border-[#E5E7EB] overflow-hidden shrink-0">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-xl" />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#163A32] text-[#D6A84F] flex items-center justify-center font-black text-2xl shadow-sm border border-[#6B8F71]/30 shrink-0 font-heading">
              {category.name.charAt(0)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#163A32]/10 text-[#163A32] px-2.5 py-0.5 rounded-full">
                Imported Category
              </span>
              <span className="text-[10px] font-semibold text-[#6B7280]">
                100% Authentic
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#111827] font-heading mt-1">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-medium">
              Showing <span className="font-bold text-[#163A32]">{products.length}</span> authentic products in this collection
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-3xl p-8 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F7F8F5] rounded-full flex items-center justify-center text-2xl">
            📦
          </div>
          <h2 className="text-xl font-bold text-[#111827] mb-2 font-heading">No products in this category yet</h2>
          <p className="text-xs sm:text-sm text-[#4B5563] mb-6">
            We are restocking authentic imported {category.name}. Check back soon or explore our other collections!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#163A32] hover:bg-[#0E2620] text-white rounded-full text-xs font-bold transition-all shadow-sm"
          >
            Explore Other Products
          </Link>
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
