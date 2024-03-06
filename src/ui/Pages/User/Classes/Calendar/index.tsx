// State | Componets
import { VoidDays, TitleDays, DayWithClasses, FinalVoidDays } from './Days'
import { useCalendar } from './useCalendar'
import { moths, determinateDay } from '../utils'
import { DesktopEditableClassButtons, DesktopReadableClassButtons, MobileClassButtons } from './Buttons'
import { MobileDayModal, EditableModal, ReadableModal } from './Modals'
import styles from './styles.module.css'
import { Button } from '@nextui-org/react'
import { type FC } from 'react'

interface Props {
  userId: string | null
}

export const Calendar: FC<Props> = ({ userId: userId2 }) => {
  const { date, classes, userRole, handleClick, modals, handleMonth, userId } = useCalendar({ userId2 })
  const curentdate = new Date()

  const currentMonth = curentdate.getMonth()
  const currentYear = curentdate.getFullYear()

  return (
    <>
      <div className='flex items-center justify-between'>
        {moths[date.month]} / {date.year}
        <div>

          <Button
            size='md'
            color='secondary'
            onClick={handleMonth}
            name='less'
            variant='light'
            isIconOnly
            startContent={<span>{'<'}</span>}
            disabled={date.year === 2024 && date.month === 0}
          />

          <Button
            size='md'
            color='secondary'
            onClick={handleMonth}
            name='today'
            variant='light'
            className='w-min'
            isDisabled={date.day !== 0}>
            Hoy
          </Button>

          {<Button
            size='md'
            color='secondary'
            onClick={handleMonth}
            name='more'
            variant='light'
            isIconOnly
            startContent={<span>{'>'}</span>}
            disabled={date.year === currentYear && date.month === currentMonth}
          />}

        </div>
      </div>

      <hr />

      <div className={`${styles.calendar}`}>

        {/* Dias de la semana Lunes, Martes Miercoles  */}
        <TitleDays />

        {/* Dias vacios al inicio del mes  */}
        <VoidDays startDay={date.startDay} />

        {/* Reccorres todos los días del mes  */}
        {Array.from({ length: date.daysAtMoth }, (_, i) => {
          // Extraer todas las propiedades, horario y clases de cada día
          const dayOfMonth = i + 1
          const dayOfWeek = determinateDay(dayOfMonth, date.startDay)
          const ocupedHours = classes.hoursOfClassesByDay[String(dayOfMonth)]
          const classesByDay = classes.classes.filter(item => item.date.getDate() === dayOfMonth)
          const scheduleByDay = classes.schedule.filter(item => {
            const isTheDay = item.day === dayOfWeek
            let hourIsNotOccuped = true

            if (ocupedHours !== undefined) {
              hourIsNotOccuped = !ocupedHours.includes(item.hour)
            }

            return isTheDay && hourIsNotOccuped
          })

          // Mostrar únicamente los días programados y hoy
          let dateItsInRange = true

          if (date.month === currentMonth && date.year === currentYear) {
            dateItsInRange = date.day >= dayOfMonth
          } else if (date.month === 0 && date.year === 2024) {
            dateItsInRange = dayOfMonth >= 9
          }

          return <DayWithClasses key={i} dayOfMonth={dayOfMonth} currentDay={date.day}>

            {/* Mostrar los botones que activan los modales de clases editables (solo escritorio) */}
            <DesktopEditableClassButtons
              dayOfMonth={dayOfMonth} month={date.month}
              year={date.year}
              scheduleByDay={scheduleByDay}
              userRole={userRole}
              handleClick={handleClick}
            />

            {/* Mostrar los botones que activan los modales de clases leibles (solo escritorio) */}
            <DesktopReadableClassButtons
              dayOfMonth={dayOfMonth}
              classesByDay={classesByDay}
              handleClick={handleClick}
            />

            {/* Mostrar el boton que activa el modal de clases en Mobile */}
            {dateItsInRange && <MobileClassButtons
              dayOfMonth={dayOfMonth}
              handleClick={handleClick}
              scheduleByDay={scheduleByDay}
              classesByDay={classesByDay}
              userRole={userRole}
              userId={userId}
            />}

            {/* Cada vez que quiere editar una clase */}
            {modals.isOpnenEditableModals[dayOfMonth] && <EditableModal
              classToEdit={classes.classToEdit}
              dayOfMonth={dayOfMonth}
              month={date.month}
              year={date.year}
              isOpnenEditableModals={modals.isOpnenEditableModals}
              setIsOpenEditableModals={modals.setIsOpenEditableModals}
            />}

            {/* Cada vez que quiere editar una clase */}
            {modals.isOpnenReadableModals[dayOfMonth] && <ReadableModal
              month={date.month}
              year={date.year}
              dayOfMonth={dayOfMonth}
              handleClick={handleClick}
              danceClass={classes.classToRead}
            />}

            {/* Cada vez que desde el celular se le da clic a un día */}
            {modals.isOpnenMobileModals[dayOfMonth] && <MobileDayModal
              scheduleByDay={scheduleByDay}
              classesByDay={classesByDay}
              handleClick={handleClick}
              dayOfMonth={dayOfMonth}
              month={date.month}
              year={date.year}
              dayOfWeek={dayOfWeek}
              userRole={userRole}
              userId={userId}
            />}

          </DayWithClasses>
        })}

        <FinalVoidDays startDay={date.startDay} daysAtMoth={date.daysAtMoth} />

      </div>
    </>
  )
}
