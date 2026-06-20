"use client";

import React, { useState, useEffect } from "react";
import { Icons } from "./Icons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 no-underline text-foreground"
        >
          <span className="text-accent">{Icons.root}</span>
          <span className="text-[18px] font-semibold tracking-[-0.03em]">
            Rootly
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Product", "Solutions", "Integrations", "Resources", "Pricing"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[13px] text-muted hover:text-foreground no-underline transition-colors duration-200 font-[450] tracking-[-0.01em]"
              >
                {item}
              </a>
            ),
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="text-[13px] text-muted hover:text-foreground no-underline font-[450] transition-colors duration-200"
          >
            Log in
          </a>
          <a href="/get-started" className="btn-primary py-2 px-5 text-[13px]">
            Request Demo
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden block bg-transparent border-none text-foreground cursor-pointer p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7H20" />
                <path d="M4 12H20" />
                <path d="M4 17H20" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-4 py-4 pb-6 border-t border-border">
          {["Product", "Solutions", "Integrations", "Resources", "Pricing"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="text-[15px] text-muted hover:text-foreground no-underline font-[450]"
              >
                {item}
              </a>
            ),
          )}
          <div className="flex gap-3 mt-2">
            <a
              href="/login"
              className="text-[14px] text-muted hover:text-foreground no-underline flex items-center"
            >
              Log in
            </a>
            <a href="/get-started" className="btn-primary py-2 px-5 text-[13px]">
              Request Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
