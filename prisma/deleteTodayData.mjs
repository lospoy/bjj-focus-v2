// Deletes all files created in the last 3 hours in a specific db model
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDataSavedInLast3Hours() {
  try {
    // Calculate the time 3 hours ago
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

    // Use Prisma Client to find and delete records created in the last 3 hours
    const deletedRecords = await prisma.session.deleteMany({
      where: {
        createdAt: {
          gte: threeHoursAgo,
        },
      },
    });

    console.log(
      `Deleted ${deletedRecords.count} records created in the last 3 hours.`,
    );
  } catch (error) {
    console.error("Error clearing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

await clearDataSavedInLast3Hours();
