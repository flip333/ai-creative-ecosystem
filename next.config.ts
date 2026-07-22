import type { NextConfig } from "next";

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
};

export default nextConfig;
