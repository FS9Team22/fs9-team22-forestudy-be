import { PrismaClient } from '@prisma/client';
import { config } from '../src/config/config.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  const PEPPER_SECRET = config.PEPPER_SECRET;

  if (!PEPPER_SECRET) {
    console.err('PEPPER가 정의되지않았습니다.');
    process.exit(1);
  }

  const numberOfStudies = 10; // 생성할 스터디 그룹 수
  const habitsPerStudy = 3; // 스터디 그룹 당 습관 수

  await prisma.$transaction(async (tx) => {
    console.log('Deleting existing data...');
    // 기존 데이터 삭제
    await tx.habitLog.deleteMany();
    await tx.reaction.deleteMany();
    await tx.habit.deleteMany();
    await tx.study.deleteMany();
    console.log('Existing data deleted.');

    for (let i = 0; i < numberOfStudies; i++) {
      // 스터디 생성
      const passwordWithPepper = faker.internet.password() + PEPPER_SECRET;
      const hashedPassword = await bcrypt.hash(passwordWithPepper, 10);
      const study = await tx.study.create({
        data: {
          title: faker.lorem.words(3), // 3개의 단어로 된 스터디 이름
          nickname: faker.internet.username(), // 생성자 닉네임
          description: faker.lorem.sentence(), // 스터디 소개
          point: faker.number.int({ min: 0, max: 1000 }), // 0에서 1000 사이의 포인트
          background: faker.number.int({ min: 1, max: 8 }), // 1에서 10 사이의 배경 이미지 번호
          password: hashedPassword, // 비밀번호
        },
      });

      console.log(`Created study: ${study.title}`);

      // 반응(Reaction) 생성
      const emojis = ['👍', '❤️', '🚀', '🎉', '🔥'];
      for (const emoji of emojis) {
        // 50% 확률로 반응 생성
        if (faker.datatype.boolean()) {
          await tx.reaction.create({
            data: {
              studyId: study.id,
              emoji: emoji,
              count: faker.number.int({ min: 1, max: 50 }),
            },
          });
        }
      }

      // 습관(Habit) 생성
      for (let j = 0; j < habitsPerStudy; j++) {
        const habit = await tx.habit.create({
          data: {
            studyId: study.id,
            name: faker.lorem.word(), // 한 단어로 된 습관 이름
          },
        });

        console.log(`  - Created habit: ${habit.name}`);
        // 습관 로그(HabitLog) 생성
        const today = new Date();
        const uniqueDates = new Set();
        const logsPerWeek = 3; // 각 주당 최소 로그 수
        const totalWeeks = 5; // 2주 전부터 3주 후까지 총 5주

        // 시딩일 기준 -2주 전부터 +2주 후까지 (총 5주) 루프
        for (let week = -2; week < totalWeeks - 2; week++) {
          const datesInWeek = new Set();
          const weekStartDate = new Date(today);
          weekStartDate.setDate(today.getDate() + week * 7);

          const weekEndDate = new Date(weekStartDate);
          weekEndDate.setDate(weekStartDate.getDate() + 6);

          while (datesInWeek.size < logsPerWeek) {
            const logDate = faker.date.between({
              from: weekStartDate,
              to: weekEndDate,
            });
            const dateOnly = logDate.toISOString().split('T')[0];
            if (!uniqueDates.has(dateOnly)) {
              datesInWeek.add(dateOnly);
            }
          }
          datesInWeek.forEach((date) => uniqueDates.add(date));
        }

        const logCreationPromises = Array.from(uniqueDates).map((dateStr) =>
          tx.habitLog.create({
            data: { habitId: habit.id, loggingDate: new Date(dateStr) },
          }),
        );
        await Promise.all(logCreationPromises);
        console.log(`- Created ${uniqueDates.size} habit logs`);
      }
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
