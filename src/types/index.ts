export type PageProps = {
  user: any
}

export type CreateRoundPayload = {
  name: string
  userId: string
  groupId: number
}

export type CreateTeamPayload = {
  name: string
  user_id: string
}

export type AddMemberPayload = {
  user_id: string
  team_id: string
}

export type CreateUserPayload = {
  email?: string
  full_name?: string
  type: 'real' | 'guest'
  username?: string
  avatar_url?: string
  id_oauth?: string
  role_id: string
  provider?: string
}

export type CreateGamePayload = {
  user_id: string
  entry_code: string
  numbers: string
  name: string
}

export type CreateTeamPlayGamePayload = {
  game_id: string
  team_id: string
}
