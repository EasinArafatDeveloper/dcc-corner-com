"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Image as ImageIcon, 
  ShoppingCart,
  LogOut
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/dcc-hq", icon: LayoutDashboard },
  { name: "Products", href: "/dcc-hq/products", icon: Package },
  { name: "Categories", href: "/dcc-hq/categories", icon: Tags },
  { name: "Banners", href: "/dcc-hq/banners", icon: ImageIcon },
  { name: "Orders", href: "/dcc-hq/orders", icon: ShoppingCart },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-primary">DCC</span> Admin
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dcc-hq' && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
