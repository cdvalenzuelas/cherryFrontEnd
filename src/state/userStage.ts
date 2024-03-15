import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'

// *********************TYPES***************//
export type UserStageType = 'reports' | 'sales' | 'wareHause'

interface UserStage {
  userStage: UserStageType
}

interface Actions {
  setUserStage: (userStage: UserStageType) => void
}

// *********************STATE***************//

const UserStateApi: StateCreator<UserStage & Actions> = (set, get) => ({
  userStage: 'reports',
  setUserStage: (userStage) => {
    set({ userStage })
  }
})

export const useUsersStage = create<UserStage & Actions>()(
  devtools(UserStateApi)
)
