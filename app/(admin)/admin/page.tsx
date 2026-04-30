import Link from "next/link";

import { SectionTitle } from "@/components/layout/SectionTitle";
import { artworksRepository } from "@/lib/repositories/artworks-repository";
import { collectionsCountLabel, worksCountLabel } from "@/lib/ru-plurals";

export default async function AdminPage() {
  const collections = await artworksRepository.listCollections();
  const artworks = await artworksRepository.list();

  return (
    <section className="admin-section">
      <SectionTitle>Обзор</SectionTitle>
      <p className="admin-copy">Управляй работами, обновляй данные и поддерживай галерею в актуальном виде.</p>
      <div className="admin-overview-grid">
        <div className="admin-overview-card">
          <span>Работы</span>
          <strong>{worksCountLabel(artworks.length)}</strong>
        </div>
        <div className="admin-overview-card">
          <span>Коллекции</span>
          <strong>{collectionsCountLabel(collections.length)}</strong>
        </div>
        <div className="admin-overview-card">
          <span>Заявки</span>
          <strong>Сохраняются в галерее</strong>
        </div>
        <div className="admin-overview-card">
          <span>Статусы</span>
          <strong>Доступна / Продана / В резерве</strong>
        </div>
      </div>
      <div className="admin-actions">
        <Link className="admin-action-link" href="/admin/artworks">
          Смотреть работы
        </Link>
        <Link className="admin-action-link" href="/admin/artworks/new">
          Добавить работу
        </Link>
        <Link className="admin-action-link" href="/admin/collections">
          Смотреть коллекции
        </Link>
        <Link className="admin-action-link" href="/admin/inquiries">
          Смотреть заявки
        </Link>
      </div>
    </section>
  );
}
