import { callGeminiAPI, callOpenAIAPI } from "../utils/genai";
import { appendMessage } from "../utils/appendMessage";
import { fetchPageContent } from "../utils/fetchPageContent";

interface chatHistoryGemini {
  role: "user" | "model";
  parts: { text: string }[];
}

interface chatHistoryOpenAI {
  role: "user" | "assistant";
  content: string;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Get all the required elements
  const chatLog = document.getElementById("chatLog") as HTMLDivElement;
  const userInput = document.getElementById("userInput") as HTMLInputElement;
  const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
  const settingsBtn = document.getElementById(
    "settingsBtn"
  ) as HTMLButtonElement;
  const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
  const chatHistory: chatHistoryGemini[] | chatHistoryOpenAI[] = [];

  // Check if required DOM elements exist
  if (!chatLog || !userInput || !sendBtn || !settingsBtn) {
    console.error("Could not find required DOM elements");
    return;
  }

  const okok = fetchPageContent();

  // Check if the API Key and LLM is configured
  const apiKey = localStorage.getItem("apiKey");
  const llm = localStorage.getItem("llm");
  if (!apiKey || !llm) {
    console.error(
      "No API key or LLM found! Please configure your API key and LLM in settings."
    );
    chrome.runtime.openOptionsPage
      ? chrome.runtime.openOptionsPage()
      : window.open(chrome.runtime.getURL("settings/settings.html"), "_blank");
  }

  // *********************** Event Listeners
  // Send button
  sendBtn.addEventListener("click", async () => {
    // Get the user message & check if it's empty
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Append the user message to chat log & make the input empty
    appendMessage({ sender: "You", message: userMessage, element: chatLog });
    userInput.value = "";

    try {
      // Logging
      appendMessage({
        sender: "System",
        message: "Fetching page content...",
        element: chatLog,
      });

      // Fetch the current page content
      const pageContent = await fetchPageContent();

      // Logging
      appendMessage({
        sender: "System",
        message: pageContent as string,
        element: chatLog,
      });

      // Logging
      appendMessage({
        sender: "System",
        message: "Page content fetched",
        element: chatLog,
      });

      const llm = localStorage.getItem("llm");
      const apiKey = localStorage.getItem("apiKey");
      if (llm && apiKey) return;
      if (llm === "gemini") {
        if (!chatHistory) {
        }
      }
    } catch (error) {}
  });

  // User input
  userInput.addEventListener("keypress", (event: KeyboardEvent) => {
    if (event.key === "Enter" && userInput.value.trim() && !event.shiftKey) {
      event.preventDefault();
      sendBtn.click();
    }
  });

  // Settings button
  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage
      ? chrome.runtime.openOptionsPage()
      : window.open(chrome.runtime.getURL("settings/settings.html"), "_blank");
  });

  // clear button
  clearBtn.addEventListener("click", () => {
    chatHistory;console.log("DOMContentLoaded event triggered");
console.log("Required DOM elements:", chatLog, userInput, sendBtn, settingsBtn);
console.log("API Key:", apiKey);
console.log("LLM:", llm);
console.log("Chat History:", chatHistory);
  });
});
