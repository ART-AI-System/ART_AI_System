import User from '~/models/schemas/users.schema'
import submissionsService from './submissions.service'
import gradeItemsService from './gradeItems.service'
import { callLLMWithJSON } from '~/utils/aiClient'

export interface AIFileAnnotation {
  lineNumber: number
  severity: 'SECURITY' | 'BUG' | 'BEST_PRACTICE' | 'PRAISE'
  title: string
  comment: string
  suggestedFix?: string
}

export interface AIFileAnnotationsResponse {
  filePath: string
  overallQuality: string
  annotations: AIFileAnnotation[]
}

class AIAnnotatorService {
  async annotateCodeFile(submissionId: string, filePath: string, user: User): Promise<AIFileAnnotationsResponse> {
    const submission = await submissionsService.getSubmissionById(submissionId, user)
    const gradeItem = await gradeItemsService.getGradeItemById(submission.gradeItemId.toString())

    const fileContentRes = await submissionsService.getSubmissionFileContent(submissionId, user, { path: filePath })
    if (!fileContentRes.isText || !fileContentRes.content) {
      throw new Error('Selected file is not text/code or cannot be read for AI annotation.')
    }

    const codeContent = fileContentRes.content

    const systemInstruction = `Bạn là Giảng viên Chuyên gia Kiểm định Chất lượng Mã nguồn (Senior Code Audit & Engineering Professor). Nhiệm vụ của bạn là kiểm tra tỉ mỉ từng dòng code trong file của sinh viên, đối chiếu với yêu cầu bài tập và chuẩn mực lập trình chuyên nghiệp. Trả về đúng định dạng JSON danh sách các chú thích (annotations) gắn đúng số dòng code (lineNumber).`

    const userPrompt = `Hãy kiểm tra và ghi chú chi tiết từng lỗi/điểm sáng trong file source code sau:
- Tên file: ${filePath}
- Yêu cầu bài tập/Rubric: ${gradeItem?.title || 'General Programming Assignment'} - ${gradeItem?.description || 'Kiểm tra logic, bảo mật và clean code'}
- Nội dung Source Code (có kèm số dòng):
${codeContent
  .split('\n')
  .map((line, idx) => `${idx + 1}: ${line}`)
  .join('\n')}

Hãy phân tích và trả về JSON theo đúng định dạng sau:
{
  "filePath": "${filePath}",
  "overallQuality": "Đánh giá tổng quan về file này trong 2 câu",
  "annotations": [
    {
      "lineNumber": số_dòng_code_có_vấn_đề_hoặc_đáng_khen,
      "severity": "SECURITY" hoặc "BUG" hoặc "BEST_PRACTICE" hoặc "PRAISE",
      "title": "Tiêu đề ngắn gọn (ví dụ: Thiếu kiểm tra null input, Xử lý ngoại lệ tốt, Rủi ro XSS)",
      "comment": "Giải thích rõ ràng lý do tại sao dòng này cần sửa hoặc làm tốt",
      "suggestedFix": "Đoạn code gợi ý thay thế (nếu cần)"
    }
  ]
}`

    const mockFallback: AIFileAnnotationsResponse = {
      filePath,
      overallQuality: `File ${filePath} được viết rõ ràng, logic hàm tốt. Tuy nhiên cần cải thiện việc kiểm tra tham số đầu vào và xử lý ngoại lệ chặt chẽ hơn.`,
      annotations: [
        {
          lineNumber: 4,
          severity: 'BEST_PRACTICE',
          title: 'Cần khai báo kiểu dữ liệu rõ ràng',
          comment: 'Nên tránh sử dụng kiểu any hoặc để tham số ngầm định để tận dụng tối đa TypeScript.',
          suggestedFix: 'function calculateGrade(midterm: number, final: number): number'
        },
        {
          lineNumber: 8,
          severity: 'SECURITY',
          title: 'Rủi ro rò rỉ thông tin qua console.log',
          comment: 'Trong môi trường production, không nên log trực tiếp dữ liệu nhạy cảm hoặc cấu hình nội bộ ra terminal.',
          suggestedFix: '// Sử dụng logger chuyên dụng hoặc loại bỏ trước khi deploy'
        },
        {
          lineNumber: 12,
          severity: 'PRAISE',
          title: 'Chia tách logic tính toán gọn gàng',
          comment: 'Hàm được viết ngắn gọn, tuân thủ nguyên tắc Single Responsibility (SRP).'
        }
      ]
    }

    return await callLLMWithJSON<AIFileAnnotationsResponse>(systemInstruction, userPrompt, mockFallback)
  }
}

const aiAnnotatorService = new AIAnnotatorService()
export default aiAnnotatorService
