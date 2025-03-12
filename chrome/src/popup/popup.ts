// popup.ts

// Interface for messages exchanged between popup and content script
interface Message {
    type: string;
    payload?: any;
  }
  
  const chatLog = document.getElementById("chatLog") as HTMLDivElement;
  const userInput = document.getElementById("userInput") as HTMLInputElement;
  const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
  const settingsBtn = document.getElementById("settingsBtn") as HTMLButtonElement;
  
  // Check if Gemini API key exists in local storage
  const apiKey = localStorage.getItem("geminiApiKey");
  if (!apiKey) {
    alert("No API key found! Please configure your Gemini API key in settings.");
    // Optionally, open settings page automatically:
    window.open(chrome.runtime.getURL("settings/settings.html"), "_blank");
  }
  
  // Retrieve current page content from content script
  function fetchPageContent(): Promise<string> {
    return new Promise((resolve) => {
      // Send a message to the active tab to extract page content
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "GET_PAGE_CONTENT" } as Message, (response) => {
            resolve(response?.content || "");
          });
        } else {
          resolve("");
        }
      });
    });
  }
  
  // Function to append a message to the chat log
  function appendMessage(sender: string, message: string) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = `${sender}: ${message}`;
    chatLog.appendChild(msgDiv);
  }
  
  // Simulated function to call the Gemini API with the user prompt and page content
  async function callGeminiAPI(prompt: string, pageContent: string): Promise<string> {
    // Construct request payload (this depends on Gemini API spec)
    const payload = {
      apiKey: apiKey,
      prompt: prompt,
      context: pageContent,
    };
  
    // Replace the URL below with the actual Gemini API endpoint
    const response = await fetch("https://api.gemini.example/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    if (response.ok) {
      const data = await response.json();
      // Assume the response has a field called 'reply'
      return data.reply;
    } else {
      return "Error: Unable to retrieve a response from the API.";
    }
  }
  
  // Event listener for the Send button
  sendBtn.addEventListener("click", async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;
  
    appendMessage("You", userMessage);
    userInput.value = "";
  
    // Get page content from the content script
    const pageContent = await fetchPageContent();
  
    // Call Gemini API with the user message and page content
    const reply = await callGeminiAPI(userMessage, pageContent);
    appendMessage("Gemini", reply);
  });
  
  // Open settings page when the Settings button is clicked
  settingsBtn.addEventListener("click", () => {
    window.open(chrome.runtime.getURL("settings/settings.html"), "_blank");
  });
  