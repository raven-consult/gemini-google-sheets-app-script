// Replace GEMINI_API_KEY with your actual API key
const GEMINI_API_KEY = "YOUR_API_KEY";

function getConfig(maxOutputTokens, temperature = 1.0) {
  return {
    safetySettings: [
      {
        "threshold": "BLOCK_ONLY_HIGH",
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      }
    ],
    generationConfig: {
      "topK": 10,
      "topP": 0.8,
      "temperature": temperature,
      "maxOutputTokens": maxOutputTokens,
    }
  }
}

function getAPIURL(modelName) {
  return [
    "https://generativelanguage.googleapis.com",
    `/v1beta/models/${modelName}:generateContent`,
    `?key=${GEMINI_API_KEY}`
  ].join("");
}

/**
 * @typedef {"gemini-1.5-flash" | "gemini-1.5-pro"} Model
 */

/**
 * Returns the response from the Gemini API for the given prompt.
 *
 * @param {string} prompt - Your prompt.
 * @param {Model} name - The name of the model.
 * @params {number} maxTokens - Max tokens to output in response.
 * @return {string} The response from the GPT-3 API.
 * @customfunction
 */
function Gemini(prompt = "Hello World", model = "gemini-1.5-flash", maxTokens = 100) {
  // Set up the API URL and payload
  const API_URL = getAPIURL(model);
  const config = getConfig(maxTokens);
  const payload = {
    ...config,
    contents: [{
      parts: [
        { "text": prompt }
      ]
    }]
  }

  // Make the API request
  var response = UrlFetchApp.fetch(API_URL, {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
    },
    'payload': JSON.stringify(payload)
  });

  // Parse the response and return the generated text
  var responseText = response.getContentText();
  var responseJson = JSON.parse(responseText);
  return responseJson["candidates"][0]["content"]["parts"][0]["text"];
}
