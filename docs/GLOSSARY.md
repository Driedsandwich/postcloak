# 用語集

PostCloak のコードと文書に出てくる言葉を、プログラムを書かない人向けに説明します。
各項目の「根拠」は、その言葉が実際に使われている場所（ファイル:おおよその行）です。行番号はこの文書を足したときのもので、コードが変わるとずれます。
説明のうち、このリポジトリの中で確かめていない一般論には「（一般的な説明）」と書いています。

全体の流れは [ARCHITECTURE.md](./ARCHITECTURE.md) を見てください。

---

## Chrome 拡張のしくみ

| 用語 | やさしい説明 | 根拠 |
|---|---|---|
| Chrome 拡張 | Chrome に機能を足す小さなプログラム。PostCloak もその1つ | `README.md:3` |
| manifest（マニフェスト） | 拡張の設計図にあたるファイル `manifest.json`。名前・版・権限・どのページで何を読むかを書く | `manifest.json` |
| Manifest V3（MV3） | manifest の書き方の第3版。いまの Chrome 拡張の標準（一般的な説明） | `manifest.json:2` |
| 版（version） | `1.6.1` のような番号。`manifest.json` と `package.json` で同じ値でなければテストが落ちる。ストアは同じか低い版の再アップロードを受け付けない | `manifest.json:4`、`test/manifest.test.js:112-114`、`STORE_LISTING.md:285` |
| service worker（サービスワーカー） / background | 拡張の「裏側」で待機している係。ページとは別の場所で動き、右クリックメニューやウィンドウを扱う。このリポジトリでは `background.js` | `manifest.json:17-19`、`background.js:1` |
| content script（コンテンツスクリプト） | 対象のページの中に入って動く係。ページの中身（DOM）を読める。このリポジトリでは `post-url.js` と `content.js` | `manifest.json:28-42` |
| 入れ直し（再注入） | 拡張を入れる前から開いていたタブへ、content script を後から入れること。Chrome は自動ではやらないので、PostCloak が `reviveContentScript` で行う | `background.js:81-83`、`:114-130` |
| `importScripts` | service worker が別のファイル（ここでは `post-url.js`）を読み込む命令 | `background.js:7` |
| 権限（permissions） | 拡張が使える Chrome の機能の許可。PostCloak は `contextMenus`（右クリックメニュー）と `scripting`（入れ直し）の2つだけ | `manifest.json:7-10`、`test/manifest.test.js:124-129` |
| ホスト権限（host_permissions） | 拡張が手を出してよいサイトの範囲。PostCloak は x.com・www.x.com・twitter.com・www.twitter.com の4つの完全一致 | `manifest.json:11-16`、`test/manifest.test.js:131-140` |
| `<all_urls>` / ワイルドカード | `<all_urls>`（すべてのサイト）や、スキーム・ホストを `*` にする指定（`*://…`、`https://*.x.com/…` など）のような広い指定。PostCloak はこれらを使わず、テストで禁じている。経路（パス）の `/*`（そのサイトのどのページでも）は使っている | `test/manifest.test.js:142-155`、`manifest.json:11-16`、`:30-35` |
| contextMenus / 右クリックメニュー | 右クリックで出る項目の一覧。PostCloak は項目を1つ足す | `background.js:33-42` |
| `documentUrlPatterns` | 右クリックメニューの項目を出すページの範囲。右クリックした「フレーム」のURLで判定される | `background.js:11-22`、`:39` |
| `contexts` | 右クリックメニューの項目を、ページ・選択文字・リンク・画像などのどこで出すか。`all` は拡張アイコンのメニューまで含むので使わない | `background.js:26-29` |
| シークレットウィンドウ（Incognito） | 履歴やログイン状態を普段のウィンドウと分けて開くウィンドウ。PostCloak は毎回**新しい**シークレットウィンドウを開く | `background.js:146-161`、`README.md:73` |
| 「シークレット モードでの実行を許可」 | Chrome の拡張ごとの設定。PostCloak を動かすのには要らない。オンにしても挙動は変わらない | `background.js:146-153`、`README.md:73` |
| タブ ID / フレーム ID（`tabId` / `frameId`） | タブや、ページの中の区画（iframe など）を見分ける番号。どのページのどこへ話しかけるかを指定するのに使う | `background.js:53-58` |
| iframe（フレーム） | ページの中に別のページをはめ込む仕組み（一般的な説明）。他のサイトに埋め込まれたポスト（`platform.twitter.com`）は対象外 | `background.js:13-16`、`README.md:53` |
| メッセージ（`sendMessage` / `onMessage`） | 裏側の係とページの中の係が、短い依頼や返事をやり取りする仕組み | `background.js:79`、`content.js:216` |
| 文脈を失う（context invalidated） | 拡張を更新・無効化したあと、古いタブに残った content script が拡張本体とつながらなくなった状態。このとき文言の仕組み（i18n）も消える | `content.js:28-36`、`:269-270` |
| i18n / ロケール / `_locales` | 表示言語ごとの文言の切り替え。`_locales/en` が英語、`_locales/ja` が日本語。既定は英語（`default_locale`） | `manifest.json:5`、`_locales/` |
| `__MSG_extName__` | manifest の中で「文言ファイルの `extName` を入れて」という書き方 | `manifest.json:3`、`test/manifest.test.js:18-33` |
| Chrome ウェブストア | 拡張を配布する Google の公式の店。PostCloak は公開済み | `README.md:80`、`STORE_LISTING.md:1-6` |
| 単一目的 | ストアの決まりで、拡張は1つの目的だけを持つこと。PostCloak の目的は「x.com のポストをそのURLでシークレットウィンドウに開くこと」 | `STORE_LISTING.md:160-169` |
| Limited Use（限定利用） | ストアの利用者データの決まりの一部。目的以外にデータを使わない・渡さない・売らない | `PRIVACY.md:80-84` |
| リモートコード | 外から取ってきたプログラムを実行すること。PostCloak は行わない | `PRIVACY.md:64-68` |

