# AtCoderToNotion
AtCoderの問題ページからNotionのページを生成するChrome拡張
↓以下のページからインストールできます
https://chrome.google.com/webstore/detail/atcoder-to-notion/mhoemoadpammfnlbjagngjenedfpcfgi?hl=ja&authuser=0

# デモ

https://github.com/hirakuuuu/AtCoderToNotion/assets/83483542/55d894d2-a560-48d5-a245-f3e4a282e781

- AtCoderの問題ページ `https://atcoder.jp/*/tasks/*` から問題文と制約を抽出し、Notionのページを生成します
- Difficulty等の情報も取得し、プロパティとして登録できます

# 使い方
## Notion側の設定
1. NotionのIntegrationを作成
   - https://www.notion.so/my-integrations から作成できます
   
   - `Integration Token` をこの後使用するので、控えておいてください

2. データベースの作成
   - Notionの適当なページでデータベースを作成してください
   
   - プロパティは指定したものが存在しないとエラーになるので、以下のプロパティを作成してください
     - Name (title) 
     - Contest (multi_select) 
     - Diff (multi_select) 
     - URL (url)
   - 必要でないプロパティは作らないように設定できるので、無くても大丈夫です。
   - また、共有用のURLからデータベースのIDを控えておいてください
   
4. Integrationとデータベースの紐づけ
   - データベースを置いているページに先ほど作成したインテグレーションを追加してください

## 拡張機能の導入

1. chromeに導入
    - [このリンク](https://chrome.google.com/webstore/detail/atcoder-to-notion/mhoemoadpammfnlbjagngjenedfpcfgi?hl=ja&authuser=0) から本拡張機能をインストールして下さい
2. 拡張機能の設定
    - 拡張機能のオプションから事前に控えておいた `Notion API Token` と `Notion Database ID` 登録します
    - 登録したいプロパティも選択してください
  

# 使用上の注意
- データベースのカラム名等が異なるとページが生成されません
- developper tool の console からレスポンスのオブジェクトを確認できます
