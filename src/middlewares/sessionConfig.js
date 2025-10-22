import session from 'express-session';
import { config } from '../config/config.js';
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
    maxAge: 60 * 60 * 1000, // 1시간
  },
});
