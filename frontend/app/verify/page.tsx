"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") || "signup";

  useEffect(() => {
    if (!tokenHash) {
      setStatus("error");
      setErrorMessage("Missing verification token. Please click the link in your email again.");
      return;
    }

    const performVerification = async () => {
      setStatus("loading");
      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (error) {
          throw error;
        }

        setStatus("success");
        // Smoothly redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "The verification link is invalid, expired, or has already been used.");
      }
    };

    performVerification();
  }, [tokenHash, type, router]);

  return (
    <div className="w-full max-w-[420px] mx-auto relative z-10 px-4">
      <div className="bg-[#111111] border border-white/5 rounded-xl p-8  text-center">
        
        {/* Loading State */}
        {status === "loading" && (
          <div className="py-6">
            <div className="w-16 h-16 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-medium tracking-tight text-white mb-3">Verifying your email</h2>
            <p className="text-xs text-muted leading-relaxed">
              Securing your profile and connecting your company workspace. Please don't close this window.
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="py-6">
            <div className="w-16 h-16 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14B8A6] scale-up-animation">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-medium tracking-tight text-white mb-3">Verification successful!</h2>
            <p className="text-xs text-[#14B8A6] font-medium animate-pulse mb-6">
              Access granted. Redirecting to your dashboard...
            </p>
            <div className="w-full bg-[#161616] rounded-full h-1 overflow-hidden border border-white/[0.02]">
              <div className="bg-[#14B8A6] h-full rounded-full animate-progress-bar"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="py-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-medium tracking-tight text-white mb-3">Verification failed</h2>
            <p className="text-xs text-red-400/90 leading-relaxed mb-6">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <Link
                href="/get-started"
                className="inline-flex w-full items-center justify-center py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 no-underline shadow-md shadow-[#14B8A6]/10"
              >
                Try Registering Again
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center py-2.5 px-4 bg-[#09090B] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 text-white font-semibold text-xs rounded-lg transition-all duration-150 no-underline"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {/* Idle/Fallback State */}
        {status === "idle" && (
          <div className="py-6">
            <h2 className="text-xl font-medium tracking-tight text-white mb-3">Verification Pending</h2>
            <p className="text-xs text-muted leading-relaxed">
              No verification token was detected. Please check your verification link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
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
          <div className="w-full max-w-[420px] mx-auto text-center bg-[#111111] border border-white/5 rounded-xl p-8">
            <div className="w-16 h-16 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-medium tracking-tight text-white mb-3">Loading verification</h2>
          </div>
        }>
          <VerifyContent />
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
          animation: progressBar 2s linear forwards;
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
