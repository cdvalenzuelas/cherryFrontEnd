import { type ReactNode } from 'react'
import styles from './styles.module.css'

interface Props {
  children: ReactNode
}

export const H1 = ({ children }: Props) => {
  return (
    <h1 className={`${styles.styles}`}>
      {children}
    </h1>
  )
}
