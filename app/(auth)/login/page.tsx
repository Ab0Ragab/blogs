"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { setAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  function onSubmit({ email, password }: LoginForm) {
    setError("");
    startTransition(async () => {
      try {
        const { token } = await login(email, password);
        await setAuth(email, token);
        router.push(callbackUrl);
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("email", { required: "Username is required", minLength: { value: 3, message: "Min 3 characters" } })}
            type="text" placeholder="Username"
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
            type="password" placeholder="Password"
            className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <p className="text-xs text-slate-400">Try: emilys / emilyspass</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={isPending}
          className="w-full rounded bg-foreground text-background py-2 font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center cursor-pointer">
          {isPending ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
          ) : "Log In"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">Sign up</Link>
      </p>
    </>
  );
}
