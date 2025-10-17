import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../db/prisma.js';
import { config } from '../../config/config.js';
import { studyRepo } from '../../repository/study/study.repo.js';
import { NotFoundException } from '../../err/notFoundException.js';

const router = express.Router();

const PEPPER_SECRET = config.PEPPER_SECRET;

if (!PEPPER_SECRET) {
  console.err('PEPPER가 정의되지않았습니다.');
  process.exit(1);
}

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

    const studies = await studyRepo.findStudies(sortOpt, keyword, page, limit);

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

    const passwordWithPepper = password + PEPPER_SECRET;
    const hashedPassword = await bcrypt.hash(passwordWithPepper, 10);
    /** password! */
    const newStudy = await studyRepo.createStudy(
      nickname,
      title,
      description,
      background,
      hashedPassword,
    );

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

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const study = await studyRepo.findStudyById(id);
    if (!study) {
      throw new NotFoundException('존재하지 않는 스터디입니다.');
    }
    res.json({ success: true, data: study });
  } catch (err) {
    next(err);
  }
});

export default router;
