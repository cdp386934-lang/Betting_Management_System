import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string; betId: string }> }
) {
  const { userId, betId } = await params;
  const body = await req.json();
  const result = body?.result as string | undefined; // "WIN" | "LOSE"
  if (result !== "WIN" && result !== "LOSE") {
    return NextResponse.json(
      { error: "result 必须为 WIN 或 LOSE" },
      { status: 400 }
    );
  }
  const bet = await prisma.bet.findFirst({
    where: { id: betId, user_id: userId },
  });
  if (!bet) {
    return NextResponse.json({ error: "投注不存在" }, { status: 404 });
  }
  if (bet.status !== "PLACED") {
    return NextResponse.json({ error: "只能结算状态为 PLACED 的投注，不允许重复结算" }, { status: 400 });
  }
  const payoutAmount = result === "WIN" ? bet.amount * 2 : 0;
  await prisma.$transaction(async (tx) => {
    await tx.bet.update({
      where: { id: betId },
      data: {
        status: "SETTLED",
        result: result as "WIN" | "LOSE",
        payout_amount: payoutAmount,
      },
    });
    if (result === "WIN") {
      await tx.ledgerEntry.create({
        data: {
          user_id: userId,
          type: "BET_CREDIT",
          amount: payoutAmount,
        },
      });
    }
  });
  return NextResponse.json({ ok: true });
}
