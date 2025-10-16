import { prisma } from '../../../db/prisma.js';

async function findHabitLogByHabitId(habitId) {
  return await prisma.habitLog.findMany({
    where: { habitId: String(habitId) },
  });
}

export const habitLogRepo = {
  findHabitLogByHabitId,
};
