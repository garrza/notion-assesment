import { Command } from "commander";
import { input } from "@inquirer/prompts";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import fs from "fs";
import { sendMail, readMail } from "./notion.js";

const program = new Command();

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcomeUser() {
  const initialNotion = chalkAnimation.rainbow(
    "Welcome to Notion Mail implementation by @garrza"
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
        - Available AI generated mailing based on prompts as well as choose templates
                - Professional
                - Casual
                - Formal
    ${chalk.red("📬 READ")}:
        - Messages are sorted by priority
        - AI mail summarization offers quick view of all available messages
  `);

  console.log(
    chalk.cyan(
      "****************************************************************\n"
    )
  );
}

await welcomeUser();

// program
//   .version("1.0.0")
//   .description("NotionMail - A simple mail app powered by Notion");

// program
//   .command("send")
//   .description("Send mail to a user")
//   .action(async () => {
//     const { sender, recipient, message } = await input([
//       { name: "sender", message: "Sender: " },
//       { name: "recipient", message: "Recipient: " },
//       { name: "message", message: "Message: " },
//     ]);
//     await sendMail(sender, recipient, message);
//   });

// program
//   .command("read")
//   .description("Check a user's mail")
//   .action(async () => {
//     const { recipient } = await input([
//       { name: "recipient", message: "User: " },
//     ]);
//     await readMail(recipient);
//   });

// // If no command is provided, show help
// if (!process.argv.slice(2).length) {
//   program.outputHelp();
// }

// program.parse(process.argv);
