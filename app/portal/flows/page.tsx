import { FlowsView } from '@/components/portal/FlowsView';
import { getAutomations, requireProfile } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PortalFlowsPage() {
  const { userId, profile } = await requireProfile();
  const automations = await getAutomations(userId);

  return <FlowsView automations={automations} hoursSaved={profile.kpi_hours ?? 0} />;
}
