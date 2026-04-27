"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";

interface LoginForm {
  email: string;
  password: string;
}

function LoginForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { setAuth } = useAuth();
  const { dict, lang } = useI18n();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || `/${lang}`;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  function onSubmit({ email, password }: LoginForm) {
    setError("");
    startTransition(async () => {
      try {
        const { token } = await login(email, password);
        await setAuth(email, token);
        window.location.href = callbackUrl;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : dict.auth.loginFailed);
      }
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">{dict.auth.loginTitle}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("email", {
              required: dict.auth.usernameRequired,
              minLength: { value: 3, message: dict.auth.minChars.replace("{count}", "3") },
            })}
            type="text"
            placeholder={dict.auth.usernamePlaceholder}
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("password", {
              required: dict.auth.passwordRequired,
              minLength: { value: 6, message: dict.auth.minChars.replace("{count}", "6") },
            })}
            type="password"
            placeholder={dict.auth.passwordPlaceholder}
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <p className="text-xs text-slate-400">{dict.auth.hint}</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-foreground text-background py-2 font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center cursor-pointer"
        >
          {isPending ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
          ) : (
            dict.auth.loginButton
          )}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {dict.auth.noAccount}{" "}
        <Link href={`/${lang}/signup`} className="underline">
          {dict.header.signup}
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
