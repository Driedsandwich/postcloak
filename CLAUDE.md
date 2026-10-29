# CLAUDE.md — このリポジトリで作業する AI への決まり

PostCloak は、x.com のポストをシークレットウィンドウで開く Chrome 拡張（Manifest V3）です。**公開リポジトリ**で、ストアにも公開済みです。
ここに書いたことは、2026-10 時点の `main`（`179ab6b`）で実際にファイルを読み、コマンドを実行して確かめた内容だけです。全体のしくみは `docs/ARCHITECTURE.md`、用語は `docs/GLOSSARY.md` を見てください。

## 1. 検査とテスト（この順で、すべて通してから push する）

依存パッケージは無いので `npm install` は要りません（`README.md:100`、`.github/workflows/ci.yml:31`）。
下の結果は Linux・Node.js 22.22.0・git 2.43.0・bash 5.2 で実行して確かめたものです。

```bash
npm run check            # JS の構文と JSON の読み込み。終了コード 0
npm run test:unit        # 拡張そのもののテスト。87 件すべて pass（Node.js だけで走る）
npm test                 # 上の 87 件 + 提出物の手順のテスト 38 件。すべて pass
bash -n tools/package.sh # 提出手順の構文検査。終了コード 0
git diff --check         # 空白の混入検査。終了コード 0
```

- `npm test` には sh・bash・git・zip・unzip・cmp・mkfifo と、shasum か sha256sum が要ります。足りないと冒頭で名前を挙げて止まります（`integration/package-script.js:46-67`）。
- コミットする前の差分には `git diff --cached --check` も通します（CI は `git diff --check` を走らせます。`.github/workflows/ci.yml:50-51`）。
- 提出用 ZIP の手順を確かめるときは `npm run package`。**コミット済みで作業ツリーが HEAD と一致しているときだけ**通常モードで成功し、`dist/postcloak-<版>-<コミット12桁>.zip` を作ります（`tools/package.sh:149-174`、`:297`）。`dist/` は `.gitignore` 済みですが、確かめ終わったら消してください。
- `POSTCLOAK_ALLOW_DIRTY_PACKAGE=1` は手元の確認用です。出来る ZIP は名前に `UNCOMMITTED` が入り、提出には使えません（`tools/package.sh:28-30`）。
- `npm audit` は lockfile が無いので `ENOLOCK` で止まります。依存が無いための正常な状態です。**lockfile や依存をリポジトリに足さないでください。**
- CI は Ubuntu で全部、Windows で `npm run check` と `npm run test:unit` だけを走らせます（`.github/workflows/ci.yml`）。本物の Chrome での確認は自動化されておらず、`SMOKE.md` の手順で人間が行います。

## 2. 触ってはいけない物（依頼で明示されたときだけ変える）

- **`manifest.json`**：版・権限・対象サイト・名前・読み込むファイル。
  - 権限は `contextMenus` と `scripting` の2つ、対象は `x.com`・`www.x.com`・`twitter.com`・`www.twitter.com` の4つの完全一致、とテストで固定しています（`test/manifest.test.js:124-155`、`test/post-url.test.js:100-108`）。テストの期待値の側を書き換えて通すことはしない。
  - 対象サイトを変えるときは `PRIVACY.md` とストア掲載文も同時に直す決まりです（`test/manifest.test.js:116`）。
- **版の番号**：`manifest.json` と `package.json` の `version` は同じ値でなければテストが落ちます（`test/manifest.test.js:112-114`）。ストアは同じか低い版の再アップロードを受け付けません（`STORE_LISTING.md:285`）。勝手に上げない・下げない。
- **`_locales/en/messages.json` の `extName` と `extDescription`**：英語ファイルでも、わざと日本語のままにしています（公開中の掲載名を変えないため。同ファイルの `description` と `STORE_LISTING.md:78`）。「訳し忘れ」として直さない。
- **`tools/package-files.txt`**：提出用 ZIP に入れる一覧の正本（`tools/package-files.txt:1-7`）。ここに無い物は配布されません。一覧と manifest の食い違いはテストが検出します（`test/package.test.js`）。
- **`SMOKE.md` の記録**：「過去の記録」の表と「まだ確かめていないこと」に書かれたコミット・版・ZIP の SHA-256・拡張 ID・日付は、**その時点の証拠**です。書き換えたり「最新に合わせて」直したりしない。新しい確認は行を足して記録します。
- **`STORE_LISTING.md` §5.3（前回の申告の記録）**と、ダッシュボードで決めた申告内容。画面を見て人間が決めることなので、コードから推して書き換えない（`STORE_LISTING.md:193-196`）。
- **`.github/workflows/ci.yml` の action の固定**：action はコミットの SHA で固定しています（`.github/workflows/ci.yml:18-20`）。`@v7` のようなタグへ戻さない。`permissions: contents: read` と `persist-credentials: false` も外さない。
- **`LICENSE`**、**`icons/`** の画像。
- **ストアへのアップロード・審査への提出・公開**は人間が行います（`STORE_LISTING.md:298`）。AI は行いません。