## 操作と画面

| 用語 | やさしい説明 | 根拠 |
|---|---|---|
| ポスト | X（旧 Twitter）の投稿1件 | `README.md:3` |
| Shift+Alt クリック | Shift と Alt を押しながらのクリック。ポストの上ならそのポストを開く | `content.js:183-212` |
| 修飾キー | Shift・Alt・Ctrl・Command（Mac）など、ほかのキーと一緒に押すキー | `content.js:188-198` |
| AltGr / AltGraph | 一部の Windows 配列で記号を打つためのキー。Ctrl+Alt として届くことがある。PostCloak は AltGr が押されていたら反応しない | `content.js:188-197`、`README.md:48` |
| `getModifierState` | 「いまこの修飾キーが押されているか」をブラウザに尋ねる機能。古い環境には無いことがあるので、あるか確かめてから使う | `content.js:193-196` |
| 入力言語のホットキー | Windows で入力言語を切り替えるキーの組み合わせ。Left Alt+Shift が割り当てられていると、Shift+Alt クリックと同時に言語が切り替わることがある | `README.md:42-47` |
| 帯（トースト・通知） | 画面下に数秒だけ出る小さな案内。`alert()` のように操作を止めない | `content.js:284-325` |
| `role="status"` / `aria-live` | 読み上げソフトに、帯の文を割り込まずに読ませるための印 | `content.js:296-300` |
| X Pro（pro.x.com） | X の別の画面。作りが違うので対象外 | `README.md:54`、`test/post-url.test.js:62` |

## URL とページの中身

