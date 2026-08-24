import { ShieldCheck, Truck, Sparkles, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | DCC Corner",
  description: "Learn more about DCC Corner - Premium Imported Snacks & Confectionery in Bashundhara R/A.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" /> Our Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111827] mb-4 font-heading">
          About DCC Corner
        </h1>
        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
          Bringing you 100% authentic, premium imported chocolates, beverages, gourmet snacks, and confectionery directly to Bashundhara R/A at wholesale rates.
        </p>
      </div>

      {/* Story Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-xs mb-12">
        <h2 className="text-2xl font-black text-[#163A32] mb-4 font-heading">Direct Import, Unmatched Freshness</h2>
        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed mb-4">
          At DCC Corner, our passion is curating the world's most beloved snack brands — from Swiss and Belgian chocolates to Japanese matcha treats, American sodas, and European wafers. We source directly through verified international channels to ensure authenticity and peak product freshness.
        </p>
        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
          Based in Bashundhara Residential Area, Dhaka, we operate our dedicated **Bashundhara Express Delivery** network, getting your cravings delivered to your doorstep within 2 hours.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#F7F8F5] p-6 rounded-3xl border border-[#E5E7EB] text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#163A32] shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-[#111827] mb-1">100% Authentic</h3>
          <p className="text-xs text-[#6B7280]">Guaranteed genuine goods sourced directly from certified distributors.</p>
        </div>

        <div className="bg-[#F7F8F5] p-6 rounded-3xl border border-[#E5E7EB] text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#163A32] shadow-2xs">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-[#111827] mb-1">2-Hour Express</h3>
          <p className="text-xs text-[#6B7280]">Lightning-fast delivery across all blocks of Bashundhara R/A.</p>
        </div>

        <div className="bg-[#F7F8F5] p-6 rounded-3xl border border-[#E5E7EB] text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#163A32] shadow-2xs">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-[#111827] mb-1">Wholesale Pricing</h3>
          <p className="text-xs text-[#6B7280]">Direct-to-consumer savings with unbeatable package deals.</p>
        </div>
      </div>

      <div className="text-center">
        <Button asChild className="rounded-2xl bg-[#163A32] hover:bg-[#0E2620] text-white font-black text-sm px-8 py-4 shadow-md shadow-[#163A32]/20">
          <Link href="/shop">Explore Our Collection</Link>
        </Button>
      </div>
    </div>
  );
}
