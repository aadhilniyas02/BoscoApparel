import { Sidebar } from "@/components/admin/Sidebar";
import { AdminProtection } from "@/components/admin/AdminProtection";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection>
      <div className="flex bg-background h-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </AdminProtection>
  );
}
