import React, { memo } from 'react'
import { Input, HStack, useToast, VStack } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'
import { useGameStore, useLoadingStore, useTeamStore, useUserStore } from '../store'
import { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ErrorText from './ErrorText'
import PrimaryIconButton from './PrimaryIconButton'

type Props = { gameId: string }

type FormData = {
  email: string
}

const scheme = yup.object({
  email: yup.string().email('Please type a valid email').required('Please enter a name').max(255),
})

export default memo(function AddPlayer({ gameId }: Props) {
  const { showLoading, hideLoading } = useLoadingStore()
  const findUserJoined = useGameStore(state => state.findUserJoined)
  const getUserByEmail = useUserStore(state => state.getUserByEmail)
  const addNewPlayer = useGameStore(state => state.addNewPlayer)
  const { getPlayersOfGame } = useTeamStore()
  const toast = useToast()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(scheme),
  })

  const addMember = useCallback(
    async (data: FormData) => {
      const { email } = data
      showLoading()
      const user = await getUserByEmail(email)
      if (!user) {
        hideLoading()
        return toast({
          title: 'Warning',
          description: 'This user not existed',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      const playerExisted = await findUserJoined(user.id, gameId)
      if (playerExisted) {
        hideLoading()
        return toast({
          title: 'Warning',
          description: 'This user has joined this game',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      const newPlayer = await addNewPlayer(user.id, gameId)
      if (newPlayer) {
        hideLoading()
        getPlayersOfGame(gameId)
        return toast({
          title: 'Success',
          description: 'Added new player',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      hideLoading()
      return toast({
        title: 'Warning',
        description: 'Add player failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
    [
      addNewPlayer,
      findUserJoined,
      gameId,
      getUserByEmail,
      hideLoading,
      showLoading,
      toast,
      getPlayersOfGame,
    ],
  )

  return (
    <VStack w="100%" alignItems="flex-start">
      <HStack w="100%" justifyContent="space-between" alignItems="center">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="Type a name of member"
              size="md"
              color="text"
              borderColor="main.3"
              focusBorderColor="main.3"
              maxLength={255}
            />
          )}
        />
        <PrimaryIconButton
          aria-label="add-player"
          disabled={Boolean(errors.email?.message)}
          onClick={handleSubmit(addMember)}
          icon={<FaPlus />}
        />
      </HStack>
      {errors.email?.message && <ErrorText message={errors.email.message} />}
    </VStack>
  )
})
