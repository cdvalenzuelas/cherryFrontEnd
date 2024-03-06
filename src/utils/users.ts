import type { User } from '@/state'

export const userColor = (user: User) => {
  if (user.role === 'admin' || user.role === 'superAdmin') {
    return 'primary'
  }

  if (user.role === 'teacher') {
    return 'secondary'
  }

  if (user.active_plan?.name === 'cortesia' || user.active_plan === null) {
    return 'warning'
  }

  return user.active_plan.active ? 'success' : 'danger'
}
