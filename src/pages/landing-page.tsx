import { Header } from "@/components/layout/landing/header";
import { Hero } from "@/components/layout/landing/hero";
import { Features } from "@/components/layout/landing/features";
import { MeetTheBuilder } from "@/components/layout/landing/meet-the-builder";
import { FAQS } from "@/components/layout/landing/faqs";
import { Footer } from "@/components/layout/landing/footer";
import { ScrollToTOp } from "@/components/shared/scroll-to-top";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Background Blurs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0657E7]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0657E7]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      {/* page sections */}
      <Header />
      <Hero />
      <Features />
      <MeetTheBuilder />
      <FAQS />
      <Footer />
      <ScrollToTOp />
    </div>
  );
}
