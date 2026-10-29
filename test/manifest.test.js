'use strict';

// manifest と _locales と実ファイルの食い違いを機械で突き合わせる。
// 目視では、片方の言語にキーを足し忘れた・参照先のファイル名を変えた、を見落とす。

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

const manifest = readJson('manifest.json');
const en = readJson('_locales/en/messages.json');
const ja = readJson('_locales/ja/messages.json');

// manifest が参照している __MSG_*__ を全部拾う
function messageKeysUsedInManifest() {
  const found = new Set();
  const walk = (node) => {
    if (typeof node === 'string') {
      const m = node.match(/^__MSG_(\w+)__$/);
      if (m) found.add(m[1]);
    } else if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      Object.values(node).forEach(walk);
    }
  };
  walk(manifest);
  return [...found];
}

test('manifest が参照する翻訳キーが両方の言語に存在する', () => {
  const used = messageKeysUsedInManifest();
  // 対照: 参照が1つも拾えていないなら、この検査自体が空振りしている
  assert.ok(used.length >= 3, `__MSG_*__ を拾えていない（${used.length}件）`);
  for (const key of used) {
    assert.ok(key in en, `en に無いキー: ${key}`);
    assert.ok(key in ja, `ja に無いキー: ${key}`);
  }
});

test('en と ja のキー集合が一致する', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ja).sort());
});

test('すべての訳文が空でない', () => {
  for (const [locale, messages] of [['en', en], ['ja', ja]]) {
    for (const [key, entry] of Object.entries(messages)) {
      assert.equal(typeof entry.message, 'string', `${locale}/${key} に message が無い`);
      assert.ok(entry.message.trim().length > 0, `${locale}/${key} が空`);
    }
  }
});

test('ウェブストアの上限に収まっている（名前75字・説明132字）', () => {
  for (const [locale, messages] of [['en', en], ['ja', ja]]) {
    assert.ok(
      messages.extName.message.length <= 75,
      `${locale} の名前が長い: ${messages.extName.message.length}字`
    );
    assert.ok(
      messages.extDescription.message.length <= 132,
      `${locale} の説明が長い: ${messages.extDescription.message.length}字`
    );
  }
});

test('default_locale のフォルダが実在する', () => {
  assert.ok(manifest.default_locale, 'default_locale が無い');
  assert.ok(
    fs.existsSync(path.join(ROOT, '_locales', manifest.default_locale, 'messages.json')),
    `_locales/${manifest.default_locale}/messages.json が無い`
  );
});

test('manifest が挙げているファイルがすべて実在する', () => {
  const files = [
    manifest.background.service_worker,
    ...Object.values(manifest.icons),
    ...manifest.content_scripts.flatMap((cs) => cs.js),
  ];
  assert.ok(files.length >= 6, `参照ファイルを拾えていない（${files.length}件）`);
  for (const f of files) {
    assert.ok(fs.existsSync(path.join(ROOT, f)), `参照先が無い: ${f}`);
  }
});

test('content script は post-url.js を content.js より先に読む', () => {
  for (const cs of manifest.content_scripts) {
    assert.ok(
      cs.js.indexOf('post-url.js') < cs.js.indexOf('content.js'),
      `読み込み順が逆: ${cs.js.join(', ')}`
    );
  }
});

