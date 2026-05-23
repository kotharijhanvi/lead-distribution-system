import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.service.createMany({
    data: [
      { id: 1, name: "Service 1" },
      { id: 2, name: "Service 2" },
      { id: 3, name: "Service 3" },
    ],
    skipDuplicates: true,
  });

  await prisma.provider.createMany({
    data: [
      { id: 1, name: "Provider 1" },
      { id: 2, name: "Provider 2" },
      { id: 3, name: "Provider 3" },
      { id: 4, name: "Provider 4" },
      { id: 5, name: "Provider 5" },
      { id: 6, name: "Provider 6" },
      { id: 7, name: "Provider 7" },
      { id: 8, name: "Provider 8" },
    ],
    skipDuplicates: true,
  });

  await prisma.allocationState.createMany({
    data: [
      { serviceId: 1, lastProviderIndex: 0 },
      { serviceId: 2, lastProviderIndex: 0 },
      { serviceId: 3, lastProviderIndex: 0 },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });