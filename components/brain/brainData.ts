export type BrainCategory = 'identidad' | 'agentes' | 'automatizaciones' | 'assets';

export interface BrainNode {
  id: string;
  label: string;
  category: BrainCategory;
  x: number;
  y: number;
  size: number;
}

export interface BrainLink {
  source: string;
  target: string;
}

export const CATEGORY_META: Record<BrainCategory, { label: string; color: string }> = {
  identidad: { label: 'Identidad de Marca', color: '#ccff00' },
  agentes: { label: 'Agentes IA', color: '#22d3ee' },
  automatizaciones: { label: 'Automatizaciones', color: '#a78bfa' },
  assets: { label: 'Assets & Contenido', color: '#f472b6' },
};

export const brainNodes: BrainNode[] = [
  { id: 'core', label: 'Origin OS', category: 'identidad', x: 50, y: 50, size: 16 },

  { id: 'brand', label: 'ADN de Marca', category: 'identidad', x: 22, y: 24, size: 8 },
  { id: 'voice', label: 'Tono de Voz', category: 'identidad', x: 14, y: 52, size: 6 },

  { id: 'lead-scoring', label: 'Lead Scoring IA', category: 'agentes', x: 78, y: 20, size: 9 },
  { id: 'enrichment', label: 'Enriquecimiento', category: 'agentes', x: 86, y: 46, size: 7 },
  { id: 'copilot', label: 'Co-piloto de Ventas', category: 'agentes', x: 72, y: 68, size: 8 },

  { id: 'crm-sync', label: 'CRM Autónomo', category: 'automatizaciones', x: 50, y: 14, size: 9 },
  { id: 'onboarding', label: 'Onboarding Clientes', category: 'automatizaciones', x: 30, y: 80, size: 7 },
  { id: 'cart-recovery', label: 'Recuperación Carritos', category: 'automatizaciones', x: 62, y: 88, size: 6 },

  { id: 'content-gen', label: 'Generador de Contenido', category: 'assets', x: 18, y: 76, size: 7 },
  { id: 'reports', label: 'Reportes Ejecutivos', category: 'assets', x: 46, y: 90, size: 6 },
];

export const brainLinks: BrainLink[] = [
  { source: 'core', target: 'brand' },
  { source: 'core', target: 'voice' },
  { source: 'core', target: 'lead-scoring' },
  { source: 'core', target: 'enrichment' },
  { source: 'core', target: 'copilot' },
  { source: 'core', target: 'crm-sync' },
  { source: 'core', target: 'onboarding' },
  { source: 'core', target: 'cart-recovery' },
  { source: 'core', target: 'content-gen' },
  { source: 'core', target: 'reports' },
  { source: 'brand', target: 'content-gen' },
  { source: 'lead-scoring', target: 'crm-sync' },
  { source: 'enrichment', target: 'crm-sync' },
  { source: 'copilot', target: 'cart-recovery' },
  { source: 'onboarding', target: 'crm-sync' },
  { source: 'content-gen', target: 'reports' },
];

export const brainStats = [
  { label: 'Conocimiento Indexado', value: '4.2k nodos' },
  { label: 'Sinapsis Activas', value: `${brainLinks.length}` },
  { label: 'Agentes Operativos', value: '6' },
];
