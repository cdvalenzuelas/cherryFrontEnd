import { useUsersState, type User } from '@state'
import { Input, Button, Avatar, Card, CardBody } from '@nextui-org/react'
import { useState, type ChangeEvent, type MouseEvent, type FC, useEffect } from 'react'
import styles from './styles.module.css'
import { UserChip } from '../UserChip'
import { userColor } from '@/utils/users'

interface Props {
  getUserId?: (userIds: string | null) => void
  getSelectedUser?: (user: User | null) => void
  showAllUsers?: boolean
}

export const SearchUser: FC<Props> = ({ getSelectedUser, getUserId, showAllUsers = false }) => {
  const users = useUsersState(state => state.users)
  const [search, setSearch] = useState<string>('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    if (getSelectedUser !== undefined) {
      getSelectedUser(selectedUser)
    }

    if (getUserId !== undefined) {
      getUserId(userId)
    }
  }, [userId, selectedUser])

  // Botones de búsqueda usuarios y estilo
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setSearch(value)

    if (value.length > 3) {
      // Filtrar bien la busqueda
      const internalUsers = users.filter(user => user.name.toLowerCase().includes(value.toLowerCase()))
      setSearchResults(internalUsers)
    } else {
      setSearchResults([])
    }
  }

  // Manejar el agregar y eliminar usuarios
  const handleUser = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as 'add' | 'delete'
    const userId = e.currentTarget.value

    if (name === 'add') {
      const selectedUser = users.filter(user => user.id === userId)[0]

      setSearch('')
      setSearchResults([])
      setUserId(selectedUser.id)
      setSelectedUser(selectedUser)
    } else if (name === 'delete') {
      setUserId(null)
      setSelectedUser(null)
    }
  }

  return (<div className='flex flex-col gap-2 relative'>
    <Input
      color='secondary'
      variant='bordered'
      type="text"
      label="Estudiantes"
      placeholder="Agregar Estudiantes"
      className='relavite'
      name='estudiantes'
      autoComplete='off'
      onChange={handleChange}
      value={search} />

    {searchResults.length > 0 && <Card className={styles.searchContainer}>
      {searchResults.map(user => <Button
        key={user.id}
        name='add'
        value={user.id}
        startContent={<Avatar src={user.image} size='sm' isBordered color={userColor(user)} className='flex-shrink-0' />}
        endContent={<UserChip user={user} />}

        variant='flat'
        size='sm'
        className='h-12 flex items-center justify-between gap-3'
        color={userColor(user)}
        isDisabled={showAllUsers
          ? false
          : user.active_plan?.active === true || user.role !== 'user'}
        onClick={handleUser}>
        <span className='flex-grow flex justify-start overflow-hidden whitespace-nowrap'>{user.name}</span>
      </Button>)}
    </Card>}

    {selectedUser !== null && <Card
      className='flex absolute h-full w-full z-10 left-0 right-0 scale-105'>
      <CardBody className='flex flex-row items-center justify-between align-middle'>
        <Avatar
          src={selectedUser.image}
          isBordered size='sm'
          color={userColor(selectedUser)}
        />
        <span>{selectedUser.name}</span>
        <Button value={selectedUser.id} size='sm' onClick={handleUser} name='delete' color='danger' variant='flat'>delete</Button>
      </CardBody>
    </Card>}
  </div>)
}
