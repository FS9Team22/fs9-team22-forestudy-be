import { prisma } from '../../db/prisma.js';

async function findStudyById(id) {
  return await prisma.study.findUnique({
    where: { id: String(id) },
    omit: {
      password: true,
    },
  });
}

export const studyRepo = {
  findStudyById,
};
