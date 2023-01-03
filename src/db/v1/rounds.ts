import supabaseClient from '../../utils/supabaseClient'
import { User } from './users'
import { Game } from './games'

export type Round = {
  id: string
  user_id: string
  game_id: string
  numbers: string
  is_winner: boolean
  deleted: boolean
  games?: Game
  users?: User
}

export type RoundInput = {
  user_id: string
  game_id: string
  numbers: string
}

const TABLE_NAME = 'rounds'

const insert = async (round: RoundInput): Promise<Round | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).insert([round]).select()
  return data?.[0]
}

const getWinners = async (gameId: string): Promise<Round[]> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select(
      `*,
    users(email, id)
    `,
    )
    .eq('game_id', gameId)
    .eq('is_winner', true)
  return data || []
}

const findByUserIdAndGameIdExist = async (
  userId: string,
  gameId: string,
): Promise<Round | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('user_id', userId)
    .eq('game_id', gameId)
  return data?.[0]
}

const findByNumbers = async (numbers: string, gameId: string): Promise<Round | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('numbers', numbers)
    .eq('game_id', gameId)
  return data?.[0]
}

const findById = async (id: string): Promise<Round | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select(
      `*,
  games(*)
  `,
    )
    .match({ id })
  return data?.[0]
}

const update = async (id: string, field: { [key: string]: any }) => {
  const { error } = await supabaseClient.from('rounds').update(field).eq('id', id)
  return !error
}

export const RoundDB = {
  insert,
  getWinners,
  findByUserIdAndGameIdExist,
  findByNumbers,
  findById,
  update,
}
