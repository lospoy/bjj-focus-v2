import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const positionId = "clpn9s24s0000bhqwnw7wg73v";
  const userId = "user_2YoT0Wf9yUOQ39GzIgksy020oVR";

  await prisma.jit.create({
    data: {
      userId: userId,
      positionId: positionId,
    },
  });
}

console.log("Dummy Jits inserted successfully!");

main()
  .catch((e) => {
    throw e;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
