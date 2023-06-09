// メッセージを検知したら、background.jsにメッセージを送る
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("content.js開始");

  // 問題文と制約の要素を取得
  const Elements = document.getElementsByTagName("section");
  const problemElement = Elements[0];
  const constraintElement = Elements[1];

  const problemParagraph = getSection(problemElement);
  const constraintParagraph = getSection(constraintElement);

  chrome.runtime
    .sendMessage({
      title: document.title,
      problem: problemParagraph,
      constraint: constraintParagraph,
    })
    .then((response) => {
      console.log(`backgroundからの戻り値: ${JSON.stringify(response)}`);
      // ここで画面への処理を書く
      // const new_element = document.createElement("p");
      // new_element.textContent = response.text;
      // document.getElementsByTagName("div")[0].appendChild(new_element);
    });
});

// mathjaxのセレクタ
const math_selector = 'annotation[encoding="application/x-tex"]';

const getSection = (elements) => {
  let sectionText = [];
  for (let elem of elements.childNodes) {
    console.log(elem, elem.nodeName);
    if (elem.nodeName === "UL") {
      for (let li of elem.childNodes) {
        if (li.nodeName === "LI") {
          sectionText.push(getBulletedListItem(li));
        }
      }
    } else if (elem.nodeName === "OL") {
      //sectionText.push(...[getNumberedListItem(elem)]);
      for (let li of elem.childNodes) {
        if (li.nodeName === "LI") {
          sectionText.push(getNumberedListItem(li));
        }
      }
    } else if (elem.nodeName === "P") {
      sectionText.push(getParagraph(elem));
    } else if (elem.nodeName === "H3") {
      sectionText.push(getHeadline(elem.textContent));
    }
  }
  return sectionText;
};

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

const getParagraph = (elements) => {
  return {
    type: "paragraph",
    paragraph: {
      rich_text: getRichText(elements),
      color: "default",
    },
  };
};

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

const getRichText = (elements, f = false) => {
  let richTextList = [];
  for (let elem of elements.childNodes) {
    if (f) console.log(elem, elem.nodeName);
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
    }
  }
  return richTextList;
};

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
    }
  }
  return blockItems;
};
