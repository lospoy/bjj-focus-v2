import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const positionId = "clpn9s24s0000bhqwnw7wg73v";

  for (let i = 700; i < 900; i++) {
    const randomName = `Jit ${i + 1}`;

    await prisma.jit.create({
      data: {
        uniqueNumber: i + 1,
        name: randomName,
        category: "TAKEDOWN",
        percentage: "LOW", // Set 'LOW' for all dummy Jits
        positionId: positionId,
      },
    });
  }

  console.log("Dummy Jits inserted successfully!");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
