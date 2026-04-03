import Image from "next/image";

import { PageContainer } from "@/components/layout/PageContainer";
import { Section } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageContainer>
          <Section className="about-page">
            <div className="about-layout">
              <div className="about-image-wrap reveal">
                <div className="about-image-frame">
                  <Image
                    src="/images/artist/yana-zubareva-portrait.jpg"
                    alt="Яна Зубарева"
                    fill
                    sizes="(max-width: 980px) 100vw, 46vw"
                    className="about-image"
                  />
                </div>
              </div>

              <div className="about-copy reveal reveal-delay-1">
                <p className="about-eyebrow">About</p>
                <h1 className="about-title">Обо мне</h1>
                <p className="about-intro">
                  Я работаю с живописью как с пространством тишины, света и внутреннего равновесия.
                  В центре моего визуального языка — деликатная композиция, чистота ритма и внимание к
                  состоянию, которое рождается внутри изображения.
                </p>
                <div className="about-text">
                  <p>
                    Мои работы строятся не на визуальном шуме, а на нюансе: мягком переходе тона,
                    глубине цвета, ощущении воздуха и спокойной пластике формы.
                  </p>
                  <p>
                    Для меня каждая картина — не просто объект, а часть интерьера и личного
                    пространства, где важны тишина, масштаб и присутствие.
                  </p>
                </div>

                <div className="about-contacts">
                  <div className="about-contact-item">
                    <span>Email</span>
                    <a href="mailto:studio@yanazubareva.com">studio@yanazubareva.com</a>
                  </div>
                  <div className="about-contact-item">
                    <span>Telegram</span>
                    <a href="https://t.me/yana_art72" rel="noreferrer" target="_blank">
                      @yana_art72
                    </a>
                  </div>
                </div>

                <div className="about-socials" aria-label="Социальные ссылки">
                  <a
                    className="about-social-link"
                    href="mailto:studio@yanazubareva.com"
                    aria-label="Email"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4 6.5h16a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 17.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5Zm0 1 8 5.6 8-5.6"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </a>
                  <a
                    className="about-social-link"
                    href="https://t.me/yana_art72"
                    rel="noreferrer"
                    target="_blank"
                    aria-label="Telegram"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M20.5 5.2 4.8 11.2c-1 .4-1 1.8.1 2.1l3.9 1.2 1.5 4.6c.3 1 1.6 1.2 2.2.3l2.2-3.1 3.8 2.8c.8.6 1.9.2 2.1-.8l2.2-11.2c.2-1.1-.9-2-2-1.6Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.4"
                      />
                      <path
                        d="m8.8 14.5 9-7.1M10.3 19l1.2-4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
