// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// Crea la clase en la base de datos
export const updateProductsImage = async (blob: Blob, productId: string, src: string): Promise<string> => {
  const path = src.split('/products/')[1]

  try {
    // Eliminar imagen anterior
    const { data: data5, error: error5 } = await supabase.storage
      .from('photos')
      .remove([`products/${path}`])

    if (error5 !== null) {
      throw new Error()
    } else if (data5 === null) {
      throw new Error()
    }

    // Hacer la query
    const file = new File([blob], `photo_${productId}_${Date.now()}.jpeg`, { type: 'image/jpeg' })

    // Borrar imagen anter
    // Subir la imagen
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(`products/${file.name}`, file)
    // Si no viene data o hay unerror lazar error

    if (error !== null) {
      throw new Error()
    } else if (data === null) {
      throw new Error()
    }

    // Obtener la url
    const { data: data2 } = supabase.storage
      .from('photos')
      .getPublicUrl(`${data.path}`)

    // Si no viene data o hay unerror lazar error
    if (data2 === null) {
      throw new Error()
    }

    // Actualizar la imagen del producto
    const { data: data3, error: error3 } = await supabase
      .from('products')
      .update({ image: data2.publicUrl })
      .eq('id', productId)
      .select()

    // Si hay un error o no viene data generar un error
    if (data3 === null) {
      throw new Error()
    } else if (error3 !== null) {
      throw new Error()
    }

    return data2.publicUrl
  } catch {
    return "''"
  }
}
