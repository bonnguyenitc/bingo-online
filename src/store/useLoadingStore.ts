import create from 'zustand'

type State = {
  isLoading: boolean
  init: boolean
}

type Action = {
  showLoading: () => void
  hideLoading: () => void
  setInit: (value: boolean) => void
}

export const useLoadingStore = create<State & Action>((set, get) => ({
  isLoading: false,
  init: false,
  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),
  setInit: value => set({ init: value }),
}))
