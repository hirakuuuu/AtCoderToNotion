import { getSection } from "./parser/parser.js";

// メッセージを検知したら、background.jsにメッセージを送る
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "sendMessage") {
    console.log("content.js開始");

    // URLをいじる
    const problem_id = location.pathname.split("/")[4];
    const contest_id = location.pathname.split("/")[2];

    // 問題文と制約の要素を取得
    const Elements = document.getElementsByTagName("section");
    const problemElement = Elements[0];
    const constraintElement = Elements[1];
    const problemParagraph = getSection(problemElement);
    const constraintParagraph = getSection(constraintElement);

    // バックグラウンドの実行
    chrome.runtime.sendMessage({
      title: document.title,
      url: document.URL,
      problem_id: problem_id,
      contest_id: contest_id,
      problem: problemParagraph,
      constraint: constraintParagraph,
    });
  } else if (message.type === "sendResponse") {
    // コールバック
    console.log(message.response);
    if (message.response.object === "page") {
      console.log("ページが生成されました！");
      alert("ページが生成されました！");
    } else if (message.response.object === "error") {
      console.log("エラーが発生しました！");
      alert("エラーが発生しました！");
    }
  }
});
