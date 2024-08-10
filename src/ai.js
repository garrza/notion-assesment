import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMail(prompt, tone) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an assistant that writes ${tone} messages, make them simple and short, do not include any names.`,
        },
        {
          role: "user",
          content: `Write a message for the following: ${prompt}`,
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
  try {
    const summaries = await Promise.all(
      mails.map(async (mail, index) => {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant that summarizes emails in one sentence. Keep it concise and informative.",
            },
            {
              role: "user",
              content: `Summarize the following email title in one sentence: "${mail.title}"`,
            },
          ],
          max_tokens: 50,
        });

        const summary = response.choices[0].message.content.trim();
        const date = new Date(mail.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        return `#${index + 1} - From: ${
          mail.sender
        }, Time: ${formattedDate}: ${summary}`;
      })
    );

    return summaries.join("\n");
  } catch (error) {
    console.error("Error summarizing emails:", error);
    return "Failed to generate AI summary of emails.";
  }
}
