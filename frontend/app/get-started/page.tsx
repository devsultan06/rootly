"use client";

import { useState } from "react";
import Link from "next/link";
import { useRegister } from "../../features/auth/useRegister";

/* ──────────────────────────────────────────────
   PREMIUM GET STARTED / SIGN UP PAGE
   ────────────────────────────────────────────── */
export default function GetStartedPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    registerMutation.mutate(
      { email, fullName: name, companyName: company, password },
      {
        onSuccess: (data) => {
          if (data.message && !data.data) {
            setSuccessMessage(data.message);
          } else {
            window.location.href = "/dashboard";
          }
        },
        onError: (err: any) => {
          setErrorMessage(err.message || "An unexpected registration error occurred.");
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
        <Link href="/login" className="text-xs text-muted hover:text-white transition-colors duration-150 no-underline">
          Already have an account? <span className="text-[#14B8A6] font-medium">Log in</span>
        </Link>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-6 md:px-8 items-center justify-center gap-12 md:gap-16 lg:gap-24 relative z-10 py-8">
        
        {/* Left Column: Product Value Props */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-center space-y-6 text-left max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.2] text-white">
            Deploy your engineering team's living intelligence layer
          </h1>
          <p className="text-xs lg:text-sm text-muted leading-relaxed max-w-md">
            Start compiling standups, tickets, Slack context, and code logic. Free up to 10 engineers, no credit card required.
          </p>

          {/* Connected intelligence lists */}
          <div className="space-y-4">
            {[
              {
                title: "One-Click Setup",
                desc: "Connect Jira, Slack, and GitHub in under 5 minutes.",
                icon: (
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                ),
              },
              {
                title: "Proof-Based Intelligence",
                desc: "No hallucinations. Answers come with verifiable ticket & commit proof.",
                icon: (
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                ),
              },
              {
                title: "Live Company Memory",
                desc: "A continuously learning memory core of standups, logs, and sprints.",
                icon: (
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                ),
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start p-3 rounded-lg border border-white/[0.02] bg-[#111111]/25 hover:bg-[#111111]/45 transition-colors">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#14B8A6]/5 border border-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-muted leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Registration Form Card */}
        <div className="w-full md:w-1/2 max-w-[420px]">
          <div className="bg-[#111111] border border-white/5 rounded-xl p-8 shadow-2xl">
            {successMessage ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14B8A6] animate-pulse">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium tracking-tight text-white mb-3">Please check your inbox</h2>
                <p className="text-xs text-muted leading-relaxed mb-6">
                  We've sent a verification email to <span className="text-[#14B8A6] font-medium">{email}</span>. Click the link in the email to activate your workspace and get started.
                </p>
                <div className="space-y-3">
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex w-full items-center justify-center gap-2 py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 cursor-pointer shadow-md shadow-[#14B8A6]/10"
                  >
                    Open Mail App
                  </a>
                  <button
                    onClick={() => {
                      setSuccessMessage("");
                      setName("");
                      setEmail("");
                      setCompany("");
                      setPassword("");
                    }}
                    className="w-full text-xs text-muted hover:text-white transition-colors duration-150 py-2 cursor-pointer"
                  >
                    Back to registration
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium tracking-tight text-white">Create your account</h2>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 text-red-400 border border-red-500/25 rounded-lg p-3 text-xs mb-4">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Sultan C."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                        disabled={registerMutation.isPending}
                        className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5"
                      >
                        Company
                      </label>
                      <input
                        id="company"
                        type="text"
                        placeholder="Acme Corp"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        disabled={registerMutation.isPending}
                        className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

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
                      disabled={registerMutation.isPending}
                      className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        disabled={registerMutation.isPending}
                        className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 pr-10 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={registerMutation.isPending}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors duration-150 p-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

                  <div className="pt-1.5">
                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-muted leading-relaxed">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        required
                        disabled={registerMutation.isPending}
                        className="rounded border-white/10 bg-[#09090B] text-[#14B8A6] focus:ring-0 w-3.5 h-3.5 cursor-pointer mt-0.5 flex-shrink-0 disabled:opacity-50"
                      />
                      <span>
                        I agree to the{" "}
                        <Link href="#" className="text-[#14B8A6] no-underline hover:text-[#0D9488] transition-colors">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="text-[#14B8A6] no-underline hover:text-[#0D9488] transition-colors">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 cursor-pointer shadow-md shadow-[#14B8A6]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-white/5" />
                  <span className="flex-shrink mx-3 text-[9px] text-muted-dark uppercase tracking-widest font-mono">
                    or sign up with
                  </span>
                  <div className="flex-grow border-t border-white/5" />
                </div>

                {/* SSO / Identity Providers */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 py-2 px-3 bg-[#09090B] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-lg text-xs font-medium text-[#F1F1F1] transition-all cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.386-2.876-6.386-6.386 0-3.51 2.876-6.386 6.386-6.386 1.54 0 2.98.55 4.12 1.48L21.1 4.4C19.16 2.65 16.27 1.6 12.75 1.6c-5.94 0-10.75 4.81-10.75 10.75s4.81 10.75 10.75 10.75c5.67 0 10.05-4 10.05-10.22 0-.58-.05-1.17-.15-1.6H12.24z" />
                    </svg>
                    Google
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2 px-3 bg-[#09090B] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-lg text-xs font-medium text-[#F1F1F1] transition-all cursor-pointer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub
                  </button>
                </div>
              </>
            )}
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