| 用語 | やさしい説明 | 根拠 |
|---|---|---|
| URL | ページの住所。例 `https://x.com/alice/status/123` | `post-url.js:37` |
| パーマリンク | そのポスト専用の固定の住所。x.com ではタイムスタンプ（投稿時刻）がこのリンクになっている | `content.js:147-155` |
| 派生ページ | ポストにぶら下がる別の画面（`/photo/1`・`/video/1`・`/analytics`・`/likes`・`/retweets`・`/quotes`）。PostCloak はポスト本体へ戻してから開く | `post-url.js:28-31` |
| 正規化 | 同じポストを指す色々な書き方を、決まった1つの形に整えること | `post-url.js:2`、`:55-66` |
| 許可ホスト（`ALLOWED_HOSTS`） | 開いてよいサイト名の一覧。4つの完全一致 | `post-url.js:14-16`、`test/post-url.test.js:100-108` |
| 絶対URL / 相対URL | 絶対URLは `https://` から始まる完全な住所。相対URLは `/alice/status/123` のような、今いるページを起点にした書き方 | `post-url.js:33-36` |
| base（基準URL） | 相対URLを読むときの起点。content script は今のページのURLを渡し、裏側は渡さない（＝相対URLは裏側で弾かれる） | `post-url.js:35-36`、`content.js:157-161` |
| クエリ / フラグメント | URL の `?` 以降と `#` 以降。PostCloak は組み立て直すので入らない | `post-url.js:63-64`、`test/post-url.test.js:33-35` |
| 資格情報入りの URL | `https://user:pass@host/` のように ID とパスワードが埋め込まれた URL。開かずに弾く | `post-url.js:49-50` |
| ポート | サイトの「窓口番号」。https は通常 443。それ以外の番号がついた URL は弾く | `post-url.js:51-52` |
| ホスト偽装 | `x.com.evil.example` のように、許可したサイトに見せかけた別のサイト。完全一致で見るので通らない | `post-url.js:14-15`、`test/post-url.test.js:46` |
| 正規表現 | 文字の並びの「形」を書く記法。ポストのパスの形を表すのに使う | `post-url.js:22-31` |
| DOM | ブラウザがページの中身を部品の木として持っているもの。PostCloak は読むだけで書き換えない（帯を除く） | `content.js:3` |
| 要素 / `<a>` / `<article>` / `<time>` | DOM の部品。`<a>` はリンク、`<article>` は x.com ではポスト1件の箱、`<time>` は投稿時刻 | `content.js:130-155` |
| 祖先をたどる | 触った部品から、その親、そのまた親…と上へ順に見ていくこと | `content.js:110-145` |
| `div[role="link"]` | 見た目はリンクだが `<a>` ではない部品。引用の箱がこれで、PostCloak はわざと区別しない | `SMOKE.md:54` |
| イベント / listener | 「右クリックされた」「クリックされた」という知らせと、それを待ち受ける処理 | `content.js:170-212` |
| capture 段 / bubble 段 | 知らせがページの外側から内側へ届く段階（capture）と、内側から外側へ戻る段階（bubble）。PostCloak は先に届く capture 段で拾う | `content.js:165-168` |
| `preventDefault` / `stopPropagation` | 「ブラウザ本来の動き（リンク移動など）をやめて」「この知らせをほかへ回さないで」という指示 | `content.js:202-209` |
| 合成イベント / `isTrusted` | ページ側のプログラムが作った偽物の操作。本物の操作だけ `isTrusted` が真になるので、偽物は無視する | `content.js:171-175`、`:190-191` |
| 控え（`lastContext`） | 右クリックした時点で割り出したポストのURLを、メニューが押されるまで覚えておく入れ物 | `content.js:55-61` |
| 60秒の期限（TTL） | 控えを使ってよい時間。過ぎたら使わず、タイマーで消す | `content.js:52-53`、`PRIVACY.md:43-49` |
| タイマー / handle | 「60秒後にこれをして」という予約と、その予約を取り消すための札 | `content.js:90-105` |
| 世代番号（generation） | 控えを作るたびに増える番号。古いタイマーが新しい控えを消さないための目印 | `content.js:76-106` |
| `source`（`link` / `fallback`） | 控えのURLを、リンクの上から採ったか（link）、ポストの箱から採ったか（fallback）の区別。消してよいかの判断に使う | `content.js:79-82`、`:128-145` |
| `getContextTarget` / `clearContextTarget` / `notify` / `open` | 係どうしのメッセージの種類。それぞれ「控えをちょうだい」「控えを消して」「帯を出して」「これを開いて」 | `content.js:216-262`、`background.js:134-142` |
| 二重登録 | 同じ待ち受け処理が2つ登録され、1回の操作で2回動くこと。印 `__postCloakLoaded` で防ぐ | `content.js:8-10`、`test/content-script.test.js:197` |
| 無名関数で包む / `var` と `const` | ファイルをもう一度読み込んだときに「同じ名前がもうある」で落ちないための書き方。`post-url.js` の一番外側では `const` などを使わない | `post-url.js:8-11`、`content.js:5-7` |

