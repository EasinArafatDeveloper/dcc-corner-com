import { ShieldCheck, Lock, Eye } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DCC Corner",
  description: "How DCC Corner protects and manages your personal information and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-4xl">
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full mb-3 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5" /> Data Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111827] mb-2 font-heading">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#4B5563]">
          Your privacy and security are our highest priority.
        </p>
      </div>

      <div className="space-y-6 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-xs text-[#4B5563] text-sm leading-relaxed mb-8">
        <div>
          <h2 className="text-lg font-black text-[#163A32] mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#6B8F71]" /> 1. Information Collection
          </h2>
          <p>
            We only collect essential details (such as name, phone number, and delivery address) necessary to fulfill your orders and deliver your products accurately. We do not sell or lease your personal data to third parties.
          </p>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6">
          <h2 className="text-lg font-black text-[#163A32] mb-2 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#6B8F71]" /> 2. Communications & Notifications
          </h2>
          <p>
            You may receive SMS, email, or browser notifications regarding your order confirmation, dispatch status, or special wholesale promotions. You can opt out of marketing communications at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
