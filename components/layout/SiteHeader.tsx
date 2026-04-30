import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link className="site-brand" href="/">
          Яна Зубарева
        </Link>
        <div className="site-nav-links">
          <Link href="/">Главная</Link>
          <Link href="/gallery">Галерея</Link>
          <Link href="/about">Обо мне</Link>
          <Link href="/contact">Контакты</Link>
          <Link className="site-nav-admin-link" href="/admin/login">
            Вход в кабинет
          </Link>
        </div>
      </nav>
    </header>
  );
}
