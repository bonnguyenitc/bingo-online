import { Text, VStack, Input, HStack, IconButton, useToast, Box } from '@chakra-ui/react'
import React, { memo, useEffect } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import ItemMember from './ItemMember'
import { useTeamStore, useLoadingStore, useUserStore } from '../store'
import { useCallback } from 'react'
import Screen from './Screen'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ErrorText from './ErrorText'

type FormData = {
  name: string
}

const scheme = yup.object({
  name: yup.string().email().required('Please enter a name of member').max(255),
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

  const toast = useToast()

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
        return toast({
          title: 'Warning',
          description: 'User not exists',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      if (user.id === self?.id) {
        hideLoading()
        return toast({
          title: 'Warning',
          description: 'Can not add self',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
      const memberExist = await findMemberExistInTeam(user.id, teamId)
      if (memberExist) {
        if (memberExist.deleted) {
          const userUpdated = await updateMemberById(memberExist.id, { deleted: false })
          if (userUpdated) {
            getMemberOfTeam(teamId)
            hideLoading()
            return toast({
              title: '',
              description: 'Added success',
              status: 'success',
              duration: 3000,
              isClosable: true,
            })
          }
        } else {
          hideLoading()
          return toast({
            title: 'Warning',
            description: 'Member already exists',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }
      const newMember = await addMemberForTeam({ user_id: user.id, team_id: teamId })
      if (newMember) {
        getMemberOfTeam(teamId)
        hideLoading()
        return toast({
          title: '',
          description: 'Added success',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        hideLoading()
        return toast({
          title: 'Warning',
          description: 'There is an error, please try again',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
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
      toast,
      updateMemberById,
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
          <Controller
            control={control}
            name="name"
            render={({ field: { onBlur, onChange } }) => (
              <Input
                w="300px"
                onChange={onChange}
                onBlur={onBlur}
                name="name"
                placeholder="Type a name of member"
                size="md"
                color="text"
                borderColor="main.3"
                focusBorderColor="main.3"
                maxLength={255}
              />
            )}
          />
          <IconButton
            aria-label="add-member"
            disabled={Boolean(errors.name?.message)}
            onClick={handleSubmit(addMember)}
            colorScheme="teal"
            icon={<FaPlusCircle />}
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
