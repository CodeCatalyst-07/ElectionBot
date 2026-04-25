/**
 * Unit tests for client/src/utils/dateUtils.ts
 * Uses jest.useFakeTimers to pin "today" for deterministic results.
 */
import { formatDate, getDaysUntil, getRelativeDateLabel } from '../utils/dateUtils';

describe('formatDate', () => {
  it('formats a Date object into a readable string', () => {
    const date = new Date('2025-04-19T00:00:00.000Z');
    const result = formatDate(date);
    // Should contain year, day, and month name
    expect(result).toContain('2025');
    expect(result).toContain('19');
  });

  it('formats an ISO string into a readable string', () => {
    const result = formatDate('2025-05-23');
    expect(result).toContain('2025');
    expect(result).toContain('23');
  });
});

describe('getDaysUntil', () => {
  beforeEach(() => {
    // Pin "today" to 2025-01-01
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns a positive number for a future date', () => {
    const result = getDaysUntil('2025-01-10');
    expect(result).toBe(9);
  });

  it('returns 0 for today', () => {
    const result = getDaysUntil('2025-01-01');
    expect(result).toBe(0);
  });

  it('returns a negative number for a past date', () => {
    const result = getDaysUntil('2024-12-25');
    expect(result).toBeLessThan(0);
  });
});

describe('getRelativeDateLabel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns "Today" when the date is today', () => {
    expect(getRelativeDateLabel('2025-01-01')).toBe('Today');
  });

  it('returns "Tomorrow" for the next day', () => {
    expect(getRelativeDateLabel('2025-01-02')).toBe('Tomorrow');
  });

  it('returns "in N days" for future dates beyond tomorrow', () => {
    expect(getRelativeDateLabel('2025-01-11')).toBe('in 10 days');
  });

  it('returns "Yesterday" for the previous day', () => {
    expect(getRelativeDateLabel('2024-12-31')).toBe('Yesterday');
  });
});
