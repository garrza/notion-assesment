#!/usr/bin/env node

import { input, select, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import fs from "fs";
import { sendMail, readMail, getAvailableUsers } from "./src/notion.js";
import { generateMail, determinePriority, summarizeMails } from "./src/ai.js";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcomeUser() {
  const initialNotion = chalkAnimation.rainbow(
    "Welcome to NotionMail implementation by @garrza"
  );

  await sleep();
  initialNotion.stop();

  console.clear();

  try {
    const art = fs.readFileSync("src/assets/notion_ascii.txt", "utf8");
    const artAnimation = chalkAnimation.rainbow(art);

    await sleep(3000);
    artAnimation.stop();
    console.clear();
  } catch (error) {
    console.error(chalk.red("Error reading ASCII art file:"), error);
  }

  console.log(chalk.bgBlue("\n  NOTION MAIL DATABASE APP  \n"));
  console.log(
    chalk.cyan(`
This is a simple CLI tool emulating reading and writing of mail.
Each time you send a mail, it is added to our Notion DB.
****************************************************************`)
  );

  console.log(chalk.bgYellow.black(" MAIN FEATURES:"));
  console.log(`
      ${chalk.yellow("📧 SEND")} - Send mail to a user
      ${chalk.yellow(
        "📬 READ"
      )} - Check a user's mail (only possible if user exists)
    `);
  console.log(chalk.bgRed.black(" ADDITIONAL FEATURES:"));
  console.log(`
    ${chalk.red("📧 SEND")}:
        - AI-generated mailing based on prompts or templates:
                - Professional
                - Casual
                - Formal
    ${chalk.red("📬 READ")}:
        - Messages sorted by priority
        - AI summarization for a quick overview of messages
    ${chalk.red("🔧 GENERAL:")}:
        - Timestamps to each of the messages
  `);

  console.log(
    chalk.cyan(
      "****************************************************************\n"
    )
  );
}

async function handleSendMail() {
  const useAI = await confirm({
    message: "Would you like to generate the message using AI?",
  });

  let message;
  if (useAI) {
    const tone = await select({
      message: "Select the tone for your AI-generated mail:",
      choices: [
        { name: "Professional", value: "Professional" },
        { name: "Casual", value: "Casual" },
        { name: "Formal", value: "Formal" },
      ],
    });

    const prompt = await input({
      message: "What should the email be about?",
    });

    message = await generateMail(prompt, tone);
    console.log(chalk.green("AI-generated message:\n"), message);
  } else {
    message = await input({
      message: "Message: ",
    });
  }

  const sender = await input({
    message: "Sender: ",
  });

  const recipient = await input({
    message: "Recipient: ",
  });

  try {
    await sendMail(sender, recipient, message);
    console.log(chalk.green("Mail sent successfully!"));
  } catch (error) {
    console.error(chalk.red("Failed to send mail:"), error);
  }
}

async function handleReadMail() {
  try {
    const users = await getAvailableUsers();

    if (users.length === 0) {
      console.log(chalk.red("No users found."));
      return;
    }

    const recipient = await select({
      message: "Select a user:",
      choices: users.map((user) => ({ name: user, value: user })),
    });

    const mails = await readMail(recipient);
    if (mails.length === 0) {
      console.log(chalk.blue(`No mails found for ${recipient}.`));
      return;
    }

    const sortByPriority = await confirm({
      message: "Sort messages by AI-determined priority?",
    });

    if (sortByPriority) {
      for (let mail of mails) {
        mail.priority = await determinePriority(mail.title);
      }

      mails.sort((a, b) => {
        const priorities = { High: 1, Medium: 2, Low: 3 };
        return priorities[a.priority] - priorities[b.priority];
      });
    }

    const summarize = await confirm({
      message: "Would you like an AI summary of the messages?",
    });

    if (summarize) {
      const summary = await summarizeMails(mails);
      console.log(chalk.yellow("\nAI Summary of Mails:"));
      console.log(chalk.white(summary));
    } else {
      console.log(chalk.blue(`\nMails for ${recipient}:\n`));
      mails.forEach((mail, index) => {
        const date = new Date(mail.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        console.log(
          `${chalk.bold(`#${index + 1}`)} - From: ${chalk.yellow(mail.sender)}
    Priority: ${chalk.red(mail.priority || "N/A")}
    Message: ${chalk.yellow(mail.title)}
    Date: ${chalk.green(formattedDate)}\n`
        );
      });
    }
  } catch (error) {
    console.error(chalk.red("Failed to read mail:"), error);
  }
}

async function askOption() {
  const choice = await select({
    message: `${chalk.blue("✉️ SELECT AN OPTION ✉️")}`,
    choices: [
      {
        name: "📧 SEND",
        value: "send",
        description: "Send mail to a user",
      },
      {
        name: "📬 READ",
        value: "read",
        description: "Check a user's mail (only possible if user exists)",
      },
      {
        name: "❌ EXIT",
        value: "exit",
        description: "Exit NotionMail",
      },
    ],
  });

  switch (choice) {
    case "send":
      await handleSendMail();
      break;
    case "read":
      await handleReadMail();
      break;
    case "exit":
      console.log(chalk.yellow("Exiting NotionMail..."));
      process.exit(0);
      break;
    default:
      console.log(chalk.red("Invalid option, please try again."));
  }

  await askOption();
}

await welcomeUser();
await askOption();
