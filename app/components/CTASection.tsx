"use client";

import React, { useState } from "react";
import { Icons } from "./Icons";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="cta" className="section-padding relative border-t border-white/4">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="max-w-[640px] mx-auto text-center">
          <div className="section-label reveal">Get Started</div>
          <h2 className="section-title reveal delay-1 text-[clamp(28px,4vw,48px)]">
            Give your engineering team a brain upgrade.
          </h2>
          <p className="section-subtitle reveal delay-2 mx-auto mb-10">
            Set up in under 5 minutes. Free for teams up to 10 engineers. No
            credit card required.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="reveal delay-3 flex gap-2 max-w-[460px] mx-auto flex-wrap justify-center"
            >
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 min-w-[240px] py-3.5 px-[18px] bg-[#111111] border border-white/8 rounded-lg text-[#F1F1F1] text-sm outline-none transition-colors duration-200 focus:border-[#4F46E5]/50"
              />
              <button
                type="submit"
                className="btn-primary py-3.5 px-8 text-sm whitespace-nowrap cursor-pointer"
              >
                Request Demo
                {Icons.arrow}
              </button>
            </form>
          ) : (
            <div className="reveal flex items-center justify-center gap-2.5 py-4 px-6 bg-green-500/8 border border-green-500/15 rounded-[10px] max-w-[400px] mx-auto">
              <span className="text-green-500">{Icons.check}</span>
              <span className="text-sm text-[#D1D5DB]">
                Thanks! We&apos;ll be in touch within 24 hours.
              </span>
            </div>
          )}

          <p className="reveal delay-4 text-[12px] text-[#6B7280] mt-5">
            Free up to 10 engineers · Enterprise plans available · SOC 2
            compliant
          </p>
        </div>
      </div>
    </section>
  );
}
