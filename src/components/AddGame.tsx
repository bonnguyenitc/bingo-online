import React, { memo, useEffect, useState } from 'react'
import { Text, VStack, HStack, Box, Wrap, WrapItem } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import { useTeamStore, useLoadingStore, useUserStore, useGameStore } from '../store'
import { useCallback } from 'react'
import Screen from './Screen'
import If from './If'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Team } from '../db/v1'
import { randomNumber } from '../utils/random'
import Link from 'next/link'
import ErrorText from './ErrorText'
import { usePolicyStore } from '../store/usePolicyStore'
import { REGEX_LETTER_NUMBER } from '../utils/constans'
import PrimaryButton from './PrimaryButton'
import { FaCheckCircle } from 'react-icons/fa'
import TextInput from './TextInput'
import { useToast } from '../hooks'

type FormData = {
  name: string
}

const scheme = yup.object({
  name: yup
    .string()
    .required('Please type a name')
    .max(255)
    .matches(REGEX_LETTER_NUMBER, 'Only allow characters and numbers'),
})

export default memo(function AddGame() {
  const [team, setTeam] = useState<string[]>([])

  const { showLoading, hideLoading } = useLoadingStore()
  const { createGame, countGamesByUserId, amountGameCreated } = useGameStore()
  const user = useUserStore(state => state.user)
  const getTeams = useTeamStore(state => state.getTeams)
  const teams = useTeamStore(state => state.teams)
  const policy = usePolicyStore(state => state.policy)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(scheme),
  })

  useEffect(() => {
    async function loadTeams() {
      showLoading()
      await getTeams(user?.id)
      hideLoading()
    }
    loadTeams()
  }, [getTeams, hideLoading, showLoading, user?.id])

  const router = useRouter()

  const { toastError } = useToast()

  useEffect(() => {
    countGamesByUserId(user?.id)
  }, [countGamesByUserId, user?.id])

  const createNewGame = useCallback(
    async (data: FormData) => {
      if (!user || !policy) return
      const { name } = data
      if (!policy.can_create_game) {
        return toastError('You can not create game')
      }
      if (policy.number_game_can_create === amountGameCreated) {
        return toastError('You can not create game')
      }
      showLoading()
      const game: any = await createGame(
        {
          entry_code: randomNumber(),
          name,
          numbers: JSON.stringify([]),
          user_id: user.id,
        },
        team,
      )
      hideLoading()
      if (game?.error) {
        return toastError(game.error)
      }
      if (game) {
        router.push('/games/' + game.id)
      }
    },
    [
      user,
      policy,
      amountGameCreated,
      showLoading,
      createGame,
      team,
      hideLoading,
      toastError,
      router,
    ],
  )

  const handleChoiceGroup = useCallback(
    (id: string) => {
      const index = team.findIndex(t => t === id)
      setTeam(index > -1 ? team.filter(t => t !== id) : [...team, id])
    },
    [team],
  )

  return (
    <Screen>
      <Box height="10px" />
      <Text color="text" fontSize="2xl" fontWeight="bold">
        Create new game
      </Text>
      <Box height="10px" />
      <VStack flex={1} color="text" fontSize="xl" w="100%" px="4">
        <TextInput
          control={control}
          name="name"
          w="300px"
          placeholder="Type a name of game"
          size="md"
          color="text"
          maxLength={255}
        />
        {errors.name?.message && (
          <HStack w="300px">
            <ErrorText message={errors.name.message} />
          </HStack>
        )}
        <Box height="10px" />
        <PrimaryButton
          disabled={Boolean(errors.name?.message)}
          onClick={handleSubmit(createNewGame)}
          label="Create"
        />
        <Box height="10px" />
        <HStack w="100%">
          <Text fontWeight="bold">My Teams</Text>
        </HStack>
        <Box height="4px" />
        <If
          condition={teams.length > 0}
          component={
            <Wrap pb="4" w="100%">
              {teams.map((t: Team) => (
                <WrapItem key={t.id}>
                  <PrimaryButton
                    onClick={() => handleChoiceGroup(t.id)}
                    w="auto"
                    rightIcon={team?.includes(t.id) ? <FaCheckCircle /> : <Box display="none" />}>
                    <Text color="main.4" fontWeight="semibold" fontSize="md">
                      {t.name}
                    </Text>
                  </PrimaryButton>
                </WrapItem>
              ))}
            </Wrap>
          }
          fallback={
            <Link href="/teams/add">
              <Text fontWeight="light" color="text" fontSize="xl">{`Let's add your team`}</Text>
            </Link>
          }
        />
      </VStack>
    </Screen>
  )
})
