"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signup } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";

interface SignupForm {
  email: string;
  password: string;
}

export default function SignupPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { setAuth } = useAuth();
  const { dict, lang } = useI18n();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>();

  function onSubmit({ email, password }: SignupForm) {
    setError("");
    startTransition(async () => {
      try {
        const { token } = await signup(email, password);
        await setAuth(email, token);
        router.push(`/${lang}`);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : dict.auth.signupFailed);
      }
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">{dict.auth.signupTitle}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("email", { required: dict.auth.emailRequired, pattern: { value: /^\S+@\S+\.\S+$/, message: dict.auth.invalidEmail } })}
            type="email" placeholder={dict.auth.emailPlaceholder}
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            {...register("password", { required: dict.auth.passwordRequired, minLength: { value: 6, message: dict.auth.minChars.replace("{count}", "6") } })}
            type="password" placeholder={dict.auth.passwordPlaceholder}
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={isPending}
          className="w-full rounded bg-foreground text-background py-2 font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center cursor-pointer">
          {isPending ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
          ) : dict.auth.signupButton}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {dict.auth.hasAccount}{" "}
        <Link href={`/${lang}/login`} className="underline">{dict.header.login}</Link>
      </p>
    </>
  );
}
