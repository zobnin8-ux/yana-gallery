import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <div className="admin-header-copy">
          <p className="admin-eyebrow">Админка</p>
          <h1 className="admin-title">Управление работами</h1>
          <p className="admin-subtitle">Спокойное рабочее пространство для обновления галереи.</p>
        </div>
        <Link className="admin-back-link" href="/">
          Вернуться на сайт
        </Link>
      </div>
    </header>
  );
}
