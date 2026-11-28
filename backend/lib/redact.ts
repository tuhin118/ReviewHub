const SENSITIVE_KEY_PATTERN =
  /(password|hash|token|secret|otp|totp|cookie|authorization|apikey|api_key|pepper|credential)/i;

export function redactValue(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[TRUNCATED]';
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => redactValue(item, depth + 1));
  }

  if (typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        output[key] = '[REDACTED]';
      } else {
        output[key] = redactValue(val, depth + 1);
      }
    }
    return output;
  }

  if (typeof value === 'string' && value.length > 300) {
    return `${value.slice(0, 300)}...`;
  }

  return value;
}

export function safeRedactedJson(details: Record<string, unknown>): string {
  return JSON.stringify(redactValue(details));
}
