import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

import fixturesRouter from './routes/fixtures';
import teamsRouter from './routes/teams';
import playersRouter from './routes/players';
import headToHeadRouter from './routes/headToHead';
import leaguesRouter from './routes/leagues';
import cacheRouter from './routes/cache';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.APP_URL ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.use('/api/fixtures', fixturesRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/players', playersRouter);
app.use('/api/head-to-head', headToHeadRouter);
app.use('/api/leagues', leaguesRouter);
app.use('/api/cache', cacheRouter);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`BetIntel API running on http://localhost:${PORT}`);
    logger.info(`Provider: ${process.env.API_FOOTBALL_KEY ? 'API-Football' : 'Mock (configure API_FOOTBALL_KEY para dados reais)'}`);
  });
}

export default app;
