# ストア掲載情報の正本

Chrome ウェブストアの掲載ページに載せている文面と設定を、リポジトリ側にも置いたものです。
**ストアの掲載内容とこのファイルが食い違ったら、こちらを直してから掲載を直します。**

掲載ページ: https://chromewebstore.google.com/detail/pekgcaiokjokphdlmnkldmclffkeepnh

> ウェブストアのダッシュボードは、ブラウザ拡張から操作できません（Chrome 側が
> `The extensions gallery cannot be scripted.` で拒否します）。掲載内容の反映は
> かならず手作業になります。

---

## 1. 説明（詳細）— 日本語

```
PostCloak は、x.com のポストを、リンクになっていない本文の上からもシークレットウィンドウで
開けるようにする拡張です。ポストを Shift+Alt クリックするか、右クリックメニューの項目を
選ぶと、そのポストが新しいシークレットウィンドウで開きます。

Chrome の「シークレット ウィンドウで開く」は、リンクの右クリックメニューの項目です。
カーソルの下に <a> 要素があるときにしか出ません。

x.com のタイムラインでは、ポスト本文は <a> ではなく <div> にクリック処理が付いている
だけです。だからポスト本文を右クリックしても、その選択肢は出てきません。

PostCloak は、そのリンクになっていない場所からポストのURLを割り出して開きます。

■ 使い方
・ポストのどこかを Shift+Alt クリックする
・またはポストのどこかを右クリックして「このポストをシークレットウィンドウで開く」を選ぶ

ポストの本文やポストへのリンクの上なら、どちらも同じ結果になります。
ポストの中のプロフィール・外部記事・ハッシュタグのリンクの上では結果が分かれ、
右クリックの項目は囲みのポストを開き、Shift+Alt クリックには拡張は介入しません。
ポストの外（サイドバーや余白）では、ポストへのリンク（タイムスタンプなど）の上ならそのポストを
開きます。それ以外の所を右クリックして選んだときは、ウィンドウは開かず、画面下に短い案内が
出ます。それ以外の所で Shift+Alt クリックしたときは、拡張は何もしません（窓も案内も出しません）。

■ 動作する範囲
x.com / www.x.com / twitter.com / www.twitter.com のページ上だけです。
第三者のサイトに埋め込まれたポストでは動かず、メニュー項目も出しません。
pro.x.com（X Pro）は画面の作りが別で、対象外です。

■ 知っておいていただきたいこと
・シークレットウィンドウは毎回あたらしく開きます。既にあるシークレットウィンドウに
　タブを足す機能はありません
・シークレットウィンドウは何枚開いても中身を共有し、最後の1枚を閉じるまで
　セッションが残ります
・ポストのURLでないリンク（プロフィール、外部記事、ハッシュタグなど）の上で
　Shift+Alt クリックしたときは、この拡張は介入せず、Chrome とページ本来の動作に任せます。
　ポストのパーマリンクと、画像・動画・いいねや引用の一覧など、ポストのURLから派生した
　リンクは、そのポストとして扱います
・Windows の一部の構成では、Left Alt+Shift が入力言語またはキーボードレイアウトの
　切替に割り当てられていることがあります。その構成で Shift+Alt クリックすると、
　ポストを開く操作と同時に入力言語が切り替わる場合があります。
　この割り当ては Windows 側の設定によるもので、この拡張が原因ではありません。
　設定画面の名称と場所は Windows の版・表示言語によって異なります。
　右クリックメニューはこのショートカット競合の影響を受けません
・拡張を入れる前、または 1.6.0 から更新する前から開いていた x.com のタブでは、
　Shift+Alt クリックで何も起きません。そのタブを一度読み直すか、ポストの本文（リンクで
　ない所）を右クリックしてメニューの項目を選ぶ（「準備ができました」と出ます）と、
　以後は開きます。新しく開いたタブや、一度読み直したタブでは起きません
・AltGr を押しながらのクリックには反応しません。多くの Windows の配列では AltGr が
　Ctrl+Alt として届くので、Ctrl または Command と一緒の Shift+Alt クリックも対象外です。
　拡張は AltGraph の状態も直接確かめています。
　そのときは拡張は何もせず、クリックは本来の動作のままです
・引用つきのポストでは、引用の箱の中のリンクでない所で使うと、外側のポストが開きます
　（引用元のタイムスタンプや画像のリンクの上なら、引用元のポストが開きます）
・シークレットモードが組織のポリシーなどで使えない環境では、ウィンドウは開かず、
　通常は画面下に案内が出ます

■ プライバシー
右クリックまたは Shift+Alt クリックした場所の周辺のハイパーリンクと、そこから取り出した
ポストのURL1件を、利用者の端末内で処理します。URLには投稿者のユーザー名にあたる部分が
含まれることがありますが（/i/status/ の形には含まれません）、ユーザー名を別の項目として
抽出・分析・記録することはしません。
開発者が管理するバックエンド、解析サービス、広告サービス、外部APIへは送信せず、
永続的な保存もしません。
右クリック経路のURLは、そのタブのメモリに置きます。60秒を超えた値は使いません。
置いたときのタイマーが参照を消し、それより前でも一度使う・別の場所を右クリックすると
捨てられます。ポストへのリンクの上で右クリックして開いた回は、その値を使わずに開き、
値を消すようタブへ依頼します（依頼が届かない場合も、60秒の期限・タイマー・次の右クリック
で捨てられます）。X の中で画面を移っても、それだけでは捨てられません（そのときも、60秒を
超えた値は使わず、タイマーが動いた時点で参照を消します）。
ポストを開くときは、Chrome が表示先である X へ通常の HTTPS ページ要求を行い、X はその
URLを受け取ります。拡張は、追加の情報・識別子・計測データ・別サーバーへの複製を
付けません。
要求する権限は contextMenus と scripting の2つと、x.com / www.x.com / twitter.com /
www.twitter.com の4つのドメインへのアクセスで、閲覧履歴を読む権限は要求しません。
本拡張によるユーザーデータの利用は、Chrome ウェブストア ユーザーデータ ポリシー
（Limited Use 要件を含む）に準拠します。

■ 免責
本拡張は X Corp. とは無関係の独立したツールで、同社による承認・後援を受けていません。
X および Twitter は X Corp. の商標です。

ソースコードは MIT ライセンスで公開しています。不具合の報告は Issue でお願いします。
```

