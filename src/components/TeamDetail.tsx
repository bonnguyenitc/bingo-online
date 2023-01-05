import { Text, VStack, HStack, Box } from '@chakra-ui/react'
import React, { memo, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import ItemMember from './ItemMember'
import { useTeamStore, useLoadingStore, useUserStore } from '../store'
import { useCallback } from 'react'
import Screen from './Screen'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ErrorText from './ErrorText'
import PrimaryIconButton from './PrimaryIconButton'
import TextInput from './TextInput'
import { useToast } from '../hooks'

type FormData = {
  name: string
}

const scheme = yup.object({
  name: yup.string().email('Please type a valid email').required('Please type an email').max(255),
})

type Props = {
  teamId: string
}

export default memo(function TeamDetail({ teamId }: Props) {
  const self = useUserStore(state => state.user)
  const getUserByEmail = useUserStore(state => state.getUserByEmail)
  const getMemberOfTeam = useTeamStore(state => state.getMemberOfTeam)
  const membersOfTeam = useTeamStore(state => state.membersOfTeam)
  const addMemberForTeam = useTeamStore(state => state.addMemberForTeam)
  const findMemberExistInTeam = useTeamStore(state => state.findMemberExistInTeam)
  const { showLoading, hideLoading } = useLoadingStore()
  const removeMemberById = useTeamStore(state => state.removeMemberById)
  const updateMemberById = useTeamStore(state => state.updateMemberById)
  const getTeamById = useTeamStore(state => state.getTeamById)
  const team = useTeamStore(state => state.team)

  const getData = useCallback(
    async (id: string) => {
      showLoading()
      await getTeamById(id)
      await getMemberOfTeam(id)
      hideLoading()
    },
    [getMemberOfTeam, getTeamById, hideLoading, showLoading],
  )

  useEffect(() => {
    getData(teamId)
  }, [getData, teamId])

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(scheme),
  })

  const { toastError, toastSuccess } = useToast()

  const removeMember = useCallback(
    (id: string) => async () => {
      showLoading()
      const done = await removeMemberById(id)
      hideLoading()
      if (done) {
        getMemberOfTeam(teamId)
      }
    },
    [showLoading, removeMemberById, hideLoading, getMemberOfTeam, teamId],
  )

  const addMember = useCallback(
    async (data: FormData) => {
      const { name } = data
      showLoading()
      const user = await getUserByEmail(name, 'id')
      if (!user) {
        hideLoading()
        return toastError('User not exists')
      }
      if (user.id === self?.id) {
        hideLoading()
        return toastError('Can not add self')
      }
      const memberExist = await findMemberExistInTeam(user.id, teamId)
      if (memberExist) {
        if (memberExist.deleted) {
          const userUpdated = await updateMemberById(memberExist.id, { deleted: false })
          if (userUpdated) {
            getMemberOfTeam(teamId)
            hideLoading()
            return toastSuccess('Added success')
          }
        } else {
          hideLoading()
          return toastError('Member already exists')
        }
      }
      const newMember = await addMemberForTeam({ user_id: user.id, team_id: teamId })
      if (newMember) {
        getMemberOfTeam(teamId)
        hideLoading()
        return toastSuccess('Added success')
      } else {
        hideLoading()
        return toastError('There is an error, please try again')
      }
    },
    [
      addMemberForTeam,
      findMemberExistInTeam,
      getMemberOfTeam,
      getUserByEmail,
      hideLoading,
      self?.id,
      showLoading,
      teamId,
      toastError,
      updateMemberById,
      toastSuccess,
    ],
  )

  return (
    <Screen>
      <Box height="10px" />
      <Text color="text" fontSize="2xl" fontWeight="bold">
        {team?.name}
      </Text>
      <Box height="10px" />
      <VStack color="main.4" fontSize="xl" flex={1}>
        <HStack spacing="4">
          <TextInput
            control={control}
            name="name"
            w="240px"
            placeholder="Type an email of player"
            size="md"
            color="text"
            maxLength={255}
          />
          <PrimaryIconButton
            aria-label="add-member"
            disabled={Boolean(errors.name?.message)}
            onClick={handleSubmit(addMember)}
            icon={<FaPlus />}
          />
        </HStack>
        {errors.name?.message && (
          <HStack w="100%">
            <ErrorText message={errors.name.message} />
          </HStack>
        )}
        <Box height="10px" />
        <HStack w="100%">
          <Text fontSize="xl" fontWeight="semibold" color="text">
            Members
          </Text>
        </HStack>
        <VStack w="100%" pb="4">
          {membersOfTeam?.map((member, index) => (
            <ItemMember
              key={member.id}
              index={index + 1}
              data={member}
              onDelete={removeMember(member.id)}
            />
          ))}
        </VStack>
      </VStack>
    </Screen>
  )
})
