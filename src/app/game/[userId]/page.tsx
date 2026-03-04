"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Bet = {
  id: string;
  amount: number;
  status: string;
  result: string | null;
  payout_amount: number;
  created_at: string;
};

export default function GamePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [balance, setBalance] = useState<number | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betAmount, setBetAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  const refresh = () =>
    Promise.all([
      fetch(`/api/users/${userId}/balance`).then((r) => r.json()),
      fetch(`/api/users/${userId}/bets`).then((r) => r.json()),
    ]).then(([balanceRes, betsRes]) => {
      setBalance(balanceRes.balance);
      setBets(betsRes);
    });

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [userId]);

  const placeBet = async () => {
    const amount = parseInt(betAmount, 10);
    if (!Number.isInteger(amount) || amount <= 0) {
      alert("请输入正整数金额");
      return;
    }
    const res = await fetch(`/api/users/${userId}/bets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "下单失败");
      return;
    }
    setBetAmount("");
    refresh();
  };

  const settle = async (betId: string, result: "WIN" | "LOSE") => {
    setSettlingId(betId);
    const res = await fetch(`/api/users/${userId}/bets/${betId}/settle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "结算失败");
    } else {
      refresh();
    }
    setSettlingId(null);
  };

  if (loading) return <main className="max-w-2xl mx-auto p-6">加载中...</main>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <p className="mb-4">
        <Link href="/users" className="text-blue-600 hover:underline">
          ← 返回用户列表
        </Link>
      </p>
      <h1 className="text-2xl font-bold mb-6">游戏页面</h1>
      <p className="text-lg mb-6">当前余额: <strong>{balance}</strong></p>

      <section className="mb-8 p-4 bg-white border rounded-lg">
        <h2 className="font-semibold mb-3">下单</h2>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="1"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="投注金额"
            className="border rounded px-3 py-2 w-32"
          />
          <button
            type="button"
            onClick={placeBet}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            下单
          </button>
        </div>
      </section>

      <section className="p-4 bg-white border rounded-lg">
        <h2 className="font-semibold mb-3">历史投注</h2>
        {bets.length === 0 ? (
          <p className="text-slate-500">暂无投注记录</p>
        ) : (
          <ul className="space-y-2">
            {bets.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-2 text-sm border-b pb-2"
              >
                <span>金额: {b.amount}</span>
                <span>状态: {b.status}</span>
                {b.result != null && <span>结果: {b.result}</span>}
                {b.payout_amount > 0 && (
                  <span>赔付: {b.payout_amount}</span>
                )}
                {b.status === "PLACED" && (
                  <>
                    <button
                      type="button"
                      disabled={settlingId === b.id}
                      onClick={() => settle(b.id, "WIN")}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      结算-赢
                    </button>
                    <button
                      type="button"
                      disabled={settlingId === b.id}
                      onClick={() => settle(b.id, "LOSE")}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                    >
                      结算-输
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
