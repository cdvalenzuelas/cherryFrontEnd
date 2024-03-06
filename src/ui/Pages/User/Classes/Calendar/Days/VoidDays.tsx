import { type FC } from 'react'

import styles from './styles.module.css'

interface Props {
  startDay: number
}

export const VoidDays: FC<Props> = ({ startDay }) => {
  return <>
    {Array.from({ length: startDay }, (_, i) => (
      <div key={i} className={styles.voidDay}>{' '}</div>
    ))}
  </>
}

interface Props2 {
  startDay: number
  daysAtMoth: number
}

export const FinalVoidDays: FC<Props2> = ({ startDay, daysAtMoth }) => {
  return <>
    {Array.from({ length: Math.ceil((daysAtMoth + startDay) / 7) * 7 - daysAtMoth - startDay }, (_, i) => (
      <div key={i} className={styles.voidDay}>{' '}</div>
    ))}
  </>
}
