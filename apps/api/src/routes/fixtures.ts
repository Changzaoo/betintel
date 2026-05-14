import { Router, Request, Response, NextFunction } from 'express';
import { FixtureFiltersSchema, FixtureIdSchema, FixtureFilters } from '@betintel/shared';
import { getProvider } from '../providers';
import { CacheService } from '../services/CacheService';
import { PredictionEngine } from '../engines/PredictionEngine';
import { logger } from '../utils/logger';

const router = Router();
const engine = new PredictionEngine();

router.get('/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = FixtureFiltersSchema.parse(req.query);
    const cacheKey = JSON.stringify(filters);
    const cached = CacheService.getUpcomingFixtures(cacheKey);
    if (cached) return res.json({ success: true, data: cached, meta: { source: 'cache' } });

    const provider = getProvider();
    const data = await provider.getUpcomingFixtures(filters as FixtureFilters);
    CacheService.setUpcomingFixtures(cacheKey, data);
    return res.json({ success: true, data, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

router.get('/today', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = FixtureFiltersSchema.parse(req.query);
    const cacheKey = JSON.stringify(filters);
    const cached = CacheService.getTodayFixtures(cacheKey);
    if (cached) return res.json({ success: true, data: cached, meta: { source: 'cache' } });

    const provider = getProvider();
    const data = await provider.getTodayFixtures(filters as FixtureFilters);
    CacheService.setTodayFixtures(cacheKey, data);
    return res.json({ success: true, data, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

router.get('/:fixtureId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fixtureId } = FixtureIdSchema.parse(req.params);
    const cached = CacheService.getFixture(fixtureId);
    if (cached) return res.json({ success: true, data: cached, meta: { source: 'cache' } });

    const provider = getProvider();
    const data = await provider.getFixtureById(fixtureId);
    if (!data) return res.status(404).json({ success: false, error: 'Partida não encontrada' });
    CacheService.setFixture(fixtureId, data);
    return res.json({ success: true, data, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

router.get('/:fixtureId/analysis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fixtureId } = FixtureIdSchema.parse(req.params);

    const provider = getProvider();
    logger.info('Generating analysis', { fixtureId, provider: provider.name });

    const [fixture, lineup] = await Promise.all([
      provider.getFixtureById(fixtureId),
      provider.getLineup(fixtureId).catch(() => null),
    ]);

    if (!fixture) return res.status(404).json({ success: false, error: 'Partida não encontrada' });

    const homeId = fixture.teams.home.id;
    const awayId = fixture.teams.away.id;

    const [homeForm, awayForm, headToHead, homeTransfers, awayTransfers] = await Promise.all([
      provider.getTeamForm(homeId),
      provider.getTeamForm(awayId),
      provider.getHeadToHead(homeId, awayId),
      provider.getTransfers(homeId).catch(() => []),
      provider.getTransfers(awayId).catch(() => []),
    ]);

    const prediction = engine.calculate({
      fixtureId, homeForm, awayForm, headToHead,
      homeLineup: lineup?.home, awayLineup: lineup?.away,
      homeTransfers, awayTransfers,
    });

    const analysis = {
      fixture, homeForm, awayForm, headToHead,
      lineup, homeTransfers, awayTransfers,
      homePlayerStats: [], awayPlayerStats: [],
      prediction, generatedAt: new Date().toISOString(),
    };

    return res.json({ success: true, data: analysis, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

export default router;
