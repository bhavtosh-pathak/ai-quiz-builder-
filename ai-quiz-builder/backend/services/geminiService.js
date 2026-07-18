// const { GoogleGenerativeAI } = require('@google/generative-ai');

// let client = null;
// const getClient = () => {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error('GEMINI_API_KEY is not configured on the server');
//   }
//   if (!client) {
//     client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   }
//   return client;
// };

// /**
//  * Builds a strict, JSON-only instruction prompt so the model's response
//  * can be parsed deterministically. We ask for a fixed schema and forbid
//  * any prose outside the JSON array.
//  */
// const buildPrompt = ({ topic, count, difficulty }) => `
// You are an expert quiz-question author for an educational platform.

// Generate exactly ${count} multiple-choice questions about: "${topic}".
// ${difficulty && difficulty !== 'mixed' ? `All questions should be "${difficulty}" difficulty.` : 'Vary the difficulty across easy, medium and hard.'}

// Rules:
// - Each question must have exactly 4 answer options.
// - Exactly one option must be correct, and "correctAnswer" must match that option's text exactly (character for character).
// - Options must be plausible and unambiguous — no "all of the above" / "none of the above".
// - Keep question text under 200 characters.
// - Provide a one-sentence "explanation" for why the correct answer is right.
// - difficulty must be one of: "easy", "medium", "hard".

// Respond with ONLY a raw JSON array (no markdown fences, no commentary, no leading/trailing text) matching this exact shape:
// [
//   {
//     "questionText": "string",
//     "options": ["string", "string", "string", "string"],
//     "correctAnswer": "string",
//     "difficulty": "easy" | "medium" | "hard",
//     "explanation": "string"
//   }
// ]
// `.trim();

// /**
//  * Strips markdown code fences if the model wraps its JSON despite instructions.
//  */
// const cleanJsonResponse = (text) => text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

// /**
//  * Calls Gemini to generate quiz questions and validates the shape of
//  * every question before returning it, dropping any malformed entries
//  * rather than letting bad data reach the database.
//  */
// const generateQuizQuestions = async ({ topic, count = 10, difficulty = 'mixed' }) => {
//   const genAI = getClient();
//   const model = genAI.getGenerativeModel({
//     model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
//     generationConfig: {
//       temperature: 0.7,
//       responseMimeType: 'application/json',
//     },
//   });

//   const prompt = buildPrompt({ topic, count, difficulty });
//   const result = await model.generateContent(prompt);
//   const rawText = result.response.text();

//   let parsed;
//   try {
//     parsed = JSON.parse(cleanJsonResponse(rawText));
//   } catch (err) {
//     throw new Error('AI response could not be parsed as JSON. Please try again.');
//   }

//   if (!Array.isArray(parsed)) {
//     throw new Error('AI response was not a list of questions.');
//   }

//   const validDifficulties = new Set(['easy', 'medium', 'hard']);

//   const validQuestions = parsed
//     .filter(
//       (q) =>
//         q &&
//         typeof q.questionText === 'string' &&
//         Array.isArray(q.options) &&
//         q.options.length === 4 &&
//         q.options.every((o) => typeof o === 'string' && o.trim().length) &&
//         typeof q.correctAnswer === 'string' &&
//         q.options.includes(q.correctAnswer)
//     )
//     .map((q) => ({
//       questionText: q.questionText.trim(),
//       options: q.options.map((o) => o.trim()),
//       correctAnswer: q.correctAnswer.trim(),
//       difficulty: validDifficulties.has(q.difficulty) ? q.difficulty : 'medium',
//       explanation: typeof q.explanation === 'string' ? q.explanation.trim() : '',
//       source: 'ai',
//       marks: 1,
//     }));

//   if (validQuestions.length === 0) {
//     throw new Error('AI did not return any valid questions. Try a different prompt.');
//   }

//   return validQuestions;
// };

// /**
//  * Generates a short, student-friendly explanation for a single question
//  * on demand (bonus "AI Explanation" feature).
//  */
// const explainAnswer = async ({ questionText, options, correctAnswer }) => {
//   const genAI = getClient();
//   const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3.5-flash' });

//   const prompt = `Explain in 2-3 simple sentences why "${correctAnswer}" is the correct answer to this question, for a student who got it wrong:
// Question: ${questionText}
// Options: ${options.join(', ')}
// Do not use markdown. Plain text only.`;

//   const result = await model.generateContent(prompt);
//   return result.response.text().trim();
// };

// module.exports = { generateQuizQuestions, explainAnswer };

const { GoogleGenerativeAI } = require('@google/generative-ai');

let client = null;
const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
};

/**
 * Builds a strict, JSON-only instruction prompt so the model's response
 * can be parsed deterministically. We ask for a fixed schema and forbid
 * any prose outside the JSON array.
 */
