import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../db/prisma.js';
import { config } from '../../config/config.js';
import { studyRepo } from '../../repository/study/study.repo.js';
import { NotFoundException } from '../../err/notFoundException.js';
import { UnauthorizedException } from '../../err/unauthorizedException.js';
import { validate } from '../../middlewares/validate.js';
import { createStudyValidation } from '../../validations/study.validation.js';
import { updateStudyPoints } from './point.js';

const router = express.Router();

const PEPPER_SECRET = config.PEPPER_SECRET;
const HASHING_COUNT = config.HASHING_COUNT;

if (!PEPPER_SECRET) {
  console.error('PEPPER가 정의되지않았습니다.');
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

    const page = Number.isNaN(parseInt(pageStr)) ? 1 : parseInt(pageStr);
    const limit = Number.isNaN(parseInt(limitStr)) ? 6 : parseInt(limitStr);
    const total = await prisma.study.count();
    const totalPages = Math.ceil(total / limit);

    const SORT_MAPPING = {
      latest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
      mostPoint: { point: 'desc' },
      fewerPoint: { point: 'asc' },
    };

    const sortOpt = SORT_MAPPING[orderBy] || { createdAt: 'desc' };

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
  }
});

router.post(
  '/',
  validate(createStudyValidation, 'body'),
  async (req, res, next) => {
    try {
      const { nickname, title, description, background, password } = req.body;

      const passwordWithPepper = password + PEPPER_SECRET;
      const hashedPassword = await bcrypt.hash(
        passwordWithPepper,
        HASHING_COUNT,
      );
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
    }
  },
);

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

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      // 401 Unauthorized 또는 400 Bad Request를 사용할 수 있습니다.
      // 비밀번호가 없다는 것은 인증 시도가 실패한 것으로 볼 수 있습니다.
      throw new UnauthorizedException('비밀번호를 입력해주세요.');
    }

    const study = await studyRepo.findStudyByIdWithPassword(id);
    if (!study) {
      throw new NotFoundException('존재하지 않는 스터디입니다.');
    }

    const passwordWithPepper = password + PEPPER_SECRET;
    const isPasswordValid = await bcrypt.compare(
      passwordWithPepper,
      study.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    const deletedStudy = await studyRepo.deleteStudyById(id);
    res.json({
      success: true,
      message: '스터디가 삭제되었습니다.',
      data: { id: deletedStudy.id },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/login', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const study = await studyRepo.findStudyByIdWithPassword(id); // 비밀번호를 포함하여 스터디 정보를 가져옵니다.
    if (!study) {
      throw new NotFoundException('존재하지 않는 스터디입니다.');
    }

    const passwordPeppering = password + PEPPER_SECRET;
    const isPasswordValid = await bcrypt.compare(
      passwordPeppering,
      study.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    req.session.authStudy = req.session.authStudy || [];
    if (!req.session.authStudy.includes(id)) {
      req.session.authStudy.push(id);
    }

    req.session.save(() =>
      res.json({
        message: '인증되었습니다.',
        authStudy: req.session.authStudy,
      }),
    );
    console.log(res);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/logout', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.session.authStudy) {
      // authStudy 배열에서 해당 study id를 제거합니다.
      req.session.authStudy = req.session.authStudy.filter(
        (studyId) => studyId !== id,
      );
    }

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (err) {
    next(err);
  }
});

// Point 관련 라우터
router.post('/:studyId/point', updateStudyPoints);

export default router;