## 2. 説明（詳細）— 英語

> 掲載ページに英語ロケールを足すときの正本です。**拡張そのものの名前と短い説明（`manifest.json` の `name` / `description`）は、どのロケールでも日本語のままにしています**（`_locales/en/messages.json` の `extName` / `extDescription` を日本語文面に揃えてあります）。`default_locale` が `en` なので、ここを英語にすると公開中の掲載名が変わってしまうためです。メニューや通知など製品内の文言は、通常どおり英語と日本語で分かれます。

```
PostCloak lets you open an x.com post in an Incognito window from the body text of the
post, not only from its links. Shift+Alt click the post, or choose the item in the
right-click menu, and the post opens in a new Incognito window.

Chrome's "Open link in Incognito window" is an item in the link context menu.
It only appears when there is an <a> element under the cursor.

On the x.com timeline, the body of a post is not an <a> — it is a <div> with a
click handler. So right-clicking the text of a post never offers that option.

PostCloak works out the post's URL from those non-link areas and opens it.

■ How to use
- Shift+Alt click anywhere on a post
- Or right-click a post and choose "Open this post in an Incognito window"

On the post body or on a link to a post, both do the same thing. On a profile, external
article, or hashtag link inside a post they differ: the menu item opens the enclosing
post, while the extension leaves a Shift+Alt click alone.
Outside a post (sidebar, margins), a link to a post (such as its timestamp) still opens
that post. Anywhere else there, choosing the menu item opens no window and shows a short
notice at the bottom of the page, and on a Shift+Alt click the extension does nothing
(no window, no notice).

■ Where it runs
Only on pages of x.com / www.x.com / twitter.com / www.twitter.com.
It does not run on posts embedded in third-party sites, and no menu item appears there.
pro.x.com (X Pro) has a different layout and is out of scope.

■ Things worth knowing
- A new Incognito window opens every time. There is no feature that adds a tab to an
  Incognito window you already have open.
- Incognito windows share one session; it lasts until you close the last one.
- When you Shift+Alt click a link that is not a post URL (a profile, an external
  article, a hashtag), the extension does not intervene, and Chrome and the page handle
  the click normally. A post permalink, and links derived from a post URL (its images,
  videos, likes, or quotes), are treated as that post.
- On some Windows configurations, Left Alt+Shift may be assigned to switch the input
  language or keyboard layout. In that configuration, a Shift+Alt click may also trigger
  the operating system's language switch. That assignment comes from Windows, not from
  this extension. The setting name and location vary by Windows version and display
  language. The right-click menu is unaffected by this shortcut conflict.
- In x.com tabs that were already open before you installed the extension, or before you
  updated from 1.6.0, a Shift+Alt click does nothing. Reload that tab once, or right-click
  the body of a post (not a link) and choose the menu item (it shows "Ready now — please
  try once more."); after that it opens normally. Newly opened or reloaded tabs are not
  affected.
- The extension ignores clicks made while holding AltGr. On many Windows layouts AltGr
  arrives as Ctrl+Alt, so a Shift+Alt click together with Ctrl or Command is ignored too;
  the extension also checks the AltGraph modifier directly. In those cases it opens
  nothing and leaves the click's normal behaviour alone.
- In a post that quotes another post, using it on a non-link area inside the quoted box
  opens the outer post (on the quoted post's timestamp or image link, the quoted post
  opens).
- Where Incognito mode is disabled (for example by an organization's policy), no window
  opens, and a notice usually appears at the bottom of the page.

■ Privacy
This extension processes, on your device, the hyperlinks around the point you acted on
and one selected post URL. The URL may contain the post author's username as part of
its path (the /i/status/ form does not), but the extension does not separately extract,
analyze, profile, or record that username.
It does not send the data to a developer-controlled backend, analytics service,
advertising service, or external API, and it does not store it persistently.
On the right-click path, the URL is held in that tab's memory; a value older than 60
seconds is not used, a timer clears the reference, and it is discarded earlier if it is
used or if you right-click elsewhere. When you right-click a link to a post and open it
directly, the held value is not used; the extension asks the tab to discard it (if that
request does not arrive, the 60-second limit, the timer, or your next right-click still
discards it). Moving between screens within X does not discard it
by itself; the 60-second limit still applies.
To display the selected post, Chrome performs an ordinary HTTPS navigation to X, and X
receives that URL. The extension adds no extra payload, identifier, telemetry, or copy
to another server.
It requests two permissions, contextMenus and scripting, plus access to four domains
(x.com, www.x.com, twitter.com, www.twitter.com), and does not request permission to
read your browsing history.
The use of user data by this extension complies with the Chrome Web Store User Data
Policy, including the Limited Use requirements.

■ Disclaimer
This is an independent, unofficial tool. It is not affiliated with, endorsed by, or
sponsored by X Corp. X and Twitter are trademarks of X Corp.

The source code is published under the MIT license. Please report problems as an Issue.
```

