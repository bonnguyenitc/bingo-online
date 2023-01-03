import { CreateGamePayload } from '../../types'
import supabaseClient from '../../utils/supabaseClient'
import { Round, RoundDB } from './rounds'
import { TeamPlayGame } from './team_play_game'

export type Game = {
  id: string
  user_id: string
  open_register: boolean
  completed: boolean
  entry_code: string
  numbers: string
  name: string
  can_play_by_entry_code: string
  deleted: string
  team_play_game?: TeamPlayGame[]
}

const TABLE_NAME = 'games'

const insert = async (game: CreateGamePayload): Promise<Game | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).insert([game]).select()
  return data?.[0]
}

const findByUserJoinedId = async (id: number): Promise<Game | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('user_joined_id', id)
  return data?.[0]
}

const findByPiece = async (piece: string): Promise<Game | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().like('piece', piece)
  return data?.[0]
}

const findByUserIdAndGameId = async (
  userId: string,
  roundId: number,
): Promise<Game | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select(
      `
        *,
        user_in_groups:user_id(name, deleted),
        rounds:round_id(code_entry)
      `,
    )
    .eq('user_id', userId)
    .eq('round_id', roundId)
  return data?.[0]
}

const findByUserIdAndGameIdExist = async (
  userId: string,
  roundId: number,
): Promise<Game | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('user_id', userId)
    .eq('round_id', roundId)
  return data?.[0]
}

const getWinners = async (gameId: string): Promise<Round[]> => {
  return await RoundDB.getWinners(gameId)
}

const updateWin = async (userId: string, roundId: number, isWin: boolean): Promise<boolean> => {
  const { error } = await supabaseClient
    .from(TABLE_NAME)
    .update({ winner: isWin })
    .match({ user_id: userId })
    .match({ round_id: roundId })
  return !error
}

const findByIdNotDone = async (userId: string): Promise<Game | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('completed', false)
    .eq('user_id', userId)
  return data?.[0]
}

const getGames = async (userId: string): Promise<any[]> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .range(0, 49)
    .order('created_at', { ascending: false })
    .eq('user_id', userId)
  return data || []
}

const update = async (id: string, userId: string, params: any): Promise<boolean> => {
  const { error } = await supabaseClient
    .from(TABLE_NAME)
    .update(params)
    .match({ id })
    .match({ user_id: userId })

  return !error
}

const findById = async (id: string): Promise<Game | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select(
      `*,
    team_play_game(*,
      teams(*)
      )
    `,
    )
    .match({
      id,
    })
  return data?.[0]
}

const findByCode = async (entryCode: string): Promise<Game | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().match({
    entry_code: entryCode,
  })
  return data?.[0]
}

const countGames = async (userId: string): Promise<number | undefined> => {
  const { count } = await supabaseClient
    .from(TABLE_NAME)
    .select('*', {
      count: 'exact',
    })
    .match({
      user_id: userId,
    })
  return count || 0
}

export const GamesDB = {
  insert,
  findByUserJoinedId,
  findByPiece,
  findByUserIdAndGameId,
  findByUserIdAndGameIdExist,
  updateWin,
  getWinners,
  findByIdNotDone,
  getGames,
  update,
  findById,
  findByCode,
  countGames,
}
