import type { Sale, User } from '@/state'
import { userColor } from '@/utils/users'
import { Avatar, Button, Chip } from '@nextui-org/react'
import type { FC, MouseEvent } from 'react'
import { SaleModal } from '../SaleModal'

interface Props {
  user: User
  sale: Sale
  value: string
  handleclick: (e: MouseEvent<HTMLButtonElement>) => void
  isOpenModals: Record<string, boolean>
  status: 'vigente' | 'vencido' | 'cortesia'
}

export const ButtonSale: FC<Props> = ({ sale, user, value, handleclick, isOpenModals, status }) => {
  return <>

    <Button

      startContent={<Avatar
        isBordered
        color={userColor(user)}
        src={user.image}
        size='sm'
        className='flex-shrink-0'
      />}

      endContent={<div className='flex gap-2'>
        <Chip color='warning' size='sm'>{sale.name}</Chip>
        <Chip color={status === 'vigente' ? 'success' : 'danger'} size='sm'>{status}</Chip>
      </div>}

      onClick={handleclick}
      value={value}
      className='flex items-center justify-between gap-5 h-14'
      color={status === 'vigente' ? 'success' : status === 'vencido' ? 'danger' : 'warning'}
      variant='flat'
      radius='full'
    >
      <span className='flex-grow flex justify-start overflow-hidden whitespace-nowrap'>{user.name}</span>
    </Button>

    {isOpenModals[sale.id as string] && <SaleModal user={user} sale={sale} handleclick={handleclick} status={status} />}

  </>
}
