import { Truck, ShieldCheck, Tag, CreditCard } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Fast Bashundhara Delivery",
      description: "Express same-day delivery across Block A to N",
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic Import",
      description: "Directly sourced from UK, USA, Europe & Japan",
    },
    {
      icon: Tag,
      title: "Wholesale Rates",
      description: "Guaranteed lower prices than local supershops",
    },
    {
      icon: CreditCard,
      title: "Cash / bKash / Card",
      description: "Flexible payment options on delivery",
    },
  ];

  return (
    <section className="bg-[#F7F8F5] border-y border-[#E5E7EB] py-6 my-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-3.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#6B8F71]/40 hover:shadow-sm transition-all"
              >
                <div className="p-2.5 rounded-xl bg-[#163A32]/10 text-[#163A32] shrink-0">
                  <Icon className="w-5 h-5 text-[#163A32]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#111827]">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-[#4B5563] mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
