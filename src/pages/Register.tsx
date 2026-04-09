import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Check,
} from "lucide-react";
import { useLangStore } from "@/shared/stores/langStore";
import { registerTranslations } from "@/shared/config/translations/register";
import { AuthLayout } from "@/shared/ui/auth/AuthLayout";
import { InputField } from "@/shared/ui/auth/InputField";
import { SocialButton } from "@/shared/ui/auth/SocialButton";
import { PasswordStrengthIndicator } from "@/shared/ui/auth/PasswordStrengthIndicator";

// ─── Register Page ────────────────────────────────────────────────────────────
export function RegisterPage() {
  const { lang } = useLangStore();
  const navigate = useNavigate();
  const tx = registerTranslations[lang];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [touched, setTouched] = useState({
    fullName: false, email: false, password: false, confirm: false, terms: false,
  });



  // Validation
  const errors = {
    fullName: !fullName ? tx.errors.nameRequired : fullName.length < 2 ? tx.errors.nameMin : "",
    email: !email ? tx.errors.emailRequired : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? tx.errors.emailInvalid : "",
    password: !password ? tx.errors.passwordRequired : password.length < 8 ? tx.errors.passwordMin : "",
    confirm: !confirmPassword ? tx.errors.confirmRequired : confirmPassword !== password ? tx.errors.confirmMatch : "",
    terms: !agreeTerms ? tx.errors.termsRequired : "",
  };

  const isValid = Object.values(errors).every((e) => !e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ fullName: true, email: true, password: true, confirm: true, terms: true });
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setSuccessMsg(tx.success);
  };

  const showErr = (field: keyof typeof touched) =>
    (touched[field] || submitted) ? errors[field] : "";

  return (
    <AuthLayout footerLinks={[tx.footer.privacy, tx.footer.terms, tx.footer.help]}>
      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Accent top bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-green-500 to-blue-500" />

        <div className="px-8 py-8">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-green-50">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-500">
                <span className="text-white text-sm font-medium">M10</span>
              </div>
            </div>
            <h1 className="text-gray-900 mb-1 text-2xl font-semibold">
              {tx.title}
            </h1>
            <p className="text-sm text-gray-500">
              {tx.subtitle}
            </p>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl text-sm bg-green-50 text-green-700">
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <InputField
              id="fullName"
              label={tx.fullName}
              type="text"
              placeholder={tx.fullNamePlaceholder}
              value={fullName}
              onChange={setFullName}
              onBlur={() => setTouched((p) => ({ ...p, fullName: true }))}
              error={showErr("fullName")}
              icon={User}
              autoComplete="name"
            />

            {/* Email */}
            <InputField
              id="email"
              label={tx.email}
              type="email"
              placeholder={tx.emailPlaceholder}
              value={email}
              onChange={setEmail}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              error={showErr("email")}
              icon={Mail}
              autoComplete="email"
            />

            {/* Password */}
            <div>
              <InputField
                id="password"
                label={tx.password}
                type={showPassword ? "text" : "password"}
                placeholder={tx.passwordPlaceholder}
                value={password}
                onChange={setPassword}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                error={showErr("password")}
                icon={Lock}
                autoComplete="new-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              {/* Strength indicator */}
              <PasswordStrengthIndicator password={password} translations={tx} />
            </div>

            {/* Confirm Password */}
            <InputField
              id="confirmPassword"
              label={tx.confirmPassword}
              type={showConfirm ? "text" : "password"}
              placeholder={tx.confirmPlaceholder}
              value={confirmPassword}
              onChange={setConfirmPassword}
              onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
              error={showErr("confirm")}
              icon={Lock}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Terms checkbox */}
           <div>
              <div className="flex items-start gap-2.5">
                <div
                  role="checkbox"
                  aria-checked={agreeTerms}
                  tabIndex={0}
                  className="relative w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-colors shrink-0 cursor-pointer"
                  style={{
                  borderColor: showErr("terms") ? "#FA5252" : agreeTerms ? "#4C6EF5" : "#D1D5DB",
                  backgroundColor: agreeTerms ? "#4C6EF5" : "#ffffff",
                 }}
                  onClick={() => setAgreeTerms((prev) => !prev)}
                 >
               {agreeTerms && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 9" fill="none">
                <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                 )}
                </div>
               <span className="text-sm text-gray-600 leading-relaxed select-none">
                {tx.agreeTerms}{" "}
                <button type="button" className="underline text-blue-600 hover:text-blue-700 cursor-pointer">
                 {tx.terms}
                </button>
                 {" "}{tx.and}{" "}
               <button type="button" className="underline text-blue-600 hover:text-blue-700 cursor-pointer">
                {tx.privacy}
               </button>
              </span>
            </div>
           {showErr("terms") && (
            <p className="mt-1.5 text-xs flex items-center gap-1 text-red-600">
            <Check className="w-3.5 h-3.5" />
            {showErr("terms")}
            </p>
           )}
        </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-opacity mt-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  {tx.registering}
                </>
              ) : (
                <>
                  {tx.registerBtn}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-gray-400">
                {tx.orContinueWith}
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <SocialButton>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </SocialButton>
            <SocialButton>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </SocialButton>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {tx.haveAccount}{" "}
            <button
              onClick={() => navigate("/login")}
              className="transition-colors text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              {tx.signIn}
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
