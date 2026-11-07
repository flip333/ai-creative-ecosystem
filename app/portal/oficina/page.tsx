import { ClientOfficePixi } from '@/components/portal/ClientOfficePixi';
import { getAutomations, requireProfile } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PortalOficinaPage() {
  const { userId } = await requireProfile();
  const automations = await getAutomations(userId);

  return <ClientOfficePixi automations={automations} />;
}
