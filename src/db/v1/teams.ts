import supabaseClient from '../../utils/supabaseClient'

export type Team = {
  id: string
  name?: string
  user_id?: string
  deleted?: boolean
}

export type GroupInput = Omit<Team, 'id'>

const TABLE_NAME = 'teams'

const insert = async (round: GroupInput): Promise<Team | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).insert([round]).select()
  return data?.[0]
}

const findById = async (id: string): Promise<Team | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('id', id)
  return data?.[0]
}

const findByUserId = async (id: string): Promise<Team[]> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('user_id', id)
  return data || []
}

const findByCode = async (code: string): Promise<Team | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('code_entry', code)
  return data?.[0]
}

const findByName = async (name: string): Promise<Team | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('name', name)
  return data?.[0]
}

const findByIdNotDone = async (userId: string): Promise<Team | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('is_done', false)
    .eq('user_id', userId)
  return data?.[0]
}

const updateRound = async (id: number, userId: string, params: any): Promise<Team | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .update(params)
    .match({ id })
    .match({ user_id: userId })
  return data?.[0]
}

const getTeams = async (userId: string): Promise<Team[]> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .range(0, 9)
    .order('created_at', { ascending: true })
    .eq('user_id', userId)
  return data || []
}

export const TeamsDB = {
  insert,
  findById,
  updateRound,
  findByIdNotDone,
  findByCode,
  getTeams,
  findByUserId,
  findByName,
}
