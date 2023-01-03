import { useEffect } from 'react'
import { useRoleStore } from '../store'

export const useRoles = () => {
  const { getRoles, roles } = useRoleStore()

  useEffect(() => {
    getRoles()
  }, [getRoles])

  return { roles }
}
