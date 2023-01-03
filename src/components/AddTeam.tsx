import { Input, VStack, Button, useToast, Text, Box, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import React, { memo, useCallback } from 'react'
import { useTeamStore, useLoadingStore, useUserStore } from '../store'
import Screen from './Screen'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { usePolicyStore } from '../store/usePolicyStore'
import ErrorText from './ErrorText'
import { REGEX_LETTER_NUMBER } from '../utils/constans'

type FormData = {
  name: string
}

const scheme = yup.object({
  name: yup
    .string()
    .required('Please enter a team name')
    .max(255)
    .matches(REGEX_LETTER_NUMBER, 'Only allow characters and numbers'),
})

export default memo(function AddTeam() {
  const createTeam = useTeamStore(state => state.createTeam)
  const { hideLoading, showLoading } = useLoadingStore()
  const checkNameTeam = useTeamStore(state => state.checkNameTeam)
  const user = useUserStore(state => state.user)
  const router = useRouter()
  const toast = useToast()
  const policy = usePolicyStore(state => state.policy)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(scheme),
  })

  const teams = useTeamStore(state => state.teams)

  const handleCreateGroup = useCallback(
    async (data: FormData) => {
      const { name } = data
      if (!policy?.can_create_team || !user) {
        return toast({
          title: 'Warning',
          description: 'You are not allowed to use this function',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      if (policy?.number_team_can_create === teams?.length) {
        return toast({
          title: 'Warning',
          description: `Max ${policy?.number_team_can_create} teams`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      showLoading()
      const teamExisted = await checkNameTeam(name)
      if (teamExisted) {
        hideLoading()
        return toast({
          title: 'Warning',
          description: 'Please type an another team name',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      const team = await createTeam({ name, user_id: user.id })
      if (team) {
        hideLoading()
        return router.back()
      } else {
        hideLoading()
        return toast({
          title: 'Warning',
          description: 'An error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    },
    [
      policy?.can_create_team,
      policy?.number_team_can_create,
      user,
      teams?.length,
      showLoading,
      checkNameTeam,
      createTeam,
      toast,
      hideLoading,
      router,
    ],
  )

  return (
    <Screen>
      <Box height="10px" />
      <Text color="text" fontSize="2xl" fontWeight="bold">
        Create new team
      </Text>
      <Box height="10px" />
      <VStack flex={1}>
        <Controller
          name="name"
          control={control}
          render={({ field: { onBlur, onChange } }) => (
            <Input
              w="300px"
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Type a team name"
              size="lg"
              color="text"
              borderColor="main.3"
              focusBorderColor="main.3"
              maxLength={255}
            />
          )}
        />
        {errors.name?.message && (
          <HStack w="300px">
            <ErrorText message={errors.name.message} />
          </HStack>
        )}
        <Box height="10px" />
        <Button
          disabled={Boolean(errors.name?.message)}
          loadingText="Đang vào"
          colorScheme="teal"
          variant="solid"
          size="lg"
          w="300px"
          onClick={handleSubmit(handleCreateGroup)}>
          Create
        </Button>
      </VStack>
    </Screen>
  )
})
