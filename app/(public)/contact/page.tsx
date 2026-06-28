import type { Metadata } from "next";
import { Suspense } from "react";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { STUDIO_EMAIL } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Студия — связь по работам",
  description: "Запросить информацию о работе: наличие, стоимость и доставка.",
  openGraph: { title: "Студия — связь по работам" },
  twitter: { card: "summary_large_image", title: "Студия — связь по работам" }
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageContainer>
          <Section className="contact-page">
            <div className="contact-layout">
              <div className="contact-copy reveal">
                <p className="contact-eyebrow">Студия</p>
                <h1 className="contact-title">Запрос о работе</h1>
                <p className="contact-intro">
                  Если вас заинтересовала картина в экспозиции, отправьте запрос через форму — заявка сохранится в
                  студии, и мы свяжемся с вами в ближайшее время.
                </p>
                <div className="contact-details">
                  <div className="contact-detail">
                    <span>Почта</span>
                    <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
                  </div>
                  <div className="contact-detail">
                    <span>Запросы</span>
                    <p>Работы, стоимость, резерв, персональный подбор.</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-card reveal reveal-delay-1">
                <Suspense fallback={<p>Загружаем форму...</p>}>
                  <InquiryForm />
                </Suspense>
              </div>
            </div>
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
