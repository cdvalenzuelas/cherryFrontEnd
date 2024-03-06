// Libs
import Link from 'next/link'
import { Avatar } from '@nextui-org/react'

// State | Componets
import { useUserState } from '@state'

export const User = () => {
  const avatarImage = useUserState(state => state.image)

  return (
    <Link href='/user'>
      <Avatar isBordered color="success" src={avatarImage} size='sm' />
    </Link>
  )
}
