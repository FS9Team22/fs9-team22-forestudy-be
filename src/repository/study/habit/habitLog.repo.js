import { prisma } from '../../../db/prisma.js';

async function findHabitLogListByHabitId(habitId) {
  return await prisma.habitLog.findMany({
    where: { habitId: String(habitId) },
  });
}

export const habitLogRepo = {
  findHabitLogListByHabitId,
};
