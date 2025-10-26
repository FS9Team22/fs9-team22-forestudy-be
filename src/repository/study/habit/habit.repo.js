import { prisma } from '../../../db/prisma.js';

async function createHabitByStudyId(studyId, name) {
  return await prisma.habit.create({
    data: {
      studyId,
      name,
    },
  });
}

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

async function findHabitById(id) {
  return await prisma.habit.findUnique({
    where: { id: String(id) },
  });
}

async function updateHabitByHabitId(id, name) {
  return await prisma.habit.update({
    where: { id: String(id) },
    data: {
      name,
    },
  });
}

async function deleteHabitById(id) {
  return await prisma.habit.delete({
    where: { id: String(id) },
  });
}

export const habitRepo = {
  createHabitByStudyId,
  findHabitListByStudyId,
  replaceHabits,
  findHabitById,
  updateHabitByHabitId,
  deleteHabitById,
};