## 3. 掲載ページのそのほかの欄

| 欄 | 値 |
|---|---|
| ショップ アイコン（必須） | 128×128。**パッケージの中のアイコンとは別枠**で、ZIP を上げても自動では入らない |
| カテゴリ | 仕事効率化（Productivity） |
| スクリーンショット | 1280×800 を4枚（メニュー / 開いた結果 / 使い方 / 動作範囲と権限） |
| プロモーション タイル（小・440×280） | 任意 |
| マーキー プロモーション タイル（1400×560） | 任意（未作成） |
| 公式 URL | なし（確認済みドメインを持つ場合の欄） |
| ホームページ URL | `https://github.com/Driedsandwich/postcloak` |
| サポート URL | `https://github.com/Driedsandwich/postcloak/issues` |
| プライバシーポリシー URL | `https://github.com/Driedsandwich/postcloak/blob/main/PRIVACY.md` |

## 4. 単一目的と権限の正当化

### 単一目的

```
x.com のポストを、そのポストのURLでシークレットウィンドウに開くこと。これが本拡張の唯一の機能です。
```

```
To open a post on x.com in an Incognito window, using that post's own URL.
That is the extension's only function.
```

### `contextMenus`

```
右クリックメニューに項目を1つ追加するためだけに使用します。項目を出す範囲は x.com / www.x.com / twitter.com / www.twitter.com のページに限定しており（documentUrlPatterns）、他のサイトでは表示されません。
```

