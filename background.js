import { GAS_URL, NOTION_API_TOKEN, NOTION_DATABASE_ID } from "./common/env.js";

// 拡張のボタンを押したときに実行される処理
chrome.action.onClicked.addListener(function (tab) {
  // content_script側にメッセージを送る
  chrome.tabs.sendMessage(tab.id, { type: "sendMessage" });
});

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  callback
) {
  // difficultyを取得
  const difficulty = await getDifficulty(request.problem_id);

  // ページのプロパティ
  const property = getProperty(
    request.title,
    request.contest_id,
    difficulty,
    request.url
  );

  // ページのデータ
  const data = {
    title: request.title,
    property: property,
    content: [...request.problem, ...request.constraint],
  };

  // Notionに送信
  await sendNotion(data);
  // コールバック
  chrome.tabs.sendMessage(sender.tab.id, { type: "sendResponse" });
});

// difficultyを取得する
const getDifficulty = async (problem_id) => {
  let difficulty = 0;
  await fetch("https://kenkoooo.com/atcoder/resources/problem-models.json")
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);
      difficulty = json[problem_id].difficulty;
    })
    .catch((error) => {
      console.log(error);
    });

  return difficulty;
};

// difficultyから色を返す
const color_list = [
  "灰",
  "茶",
  "緑",
  "水",
  "青",
  "黄",
  "橙",
  "赤",
  "銅",
  "銀",
  "金",
];
const getColor = (difficulty) => {
  const color_id = Math.floor(difficulty / 400);
  if (0 <= color_id && color_id < color_list.length) {
    return color_list[color_id];
  } else {
    return "?";
  }
};

// プロパティ生成
const getProperty = (title, contest_id, difficulty, url) => {
  return {
    Name: {
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
    },
    Tag: {
      multi_select: [
        {
          name: contest_id,
        },
        {
          name: getColor(difficulty),
        },
      ],
    },
    Date: {
      date: {
        // 今日の日付を取得(yyyy-mm-dd)
        start: new Date()
          .toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .split("/")
          .join("-"),
      },
    },
    URL: {
      url: url,
    },
    AC: {
      checkbox: false,
    },
  };
};

// Notionのデータベースに追加する
const sendNotion = async (data) => {
  await fetch(GAS_URL, {
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
      return response.text();
    })
    .then((json) => {
      console.log(json);
    })
    .catch((error) => {
      console.log("エラー:", error);
    });
};
