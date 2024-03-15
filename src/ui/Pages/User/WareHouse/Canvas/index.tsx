/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@nextui-org/react'
import { useRef, useEffect, type FC, type MouseEvent, useState, type Dispatch, type SetStateAction } from 'react'
import styles from './styles.module.css'
import { faCamera, faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { uploadProductsImage, updateProductsImage } from '@api'
import { useProductsState } from '@/state'

interface Props {
  productId: string
  setDisplay: Dispatch<SetStateAction<boolean>>
  productImage: string
}

export const Canvas: FC<Props> = ({ productId, setDisplay: setDisplay2, productImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const updateProductImage = useProductsState(state => state.updateProductImage)

  const [display, setDisplay] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      const width = window.innerWidth
      const height = window.innerWidth

      // Crea el stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width, height, facingMode: { exact: 'environment' } }
      })
      const videoElement = videoRef.current as HTMLVideoElement

      // Crea el elemento video
      videoElement.srcObject = stream
      await videoElement.play()
    })()
  }, [display])

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    const video = videoRef.current as HTMLVideoElement
    const canva = canvasRef.current as HTMLCanvasElement

    const width = window.innerWidth
    const height = window.innerWidth

    canva.width = width
    canva.height = height

    const context = canva.getContext('2d')
    context?.drawImage(video, 0, 0, width, height)

    // Termina el stream
    const stream = video.srcObject as MediaStream
    const tracks = stream.getTracks()

    tracks.forEach(track => { track.stop() })

    setDisplay(false)
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    const canva = canvasRef.current as HTMLCanvasElement

    canva.toBlob(blob => {
      if (blob !== null) {
        (async () => {
          if (productImage === null || productImage === "''") {
            const data = await uploadProductsImage(blob, productId)
            updateProductImage(productId, data)
          } else {
            const data = await updateProductsImage(blob, productId, productImage)
            updateProductImage(productId, data)
          }

          setDisplay2(false)
        })()
      }
    }, 'image/jpeg', 1)
  }

  return <div
    className='fixed w-screen h-screen top-0 flex-col flex items-center justify-center'
    style={{ zIndex: 1000, backgroundColor: 'black' }}>

    {display && <div className='h-full fixed flex flex-col justify-center'>
      <video ref={videoRef} />
      <Button
        onClick={handleClick}
        color='danger'
        className={styles.button}
        isIconOnly
        startContent={<FontAwesomeIcon size='2x' icon={faCamera} color='#fff' />}
      />
    </div>}

    <div className='fixed flex flex-col items-center justify-center'
      style={{ display: !display ? 'initial' : 'none' }}>

      <canvas ref={canvasRef}></canvas>

      <div className={styles.actions}>
        <Button
          onClick={e => { setDisplay(true) }}
          color='danger'
          isIconOnly
          startContent={<FontAwesomeIcon size='2x' icon={faXmark} color='#fff' />}
          className={styles.actionButtons}
        />

        <Button
          onClick={handleSubmit}
          color='success'
          isIconOnly
          startContent={<FontAwesomeIcon size='2x' icon={faFloppyDisk} color='#fff' />}
          className={styles.actionButtons}
        />
      </div>
    </div>

  </div>
}