## 開発の道具とテスト

| 用語 | やさしい説明 | 根拠 |
|---|---|---|
| Node.js | ブラウザの外で JavaScript を動かす道具。テストと道具に使う（22 以降） | `README.md:107` |
| npm / npm scripts | Node.js に付いてくる道具。`npm test` などの短い命令の中身は `package.json` に書いてある | `package.json:7-12` |
| 依存パッケージ | 他の人が作ったライブラリ。PostCloak は1つも使っていない | `README.md:106`、`.github/workflows/ci.yml:31` |
| `npm run check` | JavaScript と JSON の書き方に間違いがないかの検査 | `package.json:10` |
| テスト / `node:test` | プログラムが期待どおりに動くかを自動で確かめるもの。Node.js に組み込みの仕組みを使う | `test/post-url.test.js:3-7` |
| 単体テスト（`npm run test:unit`） | 拡張そのもののテスト。Windows でも走る | `package.json:9`、`tools/run-unit-tests.js:1-5` |
| 統合テスト（提出物の手順のテスト） | `tools/package.sh` を実際に起動して確かめるテスト。bash・git・zip などが要る | `integration/package-script.js:1-10`、`:46-58` |
| `--full` | `npm test` が付けている指定。統合テストまで含めて走らせる | `package.json:8`、`test/package.test.js:92-97` |
| ランチャー | テストを起動する係 `tools/run-unit-tests.js` | `tools/run-unit-tests.js` |
| Node の既定の探索 | `node --test` が「テストらしいファイル」を自動で探す規則。統合テストはわざとこれに当たらない場所と名前に置く | `tools/run-unit-tests.js:7-51` |
| 偽物の DOM / 偽物の chrome | テストのために作った、本物の代わりをする小さな部品 | `test/content-script.test.js:3-7`、`test/background.test.js:3-6` |
| `vm` | Node.js の中に、別の小さな実行場所を作る仕組み。テストで `content.js` などを本物のように動かすのに使う | `test/content-script.test.js:13` |
| 差し込み（shim） | 本物の部品の手前に置いて、わざと失敗を起こす仕組み。テストのときだけ使う | `tools/fs-fault-shim.js:1-18`、`integration/package-script.js:145-153` |
| `NODE_OPTIONS` | Node.js の起動時の指定を、環境の設定で渡す方法。差し込みを読み込ませるのに使う | `tools/fs-fault-shim.js:3` |

## 提出用 ZIP と git

| 用語 | やさしい説明 | 根拠 |
|---|---|---|
| 提出用 ZIP / 配布物 | ストアへ上げるファイルの束。`dist/` に作る | `tools/package.sh:1-8`、`.gitignore` |
| 配布一覧（`tools/package-files.txt`） | ZIP に入れるファイルの一覧。正本はここ1つ | `tools/package-files.txt:1-7` |
| `dist/` | ZIP の置き場所。git には入れない | `.gitignore`、`tools/package.sh:285` |
| git / コミット / HEAD | git は変更の記録を取る道具。コミットは記録の1回分。HEAD は「いま手元にある最新のコミット」 | `tools/package.sh:8-11` |
| 作業ツリー | 手元のファイルそのもの。コミット前の変更が入っていることがある | `tools/package.sh:8-11` |
| 枝（ブランチ） / main | 記録の流れの分かれ道。`main` が本流 | `.github/workflows/ci.yml:4-5` |
| index / assume-unchanged / skip-worktree | index は git が「次のコミットの予定」を持つ場所。後の2つは「このファイルの変更を見ないで」という印で、付いていると変更が見えなくなる。package.sh はこの印を直接見て止まる | `tools/package.sh:17-21`、`:112-141` |
| release モード / dirty モード | 提出用に HEAD から作る通常のモードと、手元の変更を固めて確かめるだけのモード | `tools/package.sh:149-174` |
| `POSTCLOAK_ALLOW_DIRTY_PACKAGE=1` | dirty モードを許す指定。値がちょうど `1` のときだけ効き、ZIP の名前に `UNCOMMITTED` が入る | `tools/package.sh:28-30`、`:160-170` |
| `git archive` | コミットの中身から直接 ZIP を作る git の命令 | `tools/package.sh:318` |
| `export-subst` / 改行の変換 | git が ZIP を作るときに中身を書き換えてしまう設定の例。起きていないかバイト単位で比べる | `tools/package.sh:13-15`、`:369-395` |
| SHA-256 | ファイルの中身から計算する「指紋」。1バイトでも違えば値が変わる。提出した ZIP を見分けるのに使う | `tools/package.sh:23-26`、`SMOKE.md:127` |
| 再現性 | 同じコミットから作り直すと同じ ZIP になること。同じ道具の版なら一致を確かめているが、git の版が違うと一致しない | `tools/package.sh:23-26` |
| シンボリックリンク | 別の場所を指す「近道」のファイル。提出物の中や出力先がこれだと止まる | `tools/package.sh:151-158`、`:273-283` |
| FIFO | 特殊なファイルの一種（一般的な説明）。出力先がこれだと止まることをテストしている | `integration/package-script.js:720` |
| `set -euo pipefail` / EXIT トラップ | bash で「途中で失敗したら止まる」「終わるときに後片付けする」ための書き方 | `tools/package.sh:34`、`:49-74` |
| bash 3.2 | macOS に入っている古い bash。書き方によっては新しい bash と違う動きをするので、それに合わせた注意が書いてある | `tools/package.sh:56-60`、`:163-165` |

