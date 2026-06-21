"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const checkAuthAndWorkspace = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        setToken(session.access_token);
        setFullName(session.user.user_metadata?.full_name || "");

        // Check if user already has a workspace
        const { data: memberData } = await supabase
          .from("workspace_members")
          .select("workspace_id")
          .eq("profile_id", session.user.id);

        if (memberData && memberData.length > 0) {
          // Already has a workspace, redirect straight to dashboard
          router.push("/dashboard");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      }
    };

    checkAuthAndWorkspace();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const response = await fetch(`${backendUrl}/auth/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName,
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to complete workspace setup.");
      }

      // Smooth redirection to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during setup.");
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin mb-4"></div>
        <p className="text-xs text-muted font-medium">Securing session...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F1F1F1] flex flex-col justify-between font-sans relative overflow-hidden select-none">
      {/* Quiet grid pattern background */}
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-20" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="text-[#14B8A6]">
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
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-muted hover:text-white bg-transparent border-none cursor-pointer transition-colors duration-150"
        >
          Sign out
        </button>
      </header>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 py-8 px-4">
        <div className="w-full max-w-[420px]">
          <div className="bg-[#111111] border border-white/5 rounded-xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-medium tracking-tight text-white">Set up your workspace</h2>
              <p className="text-xs text-muted leading-relaxed mt-1">
                You're authenticated! Complete your profile configuration to deploy your team's intelligence layer.
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
                  htmlFor="fullName"
                  className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Sultan Dev"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5"
                >
                  Company / Workspace Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-[#14B8A6]/40 focus:ring-1 focus:ring-[#14B8A6]/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-[#14B8A6] hover:bg-[#0D9488] active:scale-[0.98] text-black font-semibold text-xs rounded-lg transition-all duration-150 cursor-pointer shadow-md shadow-[#14B8A6]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Setting up workspace...</span>
                  </>
                ) : (
                  <span>Complete Setup</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trust & Footer */}
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
