import { ClientsView } from '@/components/admin/ClientsView';
import {
  getAllAutomations,
  getAllBillingRecords,
  getClients,
  requireAdmin,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  await requireAdmin();

  const [clients, automations, billing] = await Promise.all([
    getClients(),
    getAllAutomations(),
    getAllBillingRecords(),
  ]);

  return <ClientsView clients={clients} automations={automations} billing={billing} />;
}
