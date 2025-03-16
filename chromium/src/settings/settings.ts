const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;
const llmInput = document.getElementById("llm") as HTMLSelectElement;
const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;

// On page load, populate the input if an API key and LLM model exists
window.addEventListener("load", () => {
  const storedKey = localStorage.getItem("apiKey");
  const llm = localStorage.getItem("llm");
  if (storedKey && llm) {
    apiKeyInput.value = storedKey;
    llmInput.value = llm;
  }
});

// Save the API & LLM to localstorage when the save button is clicked
saveBtn.addEventListener("click", () => {
  const newApiKey = apiKeyInput.value.trim();
  const newLlm = llmInput.value.trim();
  if (!newApiKey || !newLlm) {
    alert("Please enter an API key and LLM model");
    return;
  } else {
    localStorage.setItem("apiKey", newApiKey);
    localStorage.setItem("llm", newLlm);
    alert("Settings saved successfully");
  }
});
