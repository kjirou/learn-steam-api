#!/usr/bin/env node

const USAGE = `Usage: node steam.mjs <command> [args]

Commands (API キー不要のエンドポイントのみ):
  players <appid>              現在の同時接続プレイヤー数
  news <appid> [count]         ゲームのニュース (デフォルト 3 件)
  achievements <appid>         グローバル実績達成率
  details <appid>              ストアのアプリ詳細
  reviews <appid>              レビュー数のサマリー (好評/不評など)
  search <term>                ストア内検索

Examples:
  node steam.mjs players 730          # CS2
  node steam.mjs news 570 5           # Dota 2 のニュース 5 件
  node steam.mjs search "Elden Ring"
`;

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "learn-steam-api-cli" } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${url}`);
  }
  return res.json();
}

const commands = {
  async players([appid]) {
    return getJson(
      `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`
    );
  },

  async news([appid, count = "3"]) {
    return getJson(
      `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appid}&count=${count}&maxlength=300`
    );
  },

  async achievements([appid]) {
    return getJson(
      `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appid}`
    );
  },

  async details([appid]) {
    const data = await getJson(
      `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=jp&l=japanese`
    );
    return data[appid];
  },

  async reviews([appid]) {
    const data = await getJson(
      `https://store.steampowered.com/appreviews/${appid}?json=1&language=all&purchase_type=all&num_per_page=0`
    );
    return data.query_summary;
  },

  async search([term]) {
    return getJson(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&cc=jp&l=japanese`
    );
  },
};

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || !(command in commands)) {
    process.stderr.write(USAGE);
    process.exit(command ? 1 : 0);
  }
  if (args.length === 0) {
    process.stderr.write(`Error: ${command} には引数が必要です\n\n${USAGE}`);
    process.exit(1);
  }

  const result = await commands[command](args);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
