# AtCoderToNotion
AtCoderの問題ページからNotionのページを生成するChrome拡張

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
   
   - 変更したい場合は、`background.js` 内の`getProperty` 関数を修正してください
  
   - また、共有用のURLからデータベースのIDを控えておいてください
   
3. Integrationとデータベースの紐づけ
   - データベースを置いているページに先ほど作成したインテグレーションを追加してください

## 拡張機能の導入
1. 環境変数を設定
    - `common/env.js` ファイルを作成し、`NOTION_API_TOKEN`と`NOTION_DATABASE_ID` を指定してください
      
    - `common/env_sample.js` と同様の形式にしてください

2. chromeに導入
    - chrome://extensions/ の `パッケージ化されていない拡張機能を読み込む` からこの拡張機能を選択してください 


# 今後の展望
ユーザースクリプトで公開したい
