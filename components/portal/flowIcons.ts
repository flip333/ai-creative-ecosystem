import {
  AlertTriangle,
  BarChart2,
  Bot,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Image as ImageIcon,
  Layers,
  Mail,
  Send,
  ShoppingCart,
  Tag,
  UserPlus,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

/**
 * Los nodos de un flujo se guardan en Postgres como
 * `[{"icon": "UserPlus", "label": "..."}]`. La BD sólo conoce el nombre;
 * el mapeo a componentes vive aquí para que el bundle sólo cargue
 * los iconos que realmente usamos.
 */
const FLOW_ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  BarChart2,
  Bot,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  ImageIcon,
  Layers,
  Mail,
  Send,
  ShoppingCart,
  Tag,
  UserPlus,
  Workflow,
};

/** Devuelve el icono por nombre; Workflow como fallback genérico. */
export function flowIcon(name: string | undefined): LucideIcon {
  return (name && FLOW_ICONS[name]) || Workflow;
}
