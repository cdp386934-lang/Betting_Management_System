import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBalance } from "@/lib/balance";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bets = await prisma.bet.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json(bets);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const body = await req.json();
  const amount = Number(body?.amount);
  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "投注金额必须为正整数" },
      { status: 400 }
    );
  }
  const balance = await getBalance(userId);
  if (amount > balance) {
    return NextResponse.json(
      { error: "投注金额不能超过当前余额" },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }
  await prisma.$transaction([
    prisma.ledgerEntry.create({
      data: { user_id: userId, type: "BET_DEBIT", amount },
    }),
    prisma.bet.create({
      data: { user_id: userId, amount, status: "PLACED" },
    }),
  ]);
  return NextResponse.json({ ok: true });
}
