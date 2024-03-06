import type { User } from '@/state'
import { Chip } from '@nextui-org/react'
import type { FC } from 'react'
import { userColor } from '@/utils/users'

interface Props {
  user: User
}

export const UserChip: FC<Props> = ({ user }) => {
  let userType = ''

  if (user.role === 'admin' || user.role === 'superAdmin') {
    userType = 'admin'
  } else if (user.role === 'teacher') {
    userType = 'teacher'
  } else if (user.active_plan === null) {
    userType = 'cortesia'
  } else if (user.active_plan.active) {
    userType = user.active_plan.name === 'cortesia' ? 'cortesia' : 'activo'
  } else {
    userType = 'inactivo'
  }

  return <Chip
    size='sm'
    color={userColor(user)}>
    {userType}
  </Chip>
}
