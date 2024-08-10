import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMail(prompt, tone) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an assistant that writes ${tone} emails.`,
        },
        {
          role: "user",
          content: `Write an email for the following: ${prompt}`,
        },
      ],
      max_tokens: 150,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating email:", error);
    return "Failed to generate email.";
  }
}

export async function determinePriority(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an assistant that determines email priority.",
        },
        {
          role: "user",
          content: `Determine the priority of the following message: "${message}". Respond with "High", "Medium", or "Low".`,
        },
      ],
      max_tokens: 5,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error determining priority:", error);
    return "Medium";
  }
}

export async function summarizeMails(mails) {
  const combinedText = mails.map((mail) => mail.title).join("\n");
  const summary = await generateMail(combinedText, "summary");
  return summary;
}