### `scripting`

```
対象の4ドメインのページで content script と通信できなかったときに、同梱の content script（post-url.js と content.js）をそのタブへ入れ直すためだけに使用します。典型は、拡張のインストールまたは更新より前から開かれていたタブです（Chrome は既存のタブへ遡って content script を注入しないため、これが無いとインストール直後の右クリックが無反応になります）。コード上は background.js の reviveContentScript 関数の1箇所からのみ呼び出しており、他の用途には使用しません。
```

### ホスト権限（`https://x.com/*` ほか3件）

```
ポストのURLを割り出す処理と、上記 scripting による content script の入れ直しを、x.com / www.x.com / twitter.com / www.twitter.com の4つのドメインに限定するために宣言しています。<all_urls> や広域のパターンは使用していません。
```

### リモートコードの使用

**「いいえ」**。外部スクリプトの読み込み、`eval()` による遠隔文字列の実行、CDN からのライブラリ取得のいずれも行っていません。

## 5. データの取り扱いと、ダッシュボードでの申告

ここは**「コードから確定できる事実」と「人間が画面を見て決めること」を分けて**書きます。ダッシュボードのフォームは非公開の画面で、文言も改定されるため、コードだけを根拠にチェック内容を確定できません。

### 5.1 実装上の事実（コードから確定できる）

- 利用者が右クリックまたは Shift+Alt クリックしたとき、その位置の周辺の DOM を**端末内で読む**
- そこからポストのURLを**1件だけ**取り出す。URLには投稿者にあたる部分（`/<利用者名>/`）が含まれることがある（`/i/status/<番号>` と `/i/web/status/<番号>` の形には含まれない）
- 右クリック経路では、取り出したURL1件をそのタブのメモリに置く。**60秒を超えた値は使わない**（問い合わせ時に経過時間を確かめる）。置いたときのタイマーが60秒後以降の最初の機会に**参照そのものを消す**。それより前でも、一度使う・ポストの外を右クリックする・別の場所を右クリックし直す、のいずれかで捨てる。ポストへのリンクの上で右クリックして直接開く回は、控えた値を使わずに開き、値を消すようタブへ依頼する（完了は待たない。届かなければ60秒の期限・タイマー・次の右クリックが受け皿）。content.js に画面の移動を検知する処理は無いので、X の中で画面を移っても、それだけでは捨てない（そのときも、60秒を超えた値は使わず、タイマーが動いた時点で参照を消す）
- **開発者が管理するバックエンド・解析サービス・広告サービス・外部APIへは送らない**（そのいずれも実装に無い）
- **永続保存しない**（ディスクにも `chrome.storage` にも書かない）
- 利用者がポストを開いたときは、Chrome が**表示先である X へ通常の HTTPS ページ要求を行い、X はそのURLを受け取る**。拡張は追加の情報・識別子・計測データ・別サーバーへの複製を付けない

> **注意**: Chrome ウェブストアの「取り扱う（handle）」は**収集・送信・使用・共有**の4つを指し、**端末内だけの処理でも開示が必要**です（公式 User Data FAQ）。「外部送信がない」ことは「何も取り扱っていない」ことを意味しません。**「収集とは端末外への転送のこと」と読み替えて申告を決めないこと。**

### 5.2 ダッシュボードの申告（2026-08-05 に現行フォームの定義文を確認して判定）

**確認日: 2026-08-05。** ダッシュボードの「データ使用」フォームに表示されている定義文を実際に読み、実装と突き合わせて決めました。定義文は改定されることがあるので、次回もここを読み直してください。

フォームの問いは「**現在または今後、どのようなユーザーデータをユーザーから収集する予定ですか？**」で、そこから「よくある質問」（User Data FAQ）へリンクされています。左側には「**このフォームの内容は、アイテム詳細ページで一般公開されます。アイテムを公開することにより、これらの開示内容がお客様のプライバシーポリシーの最新の内容を反映したものであることを表明したことになります。**」とあります。

