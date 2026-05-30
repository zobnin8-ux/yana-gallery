import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Основная навигация">
        <Link className="site-brand" href="/">
          <span className="site-brand-copy">
            <span className="site-brand-name">Яна Зубарева</span>
            <span className="site-brand-line" aria-hidden="true" />
            <span className="site-brand-tag">частная галерея</span>
          </span>
          <span aria-hidden="true" className="site-brand-mark">
            <Image
              alt=""
              className="site-brand-mark-image"
              fill
              sizes="48px"
              src="/images/branding/yana-monogram-full.png"
            />
          </span>
        </Link>
        <div className="site-nav-links">
          <Link href="/">Главная</Link>
          <Link href="/gallery">Экспозиция</Link>
          <Link href="/about">Художник</Link>
          <Link href="/contact">Студия</Link>
          <Link className="site-nav-admin-link" href="/admin">
            Вход
          </Link>
        </div>
      </nav>
    </header>
  );
}