## CI と確認の記録

| 用語 | やさしい説明 | 根拠 |
|---|---|---|
| CI / GitHub Actions | push や PR のたびに、GitHub の上で自動でテストを走らせる仕組み | `.github/workflows/ci.yml` |
| ランナー（ubuntu-latest / windows-latest） | CI でテストを走らせる GitHub 側の計算機 | `.github/workflows/ci.yml:14`、`:64` |
| SHA 固定（action の固定） | CI で使う部品を、変えられない識別子（コミットの SHA）で指定すること。`@v7` のような名前は後から中身が変わりうる | `.github/workflows/ci.yml:18-20` |
| `persist-credentials: false` | CI の中に GitHub の認証情報を残さない指定 | `.github/workflows/ci.yml:21-23` |
| `git diff --check` | 行末の余計な空白などが混ざっていないかの検査 | `.github/workflows/ci.yml:50-51` |
| 実機確認 / SMOKE | 本物の Chrome に読み込んで、手で確かめること。手順と記録は `SMOKE.md` | `SMOKE.md:1-14` |
| 展開物 | 提出用 ZIP を開いて取り出したフォルダ。提出前の確認はリポジトリのフォルダではなくこれで行う | `SMOKE.md:9-14` |
| 補助手順 | 右クリックせずに、控えている値を service worker のコンソールから尋ねる方法 | `SMOKE.md:80-108` |
| DevTools / コンソール | Chrome の開発者向けの画面と、命令を打てる欄 | `SMOKE.md:84-106` |
| headless / CDP | headless は画面を出さずに動かす Chrome。CDP はその Chrome を外から操作する仕組み。どちらも過去の確認で使われた | `SMOKE.md:120-121` |
| 合成ページ | 確認用に手元で作った、x.com に似せた最小のページ。本物の x.com ではない | `SMOKE.md:121` |
| 対照（陽性の対照） | 「確かめ方そのものが正しく反応するか」を見るために、結果が分かっている例を並べて試すこと | `SMOKE.md:120-121` |
| 判別力 / 壊した写し | 確認方法が「正しい物」と「壊れた物」を見分けられるか。わざと壊したコードの写しで試して、ちゃんと落ちるかを見る | `SMOKE.md:121` |
| 拡張 ID | Chrome が拡張ごとにつける識別子。SMOKE.md の記録に残っている | `SMOKE.md:120` |

## ライセンスとその他

| 用語 | やさしい説明 | 根拠 |
|---|---|---|
| MIT ライセンス | 「著作権表示とこの許諾文を残せば、誰でも自由に使ってよい。保証はしない」という短いライセンス | `LICENSE` |
| 免責 | X Corp. とは無関係で、承認も後援も受けていないという断り書き | `README.md:163-165` |
| 着想 | 他の拡張（incognito-link）からアイデアを得たという意味。コードを受け継いだかどうかは、このリポジトリからは未確認 | `README.md:159-161` |
