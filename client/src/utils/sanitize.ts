/**
 * Strips HTML tags from a string to prevent XSS injection.
 *
 * @param input - Raw user input string
 * @returns String with all HTML tags removed
 */
function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes user input text by stripping HTML tags, trimming whitespace,
 * and enforcing a maximum character length.
 *
 * @param input - The raw user input string
 * @param maxLength - Maximum allowed character length (default: 2000)
 * @returns A sanitized, trimmed, length-capped string
 */
export function sanitizeInput(input: string, maxLength = 2000): string {
  return stripHtmlTags(input).trim().slice(0, maxLength);
}

/**
 * Checks whether a string is empty or contains only whitespace.
 *
 * @param value - The string to check
 * @returns True if the string is blank, false otherwise
 */
export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}
