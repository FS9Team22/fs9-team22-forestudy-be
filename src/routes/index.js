import express from 'express';
import studyRouter from './study/study.js';
import reactionRouter from './study/reaction/reaction.js';
import habitRouter from './study/habit/habit.js';
import habitLogRouter from './study/habit/habitLog.js';
export const router = express.Router();

// 기본 라우트
router.get('/', (req, res) => {
  res.json({
    message: 'Hello Express!',
    timestamp: new Date().toISOString(),
  });
});

router.use('/study', studyRouter);
router.use('/study/:studyId/reaction', reactionRouter);
router.use('/study/:studyId/habit', habitRouter);
router.use('/habit/:habitId/log', habitLogRouter);

export default router;
