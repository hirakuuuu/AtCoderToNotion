const headerInfo = (token) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + token,
  "Notion-Version": "2021-08-16",
});

// Create a diary page for the given date
const createPage = async (dbId, token, data) => {
  const endPoint = `https://api.notion.com/v1/pages`;
  let result = undefined;
  const content_data = {
    parent: {
      database_id: dbId,
    },
    properties: data.property,
    // childrenがページ自体の中身に値します。
    children: data.content,
  };
  const options = {
    method: "post",
    headers: headerInfo(token),
    muteHttpExceptions: true,
    body: JSON.stringify(content_data),
  };
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

  //   const resp = UrlFetchApp.fetch(endPoint, options);
  //   return JSON.parse(resp.getContentText());
};

// 実行する関数
export const createProblemPage = async (data) => {
  const dbid = data.database_id;
  const token = data.api_token;
  const content = data.content;
  const result = await createPage(dbid, token, content);
  console.log(result);
  return result;
};
