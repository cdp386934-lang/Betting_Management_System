import { NextResponse } from "next/server";
import { getBalance } from "@/lib/balance";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const balance = await getBalance(userId);
  return NextResponse.json({ balance });
}
