import { SimpleGrid, VStack, Text, Spinner, Box, Wrap, Center, WrapItem } from '@chakra-ui/react'
import { memo, useCallback, useEffect, useState } from 'react'
import supabaseClient from '../utils/supabaseClient'
import NumberBingo from './NumberBingo'
import { useRoundStore } from '../store'
import Screen from './Screen'
import { checkBingoWin } from '../utils/bingo-win'

export default memo(function PlayGround() {
  const round = useRoundStore(state => state.round)
  const { getRoundById, updateWinner } = useRoundStore()

  const [result, setResult] = useState([])
  const [numbers, setNumbers] = useState([])

  useEffect(() => {
    if (!round) return
    const { numbers, games } = round
    try {
      setNumbers(JSON.parse(numbers))
      if (!games) return
      setResult(JSON.parse(games.numbers))
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(round)])

  useEffect(() => {
    if (result.length > 0 && numbers.length > 0) {
      const won = checkBingoWin(numbers, result)
      if (won && round?.id) {
        updateWinner(round.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(result), JSON.stringify(numbers), JSON.stringify(round)])

  const getData = useCallback(() => {
    getRoundById(round?.id)
  }, [getRoundById, round?.id])

  useEffect(() => {
    getData()
  }, [getData])

  const handleNewMessage = useCallback(
    (row: any) => {
      if (row?.new?.id === round?.game_id) {
        getData()
      }
    },
    [getData, round?.game_id],
  )

  useEffect(() => {
    const subscription = supabaseClient
      .channel('public:games')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'games' },
        handleNewMessage,
      )
      .subscribe()
    return () => {
      subscription.unsubscribe()
    }
  }, [handleNewMessage])

  if (!round) return <Screen />

  return (
    <Screen>
      <Box height="10px" />
      <VStack alignSelf="center" bg="main.4" w="100%" flex={1}>
        <Text px="4" color="text" fontSize="2xl" fontWeight="bold" noOfLines={2}>
          {round.games?.name}
        </Text>
        <Text color="text" fontSize="2xl" fontWeight="semibold" pt="4">
          Bingo numbers
        </Text>
        <Box height="10px" />
        <Wrap px="4" justify="space-between">
          {result?.map(num => (
            <WrapItem key={num}>
              <Center bg="main.1" borderRadius="full" w="50px" h="50px">
                <Text color="textLight" fontSize="2xl" fontWeight="bold">
                  {num}
                </Text>
              </Center>
            </WrapItem>
          ))}
          <WrapItem>
            <Center h="50px" w="50px">
              <Spinner color="main.1" />
            </Center>
          </WrapItem>
        </Wrap>
        <Text color="text" fontSize="2xl" fontWeight="semibold" pt="4">
          My numbers
        </Text>
        <SimpleGrid columns={5} spacing={2} w="100%" p="4">
          {numbers?.map(num => (
            <NumberBingo number={num} key={num} active={result?.includes(num)} />
          ))}
        </SimpleGrid>
      </VStack>
    </Screen>
  )
})
