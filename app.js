import { Command } from "commander";
import { input, select, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import fs from "fs";
import { sendMail, readMail } from "./notion.js";
import inquirer from "inquirer";

const program = new Command();

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcomeUser() {
  const initialNotion = chalkAnimation.rainbow(
    "Welcome to NotionMail implementation by @garrza"
  );

  await sleep();
  initialNotion.stop();

  console.clear();

  try {
    // ASCII Art display
    const art = fs.readFileSync("notion_ascii.txt", "utf8");
    const artAnimation = chalkAnimation.karaoke(art);

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
        - Testing suite that tests the program correctness
        - Timestamps to each of the messages
  `);

  console.log(
    chalk.cyan(
      "****************************************************************\n"
    )
  );
}

async function handleSendMail() {
  const { sender } = await input({
    message: "Sender: ",
  });

  const { recipient } = await input({
    message: "Recipient: ",
  });

  const { message } = await input({
    message: "Message: ",
  });

  try {
    await sendMail(sender, recipient, message);
    console.log(chalk.green("Mail sent successfully!"));
  } catch (error) {
    console.error(chalk.red("Failed to send mail:"), error);
  }
}

// Function to handle reading mail
async function handleReadMail() {
  const { recipient } = await input({
    message: "User: ",
  });

  try {
    const mails = await readMail(recipient);
    console.log(chalk.blue(`\nMails for ${recipient}:\n`));
    mails.forEach((mail, index) => {
      console.log(`${chalk.bold(`#${index + 1}`)} - ${chalk.yellow(mail)}`);
    });
  } catch (error) {
    console.error(chalk.red("Failed to read mail:"), error);
  }
}

// Main logic for handling user choices
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

  // Re-run the menu after an action is completed
  await askOption();
}

// Start the application
await welcomeUser();
await askOption();
