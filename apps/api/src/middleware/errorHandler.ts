import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Parâmetros inválidos',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  logger.error('Unhandled error', { url: req.url, err });

  const message = process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : 'Erro interno do servidor';

  return res.status(500).json({ success: false, error: message });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, error: `Rota não encontrada: ${req.method} ${req.path}` });
}
