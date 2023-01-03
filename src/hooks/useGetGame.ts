import { useEffect } from 'react'
import { useGameStore, useLoadingStore } from '../store'

export const useGetGame = (id: string) => {
  const getGameById = useGameStore(state => state.getGameById)
  const { showLoading, hideLoading } = useLoadingStore()

  useEffect(() => {
    async function loadData() {
      showLoading()
      await getGameById(id)
      hideLoading()
    }
    loadData()
  }, [getGameById, hideLoading, id, showLoading])
}
