import { type StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { UserStatus, UserRole, User, Sale } from '@state'

// **********************************TYPES************************************ //

export interface MinimalUser {
  id: string
  image: string
  status: UserStatus
  name: string
  role: UserRole
  instagram_id: string
  active_plan: string
}

export interface MinimalUsers {
  users: User[]
}

interface DateToUpdate {
  user_id: string
  id: string
  start_date: Date
  end_date: Date
}

interface Actions {
  saveUsers: (users: User[]) => void
  getTeachers: () => User[]
  updateUsersDates: (usersDates: DateToUpdate[]) => void
  udateUsersTakenClasses: (usersIds: string[]) => void
  updateUserPack: (usersIds: string, sale: Sale, sell: number, resetReward: boolean) => void
}

// ************************************STATE******************************* //

const UserStateApi: StateCreator<MinimalUsers & Actions> = (set, get) => ({
  users: [],
  saveUsers: (users: User[]) => {
    set({ users }, false)
  },
  getTeachers: () => {
    const teachers = get().users.filter(item => item.role === 'teacher')

    return teachers
  },
  updateUsersDates(usersDates) {
    const usersDatesIds = usersDates.map(item => item.user_id)
    const internalUsers = get().users

    const filteredUsers = internalUsers.filter(item => usersDatesIds.includes(item.id))
    const noFilteredUsers = internalUsers.filter(item => !usersDatesIds.includes(item.id))

    filteredUsers.forEach(item => {
      const userDates = usersDates.filter(item2 => item.id === item2.user_id)[0]

      if (item.active_plan !== null) {
        item.active_plan.start_date = userDates.start_date
        item.active_plan.end_date = userDates.end_date
      }
    })

    set({ users: [...filteredUsers, ...noFilteredUsers] })
  },
  udateUsersTakenClasses: (usersIds) => {
    const internalUsers = get().users

    const filteredUsers = internalUsers.filter(item => usersIds.includes(item.id))
    const noFilteredUsers = internalUsers.filter(item => !usersIds.includes(item.id))

    filteredUsers.forEach(item => {
      if (item.active_plan !== null) {
        item.active_plan.taken_classes = item.active_plan.taken_classes + 1

        if (item.active_plan.classes !== -1 && item.active_plan.classes === item.active_plan.taken_classes) {
          item.active_plan.active = false
        }
      }
    })

    set({ users: [...filteredUsers, ...noFilteredUsers] })
  },
  updateUserPack: (userId, pack, sell, resetReward) => {
    const internalUsers = get().users

    const filteredUser = internalUsers.filter(item => item.id === userId)[0]
    const noFilteredUsers = internalUsers.filter(item => item.id !== userId)

    filteredUser.active_plan = pack
    filteredUser.reward = resetReward ? 0 : filteredUser.reward + sell

    set({ users: [filteredUser, ...noFilteredUsers] })
  }
})

export const useUsersState = create<MinimalUsers & Actions>()(
  devtools(UserStateApi)
)
