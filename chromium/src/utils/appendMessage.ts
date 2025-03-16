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
  messageDiv.textContent = `${sender}: ${message}`;
  element.appendChild(messageDiv);
  element.scrollTop = element.scrollHeight;
}
