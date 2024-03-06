import { type ReactNode } from 'react'
import styles from './styles.module.css'

interface Props {
  children: ReactNode
}

export const H3 = ({ children }: Props) => {
  return (
    <h3 className={`${styles.styles}`}>
      {children}
    </h3>
  )
}
