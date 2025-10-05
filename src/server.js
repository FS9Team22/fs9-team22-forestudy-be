import express from 'express';

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Hello Express!',
    timestamp: new Date().toISOString(),
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
