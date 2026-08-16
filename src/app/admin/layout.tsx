import AdminLayout from "@/components/admin/AdminLayout";
import { auth } from "@/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return <div className="flex items-center justify-center h-screen text-2xl">Access Denied</div>;

    return <AdminLayout>{children}</AdminLayout>;
}
