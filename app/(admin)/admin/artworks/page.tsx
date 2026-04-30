import type { Metadata } from "next";

import { ArtworkTable } from "@/components/admin/ArtworkTable";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export const metadata: Metadata = {
  title: "Работы | Админка"
};

export default async function AdminArtworksPage() {
  const artworks = await artworksRepository.list();

  return (
    <section className="admin-section">
      <SectionTitle>Работы</SectionTitle>
      <p className="admin-copy">Простой список всех работ, которые отображаются в галерее.</p>
      <ArtworkTable artworks={artworks} />
    </section>
  );
}
