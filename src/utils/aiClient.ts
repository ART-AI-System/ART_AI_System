import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Shared AI Client for calling Google Gemini API with structured JSON return and model fallback.
 */
export async function callLLMWithJSON<T>(systemInstruction: string, userPrompt: string, mockFallback?: T): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY || ''
  
  // If no valid API key is set and a mockFallback is provided, return mock for local development
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.startsWith('AIzaSy_your_key')) {
    console.warn('⚠️ [aiClient] GEMINI_API_KEY is missing or placeholder. Using mock/fallback response if provided.')
    if (mockFallback) {
      return mockFallback
    }
    throw new Error('GEMINI_API_KEY is not configured in .env file.')
  }

  const candidateModels = [
    process.env.GEMINI_MODEL || 'gemini-flash-latest',
    'gemini-flash-latest',
    'gemini-pro-latest',
    'gemma-4-31b-it',
    'gemini-2.5-flash-lite'
  ]

  // Remove duplicates while keeping order
  const modelsToTry = Array.from(new Set(candidateModels))

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError: any = null

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      })

      const result = await model.generateContent(userPrompt)
      const responseText = result.response.text()
      
      // Clean potential markdown code blocks if any exist
      const cleanedText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
      return JSON.parse(cleanedText) as T
    } catch (error: any) {
      lastError = error
      const statusMsg = error.message || String(error)
      console.warn(`⚠️ [aiClient] Model ${modelName} failed (${statusMsg.slice(0, 100)}...). Trying next model if available...`)
    }
  }

  console.error('❌ [aiClient] All Gemini models failed. Last error:', lastError?.message || lastError)
  if (mockFallback) {
    console.warn('⚠️ [aiClient] Falling back to mock data due to API failure/quota.')
    return mockFallback
  }
  throw lastError || new Error('All Gemini AI models failed to generate content.')
}
