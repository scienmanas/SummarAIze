# SummarAIze

SummarAIze is a Chrome extension that uses Gemini AI to help users understand and summarize web page content. With this extension, you can ask questions about the current page and get intelligent responses based on the page's content.

## Features

- Chat with AI about the current webpage content
- Summarize articles, blog posts, and other web content
- Ask specific questions about the page information
- Customize with your own Gemini API key

## Installation

### From Source

1. Clone this repository
2. Navigate to the `chrome` directory
3. Run `npm install` to install dependencies
4. Run `npm run build` to build the extension
5. In Chrome, go to `chrome://extensions/`
6. Enable "Developer mode" in the top right
7. Click "Load unpacked" and select the `build` directory

## Usage

1. Click the SummarAIze icon in your browser toolbar
2. Set your Gemini API key in Settings (you can get one from [Google AI Studio](https://makersuite.google.com/app/apikey))
3. Navigate to any webpage and click the extension icon
4. Type your question or request about the page content
5. Get AI-powered responses based on the page

## Development

To work on this extension:

1. Run `npm run dev` for development mode with hot reloading
2. The extension will be compiled to the `dev_build` directory

## License

This project is licensed under the MIT License - see the [License](License) file for details.
