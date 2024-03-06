// Components
import { useScheduleState } from '@state'
import styles from './styles.module.css'
import { Avatar, Button, Card, Chip, Image } from '@nextui-org/react'
import { useEffect, useState } from 'react'

const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado']

export const Schedule = () => {
  const schedule = useScheduleState(state => state.schedule)
  const [visibleDay, setVisibleDay] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])

  useEffect(() => {
    const newVisibleDay = [...visibleDay]

    newVisibleDay.forEach((item, i) => {
      newVisibleDay[i] = schedule.filter(item2 => item2.day === i).length
    })

    setVisibleDay(newVisibleDay)
  }, [])

  return (<div className={`${styles.container}`}>
    {Array.from({ length: 7 }, (_, i) => {
      if (visibleDay[i] > 0) {
        return <div key={i} className={styles.day}>

          <Button
            key={days[i]}
            className='w-full'
            variant='flat'
            disabled
            style={{ display: visibleDay[i] === 0 ? 'none' : 'initial' }}
            color="secondary">
            {days[i]}
          </Button>

          <div className={styles.classContainer}>
            {schedule.map(item => {
              if (item.day === i) {
                return <Card
                  key={item.id}
                  className={styles.class}
                >

                  <div className={styles.cover}>
                    <Image
                      src={`teachers/${item.teacher.instagram_id}.jpg`}
                      style={{ borderRadius: '0' }}
                      className={styles.img}
                    />
                  </div>

                  <div className={styles.avatar}>
                    <Avatar
                      size='lg'
                      src={item.teacher.image}
                      isBordered
                      color='secondary'
                    />
                  </div>

                  <div className={styles.teacherInfo}>
                    <span>{item.teacher.name}</span>
                    <a>{item.teacher.instagram_id}</a>
                  </div>

                  <div className={styles.info}>
                    <span>{item.gender} {item.mode === 'couple' ? 'parejas' : ''} {item.style}</span>
                    <span className={styles.hour}>{item.hour}:00 a {item.hour + 1}:00</span>
                    <Chip size='sm' color={item.difficulty === 'basico' ? 'success' : 'warning'}>{item.difficulty}</Chip>
                  </div>

                </Card>
              } else {
                return null
              }
            })}
          </div>

        </div>
      } else {
        return null
      }
    })}
  </div >)
}
