import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USERS = [
  { email: "user1@example.com", display_name: "用户一" },
  { email: "user2@example.com", display_name: "用户二" },
  { email: "user3@example.com", display_name: "用户三" },
  { email: "user4@example.com", display_name: "用户四" },
  { email: "user5@example.com", display_name: "用户五" },
  { email: "user6@example.com", display_name: "用户六" },
  { email: "user7@example.com", display_name: "用户七" },
  { email: "user8@example.com", display_name: "用户八" },
  { email: "user9@example.com", display_name: "用户九" },
  { email: "user10@example.com", display_name: "用户十" },
];

async function main() {
  for (const u of USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
  console.log("Seeded 10 users.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
