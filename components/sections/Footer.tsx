"use client"

import { Button } from "@/components/ui/button"

export function Footer() {
    return (
        <footer className="py-24 border-t border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />

            <div className="container px-4 md:px-6 text-center space-y-8 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    La creatividad sigue siendo humana.
                    <span className="block text-primary mt-2">La inteligencia artificial la potencia.</span>
                </h2>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button variant="glow" size="lg" className="text-lg px-8 py-6 rounded-full w-full sm:w-auto">
                        Iniciar conversación
                    </Button>
                    <Button variant="ghost" size="lg" className="text-lg px-8 py-6 rounded-full w-full sm:w-auto hover:bg-white/5">
                        Descubrir cómo aplicarlo
                    </Button>
                </div>

                <div className="pt-20 text-sm text-muted-foreground border-t border-white/5 mt-20 w-full flex justify-between items-center">
                    <p>© 2026 AI Creative Ecosystem.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
