import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="not-found-page">
        <PageContainer>
          <div className="not-found-inner">
            <p className="eyebrow">404</p>
            <h1 className="not-found-title">Страница недоступна</h1>
            <p className="not-found-text">
              Эта работа недоступна или ссылка устарела. Вернитесь к экспозиции или откройте галерею.
            </p>
            <Link className="hero-link hero-link-primary" href="/gallery">
              К экспозиции
            </Link>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
