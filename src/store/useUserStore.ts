import create from 'zustand'
import { CreateUserPayload } from '../types'
import { User, UserDB } from '../db/v1'

type State = {
  user: User | null
}

type Action = {
  setUser: (user: User | null) => void
  signInByGoogle: (user: CreateUserPayload | null) => Promise<void>
  getUserByEmail: (email: string, fields?: string) => Promise<User | null>
}

export const useUserStore = create<State & Action>((set, get) => ({
  // state
  user: null,
  // actions
  setUser: user => set({ user }),
  signInByGoogle: async user => {
    if (!user?.email) return set({ user: null })
    const userExisted = await UserDB.findByEmail(user.email)
    if (userExisted) {
      set({ user: userExisted })
    } else {
      const newUser = await UserDB.insert(user)
      if (newUser) set({ user: newUser })
    }
  },
  getUserByEmail: async (email, fields) => {
    if (!email) return null
    return await UserDB.findByEmail(email, fields)
  },
}))
