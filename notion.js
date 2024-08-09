import dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

export async function sendMail(sender, recipient, message) {
  try {
    console.log("Sending mail with the following details:");
    console.log("Sender:", sender);
    console.log("Recipient:", recipient);
    console.log("Message:", message);

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_PAGE_ID },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: message,
              },
            },
          ],
        },
        Sender: {
          rich_text: [
            {
              text: {
                content: sender,
              },
            },
          ],
        },
        Recipient: {
          rich_text: [
            {
              text: {
                content: recipient,
              },
            },
          ],
        },
      },
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

export async function readMail(recipient) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_PAGE_ID,
      filter: {
        property: "Recipient",
        rich_text: {
          contains: recipient,
        },
      },
    });

    if (response.results.length === 0) {
      console.log(`No messages found for user: ${recipient}`);
      return;
    }

    console.log(`Messages for user: ${recipient}`);
    for (const page of response.results) {
      const title = page.properties.Title.title[0]?.text?.content || "No Title";
      const sender =
        page.properties.Sender.rich_text[0]?.text?.content || "Unknown Sender";

      console.log(`\nFrom: ${sender}\nTitle: ${title}`);
    }
  } catch (error) {
    console.error("Error reading messages:", error);
  }
}
