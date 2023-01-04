import React from 'react'
import { IconButton, IconButtonProps } from '@chakra-ui/react'

export default function PrimaryIconButton(props: IconButtonProps) {
  return (
    <IconButton
      bg="main.3"
      color="main.4"
      _hover={{
        bg: 'main.3',
      }}
      _active={{
        bg: 'main.1',
      }}
      {...props}
      borderRadius="full"
    />
  )
}
