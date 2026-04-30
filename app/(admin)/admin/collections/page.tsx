import type { Metadata } from "next";

import { AdminCollectionsManager } from "@/components/admin/AdminCollectionsManager";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export const metadata: Metadata = {
  title: "Коллекции | Админка"
};

export default async function AdminCollectionsPage() {
  const collections = await artworksRepository.listCollections();

  return (
    <section className="admin-section">
      <SectionTitle>Коллекции</SectionTitle>
      <p className="admin-copy">
        Здесь можно создавать, редактировать и удалять коллекции. Перемещение отдельных работ выполняется в
        форме редактирования работы.
      </p>
      <AdminCollectionsManager collections={collections} />
    </section>
  );
}
