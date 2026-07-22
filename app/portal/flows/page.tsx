'use client';

import { useState } from 'react';
import { 
  Workflow, 
  Clock, 
  Database, 
  Search, 
  Plus, 
  ExternalLink, 
  X, 
  Play, 
  Pause, 
  MessageSquare,
  UserPlus,
  Bot,
  Mail,
  Calendar,
  Brain,
  Image as ImageIcon,
  CheckCircle,
  Layers,
  Tag,
  ShoppingCart,
  AlertTriangle,
  BarChart2,
  Send
} from 'lucide-react';

interface Node {
  icon: any;
  label: string;
}

interface Log {
  ok: boolean;
  label: string;
  time: string;
}

interface AutomationRow {
  id: number;
  name: string;
  stack: string;
  area: string;
  status: 'activo' | 'pausa' | 'error';
  updated: string;
  cost: string;
  result: string;
  doc: string;
  sparkPoints: string;
  nodes: Node[];
  logs: Log[];
}

const INITIAL_ROWS: AutomationRow[] = [
  {
    id: 1,
    name: 'Secuencia Onboarding Clientes',
    stack: 'N8N + GoHighLevel',
    area: 'ventas',
    status: 'activo',
    updated: 'Hace 2 horas',
    cost: '$15.00 / mes',
    result: '+45 Leads',
    sparkPoints: '0,18 10,14 20,15 30,9 40,10 50,4 60,3',
    doc: 'https://docs.genflow.ai/onboarding-clientes',
    nodes: [
      { icon: UserPlus, label: 'Trigger: Nuevo Lead' },
      { icon: Database, label: 'CRM Sync' },
      { icon: Bot, label: 'Enriquecimiento IA' },
      { icon: Mail, label: 'Secuencia Email' },
    ],
    logs: [
      { ok: true, label: 'Ejecución completada — 12 contactos procesados', time: 'Hoy 09:42' },
      { ok: true, label: 'Ejecución completada — 8 contactos procesados', time: 'Hoy 06:10' },
      { ok: true, label: 'Ejecución completada — 15 contactos procesados', time: 'Ayer 22:03' },
      { ok: false, label: 'Error de timeout en API de GoHighLevel', time: 'Ayer 14:27' },
      { ok: true, label: 'Ejecución completada — 10 contactos procesados', time: 'Ayer 09:15' },
    ],
  },
  {
    id: 2,
    name: 'Generador de Contenido IA',
    stack: 'Vivid Synthesis + OpenAI',
    area: 'marketing',
    status: 'activo',
    updated: 'Hace 1 día',
    cost: '$42.30 / mes',
    result: '128 piezas',
    sparkPoints: '0,10 10,12 20,8 30,11 40,6 50,7 60,3',
    doc: 'https://docs.genflow.ai/vivid-synthesis',
    nodes: [
      { icon: Calendar, label: 'Trigger: Calendario' },
      { icon: Brain, label: 'Generación GPT-4' },
      { icon: ImageIcon, label: 'Render Visual' },
      { icon: CheckCircle, label: 'Revisión Humana' },
    ],
    logs: [
      { ok: true, label: '12 piezas generadas para Instagram', time: 'Hoy 07:00' },
      { ok: true, label: '6 piezas generadas para LinkedIn', time: 'Ayer 07:00' },
      { ok: true, label: '9 piezas generadas para Instagram', time: '27/Jul 07:00' },
      { ok: true, label: '4 piezas generadas para Blog', time: '26/Jul 07:00' },
      { ok: false, label: 'Fallo de cuota en API de OpenAI', time: '25/Jul 07:00' },
    ],
  },
  {
    id: 3,
    name: 'Calificación de Leads (Scoring)',
    stack: 'N8N + HubSpot',
    area: 'ventas',
    status: 'pausa',
    updated: '14/May/2026',
    cost: '$8.00 / mes',
    result: '12h ahorradas',
    sparkPoints: '0,6 10,7 20,9 30,9 40,9 50,9 60,9',
    doc: 'https://docs.genflow.ai/lead-scoring',
    nodes: [
      { icon: Database, label: 'Trigger: HubSpot' },
      { icon: Layers, label: 'Reglas de Scoring' },
      { icon: Tag, label: 'Etiquetado Auto.' },
    ],
    logs: [
      { ok: true, label: 'Última ejecución antes de pausa — 34 leads', time: '14/May 11:20' },
      { ok: true, label: '31 leads calificados', time: '13/May 11:20' },
      { ok: true, label: '28 leads calificados', time: '12/May 11:20' },
    ],
  },
  {
    id: 4,
    name: 'Recuperación de Carritos',
    stack: 'Shopify + Klaviyo',
    area: 'marketing',
    status: 'error',
    updated: 'Hace 30 min',
    cost: '$22.00 / mes',
    result: '-3 fallos',
    sparkPoints: '0,4 10,6 20,5 30,10 40,14 50,18 60,20',
    doc: 'https://docs.genflow.ai/cart-recovery',
    nodes: [
      { icon: ShoppingCart, label: 'Trigger: Carrito' },
      { icon: Clock, label: 'Espera 1h' },
      { icon: Mail, label: 'Envío Klaviyo' },
      { icon: AlertTriangle, label: 'Webhook (Error)' },
    ],
    logs: [
      { ok: false, label: 'Error de autenticación con Klaviyo', time: 'Hoy 08:12' },
      { ok: false, label: 'Error de autenticación con Klaviyo', time: 'Hoy 06:40' },
      { ok: true, label: 'Ejecución completada — 22 carritos', time: 'Ayer 22:00' },
    ],
  },
  {
    id: 5,
    name: 'Reporte Semanal Ejecutivo',
    stack: 'Synergy AI + Slack',
    area: 'operaciones',
    status: 'activo',
    updated: 'Hace 3 horas',
    cost: '$5.50 / mes',
    result: '6h ahorradas',
    sparkPoints: '0,12 10,10 20,11 30,7 40,8 50,5 60,4',
    doc: 'https://docs.genflow.ai/reporte-ejecutivo',
    nodes: [
      { icon: Calendar, label: 'Trigger: Lunes 8am' },
      { icon: BarChart2, label: 'Consolidación Datos' },
      { icon: Send, label: 'Envío a Slack' },
    ],
    logs: [
      { ok: true, label: 'Reporte enviado al canal #dirección', time: 'Lun 08:00' },
      { ok: true, label: 'Reporte enviado al canal #dirección', time: '27/Jul 08:00' },
    ],
  },
];

