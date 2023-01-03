import supabaseClient from '../../utils/supabaseClient'

export type User = {
  id: string
  full_name?: string
  email?: string
  avatar_url?: string
  type: 'guest' | 'real'
  username?: string
  deleted?: string
  id_oauth?: string
  roles?: {
    alias: string
    id: 'b43ff7c4-fc38-43b1-8d13-fe098df073a5'
    name: string
    policies_id: string
  }
}

export type UserInput = Omit<User, 'id'>

const TABLE_NAME = 'users'

const insert = async (user: UserInput): Promise<User | null> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .insert([user])
    .select(
      `
    *,
    roles (
        *
    )
    `,
    )
  return data?.[0] || null
}

const findByEmail = async (email: string, fields = `*,roles (*)`): Promise<User | null> => {
  const { data } = await supabaseClient
    .from(TABLE_NAME)
    .select(fields)
    .textSearch('email', `${email}`)
  return data?.[0] || null
}

export const UserDB = {
  insert,
  findByEmail,
}
