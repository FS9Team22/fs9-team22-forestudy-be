import express from 'express';
import * as reactionRepo from '../../../repository/study/reaction/reaction.repo.js';

const router = express.Router();

export async function addReaction(req, res) {
  try {
    const { studyId } = req.params;
    const { emoji } = req.body;

    const existing = await reactionRepo.findReaction(studyId, emoji);
    let reaction;

    if (existing) {
      reaction = await reactionRepo.updateReactionCount(
        existing.id,
        existing.count + 1,
      );
    } else {
      reaction = await reactionRepo.createReaction(studyId, emoji);
    }

    res.json(reaction);
  } catch (err) {
    console.error('❌ 리액션 추가 실패:', err);
    res.status(500).json({ error: '리액션 추가 실패' });
  }
}

export async function getReactions(req, res) {
  try {
    const { studyId } = req.params;
    const reactions = await reactionRepo.getReactionsByStudy(studyId);

    const counts = reactions.reduce((acc, r) => {
      acc[r.emoji] = r.count;
      return acc;
    }, {});

    res.json(counts);
  } catch (err) {
    console.error('❌ 리액션 조회 실패:', err);
    res.status(500).json({ error: '리액션 조회 실패' });
  }
}

router.post('/', addReaction);
router.get('/', getReactions);

export default router;
