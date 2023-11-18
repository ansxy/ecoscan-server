import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  const objectNames = [
    "Hair Dryer",
    "Refrigerator",
    "Oven",
    "Rice Cooker",
    "Washing Machine",
    "Television",
    "Iron",
    "Laptop",
    "Vacuum Cleaner",
    "Air Conditioner",
    "Lamp"
  ];

  const userIds = [1, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < 50; i++) {
    const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
    const randomObjectName = objectNames[Math.floor(Math.random() * objectNames.length)];

    await prisma.item.create({
      data: {
        userId: randomUserId,
        objectName: randomObjectName
      }
    });
  }
}

async function main() {
  try {
    await seedDatabase();
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
