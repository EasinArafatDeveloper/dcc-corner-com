import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-[#0E2620] text-emerald-100/80 pt-16 pb-8 border-t border-[#163A32]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-black text-white tracking-tight block">
              DCC <span className="text-[#6B8F71]">Corner</span>
            </Link>
            <p className="text-sm text-emerald-100/70 leading-relaxed">
              Premium imported snacks & confectionery store in Bashundhara R/A. Discover a world of exquisite tastes with our curated selection of international food products at wholesale rates.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-emerald-200/70 hover:text-[#D6A84F] transition-colors p-2 rounded-lg bg-[#163A32] hover:bg-[#1E4D43]">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-emerald-200/70 hover:text-[#D6A84F] transition-colors p-2 rounded-lg bg-[#163A32] hover:bg-[#1E4D43]">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-emerald-200/70 hover:text-[#D6A84F] transition-colors p-2 rounded-lg bg-[#163A32] hover:bg-[#1E4D43]">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white uppercase tracking-wider text-xs">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-emerald-100/70 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/shop" className="text-sm text-emerald-100/70 hover:text-white transition-colors">Shop All Products</Link></li>
              <li><Link href="/shop?offers=true" className="text-sm text-emerald-100/70 hover:text-white transition-colors">Special Wholesale Deals</Link></li>
              <li><Link href="/track-order" className="text-sm text-emerald-100/70 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/login" className="text-sm text-emerald-100/70 hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white uppercase tracking-wider text-xs">Customer Service</h3>
            <ul className="space-y-2.5">
              <li><Link href="/faq" className="text-sm text-emerald-100/70 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/shipping-policy" className="text-sm text-emerald-100/70 hover:text-white transition-colors">Bashundhara Express Delivery</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-emerald-100/70 hover:text-white transition-colors">Refund & Replacement</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-emerald-100/70 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white uppercase tracking-wider text-xs">Contact & Location</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-[#6B8F71] shrink-0 mt-1" />
                <span className="text-sm text-emerald-100/70">Bashundhara R/A, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-[#6B8F71] shrink-0" />
                <span className="text-sm text-emerald-100/70">+880 1700-000000</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-[#6B8F71] shrink-0" />
                <span className="text-sm text-emerald-100/70">support@dcccorner.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-[#163A32] flex flex-col md:flex-row items-center justify-between text-xs text-emerald-200/50">
          <p>&copy; {new Date().getFullYear()} DCC Corner. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0 font-bold tracking-wider text-[11px] text-emerald-300/70">
            <span>100% ORIGINAL IMPORTED GOODS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
