import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const ROOT = process.cwd();

test('migrations exist in sequential order without destructive DROP statements', () => {
  const m1 = fs.readFileSync(path.join(ROOT, 'db/migrations/0001_foundation.sql'), 'utf8');
  const m2 = fs.readFileSync(path.join(ROOT, 'db/migrations/0002_platform_core.sql'), 'utf8');

  assert.equal(/\bDROP\s+TABLE\b/i.test(m1), false);
  assert.equal(/\bDROP\s+TABLE\b/i.test(m2), false);
  assert.match(m2, /UNIQUE\s*\(\s*listing_id\s*,\s*user_id\s*\)/i);
  assert.match(m2, /CHECK\s*\(\s*security_alerts\s+IN\s*\(\s*1\s*\)\s*\)/i);
});

test('wrangler.toml does not ship dummy 0000 database_id', () => {
  const wrangler = fs.readFileSync(path.join(ROOT, 'wrangler.toml'), 'utf8');
  assert.equal(wrangler.includes('00000000-0000-0000-0000-000000000000'), false);
});
