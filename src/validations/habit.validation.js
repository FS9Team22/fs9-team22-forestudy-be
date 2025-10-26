import { z } from 'zod';

export const createHabitValidation = z.object({
  name: z
    .string()
    .trim()
    .min(2, '습관 이름은 최소 2자 이상이어야합니다.')
    .max(32, '습관 이름은 최대  32자까지 가능합니다.'),
});
