import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <p className="site-footer-name">Яна Зубарева</p>
          <p className="site-footer-tag">Частная галерея</p>
        </div>
        <nav aria-label="Разделы сайта" className="site-footer-nav">
          <Link href="/">Главная</Link>
          <Link href="/gallery">Экспозиция</Link>
          <Link href="/about">Художник</Link>
          <Link href="/contact">Студия</Link>
        </nav>
        <div className="site-footer-contact">
          <a href="mailto:studio@yanazubareva.com">studio@yanazubareva.com</a>
          <span className="site-footer-contact-sep" aria-hidden="true">
            ·
          </span>
          <a className="site-footer-admin-link" href="/admin">
            Вход
          </a>
        </div>
      </div>
    </footer>
  );
}
