import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, PlayCircle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ProductActions } from "./ProductActions";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getProductData(slug: string) {
  await connectToDatabase();
  const product = await Product.findOne({ slug }).populate('category').lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
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
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12 mb-16">
        {/* Product Image & Video Gallery */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="aspect-square bg-muted/20 rounded-2xl flex items-center justify-center overflow-hidden relative group">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square bg-muted/20 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all flex items-center justify-center overflow-hidden">
                <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {/* Fake Video Placeholder as requested */}
            <div className="aspect-square bg-black rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all flex items-center justify-center relative group overflow-hidden">
               <img src={product.images[0]} alt="Video Thumbnail" className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
               <PlayCircle className="absolute w-8 h-8 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
               <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">0:45</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          {product.discountPrice > 0 ? (
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-3 rounded-xl mb-4 flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 animate-pulse" />
                <span className="font-bold tracking-wider uppercase text-sm">Limited Time Offer</span>
              </div>
              <span className="bg-white text-red-600 text-xs font-black px-2 py-1 rounded-lg">
                {product.discountPercent || Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
              </span>
            </div>
          ) : null}

          <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2">{product.brand}</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'fill-secondary text-secondary' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} Rating</span>
            <span className="text-sm text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">{product.numReviews} Reviews</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            {product.discountPrice > 0 ? (
              <div className="flex flex-col">
                <span className="text-lg text-muted-foreground line-through decoration-red-500/50 font-medium">${product.price.toFixed(2)}</span>
                <span className="text-4xl font-black text-red-600 flex items-center gap-2">
                  ${product.discountPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-3xl font-extrabold text-primary">
                ${product.price.toFixed(2)}
              </div>
            )}
          </div>

          <div 
            className="text-muted-foreground leading-relaxed mb-8 prose prose-sm max-w-none" 
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />

          <div className="space-y-6 mb-8 border-y border-border py-6">
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium w-24">Availability:</span>
              {product.countInStock > 0 ? (
                <span className="text-green-600 font-medium">In Stock ({product.countInStock})</span>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium w-24">SKU:</span>
              <span className="text-muted-foreground">{product.sku}</span>
            </div>
          </div>

          <ProductActions product={product} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto pt-6 bg-muted/20 p-6 rounded-2xl">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-semibold text-sm">100% Authentic</p>
                <p className="text-xs text-muted-foreground">Original imported products</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-8 h-8 text-secondary" />
              <div>
                <p className="font-semibold text-sm">Fast Delivery</p>
                <p className="text-xs text-muted-foreground">Across the country</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Description & Reviews Tabs */}
      <div className="mt-16">
        <div className="border-b mb-8 flex space-x-8">
          <button className="pb-4 border-b-2 border-primary font-bold text-lg text-primary">Description</button>
          <button className="pb-4 border-b-2 border-transparent font-medium text-lg text-muted-foreground hover:text-foreground">Reviews ({product.numReviews})</button>
          <button className="pb-4 border-b-2 border-transparent font-medium text-lg text-muted-foreground hover:text-foreground">Shipping Info</button>
        </div>
        
        <div 
          className="prose prose-sm md:prose-base max-w-none text-muted-foreground mb-12" 
          dangerouslySetInnerHTML={{ __html: product.description }} 
        />

        {/* Fake Reviews Section Placeholder */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((review) => (
              <div key={review} className="border border-border/50 rounded-xl p-6 bg-background">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      U{review}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Premium User {review}</p>
                      <p className="text-xs text-muted-foreground">Verified Buyer</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3.5 h-3.5 fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Absolutely loved this product! The quality is exactly what you would expect from premium imported goods. Will definitely be ordering from DCC Corner again.
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
             <Button variant="outline">Load More Reviews</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
