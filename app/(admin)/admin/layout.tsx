import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Админка | Галерея Яны Зубаревой"
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-shell">
      <AdminHeader />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
