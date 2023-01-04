import React, { memo } from 'react'
import { Box, Text, Stack, HStack, useTheme } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useToast } from '@chakra-ui/react'
import { useRoundStore, useUserStore } from '../store'
import { useCallback } from 'react'
import Screen from './Screen'
import If from './If'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ErrorText from './ErrorText'
import { useLoading } from '../hooks'
import PrimaryButton from './PrimaryButton'
import TextInput from './TextInput'

type FormData = {
  code: string
}

const scheme = yup.object({
  code: yup.string().required('Please type a code').max(255),
})

export default memo(function MainPlay() {
  const router = useRouter()
  const user = useUserStore(state => state.user)
  const joinRound = useRoundStore(state => state.joinRound)
  const { showLoading, hideLoading } = useLoading()

  const theme = useTheme()

  const toast = useToast()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(scheme),
  })

  const handleJoinGame = useCallback(
    async (data: FormData) => {
      if (!user) return
      const { code } = data
      showLoading()
      const round = await joinRound(code, user.id)
      hideLoading()
      if (round?.error) {
        return toast({
          title: 'Warning',
          description: round.error,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        })
      }
      return router.push('/play')
    },
    [joinRound, router, toast, user, hideLoading, showLoading],
  )

  return (
    <Screen>
      <If
        condition={Boolean(user?.id)}
        component={
          <>
            <Link href="/games/add">
              <PrimaryButton color="textLight">New game</PrimaryButton>
            </Link>
            <Box h="5" />
            <Link href="/games">
              <PrimaryButton color="textLight">Games</PrimaryButton>
            </Link>
            <Box h="5" />
            <Link href="/teams">
              <PrimaryButton color="textLight">Teams</PrimaryButton>
            </Link>
            <Box h="5" />
          </>
        }
      />
      <Stack w="300px">
        <TextInput
          control={control}
          name="code"
          w="300px"
          placeholder="Type a code invite or code game"
          size="lg"
          maxLength={255}
        />
        {errors.code?.message && (
          <HStack w="300px">
            <ErrorText message={errors.code.message} />
          </HStack>
        )}
        <Text fontSize="sm" fontWeight="light">
          Enter a code invited or entry code
        </Text>
        <Box h="5" />
        <PrimaryButton
          disabled={Boolean(errors.code?.message)}
          color="textLight"
          onClick={handleSubmit(handleJoinGame)}>
          Play
        </PrimaryButton>
      </Stack>
    </Screen>
  )
})
