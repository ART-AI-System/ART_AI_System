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
  maxScore: number
  consistencyScore: number
  auditStatus: 'GREEN' | 'YELLOW' | 'RED'
  holisticRecommendedScore: number
  isDefenseMandatory: boolean
  synergyAnalysis: string
  actionableDefensePlan: ActionableDefensePlanItem[]
  gradingBreakdown: AIGradingSuggestion['rubricBreakdown']
  vivaQuestions: AIAuditAndVivaResponse['vivaQuestions']
  redFlags: string[]
  summaryAnalysis: string
  suggestedFeedback: string
}

export class AIHolisticSynthesisService {
  async synthesizeAuditAndGrading(
    submissionId: string,
    user: User,
    existingGrading?: AIGradingSuggestion,
    existingAudit?: AIAuditAndVivaResponse
  ): Promise<AIHolisticSynthesisResult> {
    const canReuseGrading = Boolean(
      existingGrading &&
        typeof existingGrading.suggestedScore === 'number' &&
        Array.isArray(existingGrading.rubricBreakdown) &&
        existingGrading.rubricBreakdown.length > 0 &&
        existingGrading.rubricBreakdown.every(item => Boolean(item.criterionId))
    )
    const canReuseAudit = Boolean(
      existingAudit &&
        typeof existingAudit.consistencyScore === 'number' &&
        Array.isArray(existingAudit.vivaQuestions) &&
        existingAudit.vivaQuestions.length === 3
    )
    const [gradingResult, auditResult] = await Promise.all([
      canReuseGrading
        ? Promise.resolve(existingGrading as AIGradingSuggestion)
        : aiGradingService.analyzeSubmissionAndSuggestGrade(submissionId, user),
      canReuseAudit
        ? Promise.resolve(existingAudit as AIAuditAndVivaResponse)
        : aiAuditService.generateAuditAndVivaQuestions(submissionId, user)
    ])

    const invalidSubmission =
      gradingResult.suggestedScore === 0 || auditResult.redFlags.includes('EMPTY_OR_NONSENSE_SUBMISSION')
    const rawRubricScore = invalidSubmission ? 0 : gradingResult.suggestedScore
    const isDefenseMandatory = auditResult.status !== 'GREEN'

    const systemInstruction = `Bạn là trợ lý tổng hợp hai nguồn thông tin độc lập cho giảng viên:
1. Điểm học thuật được đề xuất theo rubric.
2. Audit tính minh bạch và câu hỏi vấn đáp.

Không được cộng hoặc trừ điểm học thuật dựa trên audit. Audit chỉ quyết định có cần vấn đáp/xác minh thêm hay không. Giảng viên là người duy nhất quyết định và công bố điểm cuối cùng. Trả về JSON hợp lệ.`

    const userPrompt = `<ACADEMIC_GRADING>
${JSON.stringify(gradingResult, null, 2)}
</ACADEMIC_GRADING>

<AI_TRANSPARENCY_AUDIT>
${JSON.stringify(auditResult, null, 2)}
</AI_TRANSPARENCY_AUDIT>

Hãy trả về:
{
  "synergyAnalysis": "Tóm tắt riêng chất lượng học thuật và rủi ro minh bạch; không suy diễn gian lận",
  "actionableDefensePlan": [
    {
      "rubricCriteria": "tiêu chí liên quan",
      "linkedVivaQuestionNumber": 1,
      "lecturerAdvice": "cách dùng câu hỏi để kiểm chứng hiểu biết, không tự động cộng/trừ điểm"
    }
  ]
}`

    const synthesis = await callLLMWithJSON<any>(systemInstruction, userPrompt)
    const validQuestionNumbers = new Set(auditResult.vivaQuestions.map(question => question.questionNumber))
    const actionableDefensePlan = Array.isArray(synthesis?.actionableDefensePlan)
      ? synthesis.actionableDefensePlan
          .map((item: any) => ({
            rubricCriteria: String(item?.rubricCriteria || '').trim(),
            linkedVivaQuestionNumber: Number(item?.linkedVivaQuestionNumber),
            lecturerAdvice: String(item?.lecturerAdvice || '').trim()
          }))
          .filter(
            (item: ActionableDefensePlanItem) =>
              item.rubricCriteria && item.lecturerAdvice && validQuestionNumbers.has(item.linkedVivaQuestionNumber)
          )
      : []

    return {
      rawRubricScore,
      maxScore: gradingResult.maxScore,
      consistencyScore: auditResult.consistencyScore,
      auditStatus: auditResult.status,
      // Audit is intentionally not a score multiplier. Lecturer decides after any required defense.
      holisticRecommendedScore: rawRubricScore,
      isDefenseMandatory,
      synergyAnalysis: String(synthesis?.synergyAnalysis || '').trim(),
      actionableDefensePlan,
      gradingBreakdown: gradingResult.rubricBreakdown,
      vivaQuestions: auditResult.vivaQuestions,
      redFlags: auditResult.redFlags,
      summaryAnalysis: auditResult.summaryAnalysis,
      suggestedFeedback: gradingResult.suggestedFeedback
    }
  }
}

const aiHolisticSynthesisService = new AIHolisticSynthesisService()
export default aiHolisticSynthesisService
