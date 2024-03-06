import styles from './styles.module.css'
import { days } from '../../utils'

export const TitleDays = () => {
  return <>
    {days.map(day => <div key={day} className={styles.titleDay}>{day}</div>)}
  </>
}
