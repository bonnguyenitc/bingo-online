import { Text } from '@chakra-ui/react'
import React, { memo } from 'react'

type Props = {
  message: string
}

export default memo(function ErrorText({ message }: Props) {
  return (
    <Text color="red.500" fontSize="sm" fontWeight="light">
      {message}
    </Text>
  )
})
