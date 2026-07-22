import { SupportView } from '@/components/portal/SupportView';
import { getTickets, requireProfile } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PortalSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  const { userId } = await requireProfile();
  const [tickets, params] = await Promise.all([getTickets(userId), searchParams]);

  return <SupportView tickets={tickets} prefillFlow={params.flow} />;
}
