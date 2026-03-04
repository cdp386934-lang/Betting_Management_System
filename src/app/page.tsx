import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">基础投注系统</h1>
      <nav className="space-y-2">
        <Link
          href="/users"
          className="block p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300"
        >
          用户列表（查看余额、充值）
        </Link>
      </nav>
    </main>
  );
}
