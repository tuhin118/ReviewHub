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

export function parsePositiveInt(raw: string | null, fallback: number, max: number): number {
  if (raw === null || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw new ValidationError(`Query parameter must be an integer between 1 and ${max}`);
  }
  return parsed;
}

export function normalizeEmail(raw: unknown): string {
  if (typeof raw !== 'string') {
    throw new ValidationError('Valid email address is required');
  }
  const email = raw.trim().toLowerCase();
  if (email.length < 5 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError('Invalid email format');
  }
  return email;
}

export function validatePasswordInput(raw: unknown): string {
  if (typeof raw !== 'string' || raw.length < 8 || raw.length > 128) {
    throw new ValidationError('Password must be between 8 and 128 characters');
  }
  return raw;
}

function isPrivateOrReservedIpv4(host: string): boolean {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!match) return false;
  const [a, b] = [Number(match[1]), Number(match[2])];
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

export function isSafeHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;

    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (
      host === 'localhost' ||
      host.endsWith('.localhost') ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host === '::1' ||
      host === '::' ||
      host.startsWith('fc') ||
      host.startsWith('fd') ||
      host.startsWith('fe80:') ||
      isPrivateOrReservedIpv4(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
