/**
 * Retry Configuration Constants
 * 
 * Defines constants for retry logic across the application.
 */

/**
 * Number of retry attempts per retry set
 * @constant {number}
 */
export const RETRIES_PER_SET = 3;

/**
 * Minimum number of retry sets allowed
 * @constant {number}
 */
export const MIN_RETRY_SETS = 1;

/**
 * Maximum number of retry sets allowed
 * @constant {number}
 */
export const MAX_RETRY_SETS = 10;
