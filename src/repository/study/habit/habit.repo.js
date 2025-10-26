import { prisma } from '../../../db/prisma.js';

async function findHabitListByStudyId(studyId) {
  return await prisma.habit.findMany({
    where: { studyId: String(studyId) },
    orderBy: { createdAt: 'asc' },
  });
}

async function replaceHabits(studyId, habits) {
  return prisma.$transaction(async (tx) => {
    // habit deleteAll
    await tx.habit.deleteMany({ where: { studyId } });

    if (habits && habits.length > 0) {
      await tx.habit.createMany({
        data: habits.map((habit) => ({
          name: habit.name,
          studyId,
          //추후 isDone 플래그
        })),
      });
    }

    return tx.habit.findMany({ where: { studyId } });
  });
}

export const habitRepo = {
  findHabitListByStudyId,
  replaceHabits,
};
