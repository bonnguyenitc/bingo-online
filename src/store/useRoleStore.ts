import create from 'zustand'
import { Role, RolesDB } from '../db/v1'

type State = {
  roles: Role[]
}

type Action = {
  getRoles: () => Promise<void>
}

export const useRoleStore = create<State & Action>((set, get) => ({
  roles: [],
  getRoles: async () => {
    const roles = await RolesDB.getRoles()
    set({ roles })
  },
}))
