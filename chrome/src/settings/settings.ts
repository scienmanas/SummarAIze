// settings.ts

const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;
const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;

// On page load, populate the input if an API key exists
window.addEventListener("load", () => {
  const storedKey = localStorage.getItem("geminiApiKey");
  if (storedKey) {
    apiKeyInput.value = storedKey;
  }
});

// Save the API key to localStorage when the save button is clicked
saveBtn.addEventListener("click", () => {
  const newKey = apiKeyInput.value.trim();
  if (newKey) {
    localStorage.setItem("geminiApiKey", newKey);
    alert("API key saved successfully!");
  } else {
    alert("Please enter a valid API key.");
  }
});
