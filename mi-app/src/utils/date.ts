import { differenceInCalendarDays } from 'date-fns'

export function getDaysDifference(startDate: Date, endDate: Date): number {
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('Both dates must be valid Date objects.')
  }

  return differenceInCalendarDays(endDate, startDate)
}
