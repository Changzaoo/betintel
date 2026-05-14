import { Router, Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/CacheService';
import { logger } from '../utils/logger';

const router = Router();

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prefix } = req.body as { prefix?: string };
    CacheService.clear(prefix);
    logger.info('Cache refresh triggered', { prefix });
    return res.json({ success: true, message: 'Cache limpo com sucesso', prefix });
  } catch (err) { return next(err); }
});

router.get('/stats', (_req: Request, res: Response) => {
  return res.json({ success: true, data: CacheService.stats() });
});

export default router;
