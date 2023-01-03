import supabaseClient from '../../utils/supabaseClient'

export type Role = {
  id: string
  name: string
  alias: string
  deleted: boolean
}

const TABLE_NAME = 'roles'

const getRoles = async (): Promise<Role[] | []> => {
  const { data: roles, error } = await supabaseClient.from(TABLE_NAME).select()
  if (error) return []
  return roles
}

export const RolesDB = {
  getRoles,
}
