import express from 'express';
import { router } from './routes/index.js';
import { config } from './config/config.js';

console.log(process.env);

const app = express();

// JSON 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.use('/', router);

// 서버 시작
app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});
