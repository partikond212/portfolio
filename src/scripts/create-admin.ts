import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../../src/shared/lib/prisma";

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    throw new Error("Использование: npx tsx scripts/create-admin.ts <email> <пароль>");
  }

  const hash = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.create({
      data: { email, password: hash }
  });
  console.log("Создан админ:", admin.id, admin.email);
}

main().finally(() => prisma.$disconnect());
