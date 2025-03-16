export function fetchPageContent() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length && tabs[0].id) {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { type: "GET_PAGE_CONTENT" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
            reject("Error accessing page content. Please refresh the page and try again.");
          } else if (response && response.content) {
            resolve(response.content);
          } else {
            reject("No content received");
          }
        });
      } else {
        reject("No active tab found");
      }
    });
  });
}
