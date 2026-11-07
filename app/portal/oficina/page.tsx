import { IsometricOffice } from '@/components/IsometricOffice';
import { requireProfile } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PortalOficinaPage() {
  // Gate de sesión (el layout ya lo hace; se mantiene por defensa en profundidad).
  await requireProfile();

  // La oficina es cliente y vive en tiempo real: lee office_agents del usuario
  // de la sesión vía el hook useSupabaseAgents (filtrado por client_id = auth.uid()).
  return <IsometricOffice />;
}
