export type Role = 'client' | 'admin';
export type ClientStatus = 'activo' | 'onboarding' | 'pausado';
export type FlowStatus = 'activo' | 'pausa' | 'error';
export type TicketStatus = 'abierto' | 'progreso' | 'resuelto';
export type TicketPriority = 'Baja' | 'Media' | 'Alta';
export type DiagnosticStatus = 'nuevo' | 'contactado' | 'agendado' | 'descartado';

export interface Profile {
  id: string;
  email: string | null;
  role: Role;
  name: string | null;
  company: string | null;
  plan: string;
  status: ClientStatus;
  avatar_initials: string | null;
  kpi_roi: string | null;
  kpi_leads: number | null;
  kpi_hours: number | null;
  created_at: string;
}

/** Nodo del pipeline. `icon` es el nombre de un icono de lucide-react. */
export interface FlowNode {
  icon: string;
  label: string;
}

export interface AutomationLog {
  id: string;
  automation_id: string;
  status: 'success' | 'error';
  message: string | null;
  created_at: string;
}

export interface Automation {
  id: string;
  client_id: string;
  name: string;
  stack: string | null;
  area: string | null;
  status: FlowStatus;
  monthly_cost: number | null;
  kpi_result: string | null;
  documentation_url: string | null;
  spark_points: string | null;
  master_prompt: string | null;
  nodes: FlowNode[];
  updated_at: string;
}

/** Automatización con sus logs embebidos, como la devuelve getAutomations(). */
export interface AutomationWithLogs extends Automation {
  automation_logs: AutomationLog[];
}

export interface BillingRecord {
  id: string;
  client_id: string;
  service_name: string;
  service_type: string | null;
  monthly_cost: number | null;
  billing_month: string | null;
}

export interface SupportTicket {
  id: string;
  client_id: string;
  subject: string;
  message: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

/** Ticket con el perfil del cliente adjunto, para la bandeja de admin. */
export interface TicketWithClient extends SupportTicket {
  profiles: Pick<Profile, 'name' | 'company' | 'email' | 'avatar_initials'> | null;
}

/** Lead de la landing (/diagnostico). Vive en la tabla `diagnostics`. */
export interface Diagnostic {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  challenge: string | null;
  status: DiagnosticStatus;
  created_at: string;
}

/** Automatización con el cliente dueño adjunto, para la vista global de flujos. */
export interface AutomationWithClient extends Automation {
  profiles: Pick<Profile, 'name' | 'company' | 'avatar_initials'> | null;
}

export type OfficeAgentStatus = 'active' | 'idle' | 'error';

/** Agente posicionado de la oficina multicliente (tabla office_agents). */
export interface OfficeAgent {
  id: string;
  client_id: string;
  /** Automatización real vinculada (1:1); null en agentes sembrados a mano. */
  automation_id?: string | null;
  name: string;
  status: OfficeAgentStatus;
  position_x: number;
  position_y: number;
  position_z: number;
  created_at: string;
  updated_at: string;
}

/** Ejecuciones de un día (suma de todos los flujos del cliente). `day` es YYYY-MM-DD. */
export interface ExecutionTrendPoint {
  day: string;
  success: number;
  error: number;
}