const buildPrompt = ({ topic, count, difficulty }) => `
You are an expert quiz-question author for an educational platform.

Generate exactly ${count} multiple-choice questions about: "${topic}".
${difficulty && difficulty !== 'mixed' ? `All questions should be "${difficulty}" difficulty.` : 'Vary the difficulty across easy, medium and hard.'}

Rules:
- Each question must have exactly 4 answer options.
- Exactly one option must be correct, and "correctAnswer" must match that option's text exactly (character for character).
- Options must be plausible and unambiguous — no "all of the above" / "none of the above".
- Keep question text under 200 characters.
- Provide a one-sentence "explanation" for why the correct answer is right.
- difficulty must be one of: "easy", "medium", "hard".

Respond with ONLY a raw JSON array (no markdown fences, no commentary, no leading/trailing text) matching this exact shape:
[
  {
    "questionText": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "string",
    "difficulty": "easy" | "medium" | "hard",
    "explanation": "string"
  }
]
`.trim();

/**
 * Strips markdown code fences if the model wraps its JSON despite instructions.
 */
const cleanJsonResponse = (text) => text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

/**
 * Returns true if the error looks like a transient overload (503) from Gemini.
 */
const isOverloadedError = (err) => {
  const status = err?.status || err?.response?.status;
  const message = (err?.message || '').toLowerCase();
  return status === 503 || message.includes('overloaded') || message.includes('service unavailable') || message.includes('high demand');
};

/**
 * Calls model.generateContent with retries (exponential backoff) on transient
 * overload errors. Throws immediately for non-transient errors.
 */
const generateWithRetry = async (model, prompt, maxRetries = 3) => {
  let lastErr;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      lastErr = err;
      if (isOverloadedError(err) && attempt < maxRetries - 1) {
        const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
        console.warn(`Gemini overloaded (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
};

/**
 * Tries a list of model names in order, falling back to the next one
 * if the current one is overloaded even after retries.
 */
const generateWithFallback = async (genAI, prompt, generationConfig) => {
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const fallbackModels = [primaryModel, 'gemini-3.1-flash-lite'].filter(
    (name, idx, arr) => arr.indexOf(name) === idx // dedupe
  );

  let lastErr;
  for (const modelName of fallbackModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, generationConfig });
      return await generateWithRetry(model, prompt);
    } catch (err) {
      lastErr = err;
      if (isOverloadedError(err)) {
        console.warn(`${modelName} unavailable, trying next model...`);
        continue;
      }
      throw err; // non-overload error, don't bother trying other models
    }
  }

  const overloadErr = new Error('AI service is currently overloaded. Please try again in a minute.');
  overloadErr.status = 503;
  overloadErr.cause = lastErr;
  throw overloadErr;
};

/**
 * Calls Gemini to generate quiz questions and validates the shape of
 * every question before returning it, dropping any malformed entries
 * rather than letting bad data reach the database.
 */
const generateQuizQuestions = async ({ topic, count = 10, difficulty = 'mixed' }) => {
  const genAI = getClient();
  const prompt = buildPrompt({ topic, count, difficulty });

  const result = await generateWithFallback(genAI, prompt, {
    temperature: 0.7,
    responseMimeType: 'application/json',
  });
  const rawText = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(cleanJsonResponse(rawText));
  } catch (err) {
    throw new Error('AI response could not be parsed as JSON. Please try again.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('AI response was not a list of questions.');
  }

  const validDifficulties = new Set(['easy', 'medium', 'hard']);

  const validQuestions = parsed
    .filter(
      (q) =>
        q &&
        typeof q.questionText === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        q.options.every((o) => typeof o === 'string' && o.trim().length) &&
        typeof q.correctAnswer === 'string' &&
        q.options.includes(q.correctAnswer)
    )
    .map((q) => ({
      questionText: q.questionText.trim(),
      options: q.options.map((o) => o.trim()),
      correctAnswer: q.correctAnswer.trim(),
      difficulty: validDifficulties.has(q.difficulty) ? q.difficulty : 'medium',
      explanation: typeof q.explanation === 'string' ? q.explanation.trim() : '',
      source: 'ai',
      marks: 1,
    }));

  if (validQuestions.length === 0) {
    throw new Error('AI did not return any valid questions. Try a different prompt.');
  }

  return validQuestions;
};

/**
 * Generates a short, student-friendly explanation for a single question
 * on demand (bonus "AI Explanation" feature).
 */
const explainAnswer = async ({ questionText, options, correctAnswer }) => {
  const genAI = getClient();

  const prompt = `Explain in 2-3 simple sentences why "${correctAnswer}" is the correct answer to this question, for a student who got it wrong:
Question: ${questionText}
Options: ${options.join(', ')}
Do not use markdown. Plain text only.`;

  const result = await generateWithFallback(genAI, prompt, undefined);
  return result.response.text().trim();
};

module.exports = { generateQuizQuestions, explainAnswer };