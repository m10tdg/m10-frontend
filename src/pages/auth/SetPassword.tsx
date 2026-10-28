import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from "lucide-react";

import { useLangStore } from "@/shared/stores/langStore";
import { setPasswordTranslations } from "@/shared/config/translations/setPassword";
import { getApiErrorStatus } from "@/shared/lib/apiError";
import { completePasswordSetup, getPasswordSetup } from "@/features/auth/api";
import type { PasswordSetupInfo } from "@/entities/auth";
import { AuthLayout } from "@/pages/auth/components/AuthLayout";
import { InputField } from "@/pages/auth/components/InputField";
import { PasswordStrengthIndicator } from "@/pages/auth/components/PasswordStrengthIndicator";

const MIN_PASSWORD_LENGTH = 8;

type Stage = "checking" | "invalid" | "form" | "done";

// Reached from an invitation email: lets a new tenant admin or platform owner
// replace their generated password, then sends them to the right sign-in page.
export function SetPasswordPage() {
  const { lang } = useLangStore();
  const tx = setPasswordTranslations[lang];
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [stage, setStage] = useState<Stage>("checking");
  const [account, setAccount] = useState<PasswordSetupInfo | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStage("invalid");
      return;
    }
    let cancelled = false;
    getPasswordSetup(token)
      .then((info) => {
        if (cancelled) return;
        setAccount(info);
        setStage("form");
      })
      .catch(() => {
        if (!cancelled) setStage("invalid");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const passwordError = password.length >= MIN_PASSWORD_LENGTH ? "" : tx.errors.passwordMin;
  const confirmError = confirm === password ? "" : tx.errors.mismatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (passwordError || confirmError) return;

    setLoading(true);
    setErrorMsg("");
    try {
      await completePasswordSetup(token, password);
      setStage("done");
    } catch (error) {
      if (getApiErrorStatus(error) === 410) setStage("invalid");
      else setErrorMsg(tx.errors.requestFailed);
    } finally {
      setLoading(false);
    }
  };

  const loginPath = account?.kind === "owner" ? "/owner/login" : "/login";

  return (
    <AuthLayout footerLinks={[]}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-linear-to-r from-gray-800 to-blue-600" />

        <div className="px-8 py-8">
          {stage === "checking" && (
            <p className="text-center text-sm text-gray-500 py-8">{tx.checking}</p>
          )}

          {stage === "invalid" && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-red-50">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <h1 className="text-gray-900 mb-2 text-2xl font-semibold">{tx.invalidTitle}</h1>
              <p className="text-sm text-gray-500">{tx.invalidText}</p>
            </div>
          )}

          {stage === "done" && account && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-green-50">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h1 className="text-gray-900 mb-2 text-2xl font-semibold">{tx.successTitle}</h1>
              <p className="text-sm text-gray-500 mb-6">
                {tx.successText.replace("{email}", account.email)}
              </p>
              <Link
                to={loginPath}
                className="inline-flex items-center justify-center w-full py-3 rounded-xl text-white text-sm bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                {tx.goToLogin}
              </Link>
            </div>
          )}

          {stage === "form" && account && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gray-100">
                  <KeyRound className="w-7 h-7 text-gray-800" />
                </div>
                <h1 className="text-gray-900 mb-1 text-2xl font-semibold">{tx.title}</h1>
                <p className="text-sm text-gray-500">
                  {tx.greeting.replace("{name}", account.name).replace("{email}", account.email)}
                </p>
              </div>

              {errorMsg && (
                <div role="alert" className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl text-sm bg-red-50 text-red-700">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Lets password managers save the new password under the right account. */}
                <input type="email" value={account.email} autoComplete="username" readOnly hidden />
                <div>
                  <InputField
                    id="new-password"
                    label={tx.password}
                    type={showPassword ? "text" : "password"}
                    placeholder={tx.passwordPlaceholder}
                    value={password}
                    onChange={setPassword}
                    error={submitted ? passwordError : ""}
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
                  <PasswordStrengthIndicator password={password} translations={tx} />
                </div>
                <InputField
                  id="confirm-password"
                  label={tx.confirm}
                  type={showPassword ? "text" : "password"}
                  placeholder={tx.confirmPlaceholder}
                  value={confirm}
                  onChange={setConfirm}
                  error={submitted ? confirmError : ""}
                  icon={Lock}
                  autoComplete="new-password"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-colors mt-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? tx.submitting : tx.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
