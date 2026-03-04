import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const body = await req.json();
  const amount = Number(body?.amount);
  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "amount 必须为正整数" },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }
  await prisma.ledgerEntry.create({
    data: { user_id: userId, type: "DEPOSIT", amount },
  });
  return NextResponse.json({ ok: true });
}
