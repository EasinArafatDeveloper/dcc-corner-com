"use client";

import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Globe, 
  ChevronDown, 
  Menu, 
  X, 
  Loader2, 
  Flame, 
  MapPin, 
  Truck, 
  HelpCircle, 
  ShieldCheck, 
  Check, 
  Package, 
  Sparkles,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Tag,
  Star,
  Gift,
  Clock
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import { AnnouncementBar } from "./AnnouncementBar";

// Static categories for the "All categories" mega dropdown
const defaultCategories = [
  { name: "Imported Chocolates", slug: "imported-chocolates", icon: "🍫", desc: "Swiss, Belgian & Artisan Bars" },
  { name: "Coffee & Beverages", slug: "beverages", icon: "☕", desc: "Davidoff, Nescafe & Gourmet Drinks" },
  { name: "Chips & Snacks", slug: "chips-snacks", icon: "🥨", desc: "Pringles, Doritos & Pretzels" },
  { name: "Biscuits & Cookies", slug: "cookies", icon: "🍪", desc: "Lotus Biscoff, Nutella Biscuits" },
  { name: "Candies & Sweets", slug: "candies", icon: "🍬", desc: "Gummies, Toffees & Marshmallows" },
  { name: "Instant Noodles", slug: "instant-noodles", icon: "🍜", desc: "Samyang Buldak, Nongshim Ramen" },
];

const deliveryLocations = [
  { label: "Bashundhara R/A (Block A - N)", flag: "🇧🇩", code: "BD", sub: "⚡ Express 2-Hour Delivery" },
  { label: "Gulshan & Banani, Dhaka", flag: "🇧🇩", code: "BD", sub: "Same-Day Delivery" },
  { label: "Uttara & Dhanmondi, Dhaka", flag: "🇧🇩", code: "BD", sub: "Same-Day Delivery" },
  { label: "All Dhaka City", flag: "🇧🇩", code: "BD", sub: "Standard Delivery (৳100)" },
  { label: "Outside Dhaka (Courier)", flag: "🇧🇩", code: "BD", sub: "2-3 Days Courier" },
];

