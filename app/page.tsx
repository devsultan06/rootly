"use client";

import useReveal from "./hooks/useReveal";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import IntegrationGraph from "./components/IntegrationGraph";
import SolutionSection from "./components/SolutionSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import IntegrationsSection from "./components/IntegrationsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function LandingPage() {
  useReveal();

  return (
    <main className="circuit-bg">
      <Navbar />
      <HeroSection />
      <div className="section-divider mx-auto max-w-[1200px]" />
      <ProblemSection />
      <div className="section-divider mx-auto max-w-[1200px]" />
      <IntegrationGraph />
      <div className="section-divider mx-auto max-w-[1200px]" />
      <SolutionSection />
      <div className="section-divider mx-auto max-w-[1200px]" />
      <FeaturesSection />
      <div className="section-divider mx-auto max-w-[1200px]" />
      <HowItWorksSection />
      <div className="section-divider mx-auto max-w-[1200px]" />
      <TestimonialsSection />
      <div className="section-divider mx-auto max-w-[1200px]" />
      <IntegrationsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
