import Link from "next/link";

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <nav className="admin-sidebar-nav">
        <Link href="/admin">Обзор</Link>
        <Link href="/admin/artworks">Работы</Link>
        <Link href="/admin/collections">Коллекции</Link>
        <Link href="/admin/about">Страница «Художник»</Link>
        <Link href="/admin/orders">Заказы</Link>
        <Link href="/admin/inquiries">Заявки</Link>
        <Link href="/admin/artworks/new">Добавить работу</Link>
        <Link className="admin-sidebar-back" href="/">
          Назад на сайт
        </Link>
      </nav>
    </aside>
  );
}
