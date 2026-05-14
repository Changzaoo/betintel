import { Router, Request, Response, NextFunction } from 'express';
import { TeamIdSchema } from '@betintel/shared';
import { getProvider } from '../providers';
import { CacheService } from '../services/CacheService';
import { CURRENT_SEASON } from '@betintel/shared';

const router = Router();

router.get('/:teamId/form', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamId } = TeamIdSchema.parse(req.params);
    const season = Number(req.query.season) || CURRENT_SEASON;

    const cached = CacheService.getTeamForm(teamId, season);
    if (cached) return res.json({ success: true, data: cached, meta: { source: 'cache' } });

    const provider = getProvider();
    const data = await provider.getTeamForm(teamId, season);
    CacheService.setTeamForm(teamId, season, data);
    return res.json({ success: true, data, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

router.get('/:teamId/transfers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamId } = TeamIdSchema.parse(req.params);
    const cached = CacheService.getTransfers(teamId);
    if (cached) return res.json({ success: true, data: cached, meta: { source: 'cache' } });

    const provider = getProvider();
    const data = await provider.getTransfers(teamId);
    CacheService.setTransfers(teamId, data);
    return res.json({ success: true, data, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

export default router;
