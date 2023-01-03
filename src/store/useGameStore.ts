import create from 'zustand'
import { randomString } from '../utils/random'
import { CreateGamePayload } from '../types'
import produce from 'immer'
import { Round } from '../db/v1'
import { CodePlay, CodePlayDB, Game, GamesDB, TeamPlayGameDB, UserOfTeamDB } from '../db/v1'

type State = {
  games: Game[]
  game: Game | null
  amountGameCreated: number
}

type Action = {
  setGame: (round: Game) => void
  joinGameForGuest: (code: string) => Promise<any>
  sendWinner: (userId: string, roundId: number, isWin: boolean) => Promise<any>
  getWinners: (gameId: string) => Promise<Round[]>
  createGame: (game: CreateGamePayload, teamIds: string[]) => Promise<Game | { error?: string }>
  getGames: (userId: string | undefined) => Promise<void>
  triggerDone: (id: string, userId: string, value: boolean) => Promise<void>
  getGameById: (id: string) => Promise<void>
  triggerRegister: (id: string, userId: string, value: boolean) => Promise<void>
  addNumberBingo: (id: string, userId: string, value: string) => Promise<any>
  findUserJoined: (userId: string, gameId: string) => Promise<CodePlay | undefined>
  addNewPlayer: (userId: string, gameId: string) => Promise<CodePlay | undefined>
  countGamesByUserId: (userId: string | undefined) => Promise<void>
}

export const useGameStore = create<State & Action>((set, get) => ({
  game: null,
  games: [],
  amountGameCreated: 0,
  loadingJoinGame: false,
  joinGameForGuest: async code => {
    //
  },
  sendWinner: async (userId, roundId, isWin) => {
    return await GamesDB.updateWin(userId, roundId, isWin)
  },
  getWinners: async gameId => {
    return await GamesDB.getWinners(gameId)
  },
  createGame: async (body, teamIds) => {
    const { user_id } = body
    const gameNotDone = await GamesDB.findByIdNotDone(user_id)
    if (gameNotDone) return { error: 'Please complete the ongoing game to create a new game' }
    const gameCreated = await GamesDB.insert(body)
    if (gameCreated) {
      if (teamIds.length > 0) {
        for (const teamId of teamIds) {
          const tpg = await TeamPlayGameDB.insert({
            game_id: gameCreated.id,
            team_id: teamId,
          })
          if (tpg) {
            const members = await UserOfTeamDB.getMemberByTeamId(teamId)
            if (members) {
              for (const member of members) {
                let code = randomString()
                let exist = await CodePlayDB.findByCodeAndTeamId(code, gameCreated.id)
                while (exist) {
                  code = randomString()
                  exist = await CodePlayDB.findByCodeAndTeamId(code, gameCreated.id)
                }
                await CodePlayDB.insert({
                  user_id: member.user_id,
                  code,
                  game_id: gameCreated.id,
                })
              }
            }
          }
        }
      }
      return gameCreated
    } else {
      return { error: 'Can not create game!' }
    }
  },
  getGames: async userId => {
    if (!userId) {
      set({ games: [] })
    } else {
      const data = await GamesDB.getGames(userId)
      set({ games: data })
    }
  },
  setGame: game => {
    set({ game })
  },
  triggerDone: async (id, userId, value) => {
    const done = await GamesDB.update(id, userId, { completed: value })
    if (done) {
      set(state => {
        const index = state.games.findIndex(item => item.id === id)
        return {
          game: produce(state.game, draft => {
            if (draft) draft.completed = !draft?.completed
          }),
          games:
            index > -1
              ? produce(state.games, draft => {
                  draft[index].completed = !draft[index].completed
                })
              : state.games,
        }
      })
    }
  },
  getGameById: async id => {
    if (!id) set({ game: null })
    else {
      const game = await GamesDB.findById(id)
      set({ game })
    }
  },
  triggerRegister: async (id, userId, value) => {
    const done = await GamesDB.update(id, userId, {
      open_register: value,
    })
    if (done) {
      set(state => ({
        game: produce(state.game, draft => {
          if (draft) draft.open_register = !draft?.open_register
        }),
      }))
    }
  },
  addNumberBingo: async (id, userId, value) => {
    const done = await GamesDB.update(id, userId, { numbers: value })
    if (done) {
      set(state => ({
        game: produce(state.game, draft => {
          if (draft) draft.numbers = value
        }),
      }))
    }
  },
  findUserJoined: async (userId, gameId) => {
    return await CodePlayDB.findByUserId(userId, gameId)
  },
  addNewPlayer: async (userId, gameId) => {
    let code = randomString()
    let exist = await CodePlayDB.findByCodeAndTeamId(code, gameId)
    while (exist) {
      code = randomString()
      exist = await CodePlayDB.findByCodeAndTeamId(code, gameId)
    }
    return await CodePlayDB.insert({
      user_id: userId,
      code,
      game_id: gameId,
    })
  },
  countGamesByUserId: async userId => {
    if (!userId) {
      set({ amountGameCreated: 0 })
    } else {
      set({ amountGameCreated: await GamesDB.countGames(userId) })
    }
  },
}))
