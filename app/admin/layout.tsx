import { AdminNav } from "./_components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <main className="pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
