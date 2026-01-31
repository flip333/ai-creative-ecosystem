import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AI Creative Ecosystem | Sistemas Inteligentes para Negocios de Próxima Generación",
  description: "Potenciamos la intuición humana con inteligencia de datos. Ecosistema de IA estratégicamente diseñado para escalar tu creatividad y optimizar tus procesos operativos.",
  keywords: ["IA para empresas", "automatización inteligente", "creatividad IA", "sistemas expertos", "ecosistema digital", "transformación digital"],
  openGraph: {
    title: "AI Creative Ecosystem",
    description: "Sistemas Inteligentes que piensan, crean y escalan contigo.",
    url: "https://ai-creative-ecosystem.com",
    siteName: "AI Creative Ecosystem",
    images: [
      {
        url: "/hero_ai_creative_abstract_1769822779877.png",
        width: 1200,
        height: 630,
        alt: "AI Creative Ecosystem Preview",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Creative Ecosystem",
    description: "Inteligencia Artificial que potencia la intuición humana.",
    images: ["/hero_ai_creative_abstract_1769822779877.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {children}
      </body>
    </html>
  );
}
