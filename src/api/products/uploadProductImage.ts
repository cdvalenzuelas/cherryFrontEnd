// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// Crea la clase en la base de datos
export const uploadProductsImage = async (blob: Blob, productId: string): Promise<string> => {
  try {
    // Hacer la query
    const file = new File([blob], `photo_${productId}.jpeg`, { type: 'image/jpeg' })

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
