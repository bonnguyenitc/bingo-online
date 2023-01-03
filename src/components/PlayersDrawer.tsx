import React, { memo, useEffect } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Text,
  Box,
  Divider,
} from '@chakra-ui/react'
import AddPlayer from './AddPlayer'
import { useTeamStore } from '../store'
import { PlayersList } from './PlayersList'

type Props = {
  isOpen: boolean
  onClose: () => void
  gameId: string
}

export default memo(function PlayersDrawer({ isOpen, onClose, gameId }: Props) {
  const { getPlayersOfGame, playersOfGame } = useTeamStore()

  useEffect(() => {
    getPlayersOfGame(gameId)
  }, [getPlayersOfGame, gameId])

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Players</DrawerHeader>
        <DrawerBody>
          <Flex w="100%" alignItems="center">
            <Text mr="8" fontSize="xl" fontWeight="semibold">
              Add new player
            </Text>
          </Flex>
          <Box height="10px" />
          <AddPlayer gameId={gameId} />
          <Box height="10px" />
          <Divider />
          <PlayersList data={playersOfGame} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
})
