import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { requireAdmin } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#02040a] text-white font-sans selection:bg-purple-500 selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader name={profile.name ?? profile.email ?? 'Admin'} />
        <main className="flex-1 p-8 overflow-x-auto">
          <div className="flex flex-col gap-7 min-w-[980px] max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
