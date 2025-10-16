import { PrismaClient } from '@prisma/client';
import express from 'express';
//import { studyRepo } from '../repository/study/study.repo.js';
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const {
      orderBy,
      keyword,
      page: pageStr = 1,
      limit: limitStr = 6,
    } = req.query;

    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const total = await prisma.study.count();
    const totalPages = Math.ceil(total / limit);

    const SORT_MAPING = {
      latest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
      mostPoint: { point: 'desc' },
      fewerPoint: { point: 'asc' },
    };

    const sortOpt = SORT_MAPING[orderBy];

    const studies = await prisma.study.findMany({
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
    res.status(200).json({
      success: true,
      message: '스터디 항목을 가져오는데 성공했습니다.',
      data: studies,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
    return;
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { nickname, title, description, background, password } = req.body;

    /** password! */
    const newStudy = await prisma.study.create({
      data: {
        nickname,
        title,
        description,
        background,
        password,
        point: 0,
      },
    });

    res.status(201).json({
      success: true,
      message: '스터디를 만들었습니다',
      data: newStudy,
    });
  } catch (err) {
    next(err);
    return;
  }
});

export default router;
