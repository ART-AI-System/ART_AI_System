import { Request, Response, NextFunction } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import adminService from '~/services/admin.services'

export const getAdminDashboardController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await adminService.getDashboard()
    res.json({
      message: 'Get admin dashboard successfully',
      result
    })
  }
)

export const getSystemActivityController = wrapRequestHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await adminService.getSystemActivity()
    res.json({
      message: 'Get system activity successfully',
      result
    })
  }
)
