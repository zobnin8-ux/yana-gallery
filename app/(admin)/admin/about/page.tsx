import type { Metadata } from "next";

import { AdminArtistAboutForm } from "@/components/admin/AdminArtistAboutForm";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { getArtistPortraitUrl } from "@/lib/site-settings-store";

export const metadata: Metadata = {
  title: "Художник (страница о вас) | Админка"
};

const DEFAULT_ABOUT_ILLUSTRATION = "/images/artworks/light-composition-1.svg";

export default async function AdminAboutPage() {
  const currentPortraitUrl = await getArtistPortraitUrl();

  return (
    <section className="admin-section">
      <SectionTitle>Страница «Художник»</SectionTitle>
      <p className="admin-copy">
        Фотография в блоке с биографией на публичной странице{" "}
        <a href="/about" rel="noreferrer" target="_blank">
          /about
        </a>
        . Текст раздела по-прежнему задаётся в коде; меняется только изображение.
      </p>
      <AdminArtistAboutForm currentPortraitUrl={currentPortraitUrl} defaultIllustrationSrc={DEFAULT_ABOUT_ILLUSTRATION} />
    </section>
  );
}
