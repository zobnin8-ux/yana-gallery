"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    const response = await fetch("/api/admin/logout", { method: "POST" });
    const result = (await response.json()) as { redirectTo?: string };

    router.replace(result.redirectTo ?? "/admin/login");
    router.refresh();
  }

  return (
    <button className="admin-back-link" disabled={isSubmitting} onClick={handleLogout} type="button">
      {isSubmitting ? "Выходим..." : "Выйти"}
    </button>
  );
}
