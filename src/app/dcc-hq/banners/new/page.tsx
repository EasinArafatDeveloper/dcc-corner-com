import connectToDatabase from '@/lib/db';
import { BannerForm } from '@/components/admin/BannerForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function NewBannerPage() {
  await connectToDatabase();
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/dcc-hq/banners">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Banner</h1>
          <p className="text-muted-foreground text-sm">Create a new promotional banner.</p>
        </div>
      </div>

      <BannerForm />
    </div>
  );
}
