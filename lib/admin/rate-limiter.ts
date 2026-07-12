/**
 * Token-bucket rate limiter for client-side admin action throttling.
 * Prevents rapid double-submission of expensive operations (brief generation,
 * file uploads, bulk operations).
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillIntervalMs: number;

  /**
   * @param maxTokens Maximum burst capacity
   * @param refillRateTokensPerSecond Tokens added per second
   */
  constructor(maxTokens: number, refillRateTokensPerSecond: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillIntervalMs = 1000 / refillRateTokensPerSecond;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const newTokens = Math.floor(elapsed / this.refillIntervalMs);
    if (newTokens > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
      this.lastRefill = now;
    }
  }

  /** Returns true if a token was consumed, false if rate-limited */
  consume(n = 1): boolean {
    this.refill();
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }

  /** Returns milliseconds until the next token is available (0 if tokens available) */
  getWaitTimeMs(): number {
    this.refill();
    if (this.tokens >= 1) return 0;
    return Math.ceil(this.refillIntervalMs - (Date.now() - this.lastRefill));
  }
}

// Pre-configured limiters for admin operations
export const briefGenerationLimiter = new RateLimiter(3, 0.05); // 3 burst, ~3 per minute
export const fileUploadLimiter = new RateLimiter(10, 0.5); // 10 burst, ~30 per minute
export const bulkOperationLimiter = new RateLimiter(2, 0.033); // 2 burst, ~2 per minute
