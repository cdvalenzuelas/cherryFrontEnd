// Componets
import { type DanceClass, useClassesState, useDateState, useUserState } from '@/state'
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { formardate } from '@/utils/dates'
import { useEffect, useState } from 'react'
import { formatCurency } from '@/utils/currency'
import styles from './styles.module.css'

export const TeacherSummary = () => {
  const userRole = useUserState(state => state.role)
  const userId = useUserState(state => state.id)
  const classesStore = useClassesState(state => state.classesStore)
  const month = useDateState(state => state.month)
  const year = useDateState(state => state.year)
  const [classesOfMonth, setClassesOfMonth] = useState<DanceClass[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    if (Object.keys(classesStore).includes(`${year}-${month}`)) {
      const internalClassesOfMonth = classesStore[`${year}-${month}`].filter(item => {
        const userIsTeacher = item.teacher.id === userId
        const classWasNotCancel = !item.canceled

        return userIsTeacher && classWasNotCancel
      })

      setClassesOfMonth(internalClassesOfMonth)
    }
  }, [classesStore, month, year])

  const total = classesOfMonth.reduce((a, b) => a + b.price, 0)

  if (userRole === 'teacher' && Object.keys(classesStore).includes(`${year}-${month}`)) {
    return <>
      <Button onClick={e => { setIsOpen(true) }} color='secondary' variant='shadow'>Resumen del Mes</Button>

      <Modal isOpen={isOpen} backdrop='blur' placement='center' className='overflow-y-scroll'>

        <ModalContent className='px-5 py-3 overflow-y-scroll'>

          <ModalHeader className='py-3 px-5'>
            <h3>Resumen del mes</h3>
          </ModalHeader>

          <ModalBody className='flex flex-col gap-5 px-5 py-5'>
            <p>Este mes dictaste {classesOfMonth.length} clases y tienes acumulado ${formatCurency(total)}, este saldo se te cancelará los primeros 5 días del seiguiente mes.</p>

            <Table removeWrapper selectionMode='single' color='secondary' aria-label="Example table with dynamic content" className={styles.content}>

              <TableHeader className={styles.tableHeader}>
                <TableColumn>Clase</TableColumn>
                <TableColumn>Precio</TableColumn>
                <TableColumn>Fecha</TableColumn>
              </TableHeader>

              <TableBody items={classesOfMonth}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell className='flex gap-1 items-center justify-start'>
                      <Chip color='danger' size='sm'>{item.gender}</Chip>
                      <Chip color='warning' size='sm'>{item.difficulty}</Chip>
                      <Chip color='success' size='sm'>{item.mode}</Chip>
                      {item.style !== '' && item.style !== "''" && <Chip color='secondary' size='sm'>{item.style}</Chip>}
                    </TableCell>
                    <TableCell>${formatCurency(item.price)}</TableCell>
                    <TableCell>{formardate(item.date)}</TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>

          </ModalBody>

          <ModalFooter>
            <Button size='sm' color='danger' variant='flat' onClick={e => { setIsOpen(false) }}>
              Cerrar
            </Button>
          </ModalFooter>

        </ModalContent>

      </Modal>
    </>
  } else {
    return null
  }
}
