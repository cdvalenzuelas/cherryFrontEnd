export const getDaysBetweenTwoDates = (date1: Date, date2: Date): number => {
  const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24

  // Calcular la diferencia en milisegundos
  const diferenciaMilisegundos = date1.getTime() - date2.getTime()

  // Convertir la diferencia a días
  const dias = diferenciaMilisegundos / MILISEGUNDOS_POR_DIA

  return Math.ceil(dias)
}

export const formardate = (date: Date): string => {
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Bogota' })
}