test('service worker が post-url.js を読み込んでいる', () => {
  const src = fs.readFileSync(path.join(ROOT, manifest.background.service_worker), 'utf8');
  assert.match(src, /importScripts\(['"]post-url\.js['"]\)/);
  // module 形式の service worker では importScripts が使えない
  assert.notEqual(manifest.background.type, 'module');
});

test('入れ直しでも同じ順序で両方のファイルを入れている', () => {
  const src = fs.readFileSync(path.join(ROOT, 'background.js'), 'utf8');
  assert.match(src, /files:\s*\['post-url\.js',\s*'content\.js'\]/);
});

test('package.json と manifest のバージョンが揃っている', () => {
  assert.equal(readJson('package.json').version, manifest.version);
});

// 効かせたい範囲。ここを変えるときは、掲載文と PRIVACY.md も同時に直す。
const ALLOWED_ORIGINS = [
  'https://www.twitter.com/*',
  'https://www.x.com/*',
  'https://twitter.com/*',
  'https://x.com/*',
].sort();

test('要求している権限が2つのままである', () => {
  assert.deepEqual([...manifest.permissions].sort(), ['contextMenus', 'scripting']);
  // 追加で権限を取る余地も残さない
  assert.equal(manifest.optional_permissions, undefined, 'optional_permissions が増えている');
  assert.equal(manifest.optional_host_permissions, undefined, 'optional_host_permissions が増えている');
});

test('シークレット・外部公開・外部接続・CSP の指定を manifest に持たない', () => {
  // incognito: 既定の spanning のままにする（split にすると挙動と文書が変わる）
  // web_accessible_resources: ページから拡張のファイルを読めるようにしない
  // externally_connectable: 他の拡張やページから拡張へ話しかけられるようにしない
  // content_security_policy: 既定より緩める余地を残さない
  for (const key of [
    'incognito',
    'web_accessible_resources',
    'externally_connectable',
    'content_security_policy',
  ]) {
    assert.equal(key in manifest, false, `manifest に ${key} がある`);
  }
});

// ---- 文書に書いた権限名と manifest の突き合わせ ----
//
// 権限を足し引きしたのに文書を直し忘れると、ストアの申告やプライバシーポリシーが
// 実際の権限と食い違う。文書の表・見出しから権限名を拾い、manifest と比べる。

const readDoc = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// heading で始まる節（次の同じ深さ以上の見出しの手前まで）を返す
function section(doc, heading) {
  const lines = doc.split('\n');
  const start = lines.findIndex((l) => l.startsWith(heading));
  assert.notEqual(start, -1, `見出しが見つからない: ${heading}`);
  const depth = heading.match(/^#+/)[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+) /);
    if (m && m[1].length <= depth) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join('\n');
}

// 表の各行の1列目にある `…` を拾う
function firstColumnCodes(text) {
  const names = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^\|\s*`([^`]+)`/);
    if (m) names.push(m[1]);
  }
  return names;
}

// 権限の表にある、manifest の permissions 以外の行（宣言の場所そのもの）
const NON_API_ROWS = ['host_permissions', 'content_scripts.matches'];

test('PRIVACY.md の権限の表が、manifest の権限と一致する（日本語・英語）', () => {
  const doc = readDoc('PRIVACY.md');
  for (const heading of ['### 4. 要求する権限とその理由', '### 4. Permissions and why']) {
    const rows = firstColumnCodes(section(doc, heading));
    // 対照: 表を読めていなければ、以下の比較は空振りになる
    assert.ok(rows.length >= 3, `${heading} の表を読めていない（${rows.length}件）`);
    const apis = rows.filter((r) => !NON_API_ROWS.includes(r));
    assert.deepEqual(apis.sort(), [...manifest.permissions].sort(), `${heading} の権限が manifest と違う`);
    for (const r of NON_API_ROWS) assert.ok(rows.includes(r), `${heading} に ${r} の行が無い`);
  }
});

test('PRIVACY.md が「要求していない」と書いた権限を、manifest は要求していない', () => {
  const sec = section(readDoc('PRIVACY.md'), '### 4. 要求する権限とその理由');
  const line = sec.split('\n').find((l) => l.includes('要求していません'));
  assert.ok(line, '「要求していません」の行が無い');
  const names = [...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  assert.ok(names.length >= 1, '名前を拾えていない');
  const requested = [...manifest.permissions, ...manifest.host_permissions];
  for (const n of names) assert.ok(!requested.includes(n), `要求していないはずの ${n} を要求している`);
});

test('STORE_LISTING.md の権限の正当化の見出しが、manifest の権限と一致する', () => {
  const sec = section(readDoc('STORE_LISTING.md'), '## 4. 単一目的と権限の正当化');
  const headings = [...sec.matchAll(/^### `([^`]+)`$/gm)].map((m) => m[1]);
  assert.deepEqual(headings.sort(), [...manifest.permissions].sort());

  // ホスト権限の見出しは「先頭の1件 ほかN件」の形で数を書いている
  const host = sec.match(/^### ホスト権限（`([^`]+)` ほか(\d+)件）$/m);
  assert.ok(host, 'ホスト権限の見出しが無い');
  assert.ok(manifest.host_permissions.includes(host[1]), `manifest に無いホスト: ${host[1]}`);
  assert.equal(Number(host[2]) + 1, manifest.host_permissions.length, 'ホスト権限の件数が違う');
});

test('README の「要求する権限」が、manifest の権限と一致する', () => {
  const sec = section(readDoc('README.md'), '## 権限とデータの扱い');
  const row = sec.split('\n').find((l) => l.startsWith('| 要求する権限 |'));
  assert.ok(row, '「要求する権限」の行が無い');
  const names = [...row.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  assert.deepEqual(names.sort(), [...manifest.permissions].sort());
  const count = row.match(/(\d+)つ/);
  assert.ok(count, '件数が書かれていない');
  assert.equal(Number(count[1]), manifest.permissions.length, '書いた件数が違う');
});

test('効かせるオリジンが、4つの完全一致のままである', () => {
  // 件数だけを見ると、1つを <all_urls> に置き換えても通ってしまう。
  // content script は matches に当たるページで毎回読み込まれるので、
  // ここは権限が広がったことに気づける最後の場所になる。
  assert.deepEqual([...manifest.host_permissions].sort(), ALLOWED_ORIGINS);

  for (const cs of manifest.content_scripts) {
    assert.deepEqual([...cs.matches].sort(), ALLOWED_ORIGINS, 'content_scripts の matches が違う');
  }
});

test('広い書き方のオリジンが混ざっていない', () => {
  // 完全一致の検査に加えて、危ない書き方そのものを名指しで拒む。
  // 範囲を広げる変更をしたときに、期待値の側だけ直して通してしまうのを防ぐ。
  const patterns = [
    ...manifest.host_permissions,
    ...manifest.content_scripts.flatMap((cs) => cs.matches),
  ];
  for (const p of patterns) {
    assert.ok(p !== '<all_urls>', `<all_urls> が入っている: ${p}`);
    assert.ok(!p.includes('*://'), `スキームがワイルドカードになっている: ${p}`);
    assert.ok(!/^https:\/\/\*/.test(p), `ホストがワイルドカードになっている: ${p}`);
    assert.ok(p.startsWith('https://'), `https 以外が入っている: ${p}`);
  }
});
