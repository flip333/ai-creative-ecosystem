import {
    MessageSquare,
    Database,
    Globe,
    FileText,
    Sheet,
    Bot,
    Search,
    Brain,
} from "lucide-react";
import React from "react";

export const useCasesData = [
    {
        id: "sales_bot",
        category: "ventas",
        icons: ["chat", "db", "brain"],
        title: "Agente de Ventas IA",
        desc: "Bot de calificación y agendamiento sincronizado con tu CRM.",
        badge: "Flujo Verificado"
    },
    {
        id: "rag_docs",
        category: "operaciones",
        icons: ["doc", "sheet", "brain"],
        title: "RAG Corporativo",
        desc: "Chat seguro con documentos PDF y Hojas de Cálculo de la empresa.",
        badge: "Ops Internas"
    },
    {
        id: "web_scraper",
        category: "growth",
        icons: ["web", "sheet", "bot"],
        title: "Scraper de Mercado",
        desc: "Rastreo autónomo de precios de competencia directo a sheets.",
        badge: "Growth Hack"
    },
    {
        id: "content_gen",
        category: "marketing",
        icons: ["brain", "web", "doc"],
        title: "Motor de Contenido Social",
        desc: "Desde análisis de tendencias hasta borradores en minutos.",
        badge: "Marketing"
    },
    {
        id: "design_gen",
        category: "creatividad",
        icons: ["brain", "web", "bot"],
        title: "Asistente de Diseño Gen",
        desc: "Generación de prompts y activos visuales alineados a la marca.",
        badge: "Creatividad"
    },
    {
        id: "social_strat",
        category: "estrategia",
        icons: ["chat", "web", "brain"],
        title: "Estratega de Sentimiento",
        desc: "Análisis masivo de comentarios para detectar insights de mercado.",
        badge: "Estrategia"
    },
    {
        id: "support_triage",
        category: "soporte",
        icons: ["chat", "bot", "db"],
        title: "Triaje de Soporte AI",
        desc: "Clasificación automática de tickets y borradores de respuesta.",
        badge: "Soporte"
    },
    {
        id: "data_viz",
        category: "analitica",
        icons: ["db", "sheet", "web"],
        title: "Dashboard KPI Automático",
        desc: "Reportes semanales automatizados de fuentes fragmentadas.",
        badge: "Analítica"
    },
    {
        id: "cro_opt",
        category: "conversion",
        icons: ["brain", "sheet", "bot"],
        title: "Optimizador de Conversión",
        desc: "Pruebas A/B automáticas de copy y estructura web.",
        badge: "Conversión"
    },
    // Capacitación y cultura IA — el pilar de adopción
    {
        id: "onboarding_ia",
        category: "cultura",
        icons: ["doc", "brain", "chat"],
        title: "Onboarding IA del Equipo",
        desc: "Ruta de formación por rol, con ejercicios sobre tus propios flujos.",
        badge: "Capacitación"
    },
    {
        id: "copiloto_interno",
        category: "cultura",
        icons: ["chat", "doc", "search"],
        title: "Copiloto Interno",
        desc: "Asistente que responde dudas de procesos internos sin escalar a soporte.",
        badge: "Adopción"
    },
    {
        id: "biblioteca_prompts",
        category: "cultura",
        icons: ["doc", "sheet", "brain"],
        title: "Biblioteca de Prompts",
        desc: "Prompts maestros documentados y versionados para todo el equipo.",
        badge: "Documentación"
    }
];
