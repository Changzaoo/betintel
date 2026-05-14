import { Router, Request, Response, NextFunction } from 'express';
import { getProvider } from '../providers';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = getProvider();
    const data = await provider.getLeagues();
    return res.json({ success: true, data, meta: { source: provider.name } });
  } catch (err) { return next(err); }
});

export default router;
