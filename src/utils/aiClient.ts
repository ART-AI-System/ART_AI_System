import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Shared AI Client for calling Google Gemini API with structured JSON return and model fallback.
 */
export async function callLLMWithJSON<T>(systemInstruction: string, userPrompt: string, mockFallback?: T): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY || ''
  const mockFallbackEnabled = process.env.AI_MOCK_FALLBACK_ENABLED === 'true'
  
  // Mock AI results must be explicitly enabled. They must never look like real grading output by default.
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.startsWith('AIzaSy_your_key')) {
    if (mockFallbackEnabled && mockFallback) {
      console.warn('⚠️ [aiClient] GEMINI_API_KEY is missing. Returning explicitly enabled development mock data.')
      return mockFallback
    }
    throw new Error('GEMINI_API_KEY is not configured. AI grading suggestions are unavailable.')
  }

  const candidateModels = [
    process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-flash-latest'
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
      
      // Robust JSON extraction & cleanup
      let cleanedText = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim()

      // Extract outermost JSON block if surrounded by conversational text
      const objectMatch = cleanedText.match(/\{[\s\S]*\}/)
      const arrayMatch = cleanedText.match(/\[[\s\S]*\]/)
      if (objectMatch && (!arrayMatch || objectMatch.index! <= arrayMatch.index!)) {
        cleanedText = objectMatch[0]
      } else if (arrayMatch) {
        cleanedText = arrayMatch[0]
      }

      // Remove trailing commas before closing braces/brackets (`{"a": 1,}` -> `{"a": 1}`)
      cleanedText = cleanedText.replace(/,\s*([\]}])/g, '$1')

      try {
        return JSON.parse(cleanedText) as T
      } catch (parseError) {
        // Safe string-literal state machine repair for unescaped newlines inside JSON values
        let inString = false
        let escaped = false
        let result = ''
        for (let i = 0; i < cleanedText.length; i++) {
          const char = cleanedText[i]
          if (escaped) {
            result += char
            escaped = false
            continue
          }
          if (char === '\\') {
            escaped = true
            result += char
            continue
          }
          if (char === '"') {
            inString = !inString
            result += char
            continue
          }
          if (inString && (char === '\n' || char === '\r')) {
            result += '\\n'
            continue
          }
          if (inString && char === '\t') {
            result += '\\t'
            continue
          }
          result += char
        }
        return JSON.parse(result) as T
      }
    } catch (error: any) {
      lastError = error
      const statusMsg = error.message || String(error)
      console.warn(`⚠️ [aiClient] Model ${modelName} failed (${statusMsg.slice(0, 100)}...). Trying next model if available...`)
    }
  }

  console.error('❌ [aiClient] All Gemini models failed. Last error:', lastError?.message || lastError)
  if (mockFallbackEnabled && mockFallback) {
    console.warn('⚠️ [aiClient] Returning explicitly enabled development mock data after Gemini failure.')
    return mockFallback
  }
  throw lastError || new Error('All Gemini AI models failed to generate content.')
}
