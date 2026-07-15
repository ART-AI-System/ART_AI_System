import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Shared AI Client for calling Google Gemini API with structured JSON return.
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

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro-latest',
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
    console.error('❌ [aiClient] Gemini API Error:', error.message || error)
    if (mockFallback) {
      console.warn('⚠️ [aiClient] Falling back to mock data due to API failure.')
      return mockFallback
    }
    throw error
  }
}
