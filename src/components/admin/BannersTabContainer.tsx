"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Layers, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerTableActions } from "@/components/admin/BannerTableActions";
import { MiddleBannerManager } from "@/components/admin/MiddleBannerManager";

interface BannersTabContainerProps {
  banners: any[];
}

export function BannersTabContainer({ banners }: BannersTabContainerProps) {
  const [activeTab, setActiveTab] = useState<"hero_slider" | "middle_poster">("hero_slider");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBanners = banners.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.linkUrl && b.linkUrl.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Banner Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage homepage slider carousels and section promotional posters.
          </p>
        </div>

        {activeTab === "hero_slider" && (
          <Button asChild className="rounded-full bg-primary text-white">
            <Link href="/dcc-hq/banners/new">
              <Plus className="w-4 h-4 mr-2" /> Add Slider Banner
            </Link>
          </Button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-white px-4 pt-3 rounded-xl border shadow-sm">
        <button
          onClick={() => setActiveTab("hero_slider")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "hero_slider"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Hero Slider Banners ({banners.length})
        </button>

        <button
          onClick={() => setActiveTab("middle_poster")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "middle_poster"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" /> Middle Promo Poster Banner
        </button>
      </div>

      {/* Tab 1: Hero Slider Banners Table */}
      {activeTab === "hero_slider" && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search slider banners..." 
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredBanners.length} slider banners
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
                {filteredBanners.map((banner: any) => (
                  <tr key={banner._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-32 h-16 rounded-lg bg-muted/30 overflow-hidden shrink-0 border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                
                {filteredBanners.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No slider banners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Middle Section Promo Poster Banner Manager */}
      {activeTab === "middle_poster" && (
        <MiddleBannerManager />
      )}
    </div>
  );
}
