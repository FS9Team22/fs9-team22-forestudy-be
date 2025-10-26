import express from 'express';
import { habitRepo } from '../../../repository/study/habit/habit.repo.js';
import { NotFoundException } from '../../../err/notFoundException.js';
import { validate } from '../../../middlewares/validate.js';
import { createHabitValidation } from '../../../validations/habit.validation.js';
import { studyRepo } from '../../../repository/study/study.repo.js';
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

router.post(
  '/',
  validate(createHabitValidation, 'body'),
  async (req, res, next) => {
    try {
      const studyId = req.params.studyId;
      const study = await studyRepo.findStudyById(studyId);
      if (!study) {
        throw new NotFoundException('존재하지 않는 스터디입니다.');
      }
      const habitName = req.body.name;
      const newHabit = await habitRepo.createHabitByStudyId(studyId, habitName);
      res.status(201).json({ success: true, data: newHabit });
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  '/:id',
  validate(createHabitValidation, 'body'),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const originHabit = await habitRepo.findHabitById(id);
      if (!originHabit) {
        throw new NotFoundException('존재하지 않는 습관입니다.');
      }
      const habitName = req.body.name;
      const updateHabit = await habitRepo.updateHabitByHabitId(id, habitName);
      res.json({ success: true, data: updateHabit });
    } catch (err) {
      next(err);
    }
  },
);

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const originHabit = await habitRepo.findHabitById(id);
    if (!originHabit) {
      throw new NotFoundException('존재하지 않는 습관입니다.');
    }
    const deleteHabit = await habitRepo.deleteHabitById(id);
    res.json({ success: true, data: deleteHabit });
  } catch (err) {
    next(err);
  }
});

export default router;
