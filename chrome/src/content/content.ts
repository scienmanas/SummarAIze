// content.ts

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_PAGE_CONTENT") {
      // Extract the visible text from the page's body.
      const content = document.body.innerText;
      sendResponse({ content: content });
    }
  });
  