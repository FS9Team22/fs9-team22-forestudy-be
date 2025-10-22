import { prisma } from '../../../db/prisma.js';

export const findReaction = (studyId, emoji) => {
  return prisma.reaction.findFirst({ where: { studyId, emoji } });
};

export const createReaction = (studyId, emoji) => {
  return prisma.reaction.create({ data: { studyId, emoji, count: 1 } });
};

export const updateReactionCount = (id, count) => {
  return prisma.reaction.update({ where: { id }, data: { count } });
};

export const getReactionsByStudy = (studyId) => {
  return prisma.reaction.findMany({ where: { studyId } });
};
