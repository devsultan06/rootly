"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otpStatus, setOtpStatus] = useState<"loading" | "verified" | "failed">("loading");
  const [otpError, setOtpError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const tokenHash = searchParams.get("token_hash");

  useEffect(() => {
    if (!tokenHash) {
      setOtpStatus("failed");
      setOtpError("Missing recovery token. Please request a new password reset link.");
      return;
    }

    const verifyOtpToken = async () => {
      setOtpStatus("loading");
      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

        if (error) {
          throw error;
        }

        setOtpStatus("verified");
      } catch (err: any) {
        setOtpStatus("failed");
        setOtpError(err.message || "The password reset link is invalid, expired, or has already been used.");
      }
    };

    verifyOtpToken();
  }, [tokenHash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      setSuccessMessage("Your password has been successfully reset.");
      
      // Sign out to clear recovery session and ensure clean login
      await supabase.auth.signOut();

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update your password. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto relative z-10 px-4">
      <div className="bg-[#111111] border border-white/5 rounded-xl p-8">
        
        {/* State 1: Verifying Recovery Token */}
        {otpStatus === "loading" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-medium tracking-tight text-white mb-3">Verifying reset link</h2>
            <p className="text-xs text-muted leading-relaxed">
              Securing a recovery session. Please don't close this window.
            </p>
          </div>
        )}

        {/* State 2: Token Invalid or Expired */}
        {otpStatus === "failed" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-medium tracking-tight text-white mb-3">Invalid reset link</h2>
            <p className="text-xs text-red-400/90 leading-relaxed mb-6">
              {otpError}
            </p>
            <div className="space-y-3">
              <Link
                href="/forgot-password"
                className="inline-flex w-full items-center justify-center py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 no-underline shadow-md shadow-[#14B8A6]/10"
              >
                Request New Link
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Token Verified, Show Reset Password Form */}
        {otpStatus === "verified" && (
          <>
            {successMessage ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14B8A6] scale-up-animation">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium tracking-tight text-white mb-3">Password reset success!</h2>
                <p className="text-xs text-[#14B8A6] font-medium mb-6 animate-pulse">
                  {successMessage} Redirecting to login page...
                </p>
                <div className="w-full bg-[#161616] rounded-full h-1 overflow-hidden border border-white/[0.02]">
                  <div className="bg-[#14B8A6] h-full rounded-full animate-progress-bar"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-medium tracking-tight text-white">Choose a new password</h2>
                  <p className="text-xs text-muted leading-relaxed mt-1">
                    Your password recovery session has been verified. Please select a strong password.
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
                      htmlFor="password"
                      className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5"
                    >
                      New Password
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
                        disabled={isUpdating}
                        className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 pr-10 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isUpdating}
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

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isUpdating}
                      className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 cursor-pointer shadow-md shadow-[#14B8A6]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Saving new password...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F1F1F1] flex flex-col justify-between font-sans relative overflow-hidden select-none">
      {/* Background grid */}
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-20" />

      {/* Header */}
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
      </header>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center relative z-10 py-16">
        <Suspense fallback={
          <div className="w-full max-w-[400px] mx-auto text-center bg-[#111111] border border-white/5 rounded-xl p-8">
            <div className="w-16 h-16 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-medium tracking-tight text-white mb-3">Loading recovery session</h2>
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/5 bg-[#09090B]/50 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center text-muted-dark text-[11px] font-mono">
          &copy; {new Date().getFullYear()} Rootly Inc. Safe and secure.
        </div>
      </footer>

      {/* Custom Keyframe Styles injected directly */}
      <style jsx global>{`
        @keyframes progressBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progressBar 2.5s linear forwards;
        }
        .scale-up-animation {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes scaleUp {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
