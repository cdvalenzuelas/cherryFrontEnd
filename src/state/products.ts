import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

// *********************TYPES***************//

export interface Product {
  id: string
  created_at: Date
  name: string
  purchase_price: number
  selling_price: number
  quantity: number
  image: string
  invoice: string
  area: string
  reference: string
  type: string[]
  discount: number
}

interface ProductsToUpdate {
  id: string
  quantity: number
}

export interface ProductState {
  products: Product[]
}

interface Actions {
  setProducts: (products: Product[]) => void
  updateProductsQuantity: (productsToUpdate: ProductsToUpdate[]) => void
  updateProductImage: (productId: string, productImage: string) => void
}

// *********************STATE***************//

const UserStateApi: StateCreator<ProductState & Actions> = (set, get) => ({
  products: [],
  setProducts: (products) => {
    set({ products })
  },
  updateProductsQuantity: (productsToUpdate) => {
    productsToUpdate.forEach(item => {
      const product = get().products.find((item2) => item2.id === item.id) as Product
      const restOfProducts = get().products.filter(item2 => item2.id !== item.id)

      product.quantity = item.quantity
      set({ products: [product, ...restOfProducts] })
    })
  },
  updateProductImage: (productId, productImage) => {
    const product = get().products.find(product => product.id === productId) as Product
    const filteredProducts = get().products.filter(product => product.id !== productId)

    product.image = productImage
    set({ products: [product, ...filteredProducts] })
  }
})

export const useProductsState = create<ProductState & Actions>()(
  devtools(UserStateApi)
)
