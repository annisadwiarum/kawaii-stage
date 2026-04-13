import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Next.js development mode hot-reloading workaround
let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  // SQLite adapter initialization for Prisma 7
  const dbFile = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace("file:./", "") : "kawaiidev.db";
  const adapter = new PrismaBetterSqlite3({ url: dbFile });
  
  prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };
