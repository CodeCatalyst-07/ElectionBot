/**
 * Formats a Date object or ISO string into a human-readable string.
 *
 * @param date - A Date object or ISO date string (e.g. '2025-04-19')
 * @returns Formatted date string, e.g. "19 April 2025"
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Calculates the number of days until a given future date.
 * Returns a negative number if the date has already passed.
 *
 * @param date - The target date as a Date object or ISO string
 * @returns Number of days until (positive) or since (negative) the date
 */
export function getDaysUntil(date: Date | string): number {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  const diffMs = targetDate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns a short relative label for a date (e.g. "in 3 days", "2 days ago", "Today").
 *
 * @param date - The target date as a Date object or ISO string
 * @returns Human-readable relative label
 */
export function getRelativeDateLabel(date: Date | string): string {
  const days = getDaysUntil(date);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1) return `in ${days} days`;
  return `${Math.abs(days)} days ago`;
}

/**
 * Returns election deadline objects for a given country with computed relative labels.
 *
 * @param country - 'india' or 'us'
 * @returns Array of deadline objects with name, date string, and relative label
 */
export function getElectionDeadlines(country: 'india' | 'us'): {
  name: string;
  dateString: string;
  relativeLabel: string;
}[] {
  const deadlines =
    country === 'india'
      ? [
          { name: 'Voter Registration Deadline', dateString: '2025-01-10' },
          { name: 'Last Day of Campaigning', dateString: '2025-04-17' },
          { name: 'Election Day', dateString: '2025-04-19' },
          { name: 'Results Day', dateString: '2025-05-23' },
        ]
      : [
          { name: 'Voter Registration Deadline', dateString: '2026-10-06' },
          { name: 'Absentee Ballot Deadline', dateString: '2026-11-01' },
          { name: 'Election Day', dateString: '2026-11-03' },
          { name: 'Electoral College Certification', dateString: '2027-01-06' },
        ];

  return deadlines.map((d) => ({
    ...d,
    relativeLabel: getRelativeDateLabel(d.dateString),
  }));
}
