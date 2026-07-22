import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { getAutomations, requireProfile } from '@/lib/queries';
import { initialsOf } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, profile } = await requireProfile();
  const automations = await getAutomations(userId);

  const name = profile.name ?? profile.email ?? 'Cliente Genflow';

  return (
    <div className="flex min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#ccff00] selection:text-black">
      <PortalSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader
          name={name}
          initials={profile.avatar_initials ?? initialsOf(name)}
          hasAlerts={automations.some((a) => a.status === 'error')}
        />
        <main className="flex-1 p-8 overflow-x-auto">
          <div className="flex flex-col gap-7 min-w-[980px] max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
