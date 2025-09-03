import { GoogleGenAI, Type } from "@google/genai";
import { UrlResult, ProcessingStatus, ProcessingMode } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const checkCopyright = async (url: string): Promise<{ scrapingAllowed: boolean; reason: string }> => {
  const prompt = `
    You are an AI assistant that determines if a website is likely to have copyright or usage restrictions that would prohibit web scraping for AI training purposes. Analyze the provided URL: ${url}.

    Based on the typical nature of a website at this domain, common footer text patterns (e.g., "All rights reserved"), and the presence of "Terms of Service" or "Copyright" pages, make an educated guess.

    Do not actually access the URL. Base your answer on your existing knowledge.

    Respond with ONLY a valid JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scrapingAllowed: {
              type: Type.BOOLEAN,
              description: "Whether scraping for AI training is likely allowed."
            },
            reason: {
              type: Type.STRING,
              description: "A brief explanation for your decision."
            },
          },
          required: ["scrapingAllowed", "reason"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (e) {
    console.error("Error in copyright check:", e);
    throw new Error("Failed to analyze copyright status.");
  }
};

const scrapeAndProcessText = async (url: string): Promise<string> => {
  const prompt = `
    You are a simulated web scraper and data preprocessing engine. You have been tasked with extracting and cleaning the main textual content from the website: ${url}.

    Your goal is to produce a high-quality, clean dataset for AI training. Perform the following steps on the website's hypothetical content:
    1. Remove all HTML tags, scripts, and styles.
    2. Filter out non-content elements like navigation bars, headers, footers, ads, and sidebars.
    3. Normalize the text by converting it to a consistent case and removing excessive punctuation.
    4. Consolidate the text into a single, coherent block.

    Do not actually access the URL. Generate plausible content based on the nature of the website and then process it.

    Return ONLY the cleaned, preprocessed text. Do not include any explanations, apologies, or markdown formatting. Just the raw text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (e) {
    console.error("Error in scraping and processing:", e);
    throw new Error("Failed to scrape and process content.");
  }
};

const scrapeAndExtractJson = async (url: string, userPrompt: string): Promise<string> => {
    const prompt = `
      You are a simulated web scraper and data extraction engine. Your task is to analyze the hypothetical content of the website at ${url} and extract structured data based on the user's request.

      User's extraction request: "${userPrompt}"

      Based on this request, generate a plausible JSON object that contains the requested data. Assume the website contains relevant information.

      Your response MUST be ONLY a valid JSON object. Do not include any explanations, apologies, or markdown formatting (like \`\`\`json).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        // The API should return a clean JSON string, but we trim just in case.
        return response.text.trim();
    } catch (e) {
        console.error("Error in JSON extraction:", e);
        throw new Error("Failed to extract JSON content.");
    }
};


export const processUrl = async (url: string, mode: ProcessingMode, jsonPrompt: string): Promise<UrlResult> => {
  // Step 1: Check copyright
  const copyrightStatus = await checkCopyright(url);

  if (!copyrightStatus.scrapingAllowed) {
    return {
      url,
      status: ProcessingStatus.COPYRIGHT_FOUND,
      reason: copyrightStatus.reason,
    };
  }
  
  // Step 2: Scrape and process based on mode
  try {
    let processedData: string;
    if (mode === ProcessingMode.JSON) {
        processedData = await scrapeAndExtractJson(url, jsonPrompt);
    } else {
        processedData = await scrapeAndProcessText(url);
    }

    return {
      url,
      status: ProcessingStatus.READY,
      data: processedData,
      dataType: mode,
      reason: copyrightStatus.reason,
    };

  } catch (error) {
     return {
      url,
      status: ProcessingStatus.ERROR,
      error: error instanceof Error ? error.message : "Failed to retrieve processed content.",
      reason: copyrightStatus.reason,
    };
  }
};