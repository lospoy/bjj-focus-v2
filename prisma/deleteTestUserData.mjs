// Deletes all entries in a specific table
import { PrismaClient } from "@prisma/client";

const testUser = process.env.TEST_USER;

async function main() {
  const prisma = new PrismaClient();

  try {
    // Fetch all jitIds associated with the testUser
    const jits = await prisma.jit.findMany({
      where: { userId: testUser },
      select: { id: true },
    });
    const jitIds = jits.map((jit) => jit.id);

    // Use Prisma to delete all records related to testUser from all tables except for the User table
    // Modify to match your actual database schema
    await prisma.session.deleteMany({
      where: { jitId: { in: jitIds } },
    });

    await prisma.note.deleteMany({
      where: { jitId: { in: jitIds } },
    });

    await prisma.jit.deleteMany({
      where: { userId: testUser },
    });

    console.log("All data related to TEST_USER has been deleted.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

await main();
