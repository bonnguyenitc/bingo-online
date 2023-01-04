import { VStack, Text, Box, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import React, { memo, useCallback } from 'react'
import { useTeamStore, useLoadingStore, useUserStore } from '../store'
import Screen from './Screen'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { usePolicyStore } from '../store/usePolicyStore'
import ErrorText from './ErrorText'
import { REGEX_LETTER_NUMBER } from '../utils/constans'
import PrimaryButton from './PrimaryButton'
import TextInput from './TextInput'
import { useToast } from '../hooks'

type FormData = {
  name: string
}

const scheme = yup.object({
  name: yup
    .string()
    .required('Please type a team name')
    .max(255)
    .matches(REGEX_LETTER_NUMBER, 'Only allow characters and numbers'),
})

export default memo(function AddTeam() {
  const createTeam = useTeamStore(state => state.createTeam)
  const { hideLoading, showLoading } = useLoadingStore()
  const checkNameTeam = useTeamStore(state => state.checkNameTeam)
  const user = useUserStore(state => state.user)
  const router = useRouter()
  const { toastError } = useToast()
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
        return toastError('You are not allowed to use this function')
      }
      if (policy?.number_team_can_create === teams?.length) {
        return toastError(`Max ${policy?.number_team_can_create} teams`)
      }
      showLoading()
      const teamExisted = await checkNameTeam(name)
      if (teamExisted) {
        hideLoading()
        return toastError('Please type an another team name')
      }
      const team = await createTeam({ name, user_id: user.id })
      if (team) {
        hideLoading()
        return router.back()
      } else {
        hideLoading()
        return toastError('An error occurred')
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
      toastError,
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
        <TextInput
          control={control}
          name="name"
          w="300px"
          placeholder="Type a team name"
          size="lg"
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
          onClick={handleSubmit(handleCreateGroup)}>
          Create
        </PrimaryButton>
      </VStack>
    </Screen>
  )
})
