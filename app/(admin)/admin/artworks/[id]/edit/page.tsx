import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { getArtworkById } from "@/lib/artworks/get-artwork-by-id";
import { artworksRepository } from "@/lib/repositories/artworks-repository";

export const metadata: Metadata = {
  title: "Редактирование работы | Админка"
};

type EditArtworkPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArtworkPage({ params }: EditArtworkPageProps) {
  const { id } = await params;
  const artwork = getArtworkById(id);
  const collections = artworksRepository.listCollections();

  if (!artwork) {
    notFound();
  }

  return (
    <section className="admin-section">
      <SectionTitle>Редактирование работы</SectionTitle>
      <p className="admin-copy">Обнови данные о картине и изображения.</p>
      <ArtworkForm artwork={artwork} collections={collections} mode="edit" />
    </section>
  );
}
