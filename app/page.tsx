import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Challenge } from "@/components/sections/Challenge";
import { UseCases } from "@/components/sections/UseCases";
import { CreativeAlly } from "@/components/sections/CreativeAlly";
import { BusinessOps } from "@/components/sections/BusinessOps";
import { SystemFlow } from "@/components/sections/SystemFlow";
import { Benefits } from "@/components/sections/Benefits";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <Challenge />
      <UseCases />
      <CreativeAlly />
      <BusinessOps />
      <SystemFlow />
      <Benefits />
      <FinalCTA />
      <Footer />
    </main>
  );
}