const STATUS_META = {
  activo: { label: 'Activo', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  pausa: { label: 'En Pausa', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  error: { label: 'Error', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

export default function PortalFlowsPage() {
  const [rows, setRows] = useState<AutomationRow[]>(INITIAL_ROWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [areaFilter, setAreaFilter] = useState('todas');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const activeCount = rows.filter((r) => r.status === 'activo').length;
  const totalCost = rows.reduce(
    (sum, r) => sum + parseFloat(r.cost.replace(/[^0-9.]/g, '')),
    0
  );

  const filteredRows = rows.filter((r) => {
    const term = searchTerm.trim().toLowerCase();
    if (term && !(r.name.toLowerCase().includes(term) || r.stack.toLowerCase().includes(term))) {
      return false;
    }
    if (statusFilter !== 'todos' && r.status !== statusFilter) return false;
    if (areaFilter !== 'todas' && r.area !== areaFilter) return false;
    return true;
  });

  const selectedRow = rows.find((r) => r.id === selectedId);

  const togglePause = (id: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'pausa' ? 'activo' : 'pausa' }
          : r
      )
    );
  };

  return (
    <div className="flex flex-col gap-7">
      {/* KPIs Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0d1117]/70 border border-[#ccff00]/10 rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-[#ccff00]" />
            </div>
            <span className="font-mono text-xs font-bold text-[#22c55e]">+2 este mes</span>
          </div>
          <div>
            <div className="font-display text-4xl font-medium text-white tracking-tight">
              {activeCount}
            </div>
            <div className="text-xs text-zinc-400 mt-1">Automatizaciones Activas</div>
          </div>
        </div>

        <div className="bg-[#0d1117]/70 border border-[#ccff00]/10 rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#ccff00]" />
            </div>
            <span className="font-mono text-xs font-bold text-[#22c55e]">+14%</span>
          </div>
          <div>
            <div className="font-display text-4xl font-medium text-white tracking-tight">86h</div>
            <div className="text-xs text-zinc-400 mt-1">Horas Ahorradas (Mes)</div>
          </div>
        </div>

        <div className="bg-[#0d1117]/70 border border-[#ccff00]/10 rounded-3xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#ccff00]" />
            </div>
            <span className="font-mono text-xs font-bold text-zinc-500">/ mes</span>
          </div>
          <div>
            <div className="font-display text-4xl font-medium text-white tracking-tight">
              ${totalCost.toFixed(2)}
            </div>
            <div className="text-xs text-zinc-400 mt-1">Gasto en Infraestructura (APIs)</div>
          </div>
        </div>
      </section>

      {/* Filter and Action Bar */}
      <section className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar flujo o integración..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#ccff00]/50 transition-all placeholder:text-zinc-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-300 text-xs outline-none focus:border-[#ccff00]/50"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pausa">En Pausa</option>
          <option value="error">Error</option>
        </select>

        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-300 text-xs outline-none focus:border-[#ccff00]/50"
        >
          <option value="todas">Todas las áreas</option>
          <option value="marketing">Marketing</option>
          <option value="ventas">Ventas</option>
          <option value="operaciones">Operaciones</option>
          <option value="soporte">Soporte</option>
        </select>

        <div className="flex-1" />

        <button 
          onClick={() => alert('Solicitud enviada a tu consultor Genflow.')}
          className="inline-flex items-center gap-2 bg-[#ccff00] text-black py-2.5 px-5 rounded-full font-bold text-xs shadow-[0_0_18px_rgba(204,255,0,0.4)] hover:bg-[#b8e600] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Solicitar nueva automatización
        </button>
      </section>

      {/* Table */}
      <section className="bg-[#0d1117] border border-white/5 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-[2.4fr_1fr_1fr_0.8fr_1fr_1.3fr] px-6 py-4 border-b border-white/5 font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          <span>Función</span>
          <span>Status</span>
          <span>Actualizado</span>
          <span>Docs</span>
          <span>Costo</span>
          <span>Resultados</span>
        </div>

        {filteredRows.length > 0 ? (
          filteredRows.map((row) => {
            const meta = STATUS_META[row.status];
            const isError = row.status === 'error';

            return (
              <div
                key={row.id}
                onClick={() => setSelectedId(row.id)}
                className="grid grid-cols-[2.4fr_1fr_1fr_0.8fr_1fr_1.3fr] items-center px-6 py-4 border-b border-white/5 last:border-b-0 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col gap-0.5 pr-3">
                  <span className="text-sm font-semibold text-white">{row.name}</span>
                  <span className="text-xs text-zinc-500">{row.stack}</span>
                </div>

                <div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.label}
                  </span>
                </div>

                <span className="text-xs text-zinc-400">{row.updated}</span>

                <div>
                  <a
                    href={row.doc}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <span className="font-mono text-xs text-zinc-300">{row.cost}</span>

                <div className="flex items-center gap-3">
                  <svg width="60" height="24" viewBox="0 0 60 24" className="shrink-0">
                    <polyline
                      points={row.sparkPoints}
                      fill="none"
                      stroke={isError ? '#ef4444' : '#ccff00'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className={`text-xs font-semibold ${
                      isError ? 'text-red-500' : 'text-[#22c55e]'
                    }`}
                  >
                    {row.result}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-zinc-500 text-sm">
            No se encontraron automatizaciones con esos filtros.
          </div>
        )}
      </section>

      {/* Detail Drawer */}
      {selectedRow && (
        <>
          <div
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 animate-fade-in"
          />

          <aside className="fixed top-0 right-0 bottom-0 w-[480px] max-w-[92vw] bg-[#0d1117] border-l border-[#ccff00]/20 shadow-2xl z-50 flex flex-col animate-slide-in">
            {/* Drawer Header */}
            <div className="p-7 border-b border-white/5 flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
                  Detalle de Flujo
                </span>
                <h2 className="margin-0 font-display font-medium text-xl text-white tracking-tight">
                  {selectedRow.name}
                </h2>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                  style={{
                    backgroundColor: STATUS_META[selectedRow.status].bg,
                    color: STATUS_META[selectedRow.status].color,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: STATUS_META[selectedRow.status].color }}
                  />
                  {STATUS_META[selectedRow.status].label}
                </span>
              </div>

              <button
                onClick={() => setSelectedId(null)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-7">
              {/* Nodes Pipeline */}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Secuencia de Nodos
                </div>
                <div className="flex items-center gap-0 bg-[#02040a] border border-white/5 rounded-2xl p-5 overflow-x-auto">
                  {selectedRow.nodes.map((node, idx) => {
                    const NodeIcon = node.icon;
                    const hasNext = idx < selectedRow.nodes.length - 1;

                    return (
                      <div key={idx} className="flex items-center shrink-0">
                        <div className="flex flex-col items-center gap-1.5 min-w-[76px]">
                          <div className="w-11 h-11 rounded-xl bg-white/5 border border-[#ccff00]/20 flex items-center justify-center">
                            <NodeIcon className="w-5 h-5 text-[#ccff00]" />
                          </div>
                          <span className="text-[10px] text-zinc-400 text-center leading-tight">
                            {node.label}
                          </span>
                        </div>
                        {hasNext && (
                          <div className="w-6 h-[1px] bg-white/20 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Logs */}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">
                  Últimas Ejecuciones
                </div>
                <div className="flex flex-col gap-1">
                  {selectedRow.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-b-0"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: log.ok
                            ? 'rgba(34,197,94,0.12)'
                            : 'rgba(239,68,68,0.12)',
                        }}
                      >
                        {log.ok ? (
                          <CheckCircle className="w-3.5 h-3.5 text-[#22c55e]" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-red-500" />
                        )}
                      </div>
                      <span className="flex-1 text-xs text-zinc-300">{log.label}</span>
                      <span className="font-mono text-[11px] text-zinc-500">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-6 border-t border-white/5 flex gap-3">
              <button
                onClick={() => togglePause(selectedRow.id)}
                className="flex-1 py-3 rounded-full bg-transparent border border-white/20 text-zinc-200 text-xs font-semibold cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                {selectedRow.status === 'pausa' ? (
                  <>
                    <Play className="w-4 h-4 text-[#ccff00]" />
                    Reanudar Automatización
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pausar Automatización
                  </>
                )}
              </button>

              <button 
                onClick={() => alert('Contactando a soporte para este flujo...')}
                className="flex-1 py-3 rounded-full bg-[#ccff00] text-black font-bold text-xs cursor-pointer hover:bg-[#b8e600] transition-colors shadow-[0_0_18px_rgba(204,255,0,0.4)] flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Contactar Soporte
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
