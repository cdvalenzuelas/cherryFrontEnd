import { getSalesFromDB, createDateFromString } from '@/api'
import { useUsersState, useSalesState, type Sale, useClassesState } from '@/state'
import { useState, useEffect, type MouseEvent } from 'react'
import { months } from '../../utils'

export const useSaleAccordeon = () => {
  const users = useUsersState(state => state.users)
  const setSales = useSalesState(state => state.setSales)
  const classesStore = useClassesState(state => state.classesStore)

  const [salesByPeriod, setSalesByPeriod] = useState<Record<string, Sale[]>>({})
  const [moneyByPeriod, setMoneyByPeriod] = useState<Record<string, number>>({})
  const [costByPeriod, setCostByPeriod] = useState<Record<string, number>>({})
  const [isOpenModals, setIsOpenModals] = useState<Record<string, boolean>>({})

  useEffect(() => {
    (async () => {
      const salesFromDB = await getSalesFromDB()
      const newSales: Sale[] = []
      const newSalesByPeriod = JSON.parse(JSON.stringify(salesByPeriod)) as Record<string, Sale[]>
      const newMoneyByPeriod = JSON.parse(JSON.stringify(salesByPeriod)) as Record<string, number>
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const newIsOpenModals: Record<string, boolean> = {} as Record<string, boolean>

      salesFromDB.forEach(item => {
        const newItem = {
          ...item,
          start_date: createDateFromString(item.start_date),
          end_date: createDateFromString(item.end_date),
          sale_date: createDateFromString(item.sale_date)
        }

        newIsOpenModals[item.id as string] = false

        const period = `${months[newItem.sale_date.getMonth()]} de ${newItem.sale_date.getFullYear()}`

        if (period in newSalesByPeriod) {
          newSalesByPeriod[period] = [...newSalesByPeriod[period], newItem]
          newMoneyByPeriod[period] = newMoneyByPeriod[period] + newItem.total_price
          // newCostByPeriod[period] = newCostByPeriod[period] + newItem.price
        } else {
          newSalesByPeriod[period] = [newItem]
          newMoneyByPeriod[period] = newItem.total_price
          // newCostByPeriod[period] = newItem.price
        }

        newSales.push(newItem)
      })

      const newCostByPeriod: Record<string, number> = {}

      Object.values(classesStore).flat().forEach(internalClass => {
        const period = `${months[internalClass.date.getMonth()]} de ${internalClass.date.getFullYear()}`

        if (Object.keys(newCostByPeriod).includes(period)) {
          newCostByPeriod[period] = newCostByPeriod[period] + internalClass.price
        } else {
          newCostByPeriod[period] = internalClass.price
        }
      })

      setCostByPeriod(newCostByPeriod)
      setIsOpenModals(newIsOpenModals)
      setMoneyByPeriod(newMoneyByPeriod)
      setSalesByPeriod(newSalesByPeriod)
      setSales(newSales)
    })()
  }, [])

  const handleclick = (e: MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value
    const newIsOpenModals = JSON.parse(JSON.stringify(isOpenModals)) as Record<string, boolean>

    newIsOpenModals[value] = !newIsOpenModals[value]

    setIsOpenModals(newIsOpenModals)
  }

  return { moneyByPeriod, salesByPeriod, users, isOpenModals, handleclick, costByPeriod }
}
