type LogContext = Record<string, unknown>

function log(level: 'info' | 'warn' | 'error', event: string, context?: LogContext) {
  const entry = { level, event, time: new Date().toISOString(), ...context }
  const line = JSON.stringify(entry)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

export const logger = {
  info: (event: string, context?: LogContext) => log('info', event, context),
  warn: (event: string, context?: LogContext) => log('warn', event, context),
  error: (event: string, context?: LogContext) => log('error', event, context),
}
