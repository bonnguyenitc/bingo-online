import { CreateTeamPlayGamePayload } from '../../types'
import supabaseClient from '../../utils/supabaseClient'
import { Team } from './teams'

export type TeamPlayGame = {
  id: string
  game_id: string
  team_id: string
  deleted: boolean
  teams?: Team
}

const TABLE_NAME = 'team_play_game'

const insert = async (round: CreateTeamPlayGamePayload): Promise<TeamPlayGame | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).insert([round]).select()
  return data?.[0]
}

const findById = async (id: number): Promise<TeamPlayGame | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('id', id)
  return data?.[0]
}

const findByRoundId = async (id: string): Promise<TeamPlayGame | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('round_id', id)
  return data?.[0]
}

const findByUserId = async (id: string): Promise<TeamPlayGame[]> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('user_id', id)
  return data || []
}

const findByCode = async (code: number): Promise<TeamPlayGame | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('code_entry', code)
  return data?.[0]
}

const findByIdNotDone = async (userId: string): Promise<TeamPlayGame | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('is_done', false)
    .eq('user_id', userId)
  return data?.[0]
}

const updateRound = async (
  id: number,
  userId: string,
  params: any,
): Promise<TeamPlayGame | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .update(params)
    .match({ id })
    .match({ user_id: userId })
  return data?.[0]
}

const getListRound = async (userId: string): Promise<TeamPlayGame[]> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().range(0, 5).eq('user_id', userId)
  return data || []
}

export const TeamPlayGameDB = {
  insert,
  findById,
  updateRound,
  findByIdNotDone,
  findByCode,
  getListRound,
  findByUserId,
  findByRoundId,
}
