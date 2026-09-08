import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist/pages');
const branch = 'gh-pages';
const git = (args, cwd = root) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const origin = git(['remote', 'get-url', 'origin']);
const revision = git(['rev-parse', '--short', 'HEAD']);
const directory = await mkdtemp(join(tmpdir(), 'agent-atlas-pages-'));

try {
  git(['init', '--initial-branch', branch], directory);
  git(['remote', 'add', 'origin', origin], directory);
  const existing = git(
    ['ls-remote', '--heads', 'origin', `refs/heads/${branch}`],
    directory,
  );
  if (existing) {
    git(['fetch', '--depth=1', 'origin', branch], directory);
    git(['reset', '--hard', 'FETCH_HEAD'], directory);
  }
  for (const entry of await readdir(directory)) {
    if (entry !== '.git')
      await rm(join(directory, entry), { recursive: true, force: true });
  }
  await cp(output, directory, { recursive: true });
  await writeFile(join(directory, '.nojekyll'), '');
  await writeFile(
    join(directory, 'source-revision.txt'),
    `${git(['rev-parse', 'HEAD'])}\n`,
  );
  git(['config', 'user.name', git(['config', 'user.name'])], directory);
  git(['config', 'user.email', git(['config', 'user.email'])], directory);
  git(['add', '--all'], directory);
  if (git(['status', '--porcelain'], directory)) {
    git(['commit', '-m', `发布 Agent 技术课（${revision}）`], directory);
    execFileSync('git', ['push', 'origin', `HEAD:refs/heads/${branch}`], {
      cwd: directory,
      stdio: 'inherit',
    });
    console.log(`静态页面已推送到 ${branch}，等待 GitHub Pages 发布。`);
  } else {
    console.log('静态页面没有变化。');
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
