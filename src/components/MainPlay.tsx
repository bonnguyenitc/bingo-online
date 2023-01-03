import React, { memo } from 'react'
import { Button, Box, Text, Stack, Input, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import { useToast } from '@chakra-ui/react'
import { useRoundStore, useUserStore } from '../store'
import { useCallback } from 'react'
import Screen from './Screen'
import If from './If'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ErrorText from './ErrorText'
import { useLoading } from '../hooks'

type FormData = {
  code: string
}

const scheme = yup.object({
  code: yup.string().required('Please enter a code').max(255),
})

export default memo(function MainPlay() {
  const router = useRouter()
  const user = useUserStore(state => state.user)
  const joinRound = useRoundStore(state => state.joinRound)
  const { showLoading, hideLoading } = useLoading()

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
              <Button color="textLight" variant="solid" size="lg" w="300px" colorScheme="teal">
                New game
              </Button>
            </Link>
            <Box h="5" />
            <Link href="/games">
              <Button color="textLight" variant="solid" size="lg" w="300px" colorScheme="teal">
                Games
              </Button>
            </Link>
            <Box h="5" />
            <Link href="/teams">
              <Button color="textLight" variant="solid" size="lg" w="300px" colorScheme="teal">
                Teams
              </Button>
            </Link>
            <Box h="5" />
          </>
        }
      />
      <Stack w="300px">
        <Controller
          control={control}
          name="code"
          render={({ field: { onBlur, onChange } }) => (
            <Input
              w="300px"
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Type a code invite or code game"
              size="lg"
              color="text"
              maxLength={255}
              borderColor="main.3"
              focusBorderColor="main.3"
            />
          )}
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
        <Button
          colorScheme="teal"
          disabled={Boolean(errors.code?.message)}
          color="textLight"
          variant="solid"
          background="main.3"
          size="lg"
          w="300px"
          onClick={handleSubmit(handleJoinGame)}>
          Play
        </Button>
      </Stack>
    </Screen>
  )
})
