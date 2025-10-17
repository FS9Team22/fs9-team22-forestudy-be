import { prisma } from '../../db/prisma.js';

async function findStudyById(id) {
  return await prisma.study.findUnique({ where: { id: String(id) } });
}

export const studyRepo = {
  findStudyById,
};
