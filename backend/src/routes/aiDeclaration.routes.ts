import { Router } from 'express'
import { body, param } from 'express-validator'
import { requireAuth, requireRole } from '~/middlewares/auth.middlewares'
import { validate } from '~/utils/validation'
import { wrapRequestHandler } from '~/utils/handlers'
import {
  createAiInteractionController,
  deleteAiInteractionController,
  getAiInteractionController,
  listAiInteractionsController,
  updateAiInteractionController,
  validateAiInteractionsController
} from '~/controllers/aiDeclaration.controllers'

const validateObjectIdParam = (paramName: string) =>
  validate({
    run: async (req: any) => {
      await param(paramName)
        .isMongoId()
        .withMessage(`${paramName} must be a valid MongoDB ObjectId`)
        .run(req)
    }
  } as any)

const validateAiInteractionBody = validate({
  run: async (req: any) => {
    await Promise.all([
      body('aiTool')
        .isIn(['chatgpt', 'gemini', 'claude', 'copilot', 'other'])
        .withMessage('aiTool must be chatgpt, gemini, claude, copilot, or other')
        .run(req),
      body('usagePurpose')
        .isIn([
          'brainstorming',
          'topic_research',
          'summarization',
          'writing_improvement',
          'critical_feedback',
          'methodology_review',
          'data_analysis',
          'other'
        ])
        .withMessage('Invalid usagePurpose type')
        .run(req),
      body('promptContent')
        .notEmpty()
        .withMessage('promptContent is required')
        .isString()
        .withMessage('promptContent must be a string')
        .run(req),
      body('aiResponseSummary')
        .notEmpty()
        .withMessage('aiResponseSummary is required')
        .isString()
        .withMessage('aiResponseSummary must be a string')
        .run(req),
      body('studentDecision')
        .isIn(['accepted', 'partially_accepted', 'rejected', 'reference_only'])
        .withMessage('studentDecision must be accepted, partially_accepted, rejected, or reference_only')
        .run(req),
      body('reflectionText')
        .notEmpty()
        .withMessage('reflectionText is required')
        .isString()
        .withMessage('reflectionText must be a string')
        .run(req)
    ])
  }
} as any)

const aiDeclarationRouter = Router()

aiDeclarationRouter.post(
  '/submissions/:submissionId/ai-interactions',
  requireAuth,
  requireRole('STUDENT'),
  validateObjectIdParam('submissionId'),
  validateAiInteractionBody,
  wrapRequestHandler(createAiInteractionController)
)

aiDeclarationRouter.get(
  '/submissions/:submissionId/ai-interactions',
  requireAuth,
  validateObjectIdParam('submissionId'),
  wrapRequestHandler(listAiInteractionsController)
)

aiDeclarationRouter.get(
  '/ai-interactions/:id',
  requireAuth,
  validateObjectIdParam('id'),
  wrapRequestHandler(getAiInteractionController)
)

aiDeclarationRouter.put(
  '/ai-interactions/:id',
  requireAuth,
  requireRole('STUDENT'),
  validateObjectIdParam('id'),
  validateAiInteractionBody,
  wrapRequestHandler(updateAiInteractionController)
)

aiDeclarationRouter.delete(
  '/ai-interactions/:id',
  requireAuth,
  requireRole('STUDENT'),
  validateObjectIdParam('id'),
  wrapRequestHandler(deleteAiInteractionController)
)

aiDeclarationRouter.post(
  '/submissions/:submissionId/ai-interactions/validate',
  requireAuth,
  requireRole('STUDENT'),
  validateObjectIdParam('submissionId'),
  wrapRequestHandler(validateAiInteractionsController)
)

export default aiDeclarationRouter
