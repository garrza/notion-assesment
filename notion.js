const { Client } = require("@notionhq/client");
require("dotenv").config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function sendMail(sender, recipient, message) {
  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Sender: { title: [{ text: { content: sender } }] },
        Recipient: { title: [{ text: { content: recipient } }] },
        Message: { rich_text: [{ text: { content: message } }] },
      },
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function readMail(recipient) {
  try {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: "Recipient",
        title: { equals: recipient },
      },
    });

    if (results.length() == 0) {
      console.log(`No messages found for user: ${recipient}`);
      return;
    }

    console.log(`Messages (${results.length}):\n`);
    for (const page of results) {
      const sender = page.properties.Sender.title[0].text.content;
      const message = page.properties.Message.rich_text[0].text.content;
      console.log(`from: ${sender}\n${message}\n`);
    }
  } catch (error) {
    console.error("Error reading messages:", error);
  }
}

module.exports = {
  sendMail,
  readMail,
};
