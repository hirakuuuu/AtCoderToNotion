import { GAS_URL, NOTION_API_TOKEN, NOTION_DATABASE_ID } from "./common/env.js";

// 拡張のボタンを押したときに実行される処理
chrome.action.onClicked.addListener(function (tab) {
  // content_script側にメッセージを送る
  chrome.tabs.sendMessage(tab.id, "hogehoge");
});

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  console.log(`バックグラウンドで受け取ったもの: ${request.title}`);

  const data = {
    title: request.title,
    content: [...request.problem, ...request.constraint],
  };

  fetch(GAS_URL, {
    // 送信先URL
    method: "post", // 通信メソッド
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // JSON形式のデータのヘッダー
    },
    body: JSON.stringify({
      api_token: NOTION_API_TOKEN,
      database_id: NOTION_DATABASE_ID,
      content: data, // JSON形式のデータ
    }),
  })
    .then((response) => {
      console.log("GASからのレスポンス:", response);
      return response.text();
    })
    .then((json) => {
      console.log("GASからのJSON:", json);
      callback(JSON.parse(json));
    })
    .catch((error) => {
      console.log("エラー:", error);
    });

  // 非同期を同期的に扱うためのtrue
  return true;
});
