import React, { memo, useEffect, useMemo, useState } from 'react'
import { Box, HStack, Switch, Text, VStack } from '@chakra-ui/react'
import GameCard from './GameCard'
import { useGameStore, useUserStore } from '../store'
import { useCallback } from 'react'
import Screen from './Screen'
import If from './If'
import Link from 'next/link'
import { useLoading } from '../hooks'

export default memo(function Games() {
  const user = useUserStore(state => state.user)
  const getGames = useGameStore(state => state.getGames)
  const games = useGameStore(state => state.games)
  const triggerDone = useGameStore(state => state.triggerDone)
  const { showLoading, hideLoading } = useLoading()

  const [statusNotDone, setNotDone] = useState(false)

  const loadGames = useCallback(async () => {
    showLoading()
    await getGames(user?.id)
    hideLoading()
  }, [getGames, hideLoading, showLoading, user?.id])

  useEffect(() => {
    loadGames()
  }, [loadGames])

  const handleToggleFilterGame = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNotDone(e.target.checked)
  }, [])

  const gameNotDone = useMemo(() => {
    return games?.filter(item => !item.completed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(games)])

  const gameShowed = useMemo(() => {
    return statusNotDone ? gameNotDone : games
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(gameNotDone), JSON.stringify(games), statusNotDone])

  const handleChangeDone = useCallback(
    async (id: string, checked: boolean) => {
      if (!user) return
      showLoading()
      await triggerDone(id, user.id, checked)
      hideLoading()
    },
    [hideLoading, showLoading, triggerDone, user],
  )

  return (
    <Screen>
      <Box height="10px" />
      <Text color="text" fontSize="2xl" fontWeight="bold">
        Games
      </Text>
      <Box height="10px" />
      <HStack px="4" w="100%" alignItems="center">
        <Text color="text" fontSize="md" fontWeight="semibold">
          Only uncompleted
        </Text>
        <Switch colorScheme="teal" onChange={handleToggleFilterGame} />
      </HStack>
      <Box height="10px" />
      <VStack flex={1} px="4" width="100%" pb="4">
        <If
          condition={gameShowed?.length > 0}
          component={
            <>
              {gameShowed.map(item => (
                <GameCard key={item.id} data={item} onChangeDone={handleChangeDone} />
              ))}
            </>
          }
          fallback={
            <Link href="/games/add">
              <Text fontWeight="light" color="text" fontSize="xl">{`Let's add a new game`}</Text>
            </Link>
          }
        />
      </VStack>
    </Screen>
  )
})
