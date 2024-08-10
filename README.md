# NotionMail CLI

NotionMail is a command-line interface (CLI) tool designed to emulate the reading and writing of emails using the Notion API. The core functionality revolves around sending messages to a specified recipient and reading messages for a given recipient from a Notion database. This tool is enhanced with several additional features, particularly focusing on AI integration and improving the user experience.

<p align="center">
  <img src="/src/assets/notion-cli-ui.png" alt="NotionMail CLI" width="300"/>
</p>

## Features

### Core Functionality

- **Send Messages:** Allows users to send messages to a designated recipient as a specified sender. This action writes the message directly to the Notion database using the Notion API.
- **Read Messages:** Enables users to read messages for a specified recipient. This action retrieves the messages from the Notion database using the Notion API.

### Additional Improvements

- **AI-Generated Mailing:** Users can generate emails using AI based on different tones (Professional, Casual, Formal). This feature enhances the flexibility and creativity in drafting messages, particularly useful for users who want to quickly generate content.
- **Message Sorting by Priority:** When reading messages, users can choose to have them sorted by AI-determined priority (High, Medium, Low). This allows users to focus on the most important messages first.
- **AI Summarization:** Provides a quick overview of all messages for a recipient by generating an AI-powered summary. This feature is particularly useful when dealing with a large volume of messages (or long messages).
- **Timestamps:** Each message includes a timestamp indicating when it was sent, adding a layer of context and organization.
- **User-Friendly Interface:** The CLI features an interactive and visually appealing interface using `chalk` and `chalk-animation`, making the user experience more engaging.

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Notion API credentials (Integration Token and Database ID)

### Installation

1. Clone the repository or install the package from npm:

   ```bash
   npm i notion-assesment
   ```

2. Set up your environment variables:
   ```bash
   export NOTION_KEY=<Your Notion Integration Token>
   export NOTION_PAGE_ID=<Your Notion Database ID>
   export OPENAI_API_KEY=<Your OpenAI API Key>
   ```

### Running the Program

1. Start the CLI by running:

   ```bash
   notionmail
   ```

2. Follow the on-screen prompts to send or read mails.

### Dependencies

- **@inquirer/prompts**: For interactive command-line prompts.
- **chalk**: For styling terminal output.
- **chalk-animation**: For adding animations to terminal output.
- **dotenv**: For managing environment variables.
- **@notionhq/client**: Official Notion API client for Node.js.
- **openai**: For AI-generated content and summarization.

## References

- [Fireship NodeJS CLI App Project](https://www.youtube.com/watch?v=_oHByo8tiEY)
- [Chalk Animation](https://github.com/bokub/chalk-animation)
- [Notion API Documentation](https://developers.notion.com/docs)
- [Notion API - Working with databases](https://developers.notion.com/docs/working-with-databases#adding-pages-to-a-database)
- [Notion API - Property values](https://developers.notion.com/reference/property-value-object#title-property-values)
- [Node.js CLI Best Practices](https://github.com/yargs/yargs)
- [OpenAI API Documentation](https://beta.openai.com/docs/)

## Future Potential Improvements

1. **Message Deletion:** Implement functionality to allow users to delete messages directly from the Notion database.
2. **Enhanced AI Features:** Further refine AI-generated messages by adding more customizable tones or templates.
3. **Custom Notion Views:** Allow users to interact with different views or filters in the Notion database, providing more flexibility in how messages are displayed.
4. **Multi-Language Support:** Expand the program to support multiple languages for both the user interface and AI-generated content.
5. **Scalability Support:**: Modify the program to handle a larger number of mails and users. Optimize the UI for reading user mail, implement view caching options to reduce queries to the database, and enhance performance.
6. **Testing Coverage and CI/CD Pipelines:** Develop a comprehensive suite of tests to ensure program correctness and integrate automated tests for continuous integration and deployment.

## Product and Technical Choices

### AI Integration

The decision to integrate AI into the NotionMail CLI was driven by the goal to enhance user productivity and creativity. By allowing users to generate messages and summaries using AI, the tool provides value beyond simple message handling, making it more versatile for various use cases.

### User Interface

The choice to use `chalk` and `chalk-animation` was made to ensure that the CLI is not only functional but also enjoyable to use. A visually appealing interface helps in making the user experience more engaging, which is crucial for a CLI tool that may otherwise seem dry or complex.

### Use of Promises and Async/Await

Given the asynchronous nature of API calls, especially when dealing with external services like Notion and OpenAI, the use of `async/await` was critical. It allows for more readable and maintainable code, especially in handling multiple steps within a single function, such as sending or reading mails.

---
