import create from 'zustand'
import { createNumbers } from '../utils/random'
import { CodePlayDB, Game, GamesDB, Round, RoundDB } from '../db/v1'

type State = {
  round: Round | null
}

type Action = {
  joinRound: (code: string, userId: string) => Promise<any>
  addNewRound: (userId: string, gameId: string) => Promise<Round | undefined>
  getRoundById: (id: string | undefined) => Promise<void>
  updateWinner: (id: string) => Promise<boolean>
}

export const useRoundStore = create<State & Action>((set, get) => ({
  round: null,
  joinRound: async (code, userId) => {
    const codePlay = await CodePlayDB.findByCode(code, userId)
    // if code play not exist
    if (!codePlay) {
      // check it will entry code
      const game: Game | undefined = await GamesDB.findByCode(code)
      // if not entry_code
      if (!game) {
        return {
          error: 'This game is not exist!',
        }
      }
      if (game.user_id === userId) {
        return {
          error: 'You can not join this game!',
        }
      }
      if (game.completed) {
        return {
          error: 'This game is done!',
        }
      }
      if (!game.open_register) {
        return {
          error: 'This game is expired!',
        }
      }
      // is entry_code
      // add round to play
      const added: Round | undefined = await get().addNewRound(userId, game.id)
      if (added) {
        return added
      } else {
        return {
          error: 'Can not join this game now!',
        }
      }
    }
    // handle for exist code play
    const added = await get().addNewRound(userId, codePlay.game_id)

    if (added) {
      return added
    } else {
      return {
        error: 'Can not join this game now!',
      }
    }
  },
  addNewRound: async (userId: string, gameId: string) => {
    const round = await RoundDB.findByUserIdAndGameIdExist(userId, gameId)
    if (round) {
      set({ round })
      // return if existed
      return round
    }
    // create numbers to add to rounds table
    let numbers = JSON.stringify(createNumbers())
    let duplicated = await RoundDB.findByNumbers(numbers, gameId)
    while (duplicated) {
      numbers = JSON.stringify(createNumbers())
      duplicated = await RoundDB.findByNumbers(numbers, gameId)
    }
    const newRound = await RoundDB.insert({
      user_id: userId,
      game_id: gameId,
      numbers,
    })
    set({ round: newRound })
    return newRound
  },
  getRoundById: async id => {
    if (!id) set({ round: null })
    else {
      const round = await RoundDB.findById(id)
      set({ round })
    }
  },
  updateWinner: async (id: string) => {
    return await RoundDB.update(id, { is_winner: true })
  },
}))
