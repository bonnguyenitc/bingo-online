import React, { memo } from 'react'
import { Center, Text } from '@chakra-ui/react'

type Props = {
  number: number
  active: boolean
}

export default memo(function NumberBingo({ number, active }: Props) {
  if (!number) {
    return <Center bg="main.4" height="80px" />
  }
  return (
    <Center
      bg={!active ? 'main.4' : 'main.2'}
      height="80px"
      borderRadius="8px"
      borderColor="main.2"
      borderWidth={1}>
      <Text fontSize="2xl" color={active ? 'textLight' : 'text'} fontWeight="bold">
        {number}
      </Text>
    </Center>
  )
})
