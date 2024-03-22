import { useState, useEffect, Dispatch, SetStateAction } from 'react'

// Define un tipo para los tipos de datos admitidos
type DataType = 'Invoice' | 'Productos' | 'Sales'

// Mejora el tipo de la función para aceptar solo los tipos específicos como clave
// y para especificar el tipo del valor inicial y de retorno
export const useLocalStorage = <T>(key: DataType, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
  // Estado para almacenar el valor con tipo genérico T
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  // Función para actualizar el valor tanto en el estado como en el localStorage
  const setValue: Dispatch<SetStateAction<T>> = (value: SetStateAction<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  // Opcional: Escuchar cambios en el localStorage para el mismo key
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key)
        setStoredValue(item ? JSON.parse(item) : initialValue)
      } catch (error) {
        console.error(error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  return [storedValue, setValue]
}
