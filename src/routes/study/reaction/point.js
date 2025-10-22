import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateStudyPoints = async (req, res) => {
  const { studyId } = req.params;
  const { point } = req.body;

  if (!point) {
    return res
      .status(400)
      .json({ success: false, message: 'point 값이 필요합니다' });
  }

  try {
    // studyId로 스터디 조회
    const study = await prisma.study.findUnique({
      where: { id: studyId }, // Prisma에서 id 타입 확인 필요: string이면 그대로, number면 parseInt(studyId)
    });

    if (!study) {
      return res
        .status(404)
        .json({ success: false, message: '스터디를 찾을 수 없습니다' });
    }

    // 포인트 업데이트
    const updatedStudy = await prisma.study.update({
      where: { id: studyId },
      data: { point: (study.point || 0) + point },
    });

    res.json({
      success: true,
      message: '포인트 업데이트 완료',
      study: updatedStudy,
    });
  } catch (err) {
    console.error('포인트 저장 에러:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getStudy = async (req, res) => {
  const { studyId } = req.params;

  try {
    const study = await prisma.study.findUnique({
      where: { id: studyId },
    });

    if (!study) {
      return res
        .status(404)
        .json({ success: false, message: '스터디를 찾을 수 없습니다' });
    }

    res.json({
      id: study.id,
      title: study.title,
      points: study.point || 0,
    });
  } catch (err) {
    console.error('스터디 조회 에러:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
