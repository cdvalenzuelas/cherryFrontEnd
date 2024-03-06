import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

// *********************TYPES***************//
export type UserStageType = 'info' | 'papers' | 'classes' | 'book' | 'renew' | 'schedule' | 'sales' | 'packs'

interface UserStage {
  userStage: UserStageType
}

interface Actions {
  setUserStage: (userStage: UserStageType) => void
}

// *********************STATE***************//

const UserStateApi: StateCreator<UserStage & Actions> = (set, get) => ({
  userStage: 'info',
  setUserStage: (userStage) => {
    set({ userStage })
  }
})

export const useUsersStage = create<UserStage & Actions>()(
  devtools(UserStateApi)
)
