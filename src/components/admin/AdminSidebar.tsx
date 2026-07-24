"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Image as ImageIcon, 
  ShoppingCart,
  LogOut,
  Target,
  Percent,
  ChevronLeft,
  ChevronRight
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
  { name: "Manage Offers", href: "/dcc-hq/offers", icon: Percent },
  { name: "Popup Offer", href: "/dcc-hq/popup", icon: Target },
];

export function AdminSidebar({ 
  onClose, 
  isCollapsed = false,
  onToggleCollapse
}: { 
  onClose?: () => void,
  isCollapsed?: boolean,
  onToggleCollapse?: () => void
}) {
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
    <div className={`flex flex-col h-full bg-slate-900 text-white transition-all duration-300 w-full`}>
      <div className={`flex items-center justify-between p-6 ${isCollapsed ? 'flex-col gap-4 px-2' : ''}`}>
        <Link href="/" className={`font-bold text-white flex items-center gap-2 ${isCollapsed ? 'text-sm' : 'text-2xl'}`}>
          <span className="text-primary">DCC</span> {!isCollapsed && "Admin"}
        </Link>
        {onToggleCollapse && (
          <button onClick={onToggleCollapse} className="text-slate-400 hover:text-white hidden md:block">
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}
      </div>

      <nav className={`flex-1 space-y-1 mt-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dcc-hq' && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 py-3 rounded-lg transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'} ${
                isActive 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-slate-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left ${isCollapsed ? 'justify-center px-0 w-auto' : 'px-3 w-full'}`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
