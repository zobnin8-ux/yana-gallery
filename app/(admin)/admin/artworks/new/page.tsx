import type { Metadata } from "next";

import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { SectionTitle } from "@/components/layout/SectionTitle";

export const metadata: Metadata = {
  title: "Добавление работы | Админка"
};

export default function NewArtworkPage() {
  return (
    <section className="admin-section">
      <SectionTitle>Добавление работы</SectionTitle>
      <p className="admin-copy">Заполни основные данные о картине и добавь изображения.</p>
      <ArtworkForm mode="create" />
    </section>
  );
}
