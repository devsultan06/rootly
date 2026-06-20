"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogin } from "../../features/auth/useLogin";

/* ──────────────────────────────────────────────
   PREMIUM LOGIN PAGE (B2B SaaS Style)
   ────────────────────────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          window.location.href = "/dashboard";
        },
        onError: (err: any) => {
          setErrorMessage(err.message || "Invalid email or password.");
        },
      }
    );
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
        <Link href="/get-started" className="text-xs text-muted hover:text-white transition-colors duration-150 no-underline">
          New to Rootly? <span className="text-[#14B8A6] font-medium">Create account</span>
        </Link>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-6 md:px-8 items-center justify-center gap-12 md:gap-16 lg:gap-24 relative z-10 py-8">
        
        {/* Left Column: Abstract graph & product copy (Otter/Linear vibe) */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-center space-y-6 text-left max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.2] text-white">
            Welcome back to <br />
            your company's brain.
          </h1>
          <p className="text-xs lg:text-sm text-muted leading-relaxed max-w-md">
            Rootly is the living intelligence layer that links Jira, GitHub, Slack, and calendars into a single, fully traceable context core.
          </p>

    
        </div>

        {/* Right/Center Column: Clean Form Card */}
        <div className="w-full md:w-1/2 max-w-[400px]">
          <div className="bg-[#111111] border border-white/5 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium tracking-tight text-white">Log in to Rootly</h2>
           
            </div>

            {errorMessage && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/25 rounded-lg p-3 text-xs mb-4 animate-pulse">
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
                  disabled={loginMutation.isPending}
                  className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-semibold text-muted uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-[10px] text-[#14B8A6] hover:text-[#0D9488] transition-colors duration-150 no-underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loginMutation.isPending}
                    className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 pr-10 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loginMutation.isPending}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors duration-150 p-0.5 cursor-pointer disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 cursor-pointer shadow-md shadow-[#14B8A6]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loginMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/5" />
              <span className="flex-shrink mx-3 text-[9px] text-muted-dark uppercase tracking-widest font-mono">
                or continue with
              </span>
              <div className="flex-grow border-t border-white/5" />
            </div>

            {/* SSO / Identity Providers */}
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2.5 py-2 px-3 bg-[#09090B] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-lg text-xs font-medium text-[#F1F1F1] transition-all cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.386-2.876-6.386-6.386 0-3.51 2.876-6.386 6.386-6.386 1.54 0 2.98.55 4.12 1.48L21.1 4.4C19.16 2.65 16.27 1.6 12.75 1.6c-5.94 0-10.75 4.81-10.75 10.75s4.81 10.75 10.75 10.75c5.67 0 10.05-4 10.05-10.22 0-.58-.05-1.17-.15-1.6H12.24z" />
                </svg>
                Continue with Google
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 py-2 px-3 bg-[#09090B] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-lg text-xs font-medium text-[#F1F1F1] transition-all cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitHub
                </button>
                <button className="flex items-center justify-center gap-2 py-2 px-3 bg-[#09090B] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-lg text-xs font-medium text-[#F1F1F1] transition-all cursor-pointer">
                  <svg width="12" height="12" viewBox="0 0 23 23" fill="currentColor">
                    <path fill="#f3f3f3" d="M0 0h11v11H0z"/>
                    <path fill="#f3f3f3" d="M12 0h11v11H12z"/>
                    <path fill="#f3f3f3" d="M0 12h11v11H0z"/>
                    <path fill="#f3f3f3" d="M12 12h11v11H12z"/>
                  </svg>
                  Microsoft
                </button>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#09090B] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-lg text-xs font-medium text-[#F1F1F1] transition-all cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Continue with SSO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Footer Info */}
      <footer className="w-full py-8 border-t border-white/5 bg-[#09090B]/50 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-dark text-[11px] font-mono">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#14B8A6]/60">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Safe and secure
          </div>
          <div className="flex items-center gap-6 text-[11px] text-muted-dark font-mono">
            <Link href="#" className="hover:text-muted transition-colors no-underline">Terms</Link>
            <Link href="#" className="hover:text-muted transition-colors no-underline">Privacy</Link>
            <Link href="#" className="hover:text-muted transition-colors no-underline">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
