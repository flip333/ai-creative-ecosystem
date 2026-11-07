import { DocsView } from '@/components/portal/DocsView';
import { getAutomations, requireProfile } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PortalDocsPage() {
  const { userId } = await requireProfile();
  const automations = await getAutomations(userId);

  return <DocsView automations={automations} />;
}
