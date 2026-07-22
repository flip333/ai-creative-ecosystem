import { Hero } from "@/components/sections/Hero";
import { ProblemSolution } from "@/components/sections/ProblemSolution";
import { GrowthGenes } from "@/components/sections/GrowthGenes";
import { PlatformShowcase } from "@/components/sections/PlatformShowcase";
import { Pillars } from "@/components/sections/Pillars";
import { UseCases } from "@/components/sections/UseCases";
import { Diagnosis } from "@/components/sections/Diagnosis";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Orden narrativo de conversión:
 * promesa → dolor → qué construimos → cómo lo ves (prueba) →
 * por qué nosotros → casos → autodiagnóstico → cierre.
 *
 * PlatformShowcase va justo después de los frentes de trabajo a propósito:
 * es la prueba tangible de la promesa de trazabilidad del hero.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#02040a]">
      <Hero />
      <ProblemSolution />
      <GrowthGenes />
      <PlatformShowcase />
      <Pillars />
      <UseCases />
      <Diagnosis />
      <FinalCTA />
    </main>
  );
}
