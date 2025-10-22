import express from 'express';
import * as reactionRepo from '../../../repository/study/reaction/reaction.repo.js';

const router = express.Router();

export async function addReaction(req, res) {
  try {
    const { studyId } = req.params;
    const { emoji } = req.body;
    const reaction = await reactionRepo.addOrUpdateReaction(studyId, emoji);
    res.json(reaction);
  } catch (err) {
    console.error('❌ 리액션 추가 실패:', err);
    res.status(500).json({ error: '리액션 추가 실패' });
  }
}

export async function getReactions(req, res) {
  try {
    const { studyId } = req.params;
    const counts = await reactionRepo.getReactionsCount(studyId);
    res.json(counts);
  } catch (err) {
    console.error('❌ 리액션 조회 실패:', err);
    res.status(500).json({ error: '리액션 조회 실패' });
  }
}

router.post('/', addReaction);
router.get('/', getReactions);

export default router;
