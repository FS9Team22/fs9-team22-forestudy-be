import { z } from 'zod';

export const createStudyValidation = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, '닉네임은 최소 2자 이상이어야합니다.')
    .max(6, '닉네임은 최대 6자까지 가능합니다.'),
  title: z
    .string()
    .trim()
    .min(2, '제목은 최소 2자 이상이어야합니다.')
    .max(10, '제목은 최대 10자까지 가능합니다.'),
  description: z
    .string()
    .trim()
    .min(2, '소개는 최소 2자리 이상이어야합니다.')
    .max(100, '소개는 최대 100자까지 가능합니다.'),
  background: z
    .number()
    .min(1, '배경선택은 필수 입력 항목입니다.')
    .max(8, '배경은 1~8사이 값이어야 합니다.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야합니다.'),
});
