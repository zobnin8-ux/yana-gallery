import type { Metadata } from "next";

import { AdminCollectionsManager } from "@/components/admin/AdminCollectionsManager";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export const metadata: Metadata = {
  title: "Коллекции | Админка"
};

export default function AdminCollectionsPage() {
  const artworks = artworksRepository.list();

  return (
    <section className="admin-section">
      <SectionTitle>Коллекции</SectionTitle>
      <p className="admin-copy">
        Здесь можно переименовывать коллекции, удалять их без удаления картин и перемещать работы между
        коллекциями. Все изменения сразу отражаются в галерее.
      </p>
      <AdminCollectionsManager artworks={artworks} />
    </section>
  );
}
