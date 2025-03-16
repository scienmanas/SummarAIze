export function fetchPageContent(): Promise<string> {
  return new Promise((resolve, reject) => {
    console.info("Fetching page content");

    // Send a message to active tab to extract page content
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length && tabs[0].id) {
        // Get the tab id
        const tabId = tabs[0].id;
        console.info("Sending message to tab: ", tabId);

        chrome.tabs.sendMessage(
          tabId,
          { type: "GET_PAGE_CONTENT" } ,
          (response) => {
            console.info("Got Response: ", resolve);
            if (chrome.runtime.lastError) {
              console.error("Error:", chrome.runtime.lastError);
              resolve(
                "Error accessing page content. Please refresh the page and try again."
              );
            } else {
              console.error("No active tab found");
              resolve("No active tab found");
            }
          }
        );
      }
    });
  });
}
