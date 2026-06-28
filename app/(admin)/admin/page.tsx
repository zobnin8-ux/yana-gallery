import Link from "next/link";

import { SectionTitle } from "@/components/layout/SectionTitle";
import { galleryStore } from "@/lib/gallery-store";
import { artworksRepository } from "@/lib/repositories/artworks-repository";
import { collectionsCountLabel, inquiriesCountLabel, worksCountLabel } from "@/lib/ru-plurals";

export default async function AdminPage() {
  const [collections, artworks, inquiries] = await Promise.all([
    artworksRepository.listCollections(),
    artworksRepository.list(),
    galleryStore.listInquiries()
  ]);
  const newInquiries = inquiries.filter((inquiry) => inquiry.status === "new").length;

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
          <strong>
            {inquiries.length ? inquiriesCountLabel(inquiries.length) : "Пока нет"}
            {newInquiries ? ` · ${newInquiries} новых` : ""}
          </strong>
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
        <Link className="admin-action-link" href="/admin/about">
          Фото на странице «Художник»
        </Link>
        <Link className="admin-action-link" href="/admin/orders">
          Заказы
        </Link>
        <Link className="admin-action-link" href="/admin/inquiries">
          Смотреть заявки
        </Link>
      </div>
    </section>
  );
}
