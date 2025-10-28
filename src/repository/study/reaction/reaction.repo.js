import { prisma } from '../../../db/prisma.js';

export const addOrUpdateReaction = async (studyId, emoji) => {
  const existing = await prisma.reaction.findFirst({
    where: { studyId, emoji },
  });

  if (existing) {
    return prisma.reaction.update({
      where: { id: existing.id },
      data: { count: existing.count + 1 },
    });
  } else {
    return prisma.reaction.create({
      data: { studyId, emoji, count: 1 },
    });
  }
};

export const getReactionsCount = async (studyId) => {
  const reactions = await prisma.reaction.findMany({ where: { studyId } });
  return reactions.reduce((acc, r) => {
    acc[r.emoji] = r.count;
    return acc;
  }, {});
};
