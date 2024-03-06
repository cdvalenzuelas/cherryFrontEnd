import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

// ******************TYPES********************
export type HttpError = boolean

export interface HttpState {
  httpError: HttpError
  message: string
}

interface Actions {
  setHttpError: (object: HttpState) => void
}

// ************************STATE***********************

const UserStateApi: StateCreator<HttpState & Actions> = (set, get) => ({
  httpError: false,
  message: '',
  setHttpError({ httpError, message }) {
    set({ httpError, message })
  }
})

export const useHttpState = create<HttpState & Actions>()(
  devtools(UserStateApi)
)
