import session from 'express-session';
import { config, isProduction } from '../config/config.js';
import connectPgSimple from 'connect-pg-simple';
import { prisma } from '../db/prisma.js';

const PgStore = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgStore({
    prisma: prisma,
    tableName: 'Session',
  }),
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction, // 프로덕션 환경에서는 true
    sameSite: isProduction ? 'none' : 'lax', // 프로덕션에서는 'none', 개발에서는 'lax'
    maxAge: 60 * 60 * 1000, // 1시간
  },
});
