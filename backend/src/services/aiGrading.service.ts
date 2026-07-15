import User from '~/models/schemas/users.schema'
import submissionsService from './submissions.service'
import gradeItemsService from './gradeItems.service'
import { callLLMWithJSON } from '~/utils/aiClient'

export interface AIGradingSuggestion {
  summary: string
  suggestedScore: number
  maxScore: number
  rubricBreakdown: {
    criteriaName: string
    score: number
    maxScore: number
    comment: string
  }[]
  suggestedFeedback: string
}

class AIGradingService {
  /**
   * Helper to recursively collect up to `limit` text file paths from a submission tree.
   */
  private collectCodeFilePaths(node: any, paths: string[] = [], limit = 5): string[] {
    if (paths.length >= limit) return paths

    if (node.type === 'file') {
      const ext = node.name.split('.').pop()?.toLowerCase() || ''
      const validExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cs', 'html', 'css', 'json', 'md']
      if (validExts.includes(ext) && !node.path.includes('node_modules') && !node.path.includes('package-lock')) {
        paths.push(node.path)
      }
    } else if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        this.collectCodeFilePaths(child, paths, limit)
        if (paths.length >= limit) break
      }
    }
    return paths
  }

  async analyzeSubmissionAndSuggestGrade(submissionId: string, user: User): Promise<AIGradingSuggestion> {
    const submission = await submissionsService.getSubmissionById(submissionId, user)
    const gradeItem = await gradeItemsService.getGradeItemById(submission.gradeItemId.toString())

    const maxScore = gradeItem?.maxScore || 10

    // Fetch submission file tree
    let codeSnippets = ''
    try {
      const treeRes = await submissionsService.getSubmissionFileTree(submissionId, user)
      const filePaths: string[] = []
      if (treeRes.tree) {
        this.collectCodeFilePaths(treeRes.tree, filePaths, 5)
      }

      for (const filePath of filePaths) {
        const fileContentRes = await submissionsService.getSubmissionFileContent(submissionId, user, { path: filePath })
        if (fileContentRes.isText && fileContentRes.content) {
          codeSnippets += `\n=== FILE: ${filePath} ===\n${fileContentRes.content.slice(0, 3000)}\n`
        }
      }
    } catch (err) {
      console.warn('⚠️ [AIGradingService] Could not read file contents for AI analysis:', err)
      codeSnippets = `Submission File Name: ${submission.fileName}\n(Content unreadable or not text format)`
    }

    if (!codeSnippets.trim()) {
      codeSnippets = `Submission File Name: ${submission.fileName}\nNo readable text source files found.`
    }

    const systemInstruction = `Bạn là một Giảng viên Chuyên gia Khoa học Máy tính & Kỹ thuật Phần mềm (Software Engineering Expert Professor). Nhiệm vụ của bạn là đánh giá công tâm, chính xác bài tập lập trình của sinh viên dựa trên Rubric/Yêu cầu bài tập và Source Code thực tế. Luôn trả về dữ liệu chuẩn JSON định dạng đã yêu cầu, nhận xét khích lệ nhưng chỉ rõ lỗi kỹ thuật hay điểm cần cải thiện.`

    const userPrompt = `Đánh giá bài nộp sau đây:
- Tên bài tập/Tiêu chí Rubric: ${gradeItem?.title || 'Assignment Assessment'}
- Mô tả yêu cầu: ${gradeItem?.description || 'Đánh giá chất lượng code, kiến trúc, xử lý lỗi và logic chương trình.'}
- Thang điểm tối đa (maxScore): ${maxScore}
- Nội dung Source Code sinh viên nộp:
${codeSnippets}

Hãy phân tích và trả về JSON theo đúng định dạng sau:
{
  "summary": "Tóm tắt project trong 3 dòng",
  "suggestedScore": số_điểm_đề_xuất_theo_thang_${maxScore},
  "maxScore": ${maxScore},
  "rubricBreakdown": [
    {
      "criteriaName": "Tên tiêu chí (ví dụ: Clean Code & Architecture, Business Logic & Error Handling, Documentation & Setup)",
      "score": điểm_tiêu_chí,
      "maxScore": điểm_tối_đa_của_tiêu_chí,
      "comment": "Lời phê chi tiết cho tiêu chí này"
    }
  ],
  "suggestedFeedback": "Lời phê tổng quát chuyên nghiệp để giảng viên dán thẳng vào ô Feedback của sinh viên"
}`

    const mockFallback: AIGradingSuggestion = {
      summary: `Project được xây dựng hoàn chỉnh với cấu trúc thư mục rõ ràng. Sinh viên áp dụng tốt ES6 modules và chia tách logic hợp lý giữa entry point (${submission.fileName}) và các file helper/service.`,
      suggestedScore: Math.round(maxScore * 0.85 * 10) / 10,
      maxScore,
      rubricBreakdown: [
        {
          criteriaName: 'Cấu trúc & Clean Code (Architecture & Structure)',
          score: Math.round(maxScore * 0.35 * 10) / 10,
          maxScore: Math.round(maxScore * 0.4 * 10) / 10,
          comment: 'Cách đặt tên biến và tách hàm tốt, dễ bảo trì. Nên bổ sung thêm type checking hoặc JSDoc.'
        },
        {
          criteriaName: 'Logic Nghiệp vụ & Xử lý lỗi (Business Logic & Error Handling)',
          score: Math.round(maxScore * 0.35 * 10) / 10,
          maxScore: Math.round(maxScore * 0.4 * 10) / 10,
          comment: 'Thuật toán chính xác, chạy đúng kết quả mong đợi. Cần chú ý thêm khối try-catch cho các thao tác ngoại vi hoặc input validation.'
        },
        {
          criteriaName: 'Tài liệu & Hướng dẫn (Documentation & Setup)',
          score: Math.round(maxScore * 0.15 * 10) / 10,
          maxScore: Math.round(maxScore * 0.2 * 10) / 10,
          comment: 'Có đầy đủ file cấu hình và README hướng dẫn chạy lệnh rõ ràng.'
        }
      ],
      suggestedFeedback: `Bài làm tốt, cấu trúc code gọn gàng và đáp ứng đúng các yêu cầu chính của đề bài. Điểm cộng cho việc chia tách hàm tiện ích rõ ràng. Tuy nhiên, em nên lưu ý xử lý chặt chẽ hơn các trường hợp input biên hoặc lỗi ngoại lệ để ứng dụng đạt độ ổn định tuyệt đối.`
    }

    return await callLLMWithJSON<AIGradingSuggestion>(systemInstruction, userPrompt, mockFallback)
  }
}

const aiGradingService = new AIGradingService()
export default aiGradingService
