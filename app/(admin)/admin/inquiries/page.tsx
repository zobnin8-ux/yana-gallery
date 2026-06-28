import Link from "next/link";
import type { Metadata } from "next";

import { AdminInquiryActions, AdminInquiryStatusBadge } from "@/components/admin/AdminInquiryActions";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { galleryStore } from "@/lib/gallery-store";
import { inquiriesCountLabel } from "@/lib/ru-plurals";

export const metadata: Metadata = {
  title: "Заявки | Админка"
};

export default async function AdminInquiriesPage() {
  const [inquiries, artworks] = await Promise.all([galleryStore.listInquiries(), galleryStore.listArtworks()]);
  const slugById = new Map(artworks.map((artwork) => [artwork.id, artwork.slug]));
  const newCount = inquiries.filter((inquiry) => inquiry.status === "new").length;

  return (
    <section className="admin-section">
      <SectionTitle>Заявки</SectionTitle>
      <p className="admin-copy">
        {inquiries.length
          ? `${inquiriesCountLabel(inquiries.length)}${newCount ? ` · ${newCount} новых` : ""}`
          : "Все запросы из публичной формы сохраняются здесь и в Supabase."}
      </p>
      <div className="admin-inquiries-list">
        {inquiries.length ? (
          inquiries.map((inquiry) => {
            const artworkSlug = inquiry.artworkId ? slugById.get(inquiry.artworkId) : undefined;

            return (
              <article className="admin-inquiry-card" key={inquiry.id}>
                <div className="admin-inquiry-card-header">
                  <div>
                    <span>{new Date(inquiry.createdAt).toLocaleString("ru-RU")}</span>
                    <h3>{inquiry.name}</h3>
                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                  </div>
                  <AdminInquiryStatusBadge status={inquiry.status} />
                </div>
                {inquiry.artworkTitle ? (
                  <p className="admin-inquiry-artwork">
                    Работа:{" "}
                    {artworkSlug ? (
                      <Link href={`/artworks/${artworkSlug}`}>{inquiry.artworkTitle}</Link>
                    ) : (
                      inquiry.artworkTitle
                    )}
                  </p>
                ) : null}
                <p>{inquiry.message}</p>
                <AdminInquiryActions inquiryId={inquiry.id} status={inquiry.status} />
              </article>
            );
          })
        ) : (
          <p className="admin-copy">Пока заявок нет.</p>
        )}
      </div>
    </section>
  );
}
