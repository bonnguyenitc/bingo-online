import create from 'zustand'
import { Policy, PolicyDB } from '../db/v1'

type State = {
  policy: Policy | null
}

type Action = {
  getPolicy: (id: string | undefined) => Promise<void>
}

export const usePolicyStore = create<State & Action>((set, get) => ({
  policy: null,
  getPolicy: async id => {
    if (!id) return set({ policy: null })
    const policy = await PolicyDB.getPolicyById(id)
    set({ policy })
  },
}))
