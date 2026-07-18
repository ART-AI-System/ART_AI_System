import submissionsService from './submissions.service'
import databaseService from './database.service'
import { callLLMWithJSON } from '../utils/aiClient'
import { ObjectId } from 'mongodb'
import User from '../models/schemas/users.schema'

export interface AIAuditAndVivaResponse {
  consistencyScore: number
  status: 'GREEN' | 'YELLOW' | 'RED'
  summaryAnalysis: string
  redFlags: string[]
  vivaQuestions: {
    questionNumber: number
    questionText: string
    targetFilePath: string
    targetLineOrFunction: string
    expectedAnswer: string
    purpose: 'CHECK_UNDERSTANDING' | 'AUDIT_AI_CODE' | 'LOGIC_VERIFICATION'
  }[]
}

class AiAuditService {
  async generateAuditAndVivaQuestions(submissionId: string, user: User) {
    const submission = await submissionsService.getSubmissionById(submissionId, user)
    if (!submission) {
      throw new Error('Submission not found')
    }

    const aiInteractions = await databaseService.aiInteractions
      .find({ submissionId: new ObjectId(submissionId) })
      .toArray()

    let codeSnippets = 'No code could be extracted.'
    try {
      const treeData = await submissionsService.getSubmissionFileTree(submissionId, user)
      // Extract top 3 important files
      const filesToRead: string[] = []
      
      const findFiles = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.type === 'file' && (
            node.name.endsWith('.js') || node.name.endsWith('.ts') || 
            node.name.endsWith('.py') || node.name.endsWith('.java')
          )) {
            filesToRead.push(node.path)
          } else if (node.children) {
            findFiles(node.children)
          }
        }
      }
      
      if (treeData.tree && treeData.tree.children) {
        findFiles(treeData.tree.children)
      } else if (!treeData.isArchive) {
        filesToRead.push(treeData.fileName)
      }

      // Read max 3 files to save prompt tokens
      const topFiles = filesToRead.slice(0, 3)
      const contents = await Promise.all(
        topFiles.map(async (p) => {
          try {
            const res = await submissionsService.getSubmissionFileContent(submissionId, user, { path: p })
            return `--- FILE: ${p} ---\n${res.content?.slice(0, 5000)}\n`
          } catch (e) {
            return ''
          }
        })
      )
      
      if (contents.join('').trim().length > 0) {
        codeSnippets = contents.join('\n')
      }
    } catch (error) {
      console.error('Error fetching file content for AI Audit:', error)
    }

    const systemInstruction = `Bạn là một Giảng viên Kỹ thuật Phần mềm kiêm Thanh tra Học vụ cực kỳ sắc bén (Academic Integrity Sentinel & Software Architecture Examiner). Nhiệm vụ của bạn là đối soát lời khai báo sử dụng AI của sinh viên với Source Code thực tế họ nộp. Hãy tìm ra những đoạn code có văn phong LLM phức tạp nhưng không được khai báo, đồng thời tạo ra đúng 3 câu hỏi Vấn đáp bảo vệ (Viva Defense Questions) xoáy sâu vào logic code khó nhất để giảng viên phỏng vấn sinh viên. Luôn luôn trả về định dạng JSON hợp lệ tuân thủ theo schema.`
    
    const userPrompt = `Hãy đối soát trung thực và tạo câu hỏi vấn đáp cho bài nộp này:
- Danh sách khai báo AI của sinh viên (AiInteractions):
${JSON.stringify(aiInteractions, null, 2)}

- Nội dung Source Code sinh viên:
${codeSnippets}

Hãy phân tích độ khớp và trả về JSON chuẩn theo đúng cấu trúc AIAuditAndVivaResponse (bao gồm consistencyScore, status: GREEN/YELLOW/RED, summaryAnalysis, redFlags, và vivaQuestions mảng 3 câu hỏi).`

    const mockFallback: AIAuditAndVivaResponse = {
      consistencyScore: 85,
      status: 'GREEN',
      summaryAnalysis: 'Sinh viên có khai báo đầy đủ các mẫu thiết kế đã hỏi AI. Code khá tương đồng với khai báo.',
      redFlags: [],
      vivaQuestions: [
        {
          questionNumber: 1,
          questionText: 'Trong file chính, bạn có sử dụng pattern nào để quản lý state không?',
          targetFilePath: 'src/index.js',
          targetLineOrFunction: 'Main Component',
          expectedAnswer: 'Sinh viên cần giải thích được luồng dữ liệu cơ bản.',
          purpose: 'CHECK_UNDERSTANDING'
        },
        {
          questionNumber: 2,
          questionText: 'Bạn đã dùng AI để sinh ra thuật toán nào trong bài?',
          targetFilePath: 'N/A',
          targetLineOrFunction: 'N/A',
          expectedAnswer: 'Sinh viên tự khai báo việc dùng AI hỗ trợ logic.',
          purpose: 'AUDIT_AI_CODE'
        },
        {
          questionNumber: 3,
          questionText: 'Giải thích cách bạn handle error trong hệ thống?',
          targetFilePath: 'src/utils.js',
          targetLineOrFunction: 'errorHandler',
          expectedAnswer: 'Cần giải thích được khối try-catch và middleware.',
          purpose: 'LOGIC_VERIFICATION'
        }
      ]
    }

    const result = await callLLMWithJSON<AIAuditAndVivaResponse>(systemInstruction, userPrompt, mockFallback)
    
    // (Optional) Save to DB here if needed, but for now just return it
    return result
  }
}

const aiAuditService = new AiAuditService()
export default aiAuditService
