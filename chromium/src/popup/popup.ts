import { callGeminiAPI, callOpenAIAPI } from "../utils/genai.js";
import { appendMessage } from "../utils/appendMessage.js";
import { fetchPageContent } from "../utils/fetchPageContent.js";

// Interface for messages exchanged between popup and content script
interface Message {
  type: string;
  payload?: any;
}


document.addEventListener("DOMContentLoaded", () => {
  // Get all the required elements
  const chatLog = document.getElementById("chatLog") as HTMLDivElement;
  const userInput = document.getElementById("userInput") as HTMLInputElement;
  const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
  const settingsBtn = document.getElementById(
    "settingsBtn"
  ) as HTMLButtonElement;

  // Check if required DOM elements exist
  if (!chatLog || !userInput || !sendBtn || !settingsBtn) {
    console.error("Could not find required DOM elements");
    return;
  }

  console.log("okokokok")
  const okok = fetchPageContent()
  console.log(okok)
  

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

  // *********************** functions

  // function to call LLM

  // *********************** Event Listeners
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
});
