import { Box, Center, IconButton, Text, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import Link from 'next/link'
import React, { memo, useCallback, useEffect } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { useLoadingStore, useTeamStore, useUserStore } from '../store'
import Screen from './Screen'

export default memo(function Team() {
  const getTeams = useTeamStore(state => state.getTeams)
  const user = useUserStore(state => state.user)
  const teams = useTeamStore(state => state.teams)
  const { showLoading, hideLoading } = useLoadingStore()

  const getData = useCallback(async () => {
    showLoading()
    await getTeams(user?.id)
    hideLoading()
  }, [getTeams, hideLoading, showLoading, user?.id])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <Screen>
      <Box height="10px" />
      <Text color="text" fontSize="2xl" fontWeight="bold">
        My Teams
      </Text>
      <Box height="10px" />
      <VStack flex={1} alignItems="flex-start" px="4" w="100%">
        <Link href="/teams/add" passHref>
          <IconButton
            colorScheme="teal"
            aria-label="add"
            bg="main.3"
            color="main.4"
            icon={<FaPlusCircle />}
          />
        </Link>
        <Box height="10px" />
        <Wrap maxW="100%">
          {teams?.map(gr => (
            <WrapItem key={gr?.id} mr="4" mb="4">
              <Link href={`teams/${gr?.id}`} passHref>
                <Center p="2" px="4" bg="main.3" borderRadius="base">
                  <Text color="main.4" fontWeight="bold" fontSize="md">
                    {gr?.name}
                  </Text>
                </Center>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </Screen>
  )
})
