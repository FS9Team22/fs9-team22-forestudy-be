import express from 'express';
import { studyRepo } from '../../repository/study/study.repo.js';
import { NotFoundException } from '../../err/notFoundException.js';
const router = express.Router();

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
