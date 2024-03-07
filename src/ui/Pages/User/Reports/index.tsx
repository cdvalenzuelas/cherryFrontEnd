import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { type SalaryReport, type SalesReport } from '@state'
import { getSalesReport, getSalaryReport } from '@/api'
import { useEffect, useState } from 'react'
import { months } from '@/utils/dates'
import { formatCurency } from '@/utils/currency'

export const Reports = () => {
  const [salesReport, setSalesReport] = useState<SalesReport[]>([])
  const [salaryReport, setSalaryReport] = useState<SalaryReport[]>([])

  useEffect(() => {
    (async () => {
      const internalSalesReport = await getSalesReport()
      const internalSalaryReport = await getSalaryReport()

      setSalesReport(internalSalesReport)
      setSalaryReport(internalSalaryReport)
    })()
  }, [])

  return (<section className='flex flex-col items-center w-full'>
    <ul className='flex flex-col gap-3 px-5 py-3'>
      {salesReport.map(report => {
        const salary = salaryReport.find(item => item.month === report.month && item.year === report.year)
        const totalSalary = salary === undefined ? 0 : salary.total
        const expenses = 0
        const balance = report.profit - expenses - totalSalary

        return <Card key={`${report.year}-${report.month}`} className='w-full h-fit px-3 py-3'>

          <CardHeader>
            <h3 className='capitalize'>{months[report.month - 1]} de {report.year}</h3>
          </CardHeader>

          <CardBody>

            <div className='flex gap-3 justify-between'>
              <span>Ventas</span>
              <span>.......................................</span>
              <span>$ {formatCurency(report.total)}</span>
            </div>

            <div className='flex gap-3 justify-between'>
              <span>Ganancias</span>
              <span>.......................................</span>
              <span style={{ color: 'var(--success)' }}>$ {formatCurency(report.profit)}</span>
            </div>

            <div className='flex gap-3 justify-between'>
              <span>Sueldo</span>
              <span>.......................................</span>
              <span style={{ color: 'var(--warning)' }}>$ {formatCurency(totalSalary)}</span>
            </div>

            <div className='flex gap-3 justify-between mb-2'>
              <span>Gastos</span>
              <span>.......................................</span>
              <span style={{ color: 'var(--danger)' }}>$ {formatCurency(expenses)}</span>
            </div>

            <Divider />

            <div className='flex gap-3 justify-between mt-2' style={{ fontWeight: 'bold' }}>
              <span>Balance</span>
              <span>.......................................</span>
              <span style={{ color: balance <= 0 ? 'var(--danger)' : 'var(--success)' }}>$ {formatCurency(balance)}</span>
            </div>

          </CardBody>
        </Card>
      })}
    </ul>
  </section>)
}