export function Header() {
  const { cart, wishlist, setCartOpen, user, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Dropdown states
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeNavMenu, setActiveNavMenu] = useState<string | null>(null);
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavEnter = (menu: string) => {
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    setActiveNavMenu(menu);
    setIsCategoryOpen(false);
  };

  const handleNavLeave = () => {
    navTimeoutRef.current = setTimeout(() => {
      setActiveNavMenu(null);
    }, 180);
  };
  
  // Preferences
  const [selectedLocation, setSelectedLocation] = useState(deliveryLocations[0]);
  const [selectedLang, setSelectedLang] = useState<"EN" | "BN">("EN");
  const [selectedCurrency, setSelectedCurrency] = useState<"BDT" | "USD">("BDT");

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  useEffect(() => {
    async function fetchSearch() {
      if (debouncedQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsSearching(false);
      }
    }
    fetchSearch();
  }, [debouncedQuery]);

  // Global click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (searchBoxRef.current && !searchBoxRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setIsCategoryOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(target)) {
        setIsLocationOpen(false);
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartItemsCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlist.length : 0;

  return (
    <>
      {/* 1. Top Slim Flash Sale Ticker */}
      <AnnouncementBar />

      {/* 2. Alibaba-Style Master Header with Dark Green Underlay for Rounded Top Corners */}
      <header className="sticky top-0 z-40 w-full bg-[#0E2620]">
        <div 
          className={`w-full bg-white rounded-t-[28px] sm:rounded-t-[36px] transition-all duration-300 ${
            isScrolled 
              ? "border-b border-[#E5E7EB] shadow-[0_4px_20px_rgba(22,58,50,0.06)]" 
              : "border-b border-transparent shadow-none"
          }`}
        >
          {/* ===================== TOP ROW: Logo, Search Bar Pill, Utility Icons, CTA ===================== */}
          <div className="container mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex h-14 sm:h-16 lg:h-17 items-center justify-between gap-2 sm:gap-4 lg:gap-6 pt-1 sm:pt-1.5">
            
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="lg:hidden">
                <MobileMenu />
              </div>

              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
                {/* Deep Forest Monogram Box with Warm Accent */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#163A32] flex items-center justify-center text-white shadow-sm shadow-[#163A32]/20 group-hover:scale-105 transition-transform duration-200 border border-[#6B8F71]/30">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-[#D6A84F]"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>

                {/* Typography Brand Name */}
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black text-[#111827] tracking-tight leading-none flex items-baseline">
                    DCC<span className="font-bold text-[#6B8F71] ml-0.5 sm:ml-1">Corner</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#4B5563] font-semibold tracking-wider uppercase mt-0.5 hidden sm:block">
                    Imported Wholesale Deals
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Alibaba-Style Long Pill Search Box */}
            <div className="flex-1 max-w-3xl mx-2 sm:mx-4 relative hidden sm:block" ref={searchBoxRef}>
              <form 
                onSubmit={handleSearchSubmit} 
                className={`relative w-full h-11 lg:h-12 bg-white rounded-full border-2 transition-all flex items-center pl-4 pr-1.5 shadow-2xs ${
                  isSearchFocused 
                    ? "border-[#163A32] ring-3 ring-[#163A32]/10" 
                    : "border-[#163A32] hover:border-[#163A32]/90"
                }`}
              >
                {/* Search Input */}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="What are you looking for?"
                  className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-[#111827] placeholder:text-[#9CA3AF] outline-none"
                />

                {/* Clear button if typed */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 mr-1.5 text-slate-400 hover:text-[#111827] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Search CTA Pill Button (Alibaba style with text + icon) */}
                <button
                  type="submit"
                  className="h-8 lg:h-9 px-4 sm:px-6 bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs sm:text-sm rounded-full flex items-center gap-1.5 shadow-sm shadow-[#163A32]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#D6A84F]" />
                  ) : (
                    <Search className="w-4 h-4 text-white stroke-[2.2]" />
                  )}
                  <span className="hidden md:inline">Search</span>
                </button>
              </form>

              {/* Live Search Autocomplete Popup */}
              {isSearchFocused && debouncedQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl z-50 overflow-hidden max-h-96 divide-y divide-[#E5E7EB] animate-in fade-in zoom-in-98 duration-150">
                  <div className="px-4 py-2 bg-[#F7F8F5] text-[11px] font-bold uppercase tracking-wider text-[#4B5563] flex justify-between items-center">
                    <span>Products Found ({searchResults.length})</span>
                    <span className="text-[10px] text-[#6B8F71] font-semibold">Press Enter to view all</span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-3.5 p-3 hover:bg-[#F7F8F5] transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#F7F8F5] border border-[#E5E7EB] overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#111827] line-clamp-1 group-hover:text-[#163A32] transition-colors">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-[#6B8F71] font-semibold mt-0.5">{product.brand || "Imported Goods"}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-[#163A32]">
                              ৳{product.discountPrice > 0 ? product.discountPrice.toFixed(0) : product.price.toFixed(0)}
                            </p>
                            {product.discountPrice > 0 && (
                              <p className="text-[10px] text-[#9CA3AF] line-through font-semibold">৳{product.price.toFixed(0)}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-[#4B5563]">
                      No products found matching &ldquo;{debouncedQuery}&rdquo;. Try another keyword.
                    </div>
                  )}

                  <div className="p-2.5 text-center bg-[#F7F8F5]">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-extrabold text-[#163A32] hover:underline"
                    >
                      View all search results for &ldquo;{searchQuery}&rdquo; →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Deliver To, Globe, Cart, User, and "Create account" Button */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              
              {/* 1. Deliver to: 🇧🇩 BD (Alibaba country flag & short code) */}
              <div className="relative hidden xl:block" ref={locationRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationOpen(!isLocationOpen);
                    setIsLangOpen(false);
                    setIsUserMenuOpen(false);
                  }}
                  className="flex flex-col items-start px-2 py-1 rounded-xl hover:bg-[#F7F8F5] transition-colors cursor-pointer text-left"
                >
                  <span className="text-[10px] text-[#4B5563] font-medium leading-none">Deliver to:</span>
                  <span className="text-xs font-extrabold text-[#111827] flex items-center gap-1 mt-0.5">
                    <span className="text-sm">{selectedLocation.flag}</span>
                    <span>{selectedLocation.code}</span>
                    <ChevronDown className="w-3 h-3 text-[#4B5563] ml-0.5" />
                  </span>
                </button>

                {/* Location Selection Dropdown */}
                {isLocationOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-[#E5E7EB] mb-1">
                      <p className="text-xs font-bold text-[#111827]">Delivery Destination</p>
                      <p className="text-[10px] text-[#4B5563]">Select your zone for express rates</p>
                    </div>
                    {deliveryLocations.map((loc) => (
                      <button
                        key={loc.label}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-[#F7F8F5] transition-colors ${
                          selectedLocation.label === loc.label ? "bg-[#163A32]/10 text-[#163A32] font-bold" : "text-[#4B5563]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{loc.flag}</span>
                          <div>
                            <p className="font-semibold text-xs text-[#111827]">{loc.label}</p>
                            <p className="text-[10px] text-[#6B8F71]">{loc.sub}</p>
                          </div>
                        </div>
                        {selectedLocation.label === loc.label && <Check className="w-4 h-4 text-[#163A32]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Language / Globe Icon (🌐) */}
              <div className="relative hidden lg:block" ref={langRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLangOpen(!isLangOpen);
                    setIsLocationOpen(false);
                    setIsUserMenuOpen(false);
                  }}
                  aria-label="Language and Currency"
                  className="p-2 text-[#111827] hover:text-[#163A32] hover:bg-[#F7F8F5] rounded-full transition-colors cursor-pointer"
                >
                  <Globe className="w-5 h-5 stroke-[1.8]" />
                </button>

                {/* Language & Currency Dropdown */}
                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4B5563] border-b border-[#E5E7EB]">
                      Language
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedLang("EN"); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[#F7F8F5] flex items-center justify-between ${
                        selectedLang === "EN" ? "font-bold text-[#163A32]" : "text-[#4B5563]"
                      }`}
                    >
                      English {selectedLang === "EN" && <Check className="w-3.5 h-3.5 text-[#163A32]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedLang("BN"); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[#F7F8F5] flex items-center justify-between ${
                        selectedLang === "BN" ? "font-bold text-[#163A32]" : "text-[#4B5563]"
                      }`}
                    >
                      বাংলা {selectedLang === "BN" && <Check className="w-3.5 h-3.5 text-[#163A32]" />}
                    </button>

                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#4B5563] border-t border-b border-[#E5E7EB] mt-1">
                      Currency
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedCurrency("BDT"); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[#F7F8F5] flex items-center justify-between ${
                        selectedCurrency === "BDT" ? "font-bold text-[#163A32]" : "text-[#4B5563]"
                      }`}
                    >
                      ৳ BDT {selectedCurrency === "BDT" && <Check className="w-3.5 h-3.5 text-[#163A32]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedCurrency("USD"); setIsLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[#F7F8F5] flex items-center justify-between ${
                        selectedCurrency === "USD" ? "font-bold text-[#163A32]" : "text-[#4B5563]"
                      }`}
                    >
                      $ USD {selectedCurrency === "USD" && <Check className="w-3.5 h-3.5 text-[#163A32]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Wishlist Icon ❤️ (Desktop & Mobile) */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="p-2 text-[#111827] hover:text-[#163A32] hover:bg-[#F7F8F5] rounded-full transition-colors cursor-pointer relative"
              >
                <Heart className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#163A32] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* 4. Cart Icon 🛒 (Alibaba Style) */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Shopping Cart"
                className="p-2 text-[#111827] hover:text-[#163A32] hover:bg-[#F7F8F5] rounded-full transition-colors cursor-pointer relative"
              >
                <ShoppingCart className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#163A32] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* 5. User Icon 👤 (Profile / Account Dropdown) */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsLocationOpen(false);
                    setIsLangOpen(false);
                  }}
                  aria-label="Account"
                  className="p-2 text-[#111827] hover:text-[#163A32] hover:bg-[#F7F8F5] rounded-full transition-colors cursor-pointer"
                >
                  <User className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.8]" />
                </button>

                {/* Account Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {user ? (
                      <>
                        <div className="px-3 py-2 border-b border-[#E5E7EB]">
                          <p className="text-[11px] text-[#4B5563]">Signed in as</p>
                          <p className="text-xs font-black text-[#111827] truncate">{user.name || user.email}</p>
                        </div>
                        {user.role === "ADMIN" && (
                          <Link
                            href="/dcc-hq"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-[#163A32] font-bold hover:bg-[#F7F8F5] rounded-lg mt-1"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#163A32]" />
                            <span>Admin Portal (HQ)</span>
                          </Link>
                        )}
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-[#4B5563] font-semibold hover:bg-[#F7F8F5] hover:text-[#163A32] rounded-lg"
                        >
                          <ShoppingBag className="w-4 h-4 text-[#6B8F71]" />
                          <span>My Orders</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#DC2626] font-medium hover:bg-red-50 rounded-lg border-t border-slate-100 mt-1"
                        >
                          <LogOut className="w-4 h-4 text-[#DC2626]" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <div className="p-2 space-y-2 text-center">
                        <p className="text-xs text-[#4B5563] font-medium">Welcome to DCC Corner</p>
                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block w-full py-2 bg-[#163A32] text-white rounded-xl font-bold text-xs shadow-xs hover:bg-[#0E2620]"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block w-full py-1.5 text-[#163A32] hover:bg-[#F7F8F5] rounded-xl font-bold text-xs"
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 6. Primary Pill CTA Button ("Create account" / "Sign In") */}
              <div className="hidden sm:block">
                {user ? (
                  <Link
                    href={user.role === "ADMIN" ? "/dcc-hq" : "/dashboard"}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#163A32] hover:bg-[#0E2620] text-white text-xs font-bold shadow-xs shadow-[#163A32]/20 transition-all hover:scale-102 cursor-pointer"
                  >
                    <span>{user.role === "ADMIN" ? "Admin HQ" : "My Account"}</span>
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#163A32] hover:bg-[#0E2620] text-white text-xs font-bold shadow-xs shadow-[#163A32]/20 transition-all hover:scale-102 cursor-pointer"
                  >
                    <span>Create account</span>
                  </Link>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Search Bar Row (When on small screens) */}
        <div className="sm:hidden px-3 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full h-10 bg-[#F7F8F5] rounded-full border border-[#E5E7EB] flex items-center pl-3.5 pr-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chocolates, coffee, snacks..."
              className="flex-1 bg-transparent text-xs font-medium text-[#111827] placeholder:text-[#9CA3AF] outline-none"
            />
            <button
              type="submit"
              className="h-7 px-3 bg-[#163A32] text-white rounded-full flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ===================== BOTTOM ROW: 2-Tier Sub-Navigation with Rich Hover Mega-Menus ===================== */}
        <div 
          className="hidden lg:block pb-2 pt-0.5 relative"
          onMouseLeave={handleNavLeave}
        >
          <div className="container mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex h-9 items-center justify-between text-xs font-bold text-[#111827]">
              
              {/* Left Subnav: "≡ All categories" + Trade Links with Hover Mega Dropdowns */}
              <div className="flex items-center space-x-6">
                
                {/* ≡ All categories Dropdown Trigger Button */}
                <div className="relative" ref={categoryRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen);
                      setActiveNavMenu(null);
                    }}
                    onMouseEnter={() => {
                      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
                      setActiveNavMenu(null);
                    }}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition-colors cursor-pointer group ${
                      isCategoryOpen ? "bg-[#163A32] text-white" : "hover:bg-[#F7F8F5] text-[#111827]"
                    }`}
                  >
                    <Menu className={`w-4 h-4 transition-transform ${isCategoryOpen ? "text-[#D6A84F]" : "text-[#163A32] group-hover:scale-110"}`} />
                    <span>All categories</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryOpen ? "rotate-180 text-white" : "text-[#4B5563]"}`} />
                  </button>

                  {/* Mega Dropdown Panel for All Categories */}
                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100">
                      <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#163A32] bg-[#F7F8F5] rounded-xl mb-1 flex items-center justify-between">
                        <span>Browse Categories</span>
                        <span className="text-[10px] text-[#6B8F71] font-bold">100% Imported</span>
                      </div>
                      
                      <div className="py-1 space-y-0.5">
                        {defaultCategories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            onClick={() => setIsCategoryOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors group"
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                            <div>
                              <p className="font-bold text-xs text-[#111827] group-hover:text-[#163A32]">{cat.name}</p>
                              <p className="text-[10px] text-[#4B5563] font-normal">{cat.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="pt-2">
                        <Link
                          href="/shop"
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-center w-full py-2 bg-[#F7F8F5] hover:bg-[#163A32]/10 text-[#163A32] rounded-xl font-extrabold text-xs transition-colors"
                        >
                          View All Imported Products →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navlink 1: Wholesale Deals (Triggers Mega-Dropdown on Hover) */}
                <div 
                  className="relative py-1"
                  onMouseEnter={() => handleNavEnter("wholesale")}
                >
                  <Link
                    href="/shop?offers=true"
                    className={`transition-colors flex items-center gap-1.5 py-1 whitespace-nowrap cursor-pointer ${
                      activeNavMenu === "wholesale" ? "text-[#163A32] font-black border-b-2 border-[#163A32]" : "text-[#111827] hover:text-[#163A32]"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-[#D6A84F] fill-[#D6A84F]" />
                    <span>Wholesale Deals</span>
                  </Link>
                </div>

                {/* Navlink 2: Direct Imports / Verified (Triggers Mega-Dropdown on Hover) */}
                <div 
                  className="relative py-1"
                  onMouseEnter={() => handleNavEnter("verified")}
                >
                  <Link
                    href="/shop?sort=popular"
                    className={`transition-colors flex items-center gap-1 py-1 whitespace-nowrap cursor-pointer ${
                      activeNavMenu === "verified" ? "text-[#163A32] font-black border-b-2 border-[#163A32]" : "text-[#4B5563] hover:text-[#163A32]"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6B8F71]" />
                    <span>Verified Direct Imports</span>
                  </Link>
                </div>

                {/* Navlink 3: New Arrivals (Triggers Mega-Dropdown on Hover) */}
                <div 
                  className="relative py-1"
                  onMouseEnter={() => handleNavEnter("new-arrivals")}
                >
                  <Link
                    href="/shop?sort=newest"
                    className={`transition-colors flex items-center gap-1 py-1 whitespace-nowrap cursor-pointer ${
                      activeNavMenu === "new-arrivals" ? "text-[#163A32] font-black border-b-2 border-[#163A32]" : "text-[#4B5563] hover:text-[#163A32]"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
                    <span>New Arrivals</span>
                  </Link>
                </div>

              </div>

              {/* Right Subnav: 4 Information & Support Links with Hover Dropdowns */}
              <div className="flex items-center space-x-6 text-[#4B5563] font-semibold">
                
                {/* Info 1: About DCC Corner */}
                <Link
                  href="/#about-us"
                  onMouseEnter={() => handleNavEnter("about")}
                  className="hover:text-[#163A32] transition-colors whitespace-nowrap py-1"
                >
                  About DCC Corner
                </Link>

                {/* Info 2: Help Center (Triggers Dropdown on Hover) */}
                <div 
                  className="relative py-1"
                  onMouseEnter={() => handleNavEnter("help")}
                >
                  <Link
                    href="/#trust-badges"
                    className={`transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      activeNavMenu === "help" ? "text-[#163A32] font-bold" : "hover:text-[#163A32]"
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#6B8F71]" />
                    <span>Help Center</span>
                  </Link>
                </div>

                {/* Info 3: Bashundhara Express (Triggers Dropdown on Hover) */}
                <div 
                  className="relative py-1"
                  onMouseEnter={() => handleNavEnter("express")}
                >
                  <Link
                    href="/checkout"
                    className={`transition-colors flex items-center gap-1 whitespace-nowrap font-bold ${
                      activeNavMenu === "express" ? "text-[#163A32] underline" : "text-[#163A32] hover:opacity-80"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-[#163A32]" />
                    <span>Bashundhara Express</span>
                  </Link>
                </div>

                {/* Info 4: Track Order */}
                <Link
                  href="/track-order"
                  onMouseEnter={() => handleNavEnter("track")}
                  className="hover:text-[#163A32] transition-colors flex items-center gap-1 whitespace-nowrap py-1"
                >
                  <Package className="w-3.5 h-3.5 text-[#6B8F71]" />
                  <span>Track Order</span>
                </Link>

              </div>

            </div>
          </div>

          {/* ===================== FULL WIDTH MEGA MENU DROPDOWNS ON HOVER ===================== */}

          {/* 1. WHOLESALE DEALS MEGA MENU (Exact Layout Matching User Screenshot) */}
          {activeNavMenu === "wholesale" && (
            <div 
              className="absolute top-full left-0 right-0 z-50 pt-2 animate-in fade-in zoom-in-98 duration-150"
              onMouseEnter={() => {
                if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
              }}
              onMouseLeave={handleNavLeave}
            >
              <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl p-6 lg:p-8 grid grid-cols-12 gap-6 text-[#111827]">
                  
                  {/* Column 1: BROWSE DEALS */}
                  <div className="col-span-2 space-y-3">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Browse Deals
                    </p>
                    <ul className="space-y-2.5 text-xs font-semibold text-[#4B5563]">
                      <li>
                        <Link 
                          href="/shop?offers=true" 
                          onClick={() => setActiveNavMenu(null)}
                          className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all group"
                        >
                          <Tag className="w-3.5 h-3.5 text-[#6B8F71] group-hover:text-[#163A32]" />
                          <span>All Wholesale Deals</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/shop?sort=popular&offers=true" 
                          onClick={() => setActiveNavMenu(null)}
                          className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all group"
                        >
                          <Star className="w-3.5 h-3.5 text-[#D6A84F] group-hover:text-[#163A32]" />
                          <span>Top Selling Deals</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/shop?q=bulk" 
                          onClick={() => setActiveNavMenu(null)}
                          className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all group"
                        >
                          <Package className="w-3.5 h-3.5 text-[#6B8F71] group-hover:text-[#163A32]" />
                          <span>Bulk Save Offers</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/shop?offers=true" 
                          onClick={() => setActiveNavMenu(null)}
                          className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all group"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#D6A84F] group-hover:text-[#163A32]" />
                          <span>Seasonal Offers</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/shop?sort=discount" 
                          onClick={() => setActiveNavMenu(null)}
                          className="flex items-center gap-2 hover:text-red-600 hover:translate-x-1 transition-all group text-red-600/90"
                        >
                          <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                          <span>Clearance Sale</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Column 2: SHOP BY CATEGORY */}
                  <div className="col-span-3 space-y-3">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Shop By Category
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-[#4B5563]">
                      <li>
                        <Link href="/category/imported-chocolates" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <span>🍫</span> Chocolates & Confectionery
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/chips-snacks" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <span>🥨</span> Snacks & Biscuits
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/beverages" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <span>☕</span> Beverages & Coffee
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=canned" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <span>🥫</span> Canned Food
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/instant-noodles" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <span>🍜</span> Instant Food
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=spreads" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <span>🍯</span> Sauces & Spreads
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=personal-care" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <span>🧴</span> Personal Care
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=household" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <span>🧻</span> Household Essentials
                        </Link>
                      </li>
                    </ul>
                    <Link 
                      href="/shop" 
                      onClick={() => setActiveNavMenu(null)}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#163A32] hover:text-[#6B8F71] transition-colors pt-1"
                    >
                      View All Categories →
                    </Link>
                  </div>

                  {/* Column 3: SHOP BY BRAND */}
                  <div className="col-span-2 space-y-3">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Shop By Brand
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-[#4B5563]">
                      <li>
                        <Link href="/shop?q=Ferrero" onClick={() => setActiveNavMenu(null)} className="hover:text-[#163A32] hover:translate-x-1 transition-all block">
                          Ferrero Rocher
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Nestle" onClick={() => setActiveNavMenu(null)} className="hover:text-[#163A32] hover:translate-x-1 transition-all block">
                          Nestle
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Lays" onClick={() => setActiveNavMenu(null)} className="hover:text-[#163A32] hover:translate-x-1 transition-all block">
                          Lays
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Pringles" onClick={() => setActiveNavMenu(null)} className="hover:text-[#163A32] hover:translate-x-1 transition-all block">
                          Pringles
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Heinz" onClick={() => setActiveNavMenu(null)} className="hover:text-[#163A32] hover:translate-x-1 transition-all block">
                          Heinz
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Barilla" onClick={() => setActiveNavMenu(null)} className="hover:text-[#163A32] hover:translate-x-1 transition-all block">
                          Barilla
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Red+Bull" onClick={() => setActiveNavMenu(null)} className="hover:text-[#163A32] hover:translate-x-1 transition-all block">
                          Red Bull
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Nescafe" onClick={() => setActiveNavMenu(null)} className="hover:text-[#163A32] hover:translate-x-1 transition-all block">
                          Nescafe
                        </Link>
                      </li>
                    </ul>
                    <Link 
                      href="/shop" 
                      onClick={() => setActiveNavMenu(null)}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#163A32] hover:text-[#6B8F71] transition-colors pt-1"
                    >
                      View All Brands →
                    </Link>
                  </div>

                  {/* Column 4: EXTRA */}
                  <div className="col-span-2 space-y-3">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Extra
                    </p>
                    <ul className="space-y-2.5 text-xs font-semibold text-[#4B5563]">
                      <li>
                        <Link href="/shop?offers=true" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <Clock className="w-3.5 h-3.5 text-[#6B8F71]" />
                          <span>Combo Deals</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=hampers" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <Gift className="w-3.5 h-3.5 text-[#D6A84F]" />
                          <span>Gift Packs & Hampers</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?sort=newest" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <Sparkles className="w-3.5 h-3.5 text-[#6B8F71]" />
                          <span>Upcoming Deals</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?offers=true" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 hover:text-[#163A32] hover:translate-x-1 transition-all">
                          <Star className="w-3.5 h-3.5 text-[#D6A84F]" />
                          <span>Deal of the Day</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Column 5: BULK ORDER PROMO BENTO CARD (Right Side) */}
                  <div className="col-span-3 bg-[#163A32] text-white rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-lg group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D6A84F]/15 rounded-full blur-2xl pointer-events-none" />
                    
                    <div>
                      <h4 className="text-base font-black text-white leading-tight font-heading">
                        Bulk Order?
                      </h4>
                      <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                        Get extra wholesale discounts on bulk orders for your business, events & corporate gifting.
                      </p>
                    </div>

                    <div className="my-3 flex justify-center">
                      <div className="w-24 h-20 bg-white/10 rounded-xl p-2 flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform">
                        <Package className="w-12 h-12 text-[#D6A84F]" />
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      onClick={() => setActiveNavMenu(null)}
                      className="w-full py-2.5 bg-[#D6A84F] hover:bg-[#E0BC70] text-[#163A32] rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 cursor-pointer"
                    >
                      <span>Contact Us →</span>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 2. VERIFIED DIRECT IMPORTS MEGA MENU */}
          {activeNavMenu === "verified" && (
            <div 
              className="absolute top-full left-0 right-0 z-50 pt-2 animate-in fade-in zoom-in-98 duration-150"
              onMouseEnter={() => {
                if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
              }}
              onMouseLeave={handleNavLeave}
            >
              <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl p-6 lg:p-8 grid grid-cols-12 gap-6 text-[#111827]">
                  
                  {/* Origin Countries */}
                  <div className="col-span-4 space-y-3 border-r border-[#E5E7EB] pr-6">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Direct Import Origins
                    </p>
                    <ul className="grid grid-cols-2 gap-2.5 text-xs font-bold text-[#4B5563]">
                      <li>
                        <Link href="/shop?q=UK" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span className="text-base">🇬🇧</span> United Kingdom
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Swiss" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span className="text-base">🇨🇭</span> Switzerland
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Belgium" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span className="text-base">🇧🇪</span> Belgium
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Germany" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span className="text-base">🇩🇪</span> Germany
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=USA" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span className="text-base">🇺🇸</span> United States
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=Japan" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span className="text-base">🇯🇵</span> Japan & Korea
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Verification Guarantee */}
                  <div className="col-span-4 space-y-3 border-r border-[#E5E7EB] pr-6">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Quality & Authenticity Checks
                    </p>
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-2xl bg-[#F7F8F5] border border-[#E5E7EB]">
                        <p className="font-bold text-[#163A32] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#163A32]" />
                          100% Original Batch Seal
                        </p>
                        <p className="text-[11px] text-[#4B5563] mt-0.5 font-normal">
                          All products are scanned and verified against manufacturer barcode databases.
                        </p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#F7F8F5] border border-[#E5E7EB]">
                        <p className="font-bold text-[#6B8F71] flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-[#6B8F71]" />
                          Cold-Chain Climate Storage
                        </p>
                        <p className="text-[11px] text-[#4B5563] mt-0.5 font-normal">
                          Chocolates and confections are kept in 18°C temperature control to prevent melting.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Importer Advantage Card */}
                  <div className="col-span-4 bg-gradient-to-br from-[#163A32] to-[#0E2620] text-white rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D6A84F]/20 text-[#D6A84F] text-[10px] font-black mb-2">
                        Direct Importer Advantage
                      </span>
                      <h4 className="text-base font-black text-white leading-tight font-heading">
                        Zero Middlemen, Genuine Wholesale Savings
                      </h4>
                      <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                        We import container shipments directly from European factories, passing on maximum savings to you.
                      </p>
                    </div>

                    <Link
                      href="/shop?sort=popular"
                      onClick={() => setActiveNavMenu(null)}
                      className="mt-4 w-full py-2.5 bg-[#D6A84F] hover:bg-[#E0BC70] text-[#163A32] rounded-xl font-black text-xs transition-all text-center"
                    >
                      Browse Verified Imports →
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 3. NEW ARRIVALS MEGA MENU */}
          {activeNavMenu === "new-arrivals" && (
            <div 
              className="absolute top-full left-0 right-0 z-50 pt-2 animate-in fade-in zoom-in-98 duration-150"
              onMouseEnter={() => {
                if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
              }}
              onMouseLeave={handleNavLeave}
            >
              <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl p-6 lg:p-8 grid grid-cols-12 gap-6 text-[#111827]">
                  
                  <div className="col-span-4 space-y-3 border-r border-[#E5E7EB] pr-6">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Landed This Week
                    </p>
                    <ul className="space-y-2.5 text-xs font-bold text-[#4B5563]">
                      <li>
                        <Link href="/shop?sort=newest&category=imported-chocolates" onClick={() => setActiveNavMenu(null)} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span>🍫 Fresh Swiss & Belgian Bars</span>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">New</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?sort=newest&category=instant-noodles" onClick={() => setActiveNavMenu(null)} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span>🍜 Viral Buldak & Ramen Flavors</span>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">New</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?sort=newest&category=beverages" onClick={() => setActiveNavMenu(null)} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span>☕ Davidoff & European Roasts</span>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">New</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-4 space-y-3 border-r border-[#E5E7EB] pr-6">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Trending & Limited Editions
                    </p>
                    <ul className="space-y-2.5 text-xs font-bold text-[#4B5563]">
                      <li>
                        <Link href="/shop?q=Dubai" onClick={() => setActiveNavMenu(null)} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span>✨ Dubai Pistachio Knafeh Chocolates</span>
                          <span className="text-[10px] text-[#D6A84F] bg-[#D6A84F]/10 px-2 py-0.5 rounded-full font-bold">Hot</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?q=hampers" onClick={() => setActiveNavMenu(null)} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <span>🎁 Luxury Festive Gift Hampers</span>
                          <span className="text-[10px] text-[#D6A84F] bg-[#D6A84F]/10 px-2 py-0.5 rounded-full font-bold">Hot</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-4 bg-[#F7F8F5] rounded-2xl p-5 border border-[#E5E7EB] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#6B8F71]">Weekly Drop</span>
                      <h4 className="text-sm font-black text-[#111827] mt-1 font-heading">
                        Be The First To Taste Limited Batches
                      </h4>
                      <p className="text-xs text-[#4B5563] mt-1">
                        Stock flies fast. Reserve your favorite imported treats before they sell out.
                      </p>
                    </div>
                    <Link
                      href="/shop?sort=newest"
                      onClick={() => setActiveNavMenu(null)}
                      className="mt-4 w-full py-2 bg-[#163A32] text-white rounded-xl font-bold text-xs text-center hover:bg-[#0E2620] transition-colors"
                    >
                      Explore All New Arrivals →
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 4. BASHUNDHARA EXPRESS MEGA MENU */}
          {activeNavMenu === "express" && (
            <div 
              className="absolute top-full left-0 right-0 z-50 pt-2 animate-in fade-in zoom-in-98 duration-150"
              onMouseEnter={() => {
                if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
              }}
              onMouseLeave={handleNavLeave}
            >
              <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl p-6 lg:p-8 grid grid-cols-12 gap-6 text-[#111827]">
                  
                  <div className="col-span-4 space-y-3 border-r border-[#E5E7EB] pr-6">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Bashundhara R/A Zones
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-[#4B5563]">
                      <li className="flex items-center justify-between p-2 rounded-xl bg-[#F7F8F5]">
                        <span className="font-bold text-[#111827]">Block A, B, C, D, E</span>
                        <span className="text-[11px] text-[#163A32] font-black">⚡ 1.5 - 2 Hours</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-xl bg-[#F7F8F5]">
                        <span className="font-bold text-[#111827]">Block F, G, H, I, J</span>
                        <span className="text-[11px] text-[#163A32] font-black">⚡ 2 Hours</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-xl bg-[#F7F8F5]">
                        <span className="font-bold text-[#111827]">Block K, L, M, N & Beyond</span>
                        <span className="text-[11px] text-[#163A32] font-black">⚡ 2 - 2.5 Hours</span>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-4 space-y-3 border-r border-[#E5E7EB] pr-6">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Delivery Benefits
                    </p>
                    <div className="space-y-2 text-xs text-[#4B5563]">
                      <p className="font-bold text-[#163A32] flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#163A32]" /> Free Shipping Over ৳1500
                      </p>
                      <p className="font-bold text-[#163A32] flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#6B8F71]" /> Insulated Protective Packaging
                      </p>
                      <p className="font-bold text-[#163A32] flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#D6A84F]" /> Cash on Delivery & bKash Accepted
                      </p>
                    </div>
                  </div>

                  <div className="col-span-4 bg-[#163A32] text-white rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <div>
                      <h4 className="text-base font-black text-white font-heading">
                        Need Treats Delivered ASAP?
                      </h4>
                      <p className="text-xs text-slate-300 font-medium mt-1">
                        Place your order now to get it delivered directly to your Bashundhara flat or office.
                      </p>
                    </div>
                    <Link
                      href="/checkout"
                      onClick={() => setActiveNavMenu(null)}
                      className="mt-4 w-full py-2.5 bg-[#D6A84F] hover:bg-[#E0BC70] text-[#163A32] rounded-xl font-black text-xs text-center transition-all"
                    >
                      Instant Express Checkout →
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 5. HELP CENTER MEGA MENU */}
          {activeNavMenu === "help" && (
            <div 
              className="absolute top-full left-0 right-0 z-50 pt-2 animate-in fade-in zoom-in-98 duration-150"
              onMouseEnter={() => {
                if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
              }}
              onMouseLeave={handleNavLeave}
            >
              <div className="container mx-auto px-3 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl p-6 lg:p-8 grid grid-cols-12 gap-6 text-[#111827]">
                  
                  <div className="col-span-6 space-y-3 border-r border-[#E5E7EB] pr-6">
                    <p className="text-[11px] font-black tracking-wider text-[#9CA3AF] uppercase">
                      Customer Care & Orders
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-[#4B5563]">
                      <li>
                        <Link href="/track-order" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <Package className="w-4 h-4 text-[#6B8F71]" />
                          <span>Track Your Active Order</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/#trust-badges" onClick={() => setActiveNavMenu(null)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F7F8F5] hover:text-[#163A32] transition-colors">
                          <ShieldCheck className="w-4 h-4 text-[#163A32]" />
                          <span>Authenticity Guarantee & Replacements</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-6 bg-[#F7F8F5] rounded-2xl p-5 border border-[#E5E7EB] flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black text-[#111827] font-heading">
                        Need Assistance or Wholesale Bulk Support?
                      </h4>
                      <p className="text-xs text-[#4B5563] mt-1">
                        Our customer service team is ready to assist you via WhatsApp or phone call.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <a
                        href="https://wa.me/8801700000000"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-[#163A32] hover:bg-[#0E2620] text-white rounded-xl font-bold text-xs text-center transition-colors"
                      >
                        Chat on WhatsApp
                      </a>
                      <Link
                        href="/track-order"
                        onClick={() => setActiveNavMenu(null)}
                        className="flex-1 py-2 bg-white border border-[#E5E7EB] hover:border-[#163A32] text-[#111827] rounded-xl font-bold text-xs text-center transition-colors"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* Mobile Horizontal Quick Category Pills */}
        <div className="lg:hidden border-t border-[#E5E7EB] bg-[#F7F8F5] py-2 px-3 overflow-x-auto no-scrollbar flex items-center gap-2 text-xs font-bold text-[#111827]">
          <Link
            href="/shop"
            className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full shrink-0 hover:border-[#163A32] flex items-center gap-1 text-[#163A32]"
          >
            <Menu className="w-3 h-3" /> All
          </Link>
          <Link
            href="/shop?offers=true"
            className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full shrink-0 hover:border-[#163A32] flex items-center gap-1 text-[#DC2626]"
          >
            <Flame className="w-3 h-3 fill-[#DC2626]" /> Deals
          </Link>
          <Link
            href="/category/imported-chocolates"
            className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full shrink-0 hover:border-[#163A32]"
          >
            🍫 Chocolates
          </Link>
          <Link
            href="/category/beverages"
            className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full shrink-0 hover:border-[#163A32]"
          >
            ☕ Coffee
          </Link>
          <Link
            href="/category/chips-snacks"
            className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full shrink-0 hover:border-[#163A32]"
          >
            🥨 Snacks
          </Link>
          <Link
            href="/track-order"
            className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-full shrink-0 hover:border-[#163A32] text-[#6B8F71]"
          >
            📦 Track
          </Link>
        </div>

        </div>
      </header>
    </>
  );
}
