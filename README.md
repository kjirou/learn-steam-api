# learn-steam-api

Steam API を API キーなしの範囲で叩くコマンドラインツール。結果は整形した JSON で出力する。

## 必要なもの

- Node.js 18 以上（組み込みの `fetch` を使用。依存パッケージなし）

## 使い方

```
node steam.mjs <command> [args]
```

### コマンド一覧

| コマンド | 説明 |
| --- | --- |
| `players <appid>` | 現在の同時接続プレイヤー数 |
| `news <appid> [count]` | ゲームのニュース（デフォルト 3 件） |
| `achievements <appid>` | グローバル実績達成率 |
| `details <appid>` | ストアのアプリ詳細（日本語・JPY） |
| `search <term>` | ストア内検索 |

### 実行例

```console
$ node steam.mjs players 730
{
  "response": {
    "player_count": 591857,
    "result": 1
  }
}

$ node steam.mjs news 570 5
$ node steam.mjs details 1245620
$ node steam.mjs search "Elden Ring"
```

appid の例: `730` = CS2、`570` = Dota 2、`1245620` = ELDEN RING。appid がわからないときは `search` で調べられる。

## 補足

- `players` / `news` / `achievements` は公式 Web API（`api.steampowered.com`）のキー不要エンドポイントを使用
- `details` / `search` は非公式だが広く使われているストア API（`store.steampowered.com/api/…`）を使用。無認証のためレート制限が厳しめ（連打すると 429 になる）
- エラー時は `Error: ...` を stderr に出力して exit code 1 で終了する
