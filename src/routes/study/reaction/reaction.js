import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// ✅ 리액션 추가 함수
export async function addReaction(req, res) {
  try {
    const { studyId } = req.params;
    const { emoji } = req.body;

    // 기존 리액션 찾기
    const existing = await prisma.reaction.findFirst({
      where: { studyId, emoji },
    });

    let reaction;

    if (existing) {
      reaction = await prisma.reaction.update({
        where: { id: existing.id },
        data: { count: existing.count + 1 },
      });
    } else {
      reaction = await prisma.reaction.create({
        data: { studyId, emoji, count: 1 },
      });
    }

    res.json(reaction);
  } catch (err) {
    console.error('❌ 리액션 추가 실패:', err);
    res.status(500).json({ error: '리액션 추가 실패' });
  }
}

// ✅ 리액션 조회 함수
export async function getReactions(req, res) {
  try {
    const { studyId } = req.params;

    const reactions = await prisma.reaction.findMany({
      where: { studyId },
    });

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

// ✅ 라우터 연결
router.post('/', addReaction);
router.get('/', getReactions);

export default router;
