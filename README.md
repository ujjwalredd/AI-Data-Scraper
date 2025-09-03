# AI Data Scraper

A minimalistic web application designed to responsibly gather and preprocess textual content from websites for AI training. This tool offers flexible extraction modes, allowing users to scrape raw text or extract structured JSON data based on a custom prompt.


## ✨ Features

- **Dual Extraction Modes**:
    - **Text Mode**: Scrapes and cleans the main textual content from websites.
    - **JSON Mode**: Extracts structured data (e.g., product details, article metadata) based on a user-provided prompt.
- **Batch Processing**: Process multiple URLs by pasting them in or uploading a `.txt` file.
- **Ethical Copyright Check**: Simulates a check for copyright or usage restrictions before scraping.
- **Concurrent Processing**: Handles multiple URLs simultaneously for significantly faster results.
- **Download & Copy**: Easily copy the processed data to your clipboard or download it as a `.txt` or `.json` file.
- **Clean & Minimalist UI**: A simple, focused interface built with React and Tailwind CSS.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **AI/Backend Logic**: [Google Gemini API](https://ai.google.dev/)

## ⚖️ Ethical Considerations

This tool is built with a "respect-first" approach. The initial step for every URL is to check for potential copyright restrictions. Scraping is blocked if restrictions are detected, promoting the responsible collection of training data.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- A modern web browser.
- A valid API key for the Google Gemini API.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-data-scraper.git
    cd ai-data-scraper
    ```

2.  **Set up the API Key:**
    This application requires a Google Gemini API key to be set as an environment variable. The application code is designed to read `process.env.API_KEY`. How you set this will depend on your development server or deployment environment.

    For example, you could use a tool like `dotenv` or set it directly in your shell:
    ```bash
    export API_KEY="YOUR_GEMINI_API_KEY"
    ```

3.  **Run the application:**
    Since this is a client-side application, you can serve the `index.html` file using any static file server. A simple one is `serve`:

    ```bash
    # Install serve if you don't have it
    npm install -g serve

    # Run the server from the project root
    serve .
    ```
    Now, open your browser and navigate to the local address provided by the server (e.g., `http://localhost:3000`).

## ✅ Usage

1.  Open the web application in your browser.
2.  **Select a Processing Mode**:
    - Choose **"Scrape Text"** to extract and clean the main body of text from the URLs.
    - Choose **"Extract JSON"** to pull structured data. When selected, a new text box will appear.
3.  If using JSON mode, **provide a clear prompt** in the "JSON Extraction Prompt" box (e.g., "Extract the product name, price, and customer ratings.").
4.  **Enter URLs**:
    - Paste one or more website URLs into the text area, with each URL on a new line.
    - **OR**, click the "Upload .txt File" button to select a local file containing a list of URLs.
5.  Click the **"Process URLs"** button.
6.  The application will display the real-time status of each URL.
7.  For successfully processed URLs, you can:
    - Click the expand icon (⌄) to view the cleaned text or formatted JSON.
    - Click "Copy" to copy the data to your clipboard.
    - Click "Download" to save the data as a `.txt` or `.json` file.