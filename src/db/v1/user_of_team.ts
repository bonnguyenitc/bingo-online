import supabaseClient from '../../utils/supabaseClient'

export type Member = {
  id: string
  user_id: string
  team_id: string
  users?: {
    email?: string
    full_name?: string
    avatar_url?: string
  }
  deleted?: boolean
}

export type MemberInput = Omit<Member, 'id'>

const TABLE_NAME = 'user_of_team'

const insert = async (user: MemberInput): Promise<Member | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).insert([user]).select()
  return data?.[0]
}

const findById = async (id: string): Promise<Member | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('id', id)
  return data?.[0]
}

const findByUserIdAndTeamId = async (
  userId: string,
  teamId: string,
): Promise<Member | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('user_id', userId)
    .eq('team_id', teamId)
  return data?.[0]
}

const findByUserId = async (id: string): Promise<Member[]> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('user_id', id)
  return data || []
}

const findByCode = async (code: string): Promise<Member | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).select().eq('code_entry', code)
  return data?.[0]
}

const findByIdNotDone = async (userId: string): Promise<Member | undefined> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq('is_done', false)
    .eq('user_id', userId)
  return data?.[0]
}

const update = async (id: string, params: any): Promise<Member | undefined> => {
  const { data } = await supabaseClient.from(TABLE_NAME).update(params).match({ id }).select()
  return data?.[0]
}

const getMemberByTeamId = async (id: string): Promise<Member[]> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select(
      `*,
      users(full_name, email, avatar_url)
      `,
    )
    .eq('team_id', id)
    .is('deleted', false)
  return data || []
}

const removeMemberById = async (id: string): Promise<boolean> => {
  const { error } = await supabaseClient
    .from(TABLE_NAME)
    .update({
      deleted: true,
    })
    .match({ id })
  return !error
}

export const UserOfTeamDB = {
  insert,
  findById,
  update,
  findByIdNotDone,
  findByCode,
  findByUserId,
  getMemberByTeamId,
  findByUserIdAndTeamId,
  removeMemberById,
}
