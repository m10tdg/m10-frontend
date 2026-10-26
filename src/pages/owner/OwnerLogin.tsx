import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";

import { useLangStore } from "@/shared/stores/langStore";
import { useOwnerStore } from "@/shared/stores/owner-store";
import { ownerTranslations } from "@/shared/config/translations/owner";
import { getApiErrorStatus } from "@/shared/lib/apiError";
import { ownerSignIn } from "@/features/owner/api";
import { AuthLayout } from "@/pages/auth/components/AuthLayout";
import { InputField } from "@/pages/auth/components/InputField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OwnerLoginPage() {
  const { lang } = useLangStore();
  const tx = ownerTranslations[lang];
  const navigate = useNavigate();
  const login = useOwnerStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const emailError = !email
    ? tx.errors.required
    : !EMAIL_PATTERN.test(email) ? tx.errors.emailInvalid : "";
  const passwordError = password ? "" : tx.errors.required;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (emailError || passwordError) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const { owner, token } = await ownerSignIn(email, password);
      login(owner, token);
      navigate("/owner", { replace: true });
    } catch (error) {
      setErrorMsg(getApiErrorStatus(error) === 401 ? tx.errors.invalidCredentials : tx.errors.requestFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout footerLinks={[]}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-linear-to-r from-gray-800 to-blue-600" />

        <div className="px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gray-100">
              <ShieldCheck className="w-7 h-7 text-gray-800" />
            </div>
            <p className="text-xs uppercase tracking-wide text-blue-600 mb-1">{tx.badge}</p>
            <h1 className="text-gray-900 mb-1 text-2xl font-semibold">{tx.login.title}</h1>
            <p className="text-sm text-gray-500">{tx.login.subtitle}</p>
          </div>

          {errorMsg && (
            <div role="alert" className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl text-sm bg-red-50 text-red-700">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <InputField
              id="owner-email"
              label={tx.login.email}
              type="email"
              placeholder={tx.login.emailPlaceholder}
              value={email}
              onChange={setEmail}
              error={submitted ? emailError : ""}
              icon={Mail}
              autoComplete="username"
            />
            <InputField
              id="owner-password"
              label={tx.login.password}
              type={showPassword ? "text" : "password"}
              placeholder={tx.login.passwordPlaceholder}
              value={password}
              onChange={setPassword}
              error={submitted ? passwordError : ""}
              icon={Lock}
              autoComplete="current-password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-colors mt-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? tx.login.submitting : (
                <>
                  {tx.login.submit}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              {tx.login.backToUserLogin}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
