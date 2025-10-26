import { prisma } from '../../../db/prisma.js';

async function findHabitLogListByHabitId(habitId) {
  return await prisma.habitLog.findMany({
    where: { habitId: String(habitId) },
  });
}

async function findHabitCurrentWeekLogListByHabitId(habitId) {
  function getCurrentWeekRange() {
    const today = new Date(); // 오늘 날짜
    const day = today.getDay(); // 일(0) ~ 토(6)

    const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const format = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
      start: format(monday),
      end: format(sunday),
    };
  }

  const weekdays = getCurrentWeekRange();
  console.log(weekdays);

  return await prisma.habitLog.findMany({
    where: {
      habitId: String(habitId),
      loggingDate: {
        gte: new Date(weekdays.start), // 주 시작일 포함
        lte: new Date(weekdays.end), // 주 종료일 포함
      },
    },
    orderBy: {
      loggingDate: 'asc',
    },
  });
}

async function findHabitCurrentDayLogByHabitId(habitId) {
  const today = new Date();
  return await prisma.habitLog.findUnique({
    where: {
      habitId: String(habitId),
      loggingDate: today,
    },
    orderBy: {
      loggingDate: 'asc',
    },
  });
}

async function createHabitLogByHabitId(habitId) {
  return await prisma.habitLog.create({
    data: {
      habitId: habitId,
    },
  });
}

async function deleteHabitLogById(id) {
  return await prisma.habitLog.delete({
    where: {
      id: String(id),
    },
  });
}

export const habitLogRepo = {
  findHabitLogListByHabitId,
  findHabitCurrentWeekLogListByHabitId,
  findHabitCurrentDayLogByHabitId,
  createHabitLogByHabitId,
  deleteHabitLogById,
};
