import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBalance } from "@/lib/balance";

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { created_at: "asc" } });
  const withBalance = await Promise.all(
    users.map(async (u) => ({
      ...u,
      balance: await getBalance(u.id),
    }))
  );
  return NextResponse.json(withBalance);
}
