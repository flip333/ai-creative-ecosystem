import { getAllAutomationsWithClient, requireAdmin } from '@/lib/queries';
import { FlowsManager } from '@/components/admin/FlowsManager';

export const dynamic = 'force-dynamic';

export default async function AdminFlowsPage() {
  await requireAdmin();
  const flows = await getAllAutomationsWithClient();

  return <FlowsManager flows={flows} />;
}
