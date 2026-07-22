import { TicketsView } from '@/components/admin/TicketsView';
import { getAllTickets, requireAdmin } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function AdminTicketsPage() {
  await requireAdmin();
  const tickets = await getAllTickets();

  return <TicketsView tickets={tickets} />;
}
