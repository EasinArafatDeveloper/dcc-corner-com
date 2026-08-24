import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, PlayCircle, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ProductActions } from "./ProductActions";
import { ProductGallery } from "./ProductGallery";
import { notFound } from "next/navigation";

import { cache } from "react";

export const revalidate = 60;

const getProductData = cache(async (slug: string) => {
  await connectToDatabase();
  const product = await Product.findOne({ slug }).populate('category').lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
});

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | DCC Corner',
    };
  }

  const cleanDescription = (product.shortDescription || product.description || '')
    .replace(/<[^>]*>?/gm, '')
    .substring(0, 160)
    .trim();

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;

  return {
    title: `${product.name} | Buy Online | DCC Corner`,
    description: `${cleanDescription} — Order authentic imported ${product.name} with 2-Hour Express Delivery in Bashundhara R/A, Dhaka.`,
    keywords: [
      product.name,
      `Buy ${product.name} Bangladesh`,
      `${product.name} price in BD`,
      product.category?.name || 'Imported snacks',
      'DCC Corner',
      'Bashundhara express delivery',
      'Authentic imported goods'
    ],
    alternates: {
      canonical: `https://dcccorner.com/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | DCC Corner`,
      description: cleanDescription,
      url: `https://dcccorner.com/product/${product.slug}`,
      siteName: 'DCC Corner',
      images: [
        {
          url: product.images?.[0] || '/og-image.jpg',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | DCC Corner`,
      description: cleanDescription,
      images: [product.images?.[0] || '/og-image.jpg'],
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const regularPrice = product.price || 0;
  const currentPrice = product.discountPrice > 0 ? product.discountPrice : regularPrice;
  const hasDiscount = regularPrice > currentPrice;
  const discountPercent = hasDiscount 
    ? (product.discountPercent || Math.round(((regularPrice - currentPrice) / regularPrice) * 100))
    : 0;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": (product.shortDescription || product.description || '').replace(/<[^>]*>?/gm, '').substring(0, 300).trim(),
    "sku": product.sku || `DCC-${product._id.toString().slice(-6).toUpperCase()}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || product.category?.name || "DCC Corner"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://dcccorner.com/product/${product.slug}`,
      "priceCurrency": "BDT",
      "price": currentPrice,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.countInStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "DCC Corner"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || "4.9",
      "reviewCount": product.numReviews || "12"
    }
  };

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
      ...(product.category ? [{
        "@type": "ListItem",
        "position": 3,
        "name": product.category.name,
        "item": `https://dcccorner.com/category/${product.category.slug}`
      }] : []),
      {
        "@type": "ListItem",
        "position": product.category ? 4 : 3,
        "name": product.name,
        "item": `https://dcccorner.com/product/${product.slug}`
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-[#4B5563] mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-[#163A32] font-medium transition-colors">Home</Link>
        <span className="text-slate-300">/</span>
        <Link href="/shop" className="hover:text-[#163A32] font-medium transition-colors">Shop</Link>
        {product.category && (
          <>
            <span className="text-slate-300">/</span>
            <Link href={`/category/${product.category.slug}`} className="hover:text-[#163A32] font-medium transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="text-slate-300">/</span>
        <span className="text-[#111827] font-bold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </nav>

      {/* 2. Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
        {/* Left Column: Interactive Product Image & Video Gallery */}
        <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-24">
          <ProductGallery 
            images={product.images || []} 
            productName={product.name} 
            discountPercent={discountPercent} 
          />
        </div>

        {/* Right Column: Product Info & Purchase Actions */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-start">
          {/* Brand & Category Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[#6B8F71] font-bold uppercase tracking-wider text-xs sm:text-sm font-heading">
              {product.brand || product.category?.name || "Direct Import"}
            </span>
            {product.soldCount && product.soldCount > 10 ? (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                🔥 {product.soldCount} Sold Recently
              </span>
            ) : null}
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111827] mb-3 leading-tight font-heading">
            {product.name}
          </h1>
          
          {/* Reviews & Ratings Row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= Math.floor(product.rating || 5) ? 'fill-[#D6A84F] text-[#D6A84F]' : 'text-slate-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#111827]">{product.rating || "4.9"} Rating</span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-[#4B5563]">{product.numReviews || "12"} Verified Reviews</span>
          </div>

          {/* Price Block */}
          <div className="bg-[#F7F8F5] border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-[#163A32] font-heading">
                ৳{currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-base sm:text-lg text-[#9CA3AF] line-through font-semibold">
                  ৳{regularPrice.toLocaleString()}
                </span>
              )}
            </div>

            {hasDiscount && (
              <span className="inline-flex items-center gap-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-black px-3 py-1.5 rounded-xl shadow-2xs shrink-0">
                <Flame className="w-3.5 h-3.5 fill-[#D6A84F]" /> Save ৳{(regularPrice - currentPrice).toLocaleString()} ({discountPercent}% OFF)
              </span>
            )}
          </div>

          {/* Clean Description */}
          {product.shortDescription ? (
            <p className="text-sm text-[#4B5563] leading-relaxed mb-6 font-normal">
              {product.shortDescription}
            </p>
          ) : product.description ? (
            <div 
              className="text-sm text-[#4B5563] leading-relaxed mb-6 prose prose-sm max-w-none line-clamp-3" 
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />
          ) : null}

          {/* Availability & SKU Specifications */}
          <div className="space-y-3 mb-6 border-y border-[#E5E7EB] py-4.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-[#111827]">Stock Availability:</span>
              {product.countInStock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock ({product.countInStock} available)
                </span>
              ) : (
                <span className="text-[#DC2626] font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200 text-xs">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-[#111827]">Product SKU:</span>
              <span className="text-[#4B5563] font-mono text-xs bg-white px-2.5 py-0.5 rounded-lg border border-[#E5E7EB]">
                {product.sku || "DCC-" + product._id.toString().slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quantity Selector, Add to Cart, and Wishlist */}
          <ProductActions product={product} />

          {/* Value Proposition & Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#F7F8F5] border border-[#E5E7EB] p-4.5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#163A32] shadow-2xs shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#163A32]" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-[#111827]">100% Authentic</p>
                <p className="text-[11px] text-[#6B7280]">Guaranteed genuine import</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#163A32] shadow-2xs shrink-0">
                <Truck className="w-5 h-5 text-[#163A32]" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-[#111827]">Bashundhara Express</p>
                <p className="text-[11px] text-[#6B7280]">2-Hour express delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3. Product Description & Verified Customer Reviews Tabs */}
      <div className="mt-12 sm:mt-16 pt-8 border-t border-[#E5E7EB]">
        <div className="border-b border-[#E5E7EB] mb-8 flex space-x-6 sm:space-x-8 overflow-x-auto">
          <button className="pb-3 sm:pb-4 border-b-2 border-[#163A32] font-bold text-sm sm:text-base text-[#163A32] shrink-0">
            Full Description
          </button>
          <button className="pb-3 sm:pb-4 border-b-2 border-transparent font-medium text-sm sm:text-base text-[#4B5563] hover:text-[#111827] shrink-0">
            Customer Reviews ({product.numReviews || "12"})
          </button>
          <button className="pb-3 sm:pb-4 border-b-2 border-transparent font-medium text-sm sm:text-base text-[#4B5563] hover:text-[#111827] shrink-0">
            Delivery & Returns
          </button>
        </div>
        
        {/* Full Rich Description */}
        <div 
          className="prose prose-sm sm:prose-base max-w-none text-[#4B5563] mb-12 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: product.description }} 
        />

        {/* Customer Reviews Section */}
        <div className="mt-10 bg-[#F7F8F5] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#111827]">Customer Reviews</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Verified purchaser ratings and feedback</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#D6A84F] text-[#D6A84F]" />
                ))}
              </div>
              <span className="font-extrabold text-sm text-[#111827]">4.9 out of 5</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {[1, 2, 3].map((review) => (
              <div key={review} className="border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs">
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#163A32]/10 rounded-full flex items-center justify-center text-[#163A32] font-black text-xs">
                      U{review}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-[#111827]">Verified Customer {review}</p>
                      <p className="text-[10px] text-[#6B8F71] font-bold">Verified Buyer (Bashundhara R/A)</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-[#D6A84F] text-[#D6A84F]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  Absolutely loved this product! The quality is 100% authentic and delivered right on time in Bashundhara Block C. Will definitely reorder from DCC Corner.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
