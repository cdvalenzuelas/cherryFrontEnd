import { type Dispatch, type FC, type SetStateAction, type MouseEvent, useState, useEffect } from 'react'
import { type DanceClass, useClassesState, type User, usePaymentsState, type Payment } from '@/state'
import { Avatar, Button, Chip } from '@nextui-org/react'
import { formatCurency } from '@/utils/currency'
import { NewSaleModal } from './NewSaleModal.tsx'
import { getPayments } from '@/api'

interface Props {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

type ClassesByTeacher = Record<string, DanceClass[]>

export const Teachers: FC<Props> = ({ isOpen, setIsOpen }) => {
  const classesStore = useClassesState(state => state.classesStore)
  const setPaymnets = usePaymentsState(state => state.setPayments)
  const payments = usePaymentsState(state => state.payments)

  useEffect(() => {
    (async () => {
      const paymentsFromDB = await getPayments()
      setPaymnets(paymentsFromDB)
    })()
  }, [])

  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null)
  const [paymentsByTeacher, setPaymentsByTeacher] = useState<Payment[]>([])

  const teachers: User[] = []

  const classesByTeacher: ClassesByTeacher = {}

  Object.values(classesStore).flat().forEach(internalClass => {
    const key = internalClass.teacher.id

    if (Object.keys(classesByTeacher).includes(key)) {
      classesByTeacher[key] = [...classesByTeacher[key], internalClass]
    } else {
      teachers.push(internalClass.teacher)
      classesByTeacher[key] = [internalClass]
    }
  })

  // const sales = useSalesState(state => state.sales)
  const handleOpen = (e: MouseEvent<HTMLButtonElement>, teacher: User | null) => {
    const name = e.currentTarget.name as 'open' | 'close'

    if (name === 'open') {
      setSelectedTeacher(teacher)
      const internalPaymentsByTeacher = payments.filter(payment => payment.teacher === teacher?.id)
      setPaymentsByTeacher(internalPaymentsByTeacher)
    }

    setIsOpen(name === 'open')
  }

  return <>
    <h1>Profesores</h1>

    <div className='flex flex-col gap-2 px-5'>

      {Object.keys(classesByTeacher).map(teacherId => {
        const teacher = teachers.filter(teacher => teacherId === teacher.id)[0]
        const debt = classesByTeacher[teacherId].reduce((a, b) => a + b.price, 0)
        const totalPaymentsByTeacher = payments.filter(payment => payment.teacher === teacherId).reduce((a, b) => a + b.amount, 0)
        const totalDebt = debt - totalPaymentsByTeacher

        return <Button
          className='h-14 flex items-center justify-between py-2'
          color={totalDebt >= 0 ? 'warning' : 'success'}
          size='lg'
          variant='flat'
          style={{ order: totalDebt * -1 }}
          name='open'

          startContent={<Avatar
            size='sm'
            isBordered
            color='secondary'
            src={teacher.image}
          />}

          endContent={<Chip size='sm' color={totalDebt >= 0 ? 'warning' : 'success'}>
            $ {formatCurency(totalDebt)}
          </Chip>}

          onClick={e => { handleOpen(e, teacher) }}

          key={teacherId}>
          {teacher.name}
        </Button>
      })}

    </div>

    {isOpen && <NewSaleModal
      isOpen={true}
      teacher={selectedTeacher}
      handleOpen={handleOpen}
      setIsOpen={setIsOpen}
      paymentsByTeacher={paymentsByTeacher}
    />}
  </>
}
