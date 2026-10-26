import { useState } from "react";
import { AlertCircle, Building2, Eye, EyeOff, Hash, Lock, Mail, Plus, User } from "lucide-react";

import { createTenant } from "@/features/owner/api";
import { getApiErrorMessage, getApiErrorStatus } from "@/shared/lib/apiError";
import { InputField } from "@/pages/auth/components/InputField";
import { PasswordStrengthIndicator } from "@/pages/auth/components/PasswordStrengthIndicator";
import type { CreateTenantResponse } from "@/entities/auth";
import type { OwnerTranslations } from "@/shared/config/translations/owner";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_PASSWORD_LENGTH = 8;

const emptyForm = {
  tenantName: "",
  slug: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
};

type FormValues = typeof emptyForm;

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validate(values: FormValues, errors: OwnerTranslations["errors"]) {
  return {
    tenantName: values.tenantName.trim() ? "" : errors.required,
    slug: !values.slug
      ? errors.required
      : SLUG_PATTERN.test(values.slug) ? "" : errors.slugInvalid,
    adminName: values.adminName.trim() ? "" : errors.required,
    adminEmail: !values.adminEmail
      ? errors.required
      : EMAIL_PATTERN.test(values.adminEmail) ? "" : errors.emailInvalid,
    adminPassword: values.adminPassword.length >= MIN_PASSWORD_LENGTH ? "" : errors.passwordMin,
  };
}

interface CreateTenantFormProps {
  tx: OwnerTranslations;
  onCreated: (result: CreateTenantResponse) => void;
}

export function CreateTenantForm({ tx, onCreated }: CreateTenantFormProps) {
  const [values, setValues] = useState(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const errors = validate(values, tx.errors);
  const isValid = Object.values(errors).every((error) => !error);
  const fieldError = (field: keyof FormValues) => (submitted ? errors[field] : "");

  const setField = (field: keyof FormValues) => (value: string) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleTenantNameChange = (value: string) =>
    setValues((prev) => ({
      ...prev,
      tenantName: value,
      slug: slugEdited ? prev.slug : toSlug(value),
    }));

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setField("slug")(value.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const result = await createTenant({
        name: values.tenantName.trim(),
        slug: values.slug,
        admin: {
          name: values.adminName.trim(),
          email: values.adminEmail.trim(),
          password: values.adminPassword,
        },
      });
      setValues(emptyForm);
      setSlugEdited(false);
      setSubmitted(false);
      onCreated(result);
    } catch (error) {
      // 400/409 carry a specific reason (e.g. duplicate slug or email).
      const status = getApiErrorStatus(error);
      setErrorMsg(status === 400 || status === 409
        ? getApiErrorMessage(error)
        : tx.errors.requestFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorMsg && (
        <div role="alert" className="flex items-center gap-2.5 p-3.5 rounded-xl text-sm bg-red-50 text-red-700">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <p className="text-xs uppercase tracking-wide text-gray-400">{tx.form.tenantSection}</p>
      <InputField
        id="tenant-name"
        label={tx.form.tenantName}
        type="text"
        placeholder={tx.form.tenantNamePlaceholder}
        value={values.tenantName}
        onChange={handleTenantNameChange}
        error={fieldError("tenantName")}
        icon={Building2}
        autoComplete="organization"
      />
      <div>
        <InputField
          id="tenant-slug"
          label={tx.form.slug}
          type="text"
          placeholder={tx.form.slugPlaceholder}
          value={values.slug}
          onChange={handleSlugChange}
          error={fieldError("slug")}
          icon={Hash}
          autoComplete="off"
        />
        {!fieldError("slug") && <p className="mt-1.5 text-xs text-gray-400">{tx.form.slugHint}</p>}
      </div>

      <p className="text-xs uppercase tracking-wide text-gray-400 pt-2">{tx.form.adminSection}</p>
      <InputField
        id="admin-name"
        label={tx.form.adminName}
        type="text"
        placeholder={tx.form.adminNamePlaceholder}
        value={values.adminName}
        onChange={setField("adminName")}
        error={fieldError("adminName")}
        icon={User}
        autoComplete="off"
      />
      <InputField
        id="admin-email"
        label={tx.form.adminEmail}
        type="email"
        placeholder={tx.form.adminEmailPlaceholder}
        value={values.adminEmail}
        onChange={setField("adminEmail")}
        error={fieldError("adminEmail")}
        icon={Mail}
        autoComplete="off"
      />
      <div>
        <InputField
          id="admin-password"
          label={tx.form.adminPassword}
          type={showPassword ? "text" : "password"}
          placeholder={tx.form.adminPasswordPlaceholder}
          value={values.adminPassword}
          onChange={setField("adminPassword")}
          error={fieldError("adminPassword")}
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
        <PasswordStrengthIndicator password={values.adminPassword} translations={tx} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-colors bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        {loading ? tx.form.submitting : tx.form.submit}
      </button>
    </form>
  );
}
