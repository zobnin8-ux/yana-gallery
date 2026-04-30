import { Suspense } from "react";

import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageContainer>
          <Section className="contact-page">
            <div className="contact-layout">
              <div className="contact-copy reveal">
                <p className="contact-eyebrow">Контакты</p>
                <h1 className="contact-title">Связаться по поводу работы</h1>
                <p className="contact-intro">
                  Если тебя заинтересовала картина, можно отправить запрос через форму. Ответное письмо
                  придёт с деталями о наличии, стоимости и возможной доставке.
                </p>
                <div className="contact-details">
                  <div className="contact-detail">
                    <span>Почта</span>
                    <a href="mailto:studio@yanazubareva.com">studio@yanazubareva.com</a>
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
