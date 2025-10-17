import { prisma } from '../../../db/prisma.js';

async function findHabitListByStudyId(studyId) {
  return await prisma.habit.findMany({
    where: { studyId: String(studyId) },
    orderBy: { createdAt: 'asc' },
  });
}

export const habitRepo = {
  findHabitListByStudyId,
};
