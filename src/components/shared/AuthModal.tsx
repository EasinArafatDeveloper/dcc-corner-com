"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { 
  X, 
  User, 
  Phone, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    openAuthModal, 
    setUser 
  } = useStore();

  const [mode, setMode] = useState<"signup" | "login">(authModalMode || "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showOptionalEmail, setShowOptionalEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");

  // Keep internal mode in sync with store
  if (authModalMode !== mode && isAuthModalOpen) {
    setMode(authModalMode);
  }

  if (!isAuthModalOpen) return null;

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your mobile phone number");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || "USER",
      });

      toast.success(`Welcome to DCC Corner, ${data.name}! 🎉`);
      closeAuthModal();
      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      toast.error(err.message || "Account creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      toast.error("Please enter your phone number or email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid phone/email or password");
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || "USER",
      });

      toast.success(`Welcome back, ${data.name}! 👋`);
      closeAuthModal();
      setLoginIdentifier("");
      setPassword("");
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={closeAuthModal} 
      />

      {/* Auth Modal Container */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-br from-[#163A32] to-[#0E2620] p-6 text-white relative">
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[#D6A84F] text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Authentic Direct Imports</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight font-heading">
            {mode === "signup" ? "Create Free Account" : "Welcome Back"}
          </h3>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            {mode === "signup" 
              ? "Join DCC Corner for wholesale rates & 2-hr Bashundhara express delivery."
              : "Sign in with your phone number or email to manage your orders."}
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-4 grid grid-cols-2 p-1 bg-black/20 rounded-xl">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-white text-[#163A32] shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#163A32] shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6">
          {mode === "signup" ? (
            /* ================= SIGNUP FORM (Name + Phone + Password) ================= */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <Label htmlFor="auth-name" className="text-xs font-bold text-[#111827]">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-10.5 rounded-xl border-[#E5E7EB] text-xs font-medium focus:ring-[#163A32] bg-[#F7F8F5]"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <Label htmlFor="auth-phone" className="text-xs font-bold text-[#111827]">
                  Phone Number (Mobile) *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="auth-phone"
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-10.5 rounded-xl border-[#E5E7EB] text-xs font-medium focus:ring-[#163A32] bg-[#F7F8F5]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="auth-password" className="text-xs font-bold text-[#111827]">
                  Password (6+ chars) *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-10.5 rounded-xl border-[#E5E7EB] text-xs font-medium focus:ring-[#163A32] bg-[#F7F8F5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional Email Toggle */}
              <div>
                {!showOptionalEmail ? (
                  <button
                    type="button"
                    onClick={() => setShowOptionalEmail(true)}
                    className="text-[11px] font-bold text-[#6B8F71] hover:text-[#163A32] transition-colors"
                  >
                    + Add Email Address (Optional)
                  </button>
                ) : (
                  <div className="space-y-1 pt-1 animate-in fade-in duration-150">
                    <Label htmlFor="auth-email" className="text-xs font-bold text-[#111827]">
                      Email Address (Optional)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="auth-email"
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-10.5 rounded-xl border-[#E5E7EB] text-xs font-medium focus:ring-[#163A32] bg-[#F7F8F5]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-2xl bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs shadow-md shadow-[#163A32]/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Start Shopping</span>
                    <ArrowRight className="w-4 h-4 text-[#D6A84F]" />
                  </>
                )}
              </Button>

              <p className="text-[11px] text-center text-[#6B7280] pt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[#163A32] font-bold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </form>
          ) : (
            /* ================= LOGIN FORM (Phone/Email + Password) ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Phone or Email */}
              <div className="space-y-1">
                <Label htmlFor="login-id" className="text-xs font-bold text-[#111827]">
                  Phone Number or Email *
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="login-id"
                    type="text"
                    required
                    placeholder="017XXXXXXXX or email@example.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="pl-10 h-10.5 rounded-xl border-[#E5E7EB] text-xs font-medium focus:ring-[#163A32] bg-[#F7F8F5]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-xs font-bold text-[#111827]">
                    Password *
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-10.5 rounded-xl border-[#E5E7EB] text-xs font-medium focus:ring-[#163A32] bg-[#F7F8F5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-2xl bg-[#163A32] hover:bg-[#0E2620] text-white font-bold text-xs shadow-md shadow-[#163A32]/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to DCC Corner</span>
                    <ArrowRight className="w-4 h-4 text-[#D6A84F]" />
                  </>
                )}
              </Button>

              <p className="text-[11px] text-center text-[#6B7280] pt-1">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[#163A32] font-bold hover:underline"
                >
                  Create one in 10 seconds
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="bg-[#F7F8F5] border-t border-[#E5E7EB] px-6 py-3 flex items-center justify-center gap-4 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#163A32]" />
            <span>Secure 256-Bit SSL</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#163A32]" />
            <span>No Spam Guarantee</span>
          </div>
        </div>

      </div>
    </div>
  );
}
