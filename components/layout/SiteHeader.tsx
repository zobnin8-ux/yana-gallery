import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link className="site-brand" href="/">
          Яна Зубарева
        </Link>
        <div className="site-nav-links">
          <Link href="/gallery">Работы</Link>
          <Link href="/about">Художник</Link>
          <Link href="/contact">Студия</Link>
        </div>
      </nav>
    </header>
  );
}
