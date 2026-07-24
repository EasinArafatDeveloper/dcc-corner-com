import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string, role: string };
    
    if (decoded.role !== 'ADMIN' && decoded.role !== 'admin') {
      redirect('/shop'); // Redirect non-admins to storefront
    }
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex print:bg-white">
      {/* Sidebar - Fixed 64 w-64 */}
      <div className="print:hidden">
        <AdminSidebar />
      </div>
      
      <div className="flex-1 ml-64 p-8 print:ml-0 print:p-0">
        {children}
      </div>
    </div>
  );
}
