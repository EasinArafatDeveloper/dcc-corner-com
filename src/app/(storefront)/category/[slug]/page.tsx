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
      title: 'Category Not Found',
    };
  }

  return {
    title: `${data.category.name} Collection`,
    description: `Shop the best ${data.category.name} at DCC Corner.`,
    openGraph: {
      title: `${data.category.name} Collection | DCC Corner`,
      description: `Shop the best ${data.category.name} at DCC Corner.`,
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

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
