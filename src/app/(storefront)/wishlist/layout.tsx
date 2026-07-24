import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Wishlist',
  description: 'View and manage your favorite products at DCC Corner.',
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
