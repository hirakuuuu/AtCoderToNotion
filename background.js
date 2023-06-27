import { createProblemPage } from "./common/api/notion.js";

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
  // 保存した情報を取得
  let NOTION_API_TOKEN = "",
    NOTION_DATABASE_ID = "";
  let name_checked = true,
    contest_checked = false,
    difficulty_checked = false,
    url_checked = false;
  chrome.storage.local.get(
    [
      "ATCODERTONOTION_API_TOKEN",
      "ATCODERTONOTION_DATABASE_ID",
      "ATCODERTONOTION_NAME_CHEKED",
      "ATCODERTONOTION_CONTEST_CHEKED",
      "ATCODERTONOTION_DIFFICULTY_CHEKED",
      "ATCODERTONOTION_URL_CHEKED",
    ],
    function (items) {
      NOTION_API_TOKEN = items.ATCODERTONOTION_API_TOKEN;
      NOTION_DATABASE_ID = items.ATCODERTONOTION_DATABASE_ID;
      name_checked = items.ATCODERTONOTION_NAME_CHEKED;
      contest_checked = items.ATCODERTONOTION_CONTEST_CHEKED;
      difficulty_checked = items.ATCODERTONOTION_DIFFICULTY_CHEKED;
      url_checked = items.ATCODERTONOTION_URL_CHEKED;
    }
  );

  // difficultyを取得
  const difficulty = await getDifficulty(request.problem_id);

  // ページのプロパティ
  console.log(name_checked, contest_checked, difficulty_checked, url_checked);
  let property = {};
  if (name_checked) property.Name = getTitleProperty(request.title);
  if (contest_checked)
    property.Contest = getMultiSelectProperty(request.contest_id);
  if (difficulty_checked)
    property.Diff = getMultiSelectProperty(getColor(difficulty));
  if (url_checked) property.URL = getUrlProperty(request.url);

  // ページのデータ
  const data = {
    title: request.title,
    property: property,
    content: [...request.problem, ...request.constraint],
  };

  // Notionに送信
  const result = await createProblemPage(
    NOTION_API_TOKEN,
    NOTION_DATABASE_ID,
    data
  );
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

const getTitleProperty = (title) => {
  return {
    title: [
      {
        text: {
          content: title,
        },
      },
    ],
  };
};

const getMultiSelectProperty = (name) => {
  return {
    multi_select: [
      {
        name: name,
      },
    ],
  };
};

const getUrlProperty = (url) => {
  return {
    url: url,
  };
};
