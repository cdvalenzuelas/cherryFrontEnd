'use client'

// Lib
import { type MouseEvent } from 'react'
import { Button } from '@nextui-org/react'
import Link from 'next/link'

// Componets
import { useUsersStage, type UserStageType } from '@state'
import styles from './styles.module.css'
import { SalesIcon } from '@/app/SalesIcon'
import { ClassIcon } from '@/app/ClassIcon'

export const Header = () => {
  const setUserStage = useUsersStage(state => state.setUserStage)
  const userStage = useUsersStage(state => state.userStage)

  // CLICK
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name as UserStageType
    setUserStage(name)
  }

  return (
    <header className={`flex flex-col gap-2 ${styles.header}`}>
      <nav className="flex flex-wrap gap-3 items-center justify-between w-full">
        <Link href="/" color="primary">
          <img src="/logo.png" alt="logo" className={styles.logo} />
        </Link>

        <Button
          size="md"
          color="secondary"
          variant="light"
          onClick={handleClick}
          startContent={
            <ClassIcon color={userStage === 'reports' ? '#009cd3' : '#94a3b8'} />
          }
          radius="none"
          name='reports'
          isIconOnly
          style={{ borderBottom: userStage === 'reports' ? '2px solid #009cd3' : 'none' }}
        />

        <Button
          size="md"
          color="secondary"
          variant="light"
          onClick={handleClick}
          startContent={
            <SalesIcon color={userStage === 'sales' ? '#009cd3' : '#94a3b8'} />
          }
          radius="none"
          name="sales"
          isIconOnly
          style={{ borderBottom: userStage === 'sales' ? '2px solid #009cd3' : 'none' }} />
      </nav>
    </header>
  )
}
