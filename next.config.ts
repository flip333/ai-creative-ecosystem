import type { NextConfig } from "next";

// ============================================================
// FASE 0 — Blindaje de plataforma (owner: genflow-seguridad / genflow-devops)
// Headers aplicados a todas las rutas. Vercel no los añade por defecto.
// Nota: la CSP estricta (nonce) queda como tarea del Sprint 0 porque hay que
// probarla contra three.js (blobs/workers), framer-motion y las conexiones a
// Supabase; meter una CSP a ciegas rompería la landing. El resto es seguro ya.
// ============================================================
const securityHeaders = [
  // Fuerza HTTPS durante 2 años, incluidos subdominios. Clave al poner el dominio propio.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // El navegador no "adivina" el content-type: corta un vector de XSS.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Nadie embebe el portal en un iframe (anti clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // No filtrar la URL completa con datos de cliente a terceros.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Apaga APIs de dispositivo que el producto no usa.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  eslint: {
    // Pendiente: la landing arrastra errores de react/no-unescaped-entities
    // y un rules-of-hooks en ScrollAnimatedCopy. Se mantiene desactivado
    // hasta limpiarlos; no afecta al portal.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Reactivado: el portal maneja datos de clientes y un error de tipos
    // silenciado ahí puede convertirse en una fuga de datos.
    ignoreBuildErrors: false,
  },
  // No regalar el stack ni un mapa de la app a un atacante.
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