## 3. コードを変えるときに守っている形

確かめた理由つきです。変えると壊れる、またはテストが落ちます。

- **URL の判定は `post-url.js` の1か所だけ**。content script と service worker の両方が同じファイルを読みます（`post-url.js:1-10`）。同じ判定をほかのファイルへ書き写さない。開く直前に `background.js` が必ずもう一度通す形も崩さない（`background.js:90-96`）。
- **`post-url.js` の一番外側で `const` / `let` / `class` を使わない**。タブへ入れ直したときに同じファイルが再実行され、再宣言で落ちるため（`post-url.js:8-11`）。`content.js` も全体を無名関数で包んでいる（`content.js:5-7`）。
- **読み込む順番は `post-url.js` → `content.js`**。manifest と、`background.js` の入れ直しの両方でこの順です（`manifest.json:36-39`、`background.js:118-120`）。テストが確かめています（`test/manifest.test.js:91-110`）。
- **`scripting` を使うのは `reviveContentScript` の1か所だけ**と、`PRIVACY.md:58` とストアの申告に書いてあります。ほかの用途に広げない。
- **永続的な保存・外部への通信をしない**と `PRIVACY.md` に書いてあります。`chrome.storage`・`fetch` などを足す変更は、文書の約束を破ります。
- **テストは `test/` の下に `node:test` で書く**（Node が自動で見つけます）。提出物の手順のテスト `integration/package-script.js` は、Node の自動の探索に**当たらない**場所と名前に置く決まりで、テストが確かめています（`tools/run-unit-tests.js:27-33`、`test/run-unit-tests.test.js:20-25`）。
- **`tools/package.sh` は macOS の bash 3.2 でも動く書き方**にする。`mapfile` を使わない、変数の直後に日本語を続けるときは `${変数}` と書く（`tools/package.sh:216`、`:163-165`。後者は `integration/package-script.js` の T11 が検査）。
- テストの期待値と、`README.md`・`PRIVACY.md`・`STORE_LISTING.md`・`SMOKE.md` の説明は対になっています。挙動を変えたら、これらの文書の該当箇所も同じ変更の中で直す。

## 4. 公開物としての注意

- **個人の情報を入れない**：人の名前、メールアドレス、手元の絶対パス（`/Users/…`、`/home/…`、`C:\Users\…`）や `~/…` の手元のパス、鍵・トークン・パスワードを、ファイルにもコミットメッセージにも書かない。テストで例が要るときは `alice` や `test@example.invalid` のような作り物を使う（`test/post-url.test.js:13`、`integration/package-script.js:76`）。
- **コミットの作者情報**：個人のメールアドレスではなく、GitHub の noreply アドレスなど公開してよい物で作る。
- **ダッシュボードの画面や提出の記録はリポジトリの外に置く**（公開ページに出さない情報が含まれるため。`STORE_LISTING.md:258`）。
- 見つけた秘密情報や個人情報は、値を書かずに種類と場所だけを報告する。

## 5. 変更の流儀

- **最小の差分**。頼まれたことだけを変え、ついでの整形・言い換え・リファクタリングを混ぜない。
- 作業は作業用の枝で行い、`main` や他の人の枝へ直接書かない。
- コミットメッセージは**日本語で1行**、やったことを平叙文で書く（例: 「SMOKE.md に … を記録した」。`git log` の書き方に合わせる）。
- 文書では、**確かめた事実**（実行した・該当行を読んだ）と**推測**を分けて書き、確かめられなかったことは理由とともに「未確認」と書く。`SMOKE.md` と `README.md:113-144` がこの書き方です。
- 説明には根拠のファイルとおおよその行を添える。
