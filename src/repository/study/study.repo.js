import { prisma } from '../../db/prisma.js';

async function createStudy(nickname, title, description, background, password) {
  await prisma.study.create({
    data: {
      nickname,
      title,
      description,
      background,
      password,
      point: 0,
    },
  });
}

async function findStudies(sortOpt, keyword, page, limit) {
  return await prisma.study.findMany({
    where: {
      OR: [
        { nickname: { contains: keyword, mode: 'insensitive' } },
        { title: { contains: keyword, mode: 'insensitive' } },
      ],
    },
    orderBy: sortOpt,
    skip: limit * (page - 1),
    take: limit,
  });
}

async function findStudyById(id) {
  return await prisma.study.findUnique({
    where: { id: String(id) },
    omit: {
      password: true,
    },
  });
}

async function findStudyByIdWithPassword(id) {
  return await prisma.study.findUnique({
    where: { id: String(id) },
  });
}

async function deleteStudyById(id) {
  return await prisma.study.delete({
    where: { id: String(id) },
  });
}

export const studyRepo = {
  createStudy,
  findStudies,
  findStudyById,
  findStudyByIdWithPassword,
  deleteStudyById,
};
