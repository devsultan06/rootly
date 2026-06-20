"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsPending(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const response = await fetch(`${backendUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errDetails = await response.json().catch(() => ({ message: "Failed to send reset email." }));
        throw new Error(errDetails.message || "Something went wrong.");
      }

      const resJson = await response.json();
      setSuccessMessage(resJson.message || "A password reset link has been sent to your email.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send reset email.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F1F1F1] flex flex-col justify-between font-sans relative overflow-hidden select-none">
      {/* Quiet grid pattern background */}
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-20" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-3 group no-underline text-[#F1F1F1]">
          <div className="text-[#14B8A6] group-hover:scale-[1.03] transition-transform duration-200">
            <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 2L14 10M14 10C14 10 8 14 8 18C8 22 11 26 14 26C17 26 20 22 20 18C20 14 14 10 14 10Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 20C10 20 6 19 4 22M18 20C18 20 22 19 24 22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] font-semibold tracking-tight leading-none text-white">Rootly</span>
          </div>
        </Link>
        <Link href="/login" className="text-xs text-muted hover:text-white transition-colors duration-150 no-underline">
          Remember your password? <span className="text-[#14B8A6] font-medium">Log in</span>
        </Link>
      </header>

      {/* Center Form Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 py-16 px-4">
        <div className="w-full max-w-[400px]">
          <div className="bg-[#111111] border border-white/5 rounded-xl p-8 shadow-2xl">
            {successMessage ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14B8A6] animate-pulse">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium tracking-tight text-white mb-3">Reset link sent!</h2>
                <p className="text-xs text-muted leading-relaxed mb-6">
                  {successMessage}
                </p>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 no-underline shadow-md shadow-[#14B8A6]/10"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-medium tracking-tight text-white">Reset password</h2>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 text-red-400 border border-red-500/25 rounded-lg p-3 text-xs mb-4">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5"
                    >
                      Work Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      disabled={isPending}
                      className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 cursor-pointer shadow-md shadow-[#14B8A6]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/5 bg-[#09090B]/50 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center text-muted-dark text-[11px] font-mono">
          &copy; {new Date().getFullYear()} Rootly Inc. Safe and secure.
        </div>
      </footer>
    </main>
  );
}
