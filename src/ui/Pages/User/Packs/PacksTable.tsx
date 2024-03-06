// Lib
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, Divider, Chip } from '@nextui-org/react'
// Componets
import { usePacksState, type Pack } from '@state'
import styles from './style.module.css'
import { formatCurency } from '@/utils/currency'

export const PacksTable = () => {
  const packs = usePacksState(state => state.packs)
  const [monthPacks, setMonthPacks] = useState<Pack[]>([])
  const [unlimitedPacks, setUnlimitedPacks] = useState<Pack[]>([])
  const setPacks = usePacksState(state => state.setPacks)
  // const packs = usePacksState(state => state.packs)

  useEffect(() => {
    const newMonthPacks = packs.filter(item => item.period === 'month' && item.classes !== -1)
    const newMonthUnlimited = packs.filter(item => item.classes === -1 && item.name !== 'fomación')

    setUnlimitedPacks(newMonthUnlimited.sort((a, b) => a.price - b.price))
    setMonthPacks(newMonthPacks.sort((a, b) => a.classes - b.classes))
    setPacks(packs)
  }, [])

  return (<div className={styles.container}>

    <Card className={styles.card}>

      <div className={styles.discount}>
        Hasta
        <span>- 20%</span>
      </div>

      <CardHeader className='flex flex-col gap-2 items-start'>
        <h2>Planes Mensuales</h2>
      </CardHeader>

      <Divider />

      <CardBody className='flex flex-col gap-5 py-3'>

        <p style={{ color: 'var(--blue1)' }}>
          ¡Eleva tu pasión por el baile con nuestros planes mensuales! Explora estilos como <span style={{ color: 'var(--salsa-color)', fontWeight: 'bold', opacity: '100%' }}>Salsa</span>, <span style={{ color: 'var(--bachata-color)', fontWeight: 'bold' }}>Bachata</span>, <span style={{ color: 'var(--afro-color)', fontWeight: 'bold' }}>Afro</span>, <span style={{ color: 'var(--reggaeton-color)', fontWeight: 'bold' }}>Reggaetón</span>, <span style={{ color: 'var(--dancehall-color)', fontWeight: 'bold' }}>Dancehall</span> y más, con horarios flexibles y acceso a eventos especiales.
        </p>

        {monthPacks.map(pack => <div key={pack.id} className='flex flex-col items-start justify-between gap-2' style={{ color: 'var(--gray2)' }}>

          <Chip size='md' color='warning' variant='flat'>Plan: {pack.name}</Chip>

          <div className='flex items-center justify-between w-full'>
            <span className={styles.price} style={{ color: 'var(--blue2)' }}>
              $ {formatCurency(pack.price)}<span className={styles.month}> / Mes</span>
            </span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{pack.classes} Clases</span>
          </div>

        </div>)}
      </CardBody>

      <Divider />

      <span style={{ fontSize: '0.75rem', color: 'var(--gray2)', marginTop: '0.5rem' }}>Aprovecha un 20% de
        descuento aplicas a uno de nuestros planes por primera vez, o un 10% de descuento si renuevas tu plan antes del 5 de
        cada mes o entre el 15 y el 20 de cada mes
      </span>

    </Card>

    <Card className={styles.card2}>

      <div className={styles.discount}>
        Hasta
        <span>- 20%</span>
      </div>

      <CardHeader className='flex flex-col gap-2 items-start'>
        <h2 style={{ color: 'white' }}>Planes Ilimitados</h2>
      </CardHeader>

      <Divider />

      <CardBody className='flex flex-col gap-5 py-3'>

        <p style={{ color: 'white' }}>
          Descubre la libertad de bailar sin límites con nuestros Planes Ilimitados. Obtén los beneficios de nuestras clases mensuales y disfruta de <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>clases ilimitadas</span>. Además, accede a <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>descuentos exclusivos</span> en eventos especiales, talleres y work-shops.
        </p>

        {unlimitedPacks.map(pack => <div key={pack.id} className='flex flex-col items-start justify-between gap-2' style={{ color: 'var(--gray2)' }}>

          <Chip size='md' color='warning' variant='solid'>Plan: {pack.name}</Chip>

          <div className='flex items-center justify-between w-full'>
            <span className={styles.price} style={{ color: 'white' }}>
              $ {formatCurency(pack.price)}
            </span>
            {pack.duration !== 1 && <Chip
              size='sm'
              color='success'
              variant='solid'
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              $ {formatCurency(Math.round(pack.price / pack.duration))} / Mes
            </Chip>}
          </div>

        </div>)}
      </CardBody>

      <Divider />

      <span style={{ fontSize: '0.75rem', color: 'white', marginTop: '0.5rem' }}>Aprovecha un 20% de
        descuento aplicas a uno de nuestros planes por primera vez, o un 10% de descuento si renuevas tu plan antes del 5 de
        cada mes o entre el 15 y el 20 de cada mes
      </span>

    </Card>

  </div>)
}
