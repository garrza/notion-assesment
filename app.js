const { Command } = require("commander");
const program = new Command();
const { input } = require("@inquirer/prompts");

const fs = require("fs");
const { sendMail, readMail } = require("./notion");

function displayNotion() {
  try {
    const art = fs.readFileSync("notion_ascii.txt", "utf8");
    console.log(art);
  } catch (error) {
    console.error("For some reason the ASCII file does not exist", error);
  }
}

displayNotion();

program
  .version("1.0.0")
  .description("NotionMail - A simple mail app powered by Notion");

program
  .command("send")
  .description("Send mail to a user")
  .action(async () => {
    const { sender, recipient, message } = await input([
      { name: "sender", message: "Sender: " },
      { name: "recipient", message: "Recipient: " },
      { name: "message", message: "Message: " },
    ]);
    await sendMail(sender, recipient, message);
  });

program
  .command("read")
  .description("Check a user's mail")
  .action(async () => {
    const { recipient } = await input([
      { name: "recipient", message: "User: " },
    ]);
    await readMail(recipient);
  });

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
