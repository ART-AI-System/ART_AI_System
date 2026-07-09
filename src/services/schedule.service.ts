import { ObjectId } from 'mongodb'
import databaseService from './database.service'

class ScheduleService {
  async getStudentSchedule(studentId: string, startDateStr: string, endDateStr: string) {
    const studentOid = new ObjectId(studentId)
    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    // Ensure the end date covers the whole day if it's just a date string
    // But since the query is between startDate and endDate, it's better if frontend sends exact ISO strings.
    // We'll just use the Date objects directly.

    const pipeline = [
      // 1. Find all classes where this student is enrolled
      {
        $match: {
          'students.studentId': studentOid,
          isActive: true
        }
      },
      // 2. Lookup sessions for these classes
      {
        $lookup: {
          from: process.env.DB_SESSIONS_COLLECTION || 'sessions',
          localField: '_id',
          foreignField: 'classId',
          as: 'sessions'
        }
      },
      // 3. Unwind the sessions array so we can filter individual sessions
      {
        $unwind: '$sessions'
      },
      // 4. Match sessions within the date range
      {
        $match: {
          'sessions.startTime': {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      // 5. Project the final shape to return to the frontend
      {
        $project: {
          _id: 0,
          classId: '$_id',
          classCode: 1,
          subjectSnapshot: 1,
          lecturer: 1,
          sessionId: '$sessions._id',
          sessionNo: '$sessions.sessionNo',
          title: '$sessions.title',
          description: '$sessions.description',
          startTime: '$sessions.startTime',
          endTime: '$sessions.endTime'
        }
      },
      // 6. Sort chronologically
      {
        $sort: {
          startTime: 1 as const
        }
      }
    ]

    const schedule = await databaseService.classes.aggregate(pipeline).toArray()
    return schedule
  }
}

const scheduleService = new ScheduleService()
export default scheduleService