問いの語は「収集」ですが、その意味はリンク先の FAQ が定めており、FAQ は「取り扱う（handle）」を**収集・送信・使用・共有**の4つとしたうえで、**端末内だけで処理・保存する場合も開示が必要**と明記しています。さらに左側の但し書きが、**開示内容はプライバシーポリシーを反映していなければならない**と言っています。[PRIVACY.md](./PRIVACY.md) は端末内でハイパーリンクとポストURLを扱うと書いているので、フォーム側だけ「何も収集しない」にすると、この2つが食い違います。

**コードから確定できる事実と、フォームを見て人間が決めることを、列で分けてあります。** コードだけを根拠にチェックの有無を最終決定しないでください。

| 項目 | フォームの定義文（逐語） | コードから確定できる事実 | ダッシュボードでの判断 |
|---|---|---|---|
| **個人を特定できる情報** | 例: 名前、住所、メールアドレス、年齢、個人識別番号 | 取り出すポストのURLには、**投稿者のユーザー名にあたる部分**（`/<利用者名>/`）が含まれることがある（`/i/status/<番号>` と `/i/web/status/<番号>` の形には含まれない）。それを別に切り出したり記録したりはしないが、URLの一部として端末内で扱う | **チェックすることを推奨。必ずフォームで再確認する。** 公式 User Data FAQ は PII の例に *"a person's name, address, telephone number, email address, and **username**"* と**ユーザー名を明記**している。フォームの例示は「例:」で網羅ではないため、そこに無いことは除外の根拠にならない。**「URLの一部だからPIIではない」「利用者本人のユーザー名ではないからPIIではない」とはコードから断定できない** |
| **ユーザーのアクティビティ** | 例: ネットワーク監視、クリック、マウスの位置、スクロール、キーストロークの**ロギング** | 右クリックと Shift+Alt クリックのイベント、その `target`、修飾キーの状態を**機能の入力として使う**。記録・集計・送信はせず、マウス位置・スクロール・キー入力は扱わない | **必ずフォームで再確認する。** 定義の例はいずれも「ロギング（記録・監視）」を指しており、それに当たらないと読めるが、**「保存しないから扱っていない」とはコードから断定できない** |
| **ウェブサイトのコンテンツ** | 例: テキスト、画像、音声、動画、**ハイパーリンク** | ページ由来の**文字列として取り出すのは `href`（ハイパーリンク）だけ**（`getAttribute('href')` の2箇所）。相対URLを解くために、そのページのURL（`location.href`）を基準として使う。どのポストに属するかを判断するために、要素の種別・祖先関係・`article` と `time` を含むリンクの構造も参照する。本文・画像データ・音声・動画は取り出さない（`innerText` / `innerHTML` / `src` はいずれも0件） | **チェックする。** 定義の例に「ハイパーリンク」が名指しされており、端末内だけの処理でも開示が要る（FAQ） |
| **ウェブ履歴** | ユーザーがアクセスしたウェブページの**リスト**およびその関連データ（ページのタイトル、アクセス時刻など） | リストを作らない。ページのタイトルもアクセス時刻も扱わない。`history` も `tabs` 権限も要求しない。扱うのは、利用者がこれから開こうとしている**1件のURL** | **必ずフォームで再確認する。** 定義の中心は「アクセスしたページのリスト」で、それには当たらないと読める |
| 認証に関する情報 | 例: パスワード、認証情報、セキュリティ保護用の質問、PIN | `cookie` / `localStorage` / `sessionStorage` / `chrome.storage` へのアクセスが**いずれも0件**。`storage` も `cookies` 権限も要求しない | 抽出・保存・送信する処理が無い。フォームの文言と照合して確認 |
| 個人的コミュニケーション | 例: メール、テキストまたはチャットメッセージ | ポストの**本文を読んでいない**（`textContent` の唯一の登場箇所は自前の通知帯への書き込み） | 同上 |
| 健康／財務・支払い／位置情報 | （各例のとおり） | それらを目的に抽出・保存・送信する処理は無い | 同上 |
| 限定利用（Limited Use） | — | 単一目的を超えた利用・転送をしない | **チェックする。** 準拠文は [PRIVACY.md](./PRIVACY.md) §7 に日英とも記載済み |

