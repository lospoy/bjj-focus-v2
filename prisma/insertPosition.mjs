import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "user_2ZJt1UqPejZ25fbtA3mLDvjv8zK";

  await prisma.jit.create({
    data: {
      userId: userId,
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
