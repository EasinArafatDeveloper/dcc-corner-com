import { HelpCircle, Truck, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | DCC Corner",
  description: "Common questions about ordering, delivery times, authenticity, and payments at DCC Corner.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "How fast is Bashundhara Express Delivery?",
      a: "Our dedicated express delivery network operates throughout Bashundhara R/A (Block A through N). Orders placed between 9:00 AM and 10:00 PM are delivered within 2 hours.",
      icon: Truck,
    },
    {
      q: "Are all products 100% original and imported?",
      a: "Yes. Every single item at DCC Corner is directly imported from certified manufacturers and international distributors (UK, USA, Europe, Japan, UAE). We guarantee 100% authenticity on all products.",
      icon: ShieldCheck,
    },
    {
      q: "What payment methods are supported?",
      a: "We accept Cash on Delivery (COD) and bKash on Delivery. You can inspect your package upon arrival before making payment.",
      icon: CreditCard,
    },
    {
      q: "What is your return & replacement policy?",
      a: "If an item arrives damaged or incorrect, we provide instant replacement or a full refund within 24 hours of delivery. Just contact our support team with your Order ID.",
      icon: RefreshCw,
    },
    {
      q: "Do you deliver outside Bashundhara R/A?",
      a: "Yes, we provide standard courier delivery across all of Dhaka and nationwide throughout Bangladesh (typically 24 to 48 hours).",
      icon: HelpCircle,
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#163A32] text-[#D6A84F] border border-[#D6A84F]/30 text-xs font-bold rounded-full mb-3 shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5" /> Help Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111827] mb-2 font-heading">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#4B5563]">
          Got questions about our services or imported snacks? Find answers below.
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-2xl bg-[#163A32]/10 text-[#163A32] shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-[#111827] mb-1.5">{faq.q}</h2>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#F7F8F5] border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 text-center">
        <h3 className="font-extrabold text-base text-[#111827] mb-1">Still have questions?</h3>
        <p className="text-xs text-[#6B7280] mb-4">Our support team is available everyday from 9 AM to 11 PM.</p>
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#163A32]">
          <span>📞 +880 1700-000000</span>
          <span>•</span>
          <span>✉️ support@dcccorner.com</span>
        </div>
      </div>
    </div>
  );
}
