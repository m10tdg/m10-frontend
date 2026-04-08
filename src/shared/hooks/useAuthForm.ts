import { useState } from 'react';

interface UseAuthFormOptions {
  validate: (values: Record<string, string>) => Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

export function useAuthForm({ validate, onSubmit }: UseAuthFormOptions) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const errors = validate(values);

  const isValid = Object.values(errors).every((e) => !e);

  const handleChange = (field: string) => (value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    if (!isValid) return;
    setLoading(true);
    try {
      await onSubmit(values);
      setSuccessMsg('Success!'); // This should be passed from translations
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const getError = (field: string) => (touched[field] || submitted) ? errors[field] : '';

  return {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    getError,
    loading,
    successMsg,
    isValid,
  };
}