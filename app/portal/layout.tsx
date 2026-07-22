import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#02040a] text-white font-sans selection:bg-[#ccff00] selection:text-black">
      <PortalSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader />
        <main className="flex-1 p-8 overflow-x-auto">
          <div className="flex flex-col gap-7 min-w-[980px] max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
