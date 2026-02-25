import pino from 'pino-http';

const logger = pino({
  timestamp: () => `"time:"${new Date().toISOString()}"`,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
}).logger;

export default logger;
