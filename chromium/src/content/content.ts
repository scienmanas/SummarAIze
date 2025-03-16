
console.log("SummarAIze content script loaded");


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  
  if (message.type === "GET_PAGE_CONTENT") {
    try {
      // Extract the visible text from the page's body.
      const content = document.body.innerText || document.body.textContent || "";
      console.log("Sending content, length:", content.length);
      sendResponse({ content: content });
    } catch (error) {
      console.error("Error extracting page content:", error);
      sendResponse({ content: "Error extracting page content" });
    }
  }
  
  // Important: return true to indicate you wish to send a response asynchronously
  return true;
});
