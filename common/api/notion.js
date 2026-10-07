// Notionのエンドポイント
const endPoint = `https://api.notion.com/v1/pages`;

// APIのヘッダー情報
const headerInfo = (token) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + token,
  "Notion-Version": "2021-08-16",
});

// 同じ問題のURLを持つページを検索する。検索失敗時は新規作成しない。
export const findProblemPage = async (token, databaseId, problemUrl) => {
  const url = new URL(problemUrl);
  const canonicalUrl = url.origin + url.pathname.replace(/\/$/, "");
  const response = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "post",
      headers: headerInfo(token),
      body: JSON.stringify({
        filter: {
          or: [
            { property: "URL", url: { equals: canonicalUrl } },
            { property: "URL", url: { starts_with: canonicalUrl + "?" } },
            { property: "URL", url: { starts_with: canonicalUrl + "#" } },
            { property: "URL", url: { equals: canonicalUrl + "/" } },
          ],
        },
        page_size: 1,
      }),
    }
  );
  const result = await response.json();
  if (!response.ok || result.object === "error") {
    throw new Error(result.message || "既存ページの検索に失敗しました。");
  }
  if (!Array.isArray(result.results)) {
    throw new Error("既存ページの検索結果が不正です。");
  }
  return result.results[0] || null;
};

// 実行する関数
export const createProblemPage = async (
  NOTION_API_TOKEN,
  NOTION_DATABASE_ID,
  data
) => {
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
