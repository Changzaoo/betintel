type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function log(level: LogLevel, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (level === 'error') {
    console.error(prefix, message, meta ?? '');
  } else if (level === 'warn') {
    console.warn(prefix, message, meta ?? '');
  } else if (process.env.NODE_ENV !== 'test') {
    console.log(prefix, message, meta ?? '');
  }
}

export const logger = {
  info: (msg: string, meta?: unknown) => log('info', msg, meta),
  warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
  error: (msg: string, meta?: unknown) => log('error', msg, meta),
  debug: (msg: string, meta?: unknown) => {
    if (process.env.NODE_ENV === 'development') log('debug', msg, meta);
  },
};
