import type { Metadata } from "next";

import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export const metadata: Metadata = {
  title: "Добавление работы | Админка"
};

export default function NewArtworkPage() {
  const collections = artworksRepository.listCollections();

  return (
    <section className="admin-section">
      <SectionTitle>Добавление работы</SectionTitle>
      <p className="admin-copy">Заполни основные данные о картине и добавь изображения.</p>
      <ArtworkForm collections={collections} mode="create" />
    </section>
  );
}
