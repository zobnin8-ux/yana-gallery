import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { SectionTitle } from "@/components/layout/SectionTitle";

export const metadata: Metadata = {
  title: "Вход | Админка"
};

export default function AdminLoginPage() {
  return (
    <section className="admin-section admin-login-section">
      <SectionTitle>Вход в админку</SectionTitle>
      <p className="admin-copy">
        Введите пароль, заданный в переменной окружения <code>GALLERY_ADMIN_PASSWORD</code>. Для локального
        запуска временный пароль: <code>change-me</code>.
      </p>
      <Suspense fallback={<p className="admin-copy">Загружаем форму входа...</p>}>
        <AdminLoginForm />
      </Suspense>
    </section>
  );
}
