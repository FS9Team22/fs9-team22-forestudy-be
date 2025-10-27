import express from 'express';
import { habitLogRepo } from '../../../repository/study/habit/habitLog.repo.js';
import { habitRepo } from '../../../repository/study/habit/habit.repo.js';
import { NotFoundException } from '../../../err/notFoundException.js';
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res, next) => {
  try {
    const habitId = req.params.habitId;
    console.log(habitId);
    const habitLogs = await habitLogRepo.findHabitLogListByHabitId(habitId);
    if (!habitLogs) {
      throw new NotFoundException('존재하지 않는 습관 내역입니다.');
    }
    res.json({ success: true, data: habitLogs });
  } catch (err) {
    next(err);
  }
});

router.get('/week', async (req, res, next) => {
  try {
    const habitId = req.params.habitId;
    console.log(habitId);
    const habitLogs =
      await habitLogRepo.findHabitCurrentWeekLogListByHabitId(habitId);
    if (!habitLogs) {
      throw new NotFoundException('존재하지 않는 습관 내역입니다.');
    }
    res.json({ success: true, data: habitLogs });
  } catch (err) {
    next(err);
  }
});

router.get('/day', async (req, res, next) => {
  try {
    const habitId = req.params.habitId;
    console.log(habitId);
    const habitLogs =
      await habitLogRepo.findHabitCurrentdayLogByHabitId(habitId);
    if (!habitLogs) {
      throw new NotFoundException('존재하지 않는 습관 내역입니다.');
    }
    res.json({ success: true, data: habitLogs });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const habitId = req.params.habitId;
    const habitExistance = await habitRepo.findHabitById(habitId);
    if (!habitExistance) {
      throw new NotFoundException('존재하지 않는 습관입니다.');
    }
    const newHabitLog = await habitLogRepo.createHabitLogByHabitId(habitId);
    res.json({ success: true, data: newHabitLog });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const habitLogId = req.params.id;
    const deleteHabitLog = habitLogRepo.deleteHabitLogById(habitLogId);
    res.json({ success: true, data: deleteHabitLog });
  } catch (err) {
    next(err);
  }
});

export default router;