**申告は過少にも過大にも寄せず、実装・現行フォームの定義・プライバシーポリシー・掲載説明に一致する正確な内容にしてください。**

「ウェブサイトのコンテンツ」（および推奨どおり「個人を特定できる情報」）にチェックを入れると、掲載ページの表示が「データを収集または使用しない」から開示ありへ変わります。**これは是正です**——現状の表示は、端末内でハイパーリンクとユーザー名を含むURLを使っている実装と食い違っています。

**画面の中での開示と同意（2026-10-31 に確認した論点）**: 公式の「Disclosure Requirements」（https://developer.chrome.com/docs/webstore/program-policies/disclosure-requirements ・頁の更新 2022-11-01）は「If your Product handles any user data, then prior to installation, it must: Prominently disclose what user data will be collected and how it will be used. Obtain the user's affirmative and informed consent for such use.」と書き、User Data FAQ の第10項は「The prominent disclosure and consent must occur within the Product's user interface. Disclosures in the Chrome Web Store description or inline installation page do not satisfy this requirement.」と書いている（どちらも 2026-10-31 に公式の頁を取って原文を確かめた）。3 つの頁に「目立つ機能と密接に関係しない取り扱いに限る」という限定の語は無い（2026-10-31 に数えて 0 件）。**文面の上では、端末内でハイパーリンクと URL を扱う本拡張にも当たりうる。** 決め（2026-10-31・作者）は、上の申告どおりに直して出し、画面の中の同意の仕組みは今は作らない（データは端末の外へ出ず、使うのは利用者がその場で選んだポストの URL 1 件だけ・審査で指摘されても直して出し直せる・同意の画面を足すとコードの変更と実機の取り直しが要る）。**審査でこの点を理由に戻されたら**、次の版（1.6.2）で、インストール直後に一度だけ開く説明の頁（扱う物・使い道・送らないこと）と同意のボタンを足して出し直す。

用途の記入欄が現れた場合は、次を貼ってください（欄が出なければ不要です）。

```
利用者が右クリックまたは Shift+Alt クリックした位置の周辺のハイパーリンクから、そのポストのURLを1件だけ取り出すために使用します。URLには投稿者のユーザー名にあたる部分が含まれることがありますが、ユーザー名を別の項目として抽出・分析・記録することはしません。取り出したURLは、そのポストをシークレットウィンドウで開くためだけに使い、開発者が管理するバックエンド・解析サービス・広告サービス・外部APIへは送信せず、永続的な保存もしません（右クリック経路では、そのタブのメモリに置き、60秒を超えた値は使わず、タイマーで参照を消します）。ポストを開くときは、Chrome が表示先である X へ通常の HTTPS ページ要求を行い、X はそのURLを受け取ります。
```

### 5.3 前回（2026-08-03 提出時）に申告した内容の記録

これは**当時そう申告したという記録**です。**2026-08-05 の判定（5.2）で「ウェブサイトのコンテンツ」を「チェックする」へ変更しました。**

> 項目名も当時の書き方と実物が違っていました。実物は **「ウェブ履歴」**（当時「ウェブ閲覧履歴」と記録）と **「ユーザーのアクティビティ」**（当時「ユーザーの操作」と記録）です。5.2 の表が実物の表記です。

| 項目 | 2026-08-03 の申告 |
|---|---|
| 個人を特定できる情報 | 収集しない |
| 健康情報 | 収集しない |
| 金融・決済情報 | 収集しない |
| 認証情報 | 収集しない |
| 個人的な通信内容 | 収集しない |
| 位置情報 | 収集しない |
| ウェブ閲覧履歴 | 収集しない |
| ユーザーの操作 | 収集しない |
| ウェブサイトのコンテンツ | 収集しない |
| 限定利用 | チェックあり |

確認した日付と画面の記録は、**このリポジトリの外**（提出用の素材を置いてある場所）に残してください。ダッシュボードの画面には、公開ページに出さない情報が含まれます。

## 6. 審査用のテスト手順（Provide test instructions 欄）

x.com のタイムラインはログインしないと表示されません。資格情報は渡さず、ログアウト状態でも表示される公開プロフィールページを指定しています。

