import express from 'express';
import { habitRepository } from '../../repository/habit/habit.repository.js';

class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

const router = express.Router();

router.get('/:studyId/habits', async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const habits = await habitRepository.findByStudyId(studyId);

    res.status(200).json({
      success: true,
      message: '습관 목록을 가져오는데 성공했습니다.',
      data: habits,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:studyId/habits', async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '습관 내용을 입력해주세요.',
      });
    }

    const newHabit = await habitRepository.create(studyId, text);

    res.status(201).json({
      success: true,
      message: '습관을 추가했습니다.',
      data: newHabit,
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:studyId/habits/:habitId', async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '습관 내용을 입력해주세요.',
      });
    }

    const habit = await habitRepository.findById(habitId);
    if (!habit) {
      throw new NotFoundException('습관을 찾을 수 없습니다.');
    }

    const updatedHabit = await habitRepository.update(habitId, text);

    res.status(200).json({
      success: true,
      message: '습관을 수정했습니다.',
      data: updatedHabit,
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/:studyId/habits/:habitId/status', async (req, res, next) => {
  try {
    const { habitId } = req.params;

    const habit = await habitRepository.findById(habitId);
    if (!habit) {
      throw new NotFoundException('습관을 찾을 수 없습니다.');
    }

    const updatedHabit = await habitRepository.toggleStatus(habitId);

    res.status(200).json({
      success: true,
      message: '습관 상태를 변경했습니다.',
      data: updatedHabit,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/:studyId/habits/:habitId', async (req, res, next) => {
  try {
    const { habitId } = req.params;

    const habit = await habitRepository.findById(habitId);
    if (!habit) {
      throw new NotFoundException('습관을 찾을 수 없습니다.');
    }

    await habitRepository.delete(habitId);

    res.status(200).json({
      success: true,
      message: '습관을 삭제했습니다.',
    });
  } catch (err) {
    next(err);
  }
});

export default router;