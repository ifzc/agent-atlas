import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const output = new URL('../dist/pages/', import.meta.url);
const base = `${process.env.PAGES_BASE_PATH ?? ''}/`;
const pages = [
  ['index.html', 'course'],
  ['chapters/agent-history/index.html', 'agent-history'],
];

for (const [file, page] of pages) {
  const html = await readFile(new URL(file, output), 'utf8');
  assert(html.includes(`data-page="${page}"`), `${file}: 页面标识不匹配`);
  assert(html.includes('type="module"'), `${file}: 缺少脚本入口`);
  const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert(assets.length >= 3, `${file}: 缺少图标、脚本或样式`);
  for (const asset of assets) {
    assert(asset.startsWith(base), `${file}: 资源没有使用部署路径 ${asset}`);
    const target = new URL(asset.slice(base.length), output);
    assert((await stat(target)).size > 0, `${file}: 资源不存在或为空 ${asset}`);
  }
}
console.log('静态产物检查通过：目录页、第一章入口及所有引用资源均完整。');
