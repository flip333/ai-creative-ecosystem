export type Role = 'client' | 'admin';
export type ClientStatus = 'activo' | 'onboarding' | 'pausado';
export type FlowStatus = 'activo' | 'pausa' | 'error';
export type TicketStatus = 'abierto' | 'progreso' | 'resuelto';
export type TicketPriority = 'Baja' | 'Media' | 'Alta';

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
