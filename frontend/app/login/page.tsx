"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormField";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/api-client";
import { isAuthenticated, setAuth } from "@/lib/auth";
import { login } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [username, setUsername] = useState("route53-admin");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }
    setCheckingSession(false);
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await login(username.trim(), password);
      setAuth(response.access_token, response.user);
      showToast("Signed in successfully", "success");
      router.push("/dashboard");
    } catch (error) {
      showToast(getErrorMessage(error, "Sign in failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-aws-bg">
        <LoadingState label="Checking session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aws-bg">
      <div className="border-b border-[#1a242f] bg-aws-header px-6 py-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-aws-orange text-sm font-bold text-aws-header">
            53
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">Route 53</p>
            <p className="text-xs text-[#aab7b8]">AWS Console Clone</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded border border-aws-border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-normal text-aws-text">Sign in</h1>
          <p className="mt-2 text-sm text-aws-text-secondary">
            Mock authentication accepts any username and password.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <InputField
              label="Username"
              htmlFor="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
            <InputField
              label="Password"
              htmlFor="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
