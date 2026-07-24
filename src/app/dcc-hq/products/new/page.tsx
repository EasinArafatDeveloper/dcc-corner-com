import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { ProductForm } from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await connectToDatabase();
  const categories = await Category.find({}).lean();

  // Convert ObjectIds to strings for passing to Client Component
  const serializedCategories = categories.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Link href="/dcc-hq/products">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground text-sm mt-1">Fill in the details below to add a new product to your catalog.</p>
        </div>
      </div>

      <ProductForm categories={serializedCategories} />
    </div>
  );
}
