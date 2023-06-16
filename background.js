import { GAS_URL, NOTION_API_TOKEN, NOTION_DATABASE_ID } from "./common/env.js";
import { createProblemPage } from "./common/notion.js";

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
  console.log(difficulty);

  // ページのプロパティ
  const property = getProperty(
    request.title,
    request.contest_id,
    difficulty,
    request.url
  );

  // ページのデータ
  const data = {
    api_token: NOTION_API_TOKEN,
    database_id: NOTION_DATABASE_ID,
    content: {
      title: request.title,
      property: property,
      content: [...request.problem, ...request.constraint],
    },
  };

  // Notionに送信
  const result = await createProblemPage(data);
  // コールバック
  chrome.tabs.sendMessage(sender.tab.id, {
    type: "sendResponse",
    response: result,
  });
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
    Contest: {
      multi_select: [
        {
          name: contest_id,
        },
      ],
    },
    Diff: {
      multi_select: [
        {
          name: getColor(difficulty),
        },
      ],
    },
    URL: {
      url: url,
    },
  };
};
