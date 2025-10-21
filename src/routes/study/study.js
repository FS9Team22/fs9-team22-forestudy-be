import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../db/prisma.js';
import { config } from '../../config/config.js';
import { studyRepo } from '../../repository/study/study.repo.js';
import { NotFoundException } from '../../err/notFoundException.js';
import { UnauthorizedException } from '../../err/unauthorizedException.js';

const router = express.Router();

const PEPPER_SECRET = config.PEPPER_SECRET;
const HASHING_COUNT = config.HASHING_COUNT;

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
    const hashedPassword = await bcrypt.hash(passwordWithPepper, HASHING_COUNT);
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

router.post('/:id/login', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const study = await studyRepo.findStudyById(id);
    if (!study) {
      throw new NotFoundException('존재하지 않는 스터디입니다.');
    }

    const passwordPeppering = password + PEPPER_SECRET;
    const passwordHashing = await bcrypt.hash(passwordPeppering, HASHING_COUNT);
    const isPasswordVaild = await bcrypt.compare(
      passwordHashing,
      study.password,
    );

    if (!isPasswordVaild) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    if (!req.session.authStudy) req.session.authStudy = [];
    if (!req.session.authStudy.includes(id)) req.session.authStudy.push(id);

    res.json({ message: '인증되었습니다.' });
  } catch (err) {
    next(err);
    return;
  }
});

router.post('/:id.logout', async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.clearCookie('connect.sid');
    res.status(200).json({ message: '로그아웃 성공' });
  } catch (err) {
    next(err);
    return;
  }
});

export default router;
