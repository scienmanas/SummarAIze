chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_PAGE_CONTENT") {
    try {
      // Extract the visible text from the page's body.
      const content =
        document.body.innerText || document.body.textContent || "";
      sendResponse({ content: content });
    } catch (error) {
      console.error("Error extracting page content:", error);
      sendResponse({ content: "Error extracting page content" });
    }
  }
  return true;
});
