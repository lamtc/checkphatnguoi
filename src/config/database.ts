// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';

// Prisma configuration
export const PRISMA_LOG_LEVELS = ['query', 'info', 'warn', 'error'];

// Search history configuration
export const MAX_HISTORY_ITEMS = 10;
