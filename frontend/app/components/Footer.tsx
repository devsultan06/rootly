"use client";

import React from "react";
import { Icons } from "./Icons";

export default function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        "Ask Rootly",
        "Sprint Intelligence",
        "Meeting Copilot",
        "Risk Alerts",
        "Standups",
        "Changelog",
      ],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press", "Contact"],
    },
    {
      title: "Resources",
      links: [
        "Documentation",
        "API Reference",
        "Security",
        "Privacy Policy",
        "Terms of Service",
      ],
    },
    {
      title: "Connect",
      links: ["Twitter / X", "LinkedIn", "GitHub", "Discord"],
    },
  ];

  return (
    <footer className="border-t border-white/4 py-[64px] pb-10">
      <div className="container-main">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-10 mb-14">
          {/* Logo column */}
          <div>
            <a
              href="#"
              className="flex items-center gap-2.5 no-underline text-[#F1F1F1] mb-4"
            >
              <span className="text-accent">{Icons.root}</span>
              <span className="text-[17px] font-semibold tracking-[-0.03em]">
                Rootly
              </span>
            </a>
            <p className="text-[13px] text-[#6B7280] leading-[1.6] max-w-[200px]">
              The AI operating system for engineering teams.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[12px] font-semibold text-[#9CA3AF] tracking-[0.04em] uppercase mb-4">
                {col.title}
              </h4>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[13px] text-[#6B7280] no-underline transition-colors duration-200 hover:text-[#D1D5DB]"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-6 border-t border-white/4 flex-wrap gap-4">
          <p className="text-[12px] text-[#4B5563]">
            © 2026 Rootly, Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-[12px] text-[#4B5563] no-underline hover:text-[#9CA3AF] transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[12px] text-[#4B5563] no-underline hover:text-[#9CA3AF] transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-[12px] text-[#4B5563] no-underline hover:text-[#9CA3AF] transition-colors duration-200"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
