import { prisma } from '../../../db/prisma.js';

export const findStudyById = (studyId) => {
  return prisma.study.findUnique({ where: { id: studyId } });
};

export const updateStudyPoints = (studyId, point) => {
  return prisma.study.update({
    where: { id: studyId },
    data: { point },
  });
};
