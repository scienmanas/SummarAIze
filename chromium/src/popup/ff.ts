
// Interface for messages exchanged between popup and content script
interface Message {
    type: string;
    payload?: any;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup loaded');
    
    const chatLog = document.getElementById("chatLog") as HTMLDivElement;
    const userInput = document.getElementById("userInput") as HTMLInputElement;
    const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
    const settingsBtn = document.getElementById("settingsBtn") as HTMLButtonElement;
    
    // Check if required DOM elements exist
    if (!chatLog || !userInput || !sendBtn || !settingsBtn) {
      console.error("Could not find required DOM elements");
      return;
    }
  
    // Check if Gemini API key exists in local storage
    const apiKey = localStorage.getItem("geminiApiKey");
    if (!apiKey) {
      appendMessage("System", "No API key found! Please configure your Gemini API key in settings.");
      // Don't auto-open settings as it might be blocked by popup blockers
    }
    
    // Retrieve current page content from content script
    function fetchPageContent(): Promise<string> {
      return new Promise((resolve) => {
        console.log("Fetching page content...");
        // Send a message to the active tab to extract page content
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length && tabs[0].id) {
            const tabId = tabs[0].id;
            console.log("Sending message to tab:", tabId);
            
            chrome.tabs.sendMessage(tabId, { type: "GET_PAGE_CONTENT" } as Message, (response) => {
              console.log("Got response:", response);
              if (chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError);
                resolve("Error accessing page content. Please refresh the page and try again.");
              } else {
                resolve(response?.content || "No content found on page");
              }
            });
          } else {
            console.error("No active tab found");
            resolve("No active tab found");
          }
        });
      });
    }
    
    // Function to append a message to the chat log
    function appendMessage(sender: string, message: string) {
      console.log(`${sender}: ${message}`);
      const msgDiv = document.createElement("div");
      msgDiv.textContent = `${sender}: ${message}`;
      chatLog.appendChild(msgDiv);
      // Auto scroll to bottom
      chatLog.scrollTop = chatLog.scrollHeight;
    }
    
    // Function to call the Gemini API with the user prompt and page content
    async function callGeminiAPI(prompt: string, pageContent: string): Promise<string> {
      if (!apiKey) {
        return "Please set your Gemini API key in the settings first.";
      }
      
      try {
        // Using actual Gemini API endpoint
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Regarding the following content, ${prompt}\n\nContent: ${pageContent.substring(0, 5000)}` // Limiting content size
              }]
            }]
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          // Extract text from Gemini API response format
          return data.candidates[0].content.parts[0].text || "No response generated";
        } else {
          const errorData = await response.text();
          console.error("API Error:", errorData);
          return `Error: API returned status ${response.status}. Check console for details.`;
        }
      } catch (error) {
        console.error("API call failed:", error);
        return "Error: Failed to connect to Gemini API. Check your internet connection and API key.";
      }
    }
    
    // Event listener for the Send button
    sendBtn.addEventListener("click", async () => {
      const userMessage = userInput.value.trim();
      if (!userMessage) return;
      
      appendMessage("You", userMessage);
      userInput.value = "";
      
      try {
        // Show loading message
        appendMessage("System", "Fetching page content...");
        
        // Get page content from the content script
        const pageContent = await fetchPageContent();
        
        appendMessage("System", "Generating response...");
        
        // Call Gemini API with the user message and page content
        const reply = await callGeminiAPI(userMessage, pageContent);
        appendMessage("Gemini", reply);
      } catch (error) {
        console.error("Error in processing request:", error);
        appendMessage("System", "An error occurred. Please try again.");
      }
    });
    
    // Enter key should also send the message
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });
    
    // Open settings page when the Settings button is clicked
    settingsBtn.addEventListener("click", () => {
      chrome.runtime.openOptionsPage ? 
        chrome.runtime.openOptionsPage() : 
        window.open(chrome.runtime.getURL("settings/settings.html"), "_blank");
    });
  });
  