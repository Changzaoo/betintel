import { Router, Request, Response, NextFunction } from 'express';
import { H2HSchema } from '@betintel/shared';
import { getProvider } from '../providers';
import { CacheService } from '../services/CacheService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamA, teamB, season } = H2HSchema.parse(req.query);

    const cached = CacheService.getH2H(teamA, teamB);
    if (cached) return res.json({ success: true, data: cached, meta: { source: 'cache' } });

    const provider = getProvider();
    const data = await provider.getHeadToHead(teamA, teamB, season);
    CacheService.setH2H(teamA, teamB, data);
    return res.json({ success: true, data, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

export default router;
