import supabaseClient from '../../utils/supabaseClient'

export type Policy = {
  id: string
  can_create_team: boolean
  number_team_can_create: number
  can_create_game: boolean
  number_game_can_create: number
  add_number_by_input: boolean
  deleted: boolean
}

const TABLE_NAME = 'policies'

const getPolicyById = async (id: string): Promise<Policy | null> => {
  const { data, error } = await supabaseClient.from(TABLE_NAME).select().match({
    id,
  })
  if (error) return null
  return data?.[0]
}

export const PolicyDB = {
  getPolicyById,
}
