import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';
import { BannerForm } from '@/components/admin/BannerForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const banner = await Banner.findById(id).lean();

  if (!banner) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/dcc-hq/banners">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Banner</h1>
          <p className="text-muted-foreground text-sm">Update details for "{banner.title}"</p>
        </div>
      </div>

      <BannerForm initialData={JSON.parse(JSON.stringify(banner))} />
    </div>
  );
}
