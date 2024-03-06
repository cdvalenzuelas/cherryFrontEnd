// Libs
import { Avatar, AvatarGroup, Chip, User, Link, Image, Card, CardHeader, CardFooter, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { type FC } from 'react'

// Componets
import { useUserState, type DanceClass } from '@state'
import styles from '../../styles.module.css'
import { userColor } from '@/utils/users'

interface Props {
  danceClass: DanceClass
  dayOfMonth: number
  month: number
  year: number
  editable: boolean
}

export const Info: FC<Props> = ({ danceClass, dayOfMonth, month, year, editable }) => {
  const userId = useUserState(state => state.id)
  const virtualUser = danceClass.users.map(item => {
    if (item.id === userId) {
      return { ...item, order: 0 }
    }

    if (item.role === 'user' && item.active_plan === null) {
      return { ...item, order: 1 }
    }

    if (item.active_plan !== null) {
      if (item.role === 'user' && !item.active_plan.active) {
        return { ...item, order: 2 }
      }

      if (item.role === 'user' && item.active_plan.active) {
        return { ...item, order: 3 }
      }
    }

    return { ...item, order: 4 }
  })

  virtualUser.sort((a, b) => a.order - b.order)

  return (<Card className={styles.info}>
    <CardHeader className="absolute z-10 top-1 flex flex-col items-start px-5 gap-2">
      <User
        name={danceClass.teacher.name}
        className='py-2'
        style={{ color: '#fff' }}
        description={(
          <Link href="https://www.instagram.com/bachataduane/" size="sm" isExternal>
            @bachataduane
          </Link>
        )}
        avatarProps={{
          src: danceClass.teacher.image,
          size: 'md',
          isBordered: true,
          color: 'secondary'
        }}
      />

      <div className='flex-grow flex flex-col gap-2'>
        <Chip size='sm' color='secondary'>{`${dayOfMonth}/${month + 1}/${year} ${danceClass.hour}:00 a ${danceClass.hour + 1}:00`}</Chip>
        <div className='flex justify-start gap-2'>
          <Chip size='sm' color='danger'>{danceClass.gender}</Chip>
          <Chip size='sm' color='warning'>{danceClass.difficulty}</Chip>
          <Chip size='sm' color='success'>{danceClass.mode}</Chip>
          {danceClass.style !== '' && <Chip size='sm' color='primary'>{danceClass.style}</Chip>}
        </div>
      </div>

    </CardHeader>

    <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between px-5">
      <div className='py-2 flex flex-col gap-2'>

        <Chip
          size='sm'
          color='secondary'>
          {danceClass.users.length} estudiantes
        </Chip>

        <AvatarGroup
          color='primary'
          isGrid
          size='sm'
          max={40}
          className='flex justify-start flex-wrap w-full'>
          {virtualUser.map(item => <Popover key={item.id} color='success' backdrop='blur'>
            <PopoverTrigger>
              <Avatar
                key={item.id}
                src={item.image}
                color={userColor(item)}
                isBordered />
            </PopoverTrigger>
            <PopoverContent>
              {item.name}
            </PopoverContent>
          </Popover>)}
        </AvatarGroup>
      </div>
    </CardFooter>

    <Image
      removeWrapper
      alt="Card background"
      className="z-0 w-full h-full object-cover"
      src={`teachers/${danceClass.teacher.instagram_id}.jpg`}
    />
  </Card>)
}
