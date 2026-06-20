"use client";

import React from "react";
import { Icons } from "./Icons";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Rootly cut our sprint retrospective prep from 3 hours to 10 minutes. It already knows what happened, with receipts.",
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "Acme Corp",
      image: "/sarah.png",
    },
    {
      quote:
        "New engineers get productive in days instead of weeks. They just ask Rootly for context instead of interrupting seniors.",
      name: "Marcus Johnson",
      role: "CTO",
      company: "Buildkit",
      image: "/marcus.png",
    },
    {
      quote:
        "The proof-based answers are a game changer. We stopped debating what happened — Rootly shows us the exact PR, thread, and meeting clip.",
      name: "Elena Rodriguez",
      role: "Engineering Lead",
      company: "Streamline",
      image: "/elena.png",
    },
  ];

  const stats = [
    { value: "6+", unit: "hours", desc: "saved per engineer per week" },
    { value: "95%", unit: "", desc: "faster context for new hires" },
    { value: "73%", unit: "", desc: "fewer interruptions across teams" },
    { value: "< 5", unit: "min", desc: "setup time per integration" },
  ];

  return (
    <section className="section-padding relative">
      <div className="container-main">
        <div className="text-center mb-16">
          <div className="section-label reveal">Social Proof</div>
          <h2 className="section-title reveal delay-1">
            Trusted by teams who ship fast.
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-14">
          {stats.map((stat, i) => (
            <div
              key={stat.desc}
              className={`reveal delay-${i + 1} text-center py-8 px-4 bg-[#111111] rounded-xl border border-white/6`}
            >
              <div className="text-[36px] font-bold text-[#F1F1F1] tracking-[-0.03em] leading-none mb-1">
                {stat.value}
                {stat.unit && (
                  <span className="text-[16px] text-[#9CA3AF] font-medium ml-1">
                    {stat.unit}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#6B7280] mt-1.5">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`card reveal delay-${i + 1} py-9 px-8 flex flex-col justify-between`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5 text-[#F59E0B]">
                {[0, 1, 2, 3, 4].map((s) => (
                  <span key={s}>{Icons.star}</span>
                ))}
              </div>

              <p className="text-[15px] text-[#D1D5DB] leading-[1.7] mb-7 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {/* Real profile image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <div className="text-[14px] font-medium text-[#F1F1F1]">
                    {t.name}
                  </div>
                  <div className="text-[12px] text-[#6B7280]">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
