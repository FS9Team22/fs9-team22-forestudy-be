import express from 'express';
import { habitLogRepo } from '../../../repository/study/habit/habitLog.repo.js';
import { NotFoundException } from '../../../err/notFoundException.js';
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    const habitId = req.params.habitId;
    console.log(habitId);
    const habits = await habitLogRepo.findHabitLogByHabitId(habitId);
    if (!habits) {
      throw new NotFoundException('존재하지 않는 습관 내역입니다.');
    }
    res.json({ success: true, data: habits });
  } catch (err) {
    next(err);
  }
});

export default router;
