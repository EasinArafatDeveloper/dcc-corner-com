import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { CategoryForm } from '@/components/admin/CategoryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const category = await Category.findById(id).lean();

  if (!category) {
    notFound();
  }

  // Fetch all categories for parent category selection
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/dcc-hq/categories">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground text-sm">Update details for "{category.name}"</p>
        </div>
      </div>

      <CategoryForm 
        categories={JSON.parse(JSON.stringify(categories))} 
        initialData={JSON.parse(JSON.stringify(category))} 
      />
    </div>
  );
}
