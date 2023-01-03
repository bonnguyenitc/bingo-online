import supabaseClient from '../../utils/supabaseClient'
import { User } from './users'

export type CodePlay = {
  id: number
  user_id: string
  code: string
  game_id: string
  users?: User
}

export type CodePlayInput = Omit<CodePlay, 'id'>

const TABLE_NAME = 'code_play'

const insert = async (user: CodePlayInput): Promise<CodePlay | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).insert([user]).select()
  return data?.[0]
}

const findByUserId = async (userId: string, gameId: string): Promise<CodePlay | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('user_id', userId)
    .eq('game_id', gameId)
  return data?.[0]
}

const findByCodeAndTeamId = async (code: string, gameId: string): Promise<CodePlay | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('code', code)
    .eq('game_id', gameId)
  return data?.[0]
}

const findByCode = async (code: string, userId: string): Promise<CodePlay | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('code', code)
    .eq('user_id', userId)
  return data?.[0]
}

const findByIdCsv = async (id: string): Promise<any[]> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select(
      `
      code,id,
      users( full_name, email, id )
    `,
    )
    .eq('game_id', id)
  return data || []
}

const findByCodeAndGroupJoined = async (code: string): Promise<any> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select(
      `
      user_id,
      group_joined_round:group_joined_round_id( round_id )
    `,
    )
    .eq('code', code)
  return data?.[0]
}

export const CodePlayDB = {
  insert,
  findByUserId,
  findByIdCsv,
  findByCodeAndTeamId,
  findByCodeAndGroupJoined,
  findByCode,
}
