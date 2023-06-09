(async () => {
  const src = chrome.runtime.getURL("content_scripts/content.js");
  const contentMain = await import(src);
})();
