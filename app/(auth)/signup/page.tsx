"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signup } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";

interface SignupForm {
  email: string;
  password: string;
}

export default function SignupPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { setAuth } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>();

  function onSubmit({ email, password }: SignupForm) {
    setError("");
    startTransition(async () => {
      try {
        const { token } = await signup(email, password);
        await setAuth(email, token);
        router.push("/");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Signup failed");
      }
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })}
            type="email" placeholder="Email"
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={isPending}
          className="w-full rounded bg-foreground text-background py-2 font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center cursor-pointer">
          {isPending ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
          ) : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">Log in</Link>
      </p>
    </>
  );
}