```
This extension only works on x.com, www.x.com, twitter.com, and www.twitter.com.

1. Open https://x.com/NASA (a public profile; no login required to see posts).
2. Right-click on the text of any post (not on a link).
   → A menu item "Open this post in an Incognito window (Shift+Alt click)" appears.
   Note: Chrome's own "Open link in Incognito window" does NOT appear there, because
   the post body is a <div>, not an <a>. That gap is what this extension fills.
3. Click it. The post opens in an Incognito window.
4. Alternatively, Shift+Alt click on the text of any post. Same result.
5. Right-click an empty area outside any post (e.g. blank space in the sidebar, not on a
   link) and choose the same item.
   → A short notice appears at the bottom of the page; no window opens.

The menu item does not appear on any site other than x.com, www.x.com, twitter.com, and
www.twitter.com.
No network requests are made to any server by the extension itself.
```

## 7. 更新を出すときの手順

**順序が大事です。実機で確かめるのは、リポジトリのフォルダではなく「提出するそのZIPを展開したもの」にしてください。** フォルダでは動くのに配布物だけ壊れている、という形の事故は、それでしか捕まりません。

1. バージョンを決める。`manifest.json` と `package.json` の `version` を同じ値にする（**同一以下のバージョンは再アップロードを拒否される**。食い違いは `npm test` が検出します）
2. コードとテストを直しきる
3. `npm run check`
4. `npm test`
5. **コミットする**
6. `npm run package` で `dist/` に ZIP を作る。**通常モードは、追跡ファイルが HEAD と一致していなければ終了コード非0で停止し、提出名の ZIP を作りません**（作業ツリーを固めたいだけなら `POSTCLOAK_ALLOW_DIRTY_PACKAGE=1`。出力名に `UNCOMMITTED` が入り、提出には使えません）
7. 表示された commit・SHA-256・入ったファイル一覧を控える
8. その ZIP を**新しい一時フォルダへ展開する**
9. 展開したフォルダを、Chrome の「パッケージ化されていない拡張機能を読み込む」で読み込む
10. [SMOKE.md](./SMOKE.md) の全項目を行い、表を埋める（対象のZIPとSHA-256も記入する）
11. **いま検証したのと同じ ZIP** をダッシュボードでアップロードする。**ショップ アイコンはパッケージとは別枠**なので、意匠を変えたときは個別に上げ直す
12. アップロード後に、ダッシュボード上のバージョン・要求権限・ファイルサイズを確認する
13. 掲載文（§1 / §2）とデータ使用の申告（§5）を、ダッシュボードと同じ内容に揃える
14. 審査への提出と公開は人間が行う。自動公開を ON にしておくと、審査を通った時点でそのまま公開される（OFF にすると通過から30日以内の手動公開が必要で、過ぎるとドラフトへ戻る）
15. 公開後、掲載ページでバージョン・説明文・プライバシー表示の3つを確認する

却下されたときは、拡張に紐づく公開者メールアドレスへ通知が届きます。通過したときは通知されず、掲載ページの表示が変わることで分かります。

---

# 付録: なぜこの文面なのか

**単一目的を1文に固定した理由** — 「追跡防止」「複数アカウントの切り替え」などの副次的な効能を足すと、審査で別目的の抱き合わせと読まれる余地を自分で作ることになります。単一目的は説明文ではなく実装と権限で判定されるため、権限を `contextMenus` と `scripting` の2つに絞ったこと自体が最大の主張になります。

**効能表現を採らなかった理由** — 「ログイン画面をスキップ」「追跡されずに」といった書き方は、ウェブストアの「ログイン制限の迂回を助けてはならない」に正面から抵触します。一方で削り過ぎは Misleading Metadata 側のリスクになるため、**機構の記述**（何を押すと何が起きるか）に統一しました。「セッション分離」「ログイン中のアカウントと切り離して読む」も効能表現にあたるので採っていません。

**プライバシーポリシーが必須である理由** — ウェブストアの "handle" は「収集・送信・**使用**・共有」の4つを指し、公式の User Data FAQ が「ローカル処理だけでも開示が必要」と明記しています。「外部送信ゼロだから記入不要」とは主張できません。

**2026-08-01 施行のポリシー改定** — Limited Use と開示要件が厳格化されました。根拠: https://developer.chrome.com/blog/cws-policy-updates-2026
