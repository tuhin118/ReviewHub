import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const ROOT = process.cwd();

function readRepoFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

test('migrations exist in sequential order without destructive DROP statements', () => {
  const m1 = readRepoFile('db/migrations/0001_foundation.sql');
  const m2 = readRepoFile('db/migrations/0002_platform_core.sql');

  assert.equal(/\bDROP\s+TABLE\b/i.test(m1), false);
  assert.equal(/\bDROP\s+TABLE\b/i.test(m2), false);
  assert.match(m2, /UNIQUE\s*\(\s*listing_id\s*,\s*user_id\s*\)/i);
  assert.match(m2, /CHECK\s*\(\s*security_alerts\s+IN\s*\(\s*1\s*\)\s*\)/i);
  assert.match(m2, /CREATE TABLE IF NOT EXISTS system_bootstrap/i);
  assert.match(m2, /CHECK\s*\(\s*id\s*=\s*1\s*\)/i);

  const permMatches = m2.match(/'perm_\d{2}'/g) ?? [];
  assert.equal(permMatches.length, 22);
});

test('wrangler.toml does not ship dummy 0000 database_id', () => {
  const wrangler = readRepoFile('wrangler.toml');
  assert.equal(wrangler.includes('00000000-0000-0000-0000-000000000000'), false);
});

test('login lockout uses atomic SQL UPDATE RETURNING without non-atomic JS increment', () => {
  const authQueries = readRepoFile('backend/db/queries/auth.queries.ts');
  const authMiddleware = readRepoFile('backend/middleware/auth.ts');

  assert.match(authQueries, /UPDATE users[\s\S]*failed_login_attempts \+ 1[\s\S]*RETURNING/i);
  assert.match(authQueries, /clearFailedLoginIfUnlocked/i);
  assert.match(authMiddleware, /recordFailedLoginAttemptAtomic/i);
});

test('CSRF rejects missing Origin and Referer on state-changing requests', () => {
  const authMiddleware = readRepoFile('backend/middleware/auth.ts');
  assert.match(authMiddleware, /Missing Origin header on state-changing request/);
  assert.match(authMiddleware, /Sec-Fetch-Site/);
});

test('registration uses atomic batch and does not swallow DB errors into 201 success', () => {
  const authRoutes = readRepoFile('backend/routes/auth.routes.ts');
  const authQueries = readRepoFile('backend/db/queries/auth.queries.ts');

  assert.match(authQueries, /registerUserAtomically[\s\S]*db\.batch/i);
  assert.match(authRoutes, /error instanceof ConflictError[\s\S]*throw new ConflictError/);
  assert.match(authRoutes, /emailDeliveryAvailable:\s*false/);
});

test('email verification and atomic admin bootstrap routes exist', () => {
  const authRoutes = readRepoFile('backend/routes/auth.routes.ts');
  const adminRoutes = readRepoFile('backend/routes/admin.routes.ts');

  assert.match(authRoutes, /\/api\/v1\/auth\/verify-email/);
  assert.match(adminRoutes, /\/api\/v1\/admin\/bootstrap/);
  assert.match(adminRoutes, /claimBootstrapSlot/);
});
