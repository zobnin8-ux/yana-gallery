import type { Metadata } from "next";

import { SectionTitle } from "@/components/layout/SectionTitle";
import { galleryStore } from "@/lib/gallery-store";

export const metadata: Metadata = {
  title: "Заявки | Админка"
};

export default async function AdminInquiriesPage() {
  const inquiries = await galleryStore.listInquiries();

  return (
    <section className="admin-section">
      <SectionTitle>Заявки</SectionTitle>
      <p className="admin-copy">Все запросы из публичной формы сохраняются здесь и в Supabase.</p>
      <div className="admin-inquiries-list">
        {inquiries.length ? (
          inquiries.map((inquiry) => (
            <article className="admin-inquiry-card" key={inquiry.id}>
              <div>
                <span>{new Date(inquiry.createdAt).toLocaleString("ru-RU")}</span>
                <h3>{inquiry.name}</h3>
                <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
              </div>
              {inquiry.artworkTitle ? <p className="admin-inquiry-artwork">Работа: {inquiry.artworkTitle}</p> : null}
              <p>{inquiry.message}</p>
            </article>
          ))
        ) : (
          <p className="admin-copy">Пока заявок нет.</p>
        )}
      </div>
    </section>
  );
}
