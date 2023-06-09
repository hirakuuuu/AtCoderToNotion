const headerInfo = (token) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + token,
  "Notion-Version": "2021-08-16",
});

// Create a diary page for the given date
const createPage = (dbId, token, meetingDate, data) => {
  const endPoint = `https://api.notion.com/v1/pages`;

  const content_data = {
    parent: {
      database_id: dbId,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: data.title,
            },
          },
        ],
      },
      Tag: {
        multi_select: [
          {
            name: "ABC",
          },
        ],
      },
    },
    // childrenがページ自体の中身に値します。
    children: data.content,
  };
  const options = {
    method: "post",
    headers: headerInfo(token),
    muteHttpExceptions: true,
    payload: JSON.stringify(content_data),
  };
  const resp = UrlFetchApp.fetch(endPoint, options);
  return JSON.parse(resp.getContentText());
};

// 実行する関数
const createProblemPage = (data) => {
  const dbid = data.database_id;
  const token = data.api_token;
  const content = data.content;
  const now = new Date();
  const meetingDate = now.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  const result = createPage(dbid, token, meetingDate, content);
  console.log(result);
};

// GASが何か受け取るときはこっち
function doPost(e) {
  // エクステンションから受け取ったデータを取り出す
  const data = JSON.parse(e.postData.getDataAsString());

  // ここにGASから返す処理を書く
  createProblemPage(data);
  // ここで処理をする
  let res = { message: "終了" };

  // エクステンションにレスポンスを返す
  let output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(res));
  return output;
}

// GASから何かを返すだけのときはこっち
function doGet(e) {
  // ここにGASから返す処理を書く
  const res = { text: "GASからのレスポンス" };

  // エクステンションにレスポンスを返す
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(res));
  return output;
}
