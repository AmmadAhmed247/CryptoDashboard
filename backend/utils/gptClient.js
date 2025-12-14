
import { OpenAI } from "openai/client.js"

export const openai=new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
});


export const askGpt=async(message , coinData)=>{
    const systemPrompt = `
You are a crypto analysis assistant.
Always use the coin data provided strictly.
If data is missing, say so.
  `;

   const userPrompt = `
User question: ${message}
Coin data: ${JSON.stringify(coinData)}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });
  return completion.choices[0].message.content;
}