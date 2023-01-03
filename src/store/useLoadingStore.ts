import create from 'zustand'

type State = {
  isLoading: boolean
}

type Action = {
  showLoading: () => void
  hideLoading: () => void
}

export const useLoadingStore = create<State & Action>((set, get) => ({
  isLoading: false,
  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),
}))
