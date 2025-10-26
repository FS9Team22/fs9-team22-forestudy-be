import express from 'express';
import { habitRepo } from '../../../repository/study/habit/habit.repo.js';
import { NotFoundException } from '../../../err/notFoundException.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const habits = await habitRepo.findHabitListByStudyId(studyId);
    if (!habits) {
      throw new NotFoundException('존재하지 않는 스터디의 습관입니다.');
    }
    res.json({ success: true, data: habits });
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  const studyId = req.params.studyId;
  const { habits } = req.body;

  if (!studyId) {
    throw new NotFoundException('존재하지 않는 스터디의 아이디입니다.');
  }
  if (!habits) {
    throw new NotFoundException('존재하지 않는 스터디의 습관입니다.');
  }

  try {
    const updated = await habitRepo.replaceHabits(studyId, habits);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
