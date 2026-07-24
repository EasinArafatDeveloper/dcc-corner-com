import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryTableActions } from '@/components/admin/CategoryTableActions';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await connectToDatabase();
  const categories = await Category.find({}).populate('parentCategory').sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage product categories and subcategories.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dcc-hq/categories/new">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {categories.length} categories
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Parent Category</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((category: any) => (
                <tr key={category._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {category.image ? (
                        <div className="w-10 h-10 rounded-lg bg-muted/30 overflow-hidden shrink-0 border">
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 border">
                          <span className="text-xs text-muted-foreground">No img</span>
                        </div>
                      )}
                      <div className="font-semibold text-slate-900">{category.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4">
                    {category.parentCategory ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border">
                        {category.parentCategory.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <CategoryTableActions categoryId={category._id.toString()} categoryName={category.name} />
                  </td>
                </tr>
              ))}
              
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No categories found. Add your first category!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
