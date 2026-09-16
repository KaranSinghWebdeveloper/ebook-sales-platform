import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.product.findFirst({ orderBy: { createdAt: 'desc' } })
  .then(p => { console.log(JSON.stringify(p, null, 2)); })
  .finally(() => prisma.$disconnect());
