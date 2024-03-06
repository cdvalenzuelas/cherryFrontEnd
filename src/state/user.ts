import { type StateCreator, create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type Sale } from '.'

// **********************************TYPES************************************ //

export type UserStatus = 'active' | 'inactive'

export type UserRole = 'user' | 'teacher' | 'admin' | 'superAdmin'

export interface UserFromDB {
  id: string
  auth_id: string
  name: string
  mail: string
  referral_code: string
  phone: string
  role: UserRole// viene del server
  image: string // user_metadata.avatar_url
  instagram_id: string
  active_plan: string | null
  reward: number
}

export interface User extends Omit<UserFromDB, 'active_plan'> {
  active_plan: Omit<Sale, 'user_id' | 'discount' | 'discount_description' | 'payment_mode' | 'price' | 'toatalPrice'> | null
}

interface Actions {
  setUser: (user: User) => void
  removeUser: () => void
  activateUser: (sale: Sale) => void
  updateReward: (sale: number) => void
}

//  *********************************STATE****************************** //

const voidUser: User = {
  name: '',
  mail: '',
  image: '',
  id: '',
  auth_id: '',
  phone: '',
  role: 'user',
  referral_code: '',
  instagram_id: '',
  active_plan: null,
  reward: 0
}

const UserStateApi: StateCreator<User & Actions> = (set, get) => ({
  ...voidUser,
  setUser: (user) => { set({ ...user }) },
  removeUser: () => { set({ ...voidUser }) },
  activateUser: (sale) => {
    set({ active_plan: sale })
  },
  updateReward: (sale) => {
    set({ reward: get().reward + sale })
  }
})

export const useUserState = create<User & Actions>()(
  persist(devtools(UserStateApi), { name: 'user' })
)
