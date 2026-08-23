import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, PlayCircle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ProductActions } from "./ProductActions";
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
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160) + '...',
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160) + '...',
      images: [
        {
          url: product.images[0] || '',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}
export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm text-[#4B5563] mb-8">
        <Link href="/" className="hover:text-[#163A32] font-medium">Home</Link>
        <span className="mx-2 text-slate-300">/</span>
        <Link href="/shop" className="hover:text-[#163A32] font-medium">Shop</Link>
        <span className="mx-2 text-slate-300">/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-[#163A32] font-medium">{product.category.name}</Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-[#111827] font-bold">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12 mb-16">
        {/* Product Image & Video Gallery */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="aspect-square bg-[#F7F8F5] border border-[#E5E7EB] rounded-2xl flex items-center justify-center overflow-hidden relative group p-4">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square bg-[#F7F8F5] border border-[#E5E7EB] rounded-xl cursor-pointer hover:ring-2 hover:ring-[#163A32] transition-all flex items-center justify-center overflow-hidden p-1">
                <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-contain" />
              </div>
            ))}
            {/* Fake Video Placeholder as requested */}
            <div className="aspect-square bg-black rounded-xl cursor-pointer hover:ring-2 hover:ring-[#163A32] transition-all flex items-center justify-center relative group overflow-hidden">
               <img src={product.images[0]} alt="Video Thumbnail" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
               <PlayCircle className="absolute w-8 h-8 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
               <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">0:45</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          {product.discountPrice > 0 ? (
            <div className="bg-[#163A32] text-white p-3 rounded-xl mb-4 flex items-center justify-between shadow-md border border-[#D6A84F]/30 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 fill-[#D6A84F] text-[#D6A84F]" />
                <span className="font-bold tracking-wider uppercase text-xs sm:text-sm">Special Imported Deal</span>
              </div>
              <span className="bg-[#D6A84F] text-[#163A32] text-xs font-black px-2.5 py-1 rounded-lg">
                {product.discountPercent || Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </span>
            </div>
          ) : null}

          <p className="text-[#6B8F71] font-bold uppercase tracking-wider text-xs sm:text-sm mb-1.5">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-[#111827] mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-4 h-4 ${star <= Math.floor(product.rating || 5) ? 'fill-[#D6A84F] text-[#D6A84F]' : 'text-slate-300'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-[#4B5563]">{product.rating || "4.9"} Rating</span>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs font-semibold text-[#4B5563]">{product.numReviews || "12"} Verified Reviews</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            {product.discountPrice > 0 ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#163A32]">
                  ৳{product.discountPrice.toFixed(0)}
                </span>
                <span className="text-lg text-[#4B5563] line-through font-semibold">৳{product.price.toFixed(0)}</span>
              </div>
            ) : (
              <div className="text-3xl sm:text-4xl font-black text-[#163A32]">
                ৳{product.price.toFixed(0)}
              </div>
            )}
          </div>

          <div 
            className="text-[#4B5563] leading-relaxed mb-8 prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />

          <div className="space-y-4 mb-8 border-y border-[#E5E7EB] py-5">
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <span className="font-bold text-[#111827] w-24">Availability:</span>
              {product.countInStock > 0 ? (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  In Stock ({product.countInStock} items left)
                </span>
              ) : (
                <span className="text-[#DC2626] font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <span className="font-bold text-[#111827] w-24">SKU:</span>
              <span className="text-[#4B5563] font-mono">{product.sku || "DCC-" + product._id.toString().slice(-6)}</span>
            </div>
          </div>

          <ProductActions product={product} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto pt-6 bg-[#F7F8F5] border border-[#E5E7EB] p-5 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#163A32] shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-[#163A32]" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-[#111827]">100% Authentic</p>
                <p className="text-[11px] text-[#4B5563]">Original imported products</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#163A32] shadow-2xs">
                <Truck className="w-6 h-6 text-[#163A32]" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-[#111827]">Bashundhara Express</p>
                <p className="text-[11px] text-[#4B5563]">Fast same-day delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Description & Reviews Tabs */}
      <div className="mt-16">
        <div className="border-b border-[#E5E7EB] mb-8 flex space-x-8">
          <button className="pb-4 border-b-2 border-[#163A32] font-bold text-base sm:text-lg text-[#163A32]">Description</button>
          <button className="pb-4 border-b-2 border-transparent font-medium text-base sm:text-lg text-[#4B5563] hover:text-[#111827]">Reviews ({product.numReviews || "12"})</button>
          <button className="pb-4 border-b-2 border-transparent font-medium text-base sm:text-lg text-[#4B5563] hover:text-[#111827]">Shipping Info</button>
        </div>
        
        <div 
          className="prose prose-sm md:prose-base max-w-none text-[#4B5563] mb-12" 
          dangerouslySetInnerHTML={{ __html: product.description }} 
        />

        {/* Reviews Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-[#111827]">Customer Reviews</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((review) => (
              <div key={review} className="border border-[#E5E7EB] rounded-2xl p-5 bg-white shadow-2xs">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-[#163A32]/10 rounded-full flex items-center justify-center text-[#163A32] font-black text-xs">
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
