import create from 'zustand'
import { AddMemberPayload, CreateTeamPayload } from '../types'
import { CodePlay, CodePlayDB, Member, Team, TeamsDB, UserOfTeamDB } from '../db/v1'

type State = {
  teams: Team[]
  team: Team | null
  membersOfTeam: Member[]
  playersOfGame: CodePlay[]
}

type Action = {
  createTeam: (body: CreateTeamPayload) => Promise<Team | undefined>
  checkNameTeam: (name: string) => Promise<any>
  addMemberForTeam: (body: AddMemberPayload) => Promise<Member | undefined>
  findMemberExistInTeam: (userId: string, teamId: string) => Promise<Member | undefined>
  getTeams: (userId: string | undefined) => Promise<void>
  getMemberOfTeam: (id: string | undefined) => Promise<void>
  removeMemberById: (id: string) => Promise<boolean>
  getPlayersOfGame: (id: string) => Promise<CodePlay[]>
  updateMemberById: (id: string, params: any) => Promise<Member | undefined>
  getTeamById: (id: string) => Promise<void>
}

export const useTeamStore = create<State & Action>((set, get) => ({
  teams: [],
  team: null,
  membersOfTeam: [],
  playersOfGame: [],
  createTeam: async (body: CreateTeamPayload) => {
    return await TeamsDB.insert(body)
  },
  checkNameTeam: async (name: string) => {
    return await TeamsDB.findByName(name)
  },
  addMemberForTeam: async body => {
    return await UserOfTeamDB.insert(body)
  },
  findMemberExistInTeam: async (userId, teamId) => {
    return await UserOfTeamDB.findByUserIdAndTeamId(userId, teamId)
  },
  getTeams: async userId => {
    if (!userId) return set({ teams: [] })
    const data = await TeamsDB.getTeams(userId)
    set({ teams: data })
  },
  getMemberOfTeam: async id => {
    if (!id) return set({ membersOfTeam: [] })
    const data = await UserOfTeamDB.getMemberByTeamId(id)
    set({ membersOfTeam: data })
  },
  removeMemberById: async id => {
    return await UserOfTeamDB.removeMemberById(id)
  },
  getPlayersOfGame: async id => {
    if (!id) {
      set({ playersOfGame: [] })
      return []
    }
    const data = await CodePlayDB.findByIdCsv(id)
    set({ playersOfGame: data })
    return data
  },
  updateMemberById: async (id, params) => {
    return await UserOfTeamDB.update(id, params)
  },
  getTeamById: async id => {
    if (!id) set({ team: null })
    const team = await TeamsDB.findById(id)
    set({ team })
  },
}))
