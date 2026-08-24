import { RefreshCw, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Replacement Policy | DCC Corner",
  description: "Learn about DCC Corner's hassle-free return, refund, and replacement policy.",
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-4xl">
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full mb-3 shadow-2xs">
          <RefreshCw className="w-3.5 h-3.5" /> Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111827] mb-2 font-heading">
          Refund & Replacement Policy
        </h1>
        <p className="text-sm text-[#4B5563]">
          Our 100% satisfaction and authentic item guarantee.
        </p>
      </div>

      <div className="space-y-6 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-xs text-[#4B5563] text-sm leading-relaxed mb-8">
        <div>
          <h2 className="text-lg font-black text-[#163A32] mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#6B8F71]" /> Instant Replacement
          </h2>
          <p>
            If any item arrives damaged, expired, or incorrect, you are entitled to an immediate replacement or full refund. Please notify our support team within 24 hours of receiving the package.
          </p>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6">
          <h2 className="text-lg font-black text-[#163A32] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#6B8F71]" /> Return Process
          </h2>
          <p>
            To initiate a replacement, share your Order ID and a photo of the received product via WhatsApp or email. Our team will verify and dispatch a replacement within the same day for Bashundhara R/A orders.
          </p>
        </div>
      </div>
    </div>
  );
}
