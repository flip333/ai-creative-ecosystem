import { Hero } from "@/components/sections/Hero";
import { ProblemSolution } from "@/components/sections/ProblemSolution";
import { GrowthGenes } from "@/components/sections/GrowthGenes";
import { UseCases } from "@/components/sections/UseCases";
import { Diagnosis } from "@/components/sections/Diagnosis";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#02040a]">
      <Hero />
      <ProblemSolution />
      <GrowthGenes />
      <UseCases />
      <Diagnosis />
      <FinalCTA />
    </main>
  );
}
