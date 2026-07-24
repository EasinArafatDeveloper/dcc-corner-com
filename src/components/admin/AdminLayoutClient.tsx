"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Menu, X } from "lucide-react";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex print:bg-white">
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-4 z-50 print:hidden">
        <div className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-primary">DCC</span> Admin
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2 focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden print:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 print:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <AdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 w-full md:ml-64 pt-16 md:pt-0 p-4 sm:p-8 print:ml-0 print:p-0 print:pt-0">
        {children}
      </div>
    </div>
  );
}
