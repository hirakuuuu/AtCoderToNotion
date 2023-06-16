import { NOTION_API_TOKEN, NOTION_DATABASE_ID } from "../env.js";

// Notionのエンドポイント
const endPoint = `https://api.notion.com/v1/pages`;

// APIのヘッダー情報
const headerInfo = (token) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + token,
  "Notion-Version": "2021-08-16",
});

// 実行する関数
export const createProblemPage = async (data) => {
  // 結果を格納する変数
  let result = undefined;

  // ページのデータ
  const content_data = {
    parent: {
      database_id: NOTION_DATABASE_ID,
    },
    properties: data.property, // ページのプロパティ
    children: data.content, // ページの中身
  };

  // リクエストのオプション
  const options = {
    method: "post",
    headers: headerInfo(NOTION_API_TOKEN),
    muteHttpExceptions: true,
    body: JSON.stringify(content_data),
  };

  // リクエストを送信
  await fetch(endPoint, options)
    .then((response) => {
      return response.text();
    })
    .then((json) => {
      result = JSON.parse(json);
    })
    .catch((error) => {
      console.log("エラー:", error);
    });

  return result;
};
