import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BannerTableActions } from '@/components/admin/BannerTableActions';

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage() {
  await connectToDatabase();
  const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage homepage slider banners and promotional images.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dcc-hq/banners/new">
            <Plus className="w-4 h-4 mr-2" /> Add Banner
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search banners..." 
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {banners.length} banners
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Preview</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {banners.map((banner: any) => (
                <tr key={banner._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-32 h-16 rounded-lg bg-muted/30 overflow-hidden shrink-0 border">
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{banner.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{banner.linkUrl}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      banner.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-slate-100 text-slate-800 border'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-muted-foreground">{banner.order}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <BannerTableActions bannerId={banner._id.toString()} bannerTitle={banner.title} />
                  </td>
                </tr>
              ))}
              
              {banners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No banners found. Add your first promotional banner!
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
