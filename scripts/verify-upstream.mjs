import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const base = new URL('../web/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('UPSTREAM.json', base), 'utf8'));
const pinned = '39dff48018271dd54bacae90ae1eb1abaa76a4ef';
if (manifest.commit !== pinned) throw new Error('Unexpected upstream commit');
for (const entry of manifest.files) {
  const bytes = await readFile(new URL(entry.path, base));
  const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  if (blob !== entry.gitBlob || sha256 !== entry.sha256 || bytes.length !== entry.bytes) {
    throw new Error(`Pinned upstream bytes changed: web/${entry.path}`);
  }
}
console.log(`PASS: ${manifest.files.length} upstream files match Wheelhold ${pinned}.`);
