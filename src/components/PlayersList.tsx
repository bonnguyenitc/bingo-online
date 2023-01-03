import { ListItem, OrderedList, Text } from '@chakra-ui/react'
import React from 'react'
import { CodePlay } from '../db/v1'

type Props = {
  data: CodePlay[]
}

export const PlayersList = ({ data }: Props) => {
  return (
    <OrderedList>
      {data.map(player => (
        <ListItem key={player.id} py="4">
          <Text fontSize="xl" color="text" fontWeight="semibold">
            {player.users?.full_name}
          </Text>
          <Text fontSize="md" color="text" fontWeight="light">
            {player.users?.email}
          </Text>
        </ListItem>
      ))}
    </OrderedList>
  )
}
