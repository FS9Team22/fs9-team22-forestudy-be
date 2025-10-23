import * as pointRepo from '../../../repository/study/point/point.repo.js';
import { BadRequestException } from '../../../err/badRequestException.js';
import { NotFoundException } from '../../../err/notFoundException.js';

// ✅ 스터디 포인트 업데이트
export const updateStudyPoints = async (req, res) => {
  const { studyId } = req.params;
  const { point } = req.body;

  if (!point) {
    return res
      .status(400)
      .json({ success: false, message: new BadRequestException().message });
  }

  try {
    const study = await pointRepo.findStudyById(studyId);

    if (!study) {
      return res
        .status(404)
        .json({ success: false, message: new NotFoundException().message });
    }

    const updatedStudy = await pointRepo.updateStudyPoints(
      studyId,
      (study.point || 0) + point,
    );

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

// ✅ 스터디 조회
export const getStudy = async (req, res) => {
  const { studyId } = req.params;

  try {
    const study = await pointRepo.findStudyById(studyId);

    if (!study) {
      return res
        .status(404)
        .json({ success: false, message: new NotFoundException().message });
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
