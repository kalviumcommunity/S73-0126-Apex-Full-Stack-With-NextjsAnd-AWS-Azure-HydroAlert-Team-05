import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const aluva = await prisma.district.upsert({
    where: { name: "Aluva" },
    update: {},
    create: {
      name: "Aluva",
      latitude: 10.1076,
      longitude: 76.3516,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@hydroalert.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@hydroalert.com",
      role: "ADMIN",
    },
  });

  await prisma.weatherReading.create({
    data: {
      rainfallMm: 120,
      waterLevel: 6.4,
      districtId: aluva.id,
    },
  });

  await prisma.floodRisk.create({
    data: {
      level: "HIGH",
      districtId: aluva.id,
    },
  });

  console.log("Seed data inserted successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
