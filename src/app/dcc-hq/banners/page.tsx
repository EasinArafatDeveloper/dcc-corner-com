import connectToDatabase from '@/lib/db';
import Banner from '@/models/Banner';
import { BannersTabContainer } from '@/components/admin/BannersTabContainer';

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage() {
  await connectToDatabase();
  
  // Only query hero slider banners for the table
  const banners = await Banner.find({ 
    isSideOffer: { $ne: true }, 
    isMiddleBanner: { $ne: true } 
  }).sort({ order: 1, createdAt: -1 }).lean();

  const parsedBanners = JSON.parse(JSON.stringify(banners));

  return <BannersTabContainer banners={parsedBanners} />;
}
