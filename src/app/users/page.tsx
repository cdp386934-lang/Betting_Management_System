"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserWithBalance = {
  id: string;
  email: string;
  display_name: string;
  balance: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositUserId, setDepositUserId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const doDeposit = async (userId: string) => {
    const amount = parseInt(depositAmount, 10);
    if (!Number.isInteger(amount) || amount <= 0) {
      alert("请输入正整数金额");
      return;
    }
    const res = await fetch(`/api/users/${userId}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "充值失败");
      return;
    }
    setDepositUserId(null);
    setDepositAmount("");
    const list = await fetch("/api/users").then((r) => r.json());
    setUsers(list);
  };

  if (loading) return <main className="max-w-2xl mx-auto p-6">加载中...</main>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">用户列表</h1>
      <ul className="space-y-3">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg"
          >
            <span className="font-medium">{u.display_name}</span>
            <span className="text-slate-500 text-sm">{u.email}</span>
            <span className="text-slate-700">余额: {u.balance}</span>
            <Link
              href={`/game/${u.id}`}
              className="text-blue-600 hover:underline"
            >
              进入游戏
            </Link>
            <button
              type="button"
              onClick={() =>
                setDepositUserId(depositUserId === u.id ? null : u.id)
              }
              className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
            >
              充值
            </button>
            {depositUserId === u.id && (
              <span className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="金额"
                  className="border rounded px-2 py-1 w-24"
                />
                <button
                  type="button"
                  onClick={() => doDeposit(u.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  确认
                </button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
