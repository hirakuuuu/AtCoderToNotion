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
    console.log("コールバック");
  }
});

// mathjaxのセレクタ
const math_selector = 'annotation[encoding="application/x-tex"]';

const getSection = (elements) => {
  let sectionText = [];
  for (let elem of elements.childNodes) {
    // console.log(elem, elem.nodeName);
    if (elem.nodeName === "UL") {
      for (let li of elem.childNodes) {
        if (li.nodeName === "LI") {
          sectionText.push(getBulletedListItem(li));
        }
      }
    } else if (elem.nodeName === "OL") {
      for (let li of elem.childNodes) {
        if (li.nodeName === "LI") {
          sectionText.push(getNumberedListItem(li));
        }
      }
    } else if (elem.nodeName === "DIV") {
      // 画像の場合（DIV）で良いかどうかは要検討
      sectionText.push(getImage(elem));
    } else if (elem.nodeName === "DETAILS") {
      // 折りたたみ
      sectionText.push(getDetails(elem));
    } else if (elem.nodeName === "PRE") {
      // コードブロック
      sectionText.push(getCode(elem));
    } else if (elem.nodeName === "BLOCKQUOTE") {
      // 引用
      sectionText.push(getQuote(elem));
    } else if (elem.nodeName === "P") {
      sectionText.push(getParagraph(elem));
    } else if (elem.nodeName === "H3") {
      sectionText.push(getHeadline(elem.textContent));
    }
  }
  return sectionText;
};

// 見出しの要素を取得
const getHeadline = (headlineText) => {
  return {
    type: "heading_2",
    heading_2: {
      text: [
        {
          type: "text",
          text: {
            content: headlineText,
          },
        },
      ],
    },
  };
};

// 段落の要素を取得
const getParagraph = (elements) => {
  return {
    type: "paragraph",
    paragraph: {
      rich_text: getRichText(elements),
      color: "default",
    },
  };
};

// 箇条書きの要素を取得
const getNumberedListItem = (elements) => {
  const blockItems = getBlocks(elements);
  return {
    type: "numbered_list_item",
    numbered_list_item: {
      rich_text: getRichText(elements, true),
      children: blockItems.length === 0 ? undefined : blockItems,
    },
  };
};

// 数字箇条書きの要素を取得
const getBulletedListItem = (elements) => {
  const blockItems = getBlocks(elements);
  return {
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: getRichText(elements),
      children: blockItems.length === 0 ? undefined : blockItems,
    },
  };
};

// リッチテキストの要素を取得
const getRichText = (elements) => {
  let richTextList = [];
  for (let elem of elements.childNodes) {
    if (elem.nodeName === "P") {
      const richText = getRichText(elem);
      for (let r of richText) {
        richTextList.push(r);
      }
    } else if (elem.nodeName == "#text") {
      richTextList.push({
        type: "text",
        text: {
          content: elem.nodeValue.replace(/[\x00-\x1F\x7F-\x9F]/g, ""),
        },
      });
    } else if (elem.nodeName == "VAR") {
      richTextList.push({
        type: "equation",
        equation: {
          expression: elem.querySelector(math_selector).textContent,
        },
      });
    } else if (elem.nodeName == "CODE") {
      richTextList.push({
        type: "text",
        text: {
          content: elem.textContent,
        },
        annotations: {
          code: true,
        },
      });
    } else if (elem.nodeName == "STRONG") {
      richTextList.push({
        type: "text",
        text: {
          content: elem.textContent,
        },
        annotations: {
          bold: true,
        },
      });
    }
  }
  return richTextList;
};

// ブロックの要素を取得
const getBlocks = (elements) => {
  let blockItems = [];
  for (let elem of elements.childNodes) {
    if (elem.nodeName == "UL") {
      for (let li of elem.childNodes) {
        if (li.nodeName === "LI") {
          blockItems.push(getBulletedListItem(li));
        }
      }
    } else if (elem.nodeName == "OL") {
      for (let li of elem.childNodes) {
        if (li.nodeName === "LI") {
          blockItems.push(getNumberedListItem(li));
        }
      }
    } else if (elem.nodeName === "BLOCKQUOTE") {
      // 引用
      blockItems.push(getQuote(elem));
    }
  }
  return blockItems;
};

// 画像の要素を取得
const getImage = (elements) => {
  const image_src = elements.querySelector("img").src;
  return {
    type: "image",
    image: {
      type: "external",
      external: {
        url: image_src,
      },
    },
  };
};

// テキストの要素を取得
const getText = (text) => {
  return {
    type: "text",
    text: {
      content: text,
    },
  };
};

// 折りたたみの要素を取得
const getDetails = (elements) => {
  const summary_elem = elements.querySelector("summary");
  console.log(summary_elem);
  return {
    type: "toggle",
    toggle: {
      rich_text: getRichText(summary_elem),
      children: getSection(elements),
    },
  };
};

// コードブロックの要素を取得
const getCode = (elements) => {
  return {
    type: "callout",
    callout: {
      rich_text: getRichText(elements),
      icon: {
        emoji: "📎",
      },
      color: "gray_background",
    },
  };
};

// 引用の要素を取
const getQuote = (elements) => {
  return {
    type: "quote",
    quote: {
      rich_text: getRichText(elements),
      color: "default",
    },
  };
};
