import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://genflow.com.co"),
  title: "Genflow | Automatización e IA con trazabilidad y acompañamiento 1:1",
  description:
    "Diseñamos y operamos tus automatizaciones de marketing, ventas y operaciones. Con un consultor asignado y un portal donde ves qué corre, qué resultados da y cuánto cuesta cada pieza.",
  keywords: [
    "automatización empresarial",
    "consultoría IA",
    "trazabilidad de automatizaciones",
    "optimización de costos IA",
    "automatización de operaciones",
    "IA segura y escalable",
  ],
  openGraph: {
    title: "Genflow | Toda tu IA en un solo lugar. Y trazable.",
    description:
      "Automatizaciones de marketing a operaciones, con acompañamiento 1:1 y costos visibles. Diagnóstico gratuito de 30 minutos.",
    url: "https://genflow.com.co",
    siteName: "Genflow",
    images: [
      {
        url: "/hero_ai_creative_abstract_1769822779877.png",
        width: 1200,
        height: 630,
        alt: "Genflow — portal de clientes con trazabilidad de automatizaciones",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genflow | Toda tu IA en un solo lugar. Y trazable.",
    description:
      "Automatizaciones de marketing a operaciones, con acompañamiento 1:1 y costos visibles.",
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
        {/* Navbar y Footer viven en app/(marketing)/layout.tsx: el portal y
            el CRM tienen su propio chrome a pantalla completa. */}
        {children}
      </body>
    </html>
  );
}
