import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

export async function callOpenAIAPI({
  apiKey,
  prompt,
  chatHistory,
}: {
  apiKey: string;
  prompt: string;
  chatHistory: {
    role: "user" | "assistant";
    content: string;
  }[];
}): Promise<{
  status: "success" | "failed";
  message: string;
}> {
  try {
    // Make client and perform generation
    const client = new OpenAI({ apiKey: apiKey });

    // Include the new prompt in the chat history
    chatHistory.push({
      role: "user",
      content: prompt,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: chatHistory,
    });
    const result: string = completion.choices[0].message.content as string;
    return {
      status: "success",
      message: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "failed",
      message: "Error Occurred. Check console!",
    };
  }
}

export async function callGeminiAPI({
  apiKey,
  prompt,
  chatHistory,
}: {
  apiKey: string;
  prompt: string;
  chatHistory: any;
}): Promise<{
  status: "success" | "failed";
  message: string;
}> {
  // Make a genai client nd configuration
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  try {
    // Start chat
    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    // Get the response
    const response = await chatSession.sendMessage(prompt);
    const result = response.response.text();

    // Return the response
    return {
      status: "success",
      message: result,
    };
  } catch (error) {
    // Return the error
    console.error(error);
    return {
      status: "failed",
      message: "Error Occurred. Check console!",
    };
  }
}
