import User from '~/models/schemas/users.schema'
import aiGradingService, { AIGradingSuggestion } from './aiGrading.service'
import aiAuditService, { AIAuditAndVivaResponse } from './aiAudit.service'
import { callLLMWithJSON } from '~/utils/aiClient'

export interface ActionableDefensePlanItem {
  rubricCriteria: string
  linkedVivaQuestionNumber: number
  lecturerAdvice: string
}

export interface AIHolisticSynthesisResult {
  rawRubricScore: number
  consistencyScore: number
  auditStatus: 'GREEN' | 'YELLOW' | 'RED'
  holisticRecommendedScore: number
  isDefenseMandatory: boolean
  synergyAnalysis: string
  actionableDefensePlan: ActionableDefensePlanItem[]
  gradingBreakdown?: any[]
  vivaQuestions?: any[]
  redFlags?: string[]
  summaryAnalysis?: string
  suggestedFeedback?: string
}

export class AIHolisticSynthesisService {
  async synthesizeAuditAndGrading(
    submissionId: string,
    user: User,
    existingGrading?: AIGradingSuggestion,
    existingAudit?: AIAuditAndVivaResponse
  ): Promise<AIHolisticSynthesisResult> {
    // 1. Obtain or compute Grading Suggestion (Person A)
    let gradingResult: AIGradingSuggestion
    if (existingGrading && typeof existingGrading.suggestedScore === 'number') {
      gradingResult = existingGrading
    } else {
      try {
        gradingResult = await aiGradingService.analyzeSubmissionAndSuggestGrade(submissionId, user)
      } catch (err) {
        console.warn('⚠️ [AIHolisticSynthesis] Could not fetch grading suggestion, using defaults:', err)
        gradingResult = {
          summary: 'Fallback grading analysis.',
          suggestedScore: 8.5,
          maxScore: 10,
          rubricBreakdown: [
            { criteriaName: 'Clean Code & Architecture', score: 3.5, maxScore: 4.0, comment: 'Good structure.' },
            { criteriaName: 'Business Logic & Error Handling', score: 3.5, maxScore: 4.0, comment: 'Correct logic.' },
            { criteriaName: 'Documentation & Setup', score: 1.5, maxScore: 2.0, comment: 'Clear configuration.' }
          ],
          suggestedFeedback: 'Good technical implementation.'
        }
      }
    }

    // 2. Obtain or compute Audit & Viva Questions (Person B)
    let auditResult: AIAuditAndVivaResponse
    if (existingAudit && typeof existingAudit.consistencyScore === 'number') {
      auditResult = existingAudit
    } else {
      try {
        auditResult = await aiAuditService.generateAuditAndVivaQuestions(submissionId, user)
      } catch (err) {
        console.warn('⚠️ [AIHolisticSynthesis] Could not fetch audit suggestion, using defaults:', err)
        auditResult = {
          consistencyScore: 75,
          status: 'YELLOW',
          summaryAnalysis: 'Moderate consistency between student declaration and code structure.',
          redFlags: ['Complex helper logic with minimal reflection.'],
          vivaQuestions: [
            {
              questionNumber: 1,
              purpose: 'CHECK_UNDERSTANDING',
              targetFilePath: 'src/main.ts',
              targetLineOrFunction: 'main() / bootstrap flow',
              questionText: 'Explain the core logic flow in your main entry point.',
              expectedAnswer: 'Student should explain modular imports and initialization.'
            }
          ]
        }
      }
    }

    const rawRubricScore = gradingResult.suggestedScore || 0
    const consistencyScore = auditResult.consistencyScore || 0
    const auditStatus = auditResult.status || 'GREEN'

    // Compute fallback holistic recommendation
    let fallbackRecommendedScore = rawRubricScore
    let isDefenseMandatory = false

    if (auditStatus === 'RED' || consistencyScore < 60) {
      fallbackRecommendedScore = Math.round((rawRubricScore * 0.5) * 10) / 10
      isDefenseMandatory = true
    } else if (auditStatus === 'YELLOW' || consistencyScore < 80) {
      fallbackRecommendedScore = Math.round((rawRubricScore * 0.85) * 10) / 10
      isDefenseMandatory = true
    }

    const mockFallback: AIHolisticSynthesisResult = {
      rawRubricScore,
      consistencyScore,
      auditStatus,
      holisticRecommendedScore: fallbackRecommendedScore,
      isDefenseMandatory,
      synergyAnalysis:
        auditStatus === 'GREEN'
          ? `Sự đồng bộ tuyệt vời (Consistency ${consistencyScore}%). Bài làm đạt kỹ thuật tốt (${rawRubricScore}/${gradingResult.maxScore}) và phản ánh trung thực năng lực sinh viên. Khuyến nghị cho thẳng điểm theo Rubric.`
          : `Phần kỹ thuật (Rubric) sinh viên đạt ${rawRubricScore}/${gradingResult.maxScore}. Tuy nhiên, mức độ nhất quán lời khai AI chỉ đạt ${consistencyScore}% (${auditStatus}) với cảnh báo "${auditResult.redFlags?.[0] || 'Dấu hiệu AI generate'}". Khuyến nghị tạm giữ mức điểm sàn ${fallbackRecommendedScore}/${gradingResult.maxScore} và bắt buộc Vấn đáp để xác thực.`,
      actionableDefensePlan: (auditResult.vivaQuestions || []).map((q, idx) => ({
        rubricCriteria: gradingResult.rubricBreakdown?.[idx % (gradingResult.rubricBreakdown.length || 1)]?.criteriaName || 'Core Software Architecture',
        linkedVivaQuestionNumber: q.questionNumber || idx + 1,
        lecturerAdvice: `Hỏi sinh viên câu hỏi Q${q.questionNumber || idx + 1} (${q.purpose}) xoáy vào file ${q.targetFilePath || 'source code'}. Nếu trả lời chính xác như Expected Answer, khôi phục điểm tiêu chí Rubric này.`
      })),
      gradingBreakdown: gradingResult.rubricBreakdown,
      vivaQuestions: auditResult.vivaQuestions,
      redFlags: auditResult.redFlags,
      summaryAnalysis: auditResult.summaryAnalysis,
      suggestedFeedback: gradingResult.suggestedFeedback
    }

    const systemInstruction = `Bạn là Chủ tịch Hội đồng Kiểm định & Đánh giá Đồ án Kỹ thuật Phần mềm (Chief Holistic Evaluation Officer). Nhiệm vụ của bạn là liên kết, tổng hợp kết quả của 2 module:
1. Module Chấm điểm Rubric kỹ thuật (Người A)
2. Module Thanh tra trung thực & Vấn đáp AI Audit (Người B)

Hãy phân tích mối tương quan và đưa ra phán quyết tổng hợp công tâm, liên kết trực tiếp giữa các tiêu chí Rubric còn nghi vấn với các câu hỏi Vấn đáp (Viva Questions) tương ứng.`

    const userPrompt = `Hãy tổng hợp đánh giá cho bài nộp dựa trên 2 nguồn dữ liệu sau:

=== 1. KẾT QUẢ CHẤM ĐIỂM RUBRIC KỸ THUẬT (Người A) ===
- Điểm kỹ thuật đề xuất (rawRubricScore): ${rawRubricScore} / ${gradingResult.maxScore}
- Chi tiết tiêu chí Rubric:
${JSON.stringify(gradingResult.rubricBreakdown || [], null, 2)}
- Lời phê kỹ thuật: ${gradingResult.suggestedFeedback}

=== 2. KẾT QUẢ THANH TRA TRUNG THỰC & VẤN ĐÁP (Người B) ===
- Điểm nhất quán (consistencyScore): ${consistencyScore}% (${auditStatus})
- Tóm tắt thanh tra: ${auditResult.summaryAnalysis}
- Cờ báo hiệu (Red Flags): ${JSON.stringify(auditResult.redFlags || [])}
- Danh sách câu hỏi Vấn đáp bảo vệ (Viva Questions):
${JSON.stringify(auditResult.vivaQuestions || [], null, 2)}

Hãy trả về chuẩn JSON theo định dạng sau:
{
  "rawRubricScore": ${rawRubricScore},
  "consistencyScore": ${consistencyScore},
  "auditStatus": "${auditStatus}",
  "holisticRecommendedScore": số_điểm_đề_xuất_cuối_cùng (nếu RED/YELLOW thì giảm điểm hoặc yêu cầu bảo vệ),
  "isDefenseMandatory": boolean (true nếu status là YELLOW/RED hoặc cần kiểm chứng thêm),
  "synergyAnalysis": "Đoạn phân tích tổng hợp sâu sắc bằng tiếng Việt, giải thích vì sao điểm số Rubric bị chi phối bởi kết quả Audit",
  "actionableDefensePlan": [
    {
      "rubricCriteria": "Tên tiêu chí Rubric liên quan (ví dụ: Business Logic & Error Handling)",
      "linkedVivaQuestionNumber": số_thứ_tự_câu_hỏi_viva (1, 2, hoặc 3),
      "lecturerAdvice": "Lời khuyên thực chiến cho giảng viên khi hỏi câu này để quyết định có cộng/trừ điểm tiêu chí đó hay không"
    }
  ]
}`

    const llmResult = await callLLMWithJSON<AIHolisticSynthesisResult>(systemInstruction, userPrompt, mockFallback)
    return {
      ...llmResult,
      gradingBreakdown: gradingResult.rubricBreakdown || mockFallback.gradingBreakdown,
      vivaQuestions: auditResult.vivaQuestions || mockFallback.vivaQuestions,
      redFlags: auditResult.redFlags || mockFallback.redFlags,
      summaryAnalysis: auditResult.summaryAnalysis || mockFallback.summaryAnalysis,
      suggestedFeedback: gradingResult.suggestedFeedback || mockFallback.suggestedFeedback
    }
  }
}

const aiHolisticSynthesisService = new AIHolisticSynthesisService()
export default aiHolisticSynthesisService
