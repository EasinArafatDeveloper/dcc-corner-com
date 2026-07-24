import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { ProductForm } from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  
  const product = await Product.findById(id).lean();
  
  if (!product) {
    notFound();
  }

  const categories = await Category.find({}).lean();

  // Convert ObjectIds to strings for passing to Client Component
  const serializedCategories = categories.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
  }));

  const serializedProduct = {
    ...product,
    _id: product._id.toString(),
    category: product.category?.toString(),
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Link href="/dcc-hq/products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground text-sm mt-1">Update details for {product.name}</p>
        </div>
      </div>

      <ProductForm categories={serializedCategories} initialData={serializedProduct} />
    </div>
  );
}
