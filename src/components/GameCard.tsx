import { Box, Flex, FormLabel, Spacer, Text } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import React, { memo, useCallback } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { useGameStore } from '../store'
import { Game } from '../db/v1'
import PrimaryIconButton from './PrimaryIconButton'
import PrimarySwitch from './PrimarySwitch'

type Props = {
  data: Game
  onChangeDone: (id: string, checked: boolean) => void
}

export default memo(function GameCard({ data, onChangeDone }: Props) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!data) return
      onChangeDone(data.id, e.target.checked)
    },
    [data, onChangeDone],
  )

  const router = useRouter()

  const setGame = useGameStore(state => state.setGame)

  const handleGoDetail = useCallback(() => {
    setGame(data)
    router.push(`/games/${data?.id}`)
  }, [data, router, setGame])

  return (
    <Box w="100%" bg="main.2" borderRadius="xl" p="4" shadow="xl">
      <Flex alignItems="center">
        <Text fontWeight="bold" fontSize="xl" color="main.4">
          {data?.name}
        </Text>
        <Spacer />
        <PrimaryIconButton
          aria-label="open-round"
          icon={<FaArrowRight />}
          onClick={handleGoDetail}
          bg="main.4"
          color="main.1"
        />
      </Flex>
      <Flex direction="column" w="100%">
        <FormLabel color="textLight" fontSize="xs">
          Mark the game as the end
        </FormLabel>
        <PrimarySwitch isChecked={data?.completed} onChange={handleChange} />
      </Flex>
    </Box>
  )
})
