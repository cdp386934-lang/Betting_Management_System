import { prisma } from "./prisma";

/**
 * 余额 = 所有 DEPOSIT + BET_CREDIT - 所有 BET_DEBIT
 */
export async function getBalance(userId: string): Promise<number> {
  const entries = await prisma.ledgerEntry.findMany({
    where: { user_id: userId },
  });
  let balance = 0;
  for (const e of entries) {
    if (e.type === "DEPOSIT" || e.type === "BET_CREDIT") balance += e.amount;
    else if (e.type === "BET_DEBIT") balance -= e.amount;
  }
  return balance;
}
