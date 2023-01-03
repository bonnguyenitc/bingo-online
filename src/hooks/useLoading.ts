import { useLoadingStore } from '../store'

export const useLoading = () => {
  const isLoading = useLoadingStore(state => state.isLoading)
  const showLoading = useLoadingStore(state => state.showLoading)
  const hideLoading = useLoadingStore(state => state.hideLoading)

  return { showLoading, hideLoading, isLoading }
}
