import { ClientOffice2D } from '@/components/ClientOffice2D';
import { requireProfile } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PortalOficinaPage() {
  // Gate de sesión (el layout ya lo hace; se mantiene por defensa en profundidad).
  await requireProfile();

  // Vista 2D (canvas 2D puro, sin WebGL) para máxima compatibilidad. Consume
  // office_agents en tiempo real vía useSupabaseAgents (filtrado por auth.uid()).
  return <ClientOffice2D />;
}
