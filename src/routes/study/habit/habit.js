import express from 'express';
import { habitRepo } from '../../../repository/study/habit/habit.repo.js';
import { NotFoundException } from '../../../err/notFoundException.js';
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    const studyId = req.params.studyId;
    console.log(studyId);
    const habits = await habitRepo.findHabitListByStudyId(studyId);
    if (!habits) {
      throw new NotFoundException('존재하지 않는 스터디의 습관입니다.');
    }
    res.json({ success: true, data: habits });
  } catch (err) {
    next(err);
  }
});

export default router;
