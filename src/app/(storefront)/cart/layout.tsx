import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your items and proceed to checkout at DCC Corner.',
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
