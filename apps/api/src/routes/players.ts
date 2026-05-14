import { Router, Request, Response, NextFunction } from 'express';
import { PlayerIdSchema } from '@betintel/shared';
import { getProvider } from '../providers';
import { CacheService } from '../services/CacheService';
import { CURRENT_SEASON } from '@betintel/shared';

const router = Router();

router.get('/:playerId/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { playerId } = PlayerIdSchema.parse(req.params);
    const season = Number(req.query.season) || CURRENT_SEASON;

    const cached = CacheService.getPlayerStats(playerId, season);
    if (cached) return res.json({ success: true, data: cached, meta: { source: 'cache' } });

    const provider = getProvider();
    const data = await provider.getPlayerStats(playerId, season);
    if (!data) return res.status(404).json({ success: false, error: 'Jogador não encontrado' });
    CacheService.setPlayerStats(playerId, season, data);
    return res.json({ success: true, data, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

export default router;
