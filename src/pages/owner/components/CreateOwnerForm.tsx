import { useState } from "react";
import { AlertCircle, Info, Mail, User, UserPlus } from "lucide-react";

import { createOwner } from "@/features/owner/api";
import { getApiErrorMessage, getApiErrorStatus } from "@/shared/lib/apiError";
import { InputField } from "@/pages/auth/components/InputField";
import type { OwnerSummary } from "@/entities/auth";
import type { OwnerTranslations } from "@/shared/config/translations/owner";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CreateOwnerFormProps {
  tx: OwnerTranslations;
  onCreated: (owner: OwnerSummary) => void;
}

export function CreateOwnerForm({ tx, onCreated }: CreateOwnerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const nameError = name.trim() ? "" : tx.errors.required;
  const emailError = !email
    ? tx.errors.required
    : EMAIL_PATTERN.test(email) ? "" : tx.errors.emailInvalid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError || emailError) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const owner = await createOwner({ name: name.trim(), email: email.trim() });
      setName("");
      setEmail("");
      setSubmitted(false);
      onCreated(owner);
    } catch (error) {
      // 400/409/502 carry a specific reason (duplicate email, email not sent).
      const status = getApiErrorStatus(error);
      setErrorMsg(status === 400 || status === 409 || status === 502
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

      <InputField
        id="owner-name"
        label={tx.owners.name}
        type="text"
        placeholder={tx.owners.namePlaceholder}
        value={name}
        onChange={setName}
        error={submitted ? nameError : ""}
        icon={User}
        autoComplete="off"
      />
      <InputField
        id="owner-new-email"
        label={tx.owners.email}
        type="email"
        placeholder={tx.owners.emailPlaceholder}
        value={email}
        onChange={setEmail}
        error={submitted ? emailError : ""}
        icon={Mail}
        autoComplete="off"
      />

      <p className="flex gap-2 p-3 rounded-xl text-xs bg-blue-50 text-blue-700">
        <Info className="w-4 h-4 shrink-0" />
        <span>{tx.owners.inviteHint}</span>
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-colors bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        {loading ? tx.owners.submitting : tx.owners.submit}
      </button>
    </form>
  );
}
