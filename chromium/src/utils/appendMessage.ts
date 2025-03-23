export function appendMessage({
  sender,
  message,
  element,
}: {
  sender: string;
  message: string;
  element: HTMLDivElement;
}): void {
  const messageDiv = document.createElement("div");
  const senderSpan = document.createElement("span");
  const messageSpan = document.createElement("span");

  // Add the text to the spans
  senderSpan.textContent = sender;
  messageSpan.textContent = message;

  // Add clasess accordingly
  if (sender.toLocaleLowerCase() === "you")
    messageDiv.classList.add("user-message");
  else messageDiv.classList.add("assistant-message");

  // Add the spans to the message div
  messageDiv.appendChild(senderSpan);
  messageDiv.appendChild(messageSpan);

  // Finallly append the message div to the chat log and make smooth scroll
  element.appendChild(messageDiv);
  element.scrollTo({
    top: element.scrollHeight,
    behavior: "smooth",
  });
}
