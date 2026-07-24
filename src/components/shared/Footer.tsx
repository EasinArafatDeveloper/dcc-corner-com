import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-muted pt-16 pb-8 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-bold text-primary tracking-tight block">
              DCC <span className="text-secondary">Corner</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium imported snacks & confectionery store. Discover a world of exquisite tastes with our curated selection of international food products.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shop</Link></li>
              <li><Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/offers" className="text-sm text-muted-foreground hover:text-primary transition-colors">Special Offers</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/shipping-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link href="/track-order" className="text-sm text-muted-foreground hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-secondary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">123 Premium Street, Retail District, City 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-secondary shrink-0" />
                <span className="text-sm text-muted-foreground">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-secondary shrink-0" />
                <span className="text-sm text-muted-foreground">support@dcccorner.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DCC Corner. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Payment methods placeholder icons */}
            <span className="font-semibold tracking-wider text-xs">SECURE PAYMENTS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
