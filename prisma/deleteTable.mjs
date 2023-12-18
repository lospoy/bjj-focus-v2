// Deletes all entries in a specific table
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();

  try {
    // Use Prisma to delete all records from the Session table
    // modify to delete other tables
    await prisma.jit.deleteMany({});

    console.log("All data from the Session table has been deleted.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

await main();
