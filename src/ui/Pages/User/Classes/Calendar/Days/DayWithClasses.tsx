// Libs
import React, { type FC } from 'react'

// Componets
import styles from './styles.module.css'

interface Props {
  dayOfMonth: number
  currentDay: number
  children: React.ReactNode
}

export const DayWithClasses: FC<Props> = ({ currentDay, dayOfMonth, children }) => {
  return <div className={`${styles.day}`}>
    <div
      className={styles.dayNumber}
      style={{
        backgroundColor: currentDay === dayOfMonth ? 'var(--danger)' : 'transparent',
        color: currentDay === dayOfMonth ? 'white' : 'var(--gray2)'
      }}
    >
      {dayOfMonth}
    </div>
    <div className='flex flex-col'>
      {children}
    </div>
  </div>
}
