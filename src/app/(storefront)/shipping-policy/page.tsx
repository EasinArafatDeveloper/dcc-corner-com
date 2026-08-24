import { Truck, Clock, MapPin, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy & Express Delivery | DCC Corner",
  description: "Shipping rates, delivery schedules, and 2-Hour Bashundhara Express terms at DCC Corner.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-4xl">
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full mb-3 shadow-2xs">
          <Truck className="w-3.5 h-3.5" /> Delivery Information
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111827] mb-2 font-heading">
          Shipping & Delivery Policy
        </h1>
        <p className="text-sm text-[#4B5563]">
          Fast, temperature-conscious delivery for all imported confectionery & snacks.
        </p>
      </div>

      <div className="space-y-6 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-xs text-[#4B5563] text-sm leading-relaxed mb-8">
        <div>
          <h2 className="text-lg font-black text-[#163A32] mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#6B8F71]" /> 1. Bashundhara Express (Under 2 Hours)
          </h2>
          <p>
            For all residents of Bashundhara R/A (Blocks A, B, C, D, E, F, G, H, I, J, K, L, M, N), we offer an ultra-fast 2-hour express delivery service for a flat fee of **৳60**. Orders placed between 9:00 AM and 10:00 PM will be processed and dispatched immediately.
          </p>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6">
          <h2 className="text-lg font-black text-[#163A32] mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#6B8F71]" /> 2. Dhaka Metro & Nationwide Courier
          </h2>
          <p>
            Outside Bashundhara R/A, we deliver across Dhaka Metro within 24 hours (flat fee ৳100) and nationwide across Bangladesh within 48 to 72 hours via verified courier services.
          </p>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6">
          <h2 className="text-lg font-black text-[#163A32] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#6B8F71]" /> 3. Temperature & Quality Care
          </h2>
          <p>
            Imported chocolates and temperature-sensitive confectionery are packaged in insulated thermal pouches to prevent melting during transit, guaranteeing optimal taste and condition upon arrival.
          </p>
        </div>
      </div>
    </div>
  );
}
