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
  return await prisma.$transaction(async (tx) => {
    const existingHabits = await tx.habit.findMany({
      where: { studyId },
      select: { id: true, name: true },
    });

    const existingHabitNames = new Set(existingHabits.map((h) => h.name));
    const incomingHabitNames = new Set(habits.map((h) => h.name));

    const habitsToDelete = existingHabits.filter(
      (h) => !incomingHabitNames.has(h.name),
    );
    const habitsToCreate = habits.filter(
      (h) => !existingHabitNames.has(h.name),
    );

    if (habitsToDelete.length > 0) {
      await tx.habit.deleteMany({
        where: { id: { in: habitsToDelete.map((h) => h.id) } },
      });
    }

    if (habitsToCreate.length > 0) {
      await tx.habit.createMany({
        data: habitsToCreate.map((h) => ({ name: h.name, studyId })),
      });
    }

    return await tx.habit.findMany({
      where: { studyId },
      orderBy: { createdAt: 'asc' },
    });
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
