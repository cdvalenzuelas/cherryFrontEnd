/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, type MouseEvent, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'

import { createProductSale, updateInvoices, updateProducts, createSalary } from '@/api'
import { type Invoice, useInvoicesState, useProductsState, useSalaryState, type Salary } from '@/state'

interface Summary {
  product_id: string
  invoice: string
  quantity: number
  quantityFromDb: number
  price: number
  total: number
  profit: number
  discount?: number
}

interface InvoicesToUpdate {
  name: string
  total: number
}

interface ProductsToUpdate {
  id: string
  quantity: number
}

export const useEditProductModal = () => {
  // Manejar el agregar y eliminar usuarios
  const handlePhoto = async (e: MouseEvent<HTMLButtonElement>) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })

    const videoElement = document.createElement('video')
    videoElement.srcObject = stream

    await videoElement.play()

    // Crear canvas para capturar imagen
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    const context = canvas.getContext('2d')
    context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    const photo = canvas.toDataURL('image/jpeg')

    stream.getTracks().forEach(track => {
      track.stop()
    }) // Detiene el acceso a la cámara

    // uploadPhoto(photo); // Llama a la función para subir la foto
  }

  return { handlePhoto }
}
