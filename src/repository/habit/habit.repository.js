import { prisma } from '../../db/prisma.js';

export const habitRepository = {
  async findByStudyId(studyId) {
    return await prisma.habit.findMany({
      where: { studyId: parseInt(studyId) },
      orderBy: { createdAt: 'asc' },
    });
  },

  async create(studyId, text) {
    return await prisma.habit.create({
      data: {
        studyId: parseInt(studyId),
        text,
        isDone: false,
      },
    });
  },

  async update(habitId, text) {
    return await prisma.habit.update({
      where: { id: parseInt(habitId) },
      data: { text },
    });
  },

  async toggleStatus(habitId) {
    const habit = await prisma.habit.findUnique({
      where: { id: parseInt(habitId) },
    });

    if (!habit) return null;

    return await prisma.habit.update({
      where: { id: parseInt(habitId) },
      data: { isDone: !habit.isDone },
    });
  },

  async delete(habitId) {
    return await prisma.habit.delete({
      where: { id: parseInt(habitId) },
    });
  },

  async findById(habitId) {
    return await prisma.habit.findUnique({
      where: { id: parseInt(habitId) },
    });
  },
};