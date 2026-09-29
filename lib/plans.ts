export const PLAN_OPTIONS = [10, 14] as const

export function planName(mealsPerWeek: number) {
  return `${mealsPerWeek} Meal Glassware Protocol`
}

export function deliveryDayLabel(day: string) {
  return day === 'THURSDAY' ? 'Thursday' : 'Monday'
}
