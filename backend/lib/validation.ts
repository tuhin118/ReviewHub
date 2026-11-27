import { ValidationError } from './errors';

const MAX_JSON_BYTES = 64 * 1024;

export async function parseJsonBody<T>(request: Request): Promise<T> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new ValidationError('Content-Type must be application/json');
  }

  const rawText = await request.text();
  if (!rawText.trim()) {
    throw new ValidationError('Request body cannot be empty');
  }

  if (new TextEncoder().encode(rawText).byteLength > MAX_JSON_BYTES) {
    throw new ValidationError('Request payload exceeds allowed size limit');
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new ValidationError('Malformed JSON payload');
  }
}

export function parsePositiveInt(
  raw: string | null,
  fallback: number,
  max: number,
): number {
  if (raw === null || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw new ValidationError(`Query parameter must be an integer between 1 and ${max}`);
  }
  return parsed;
}

export function isSafeHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
