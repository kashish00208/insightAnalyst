import Groq from "groq-sdk";

const groq = new Groq();

export async function main() {
  const completion = await getGroqChatCompletion();
  console.log(completion.choices[0]?.message?.content || "");
}

export const getGroqChatCompletion = async () => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama-3.1-8b-instant",
  });
};

main();