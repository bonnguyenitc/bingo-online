import { Button, ButtonProps } from '@chakra-ui/react'
import React from 'react'

type Props = {
  label?: string
  children?: React.ReactNode
}

export default function PrimaryButton({ children, label, ...rest }: Props & ButtonProps) {
  return (
    <Button
      bg="main.2"
      color="textLight"
      variant="solid"
      size="lg"
      w="300px"
      _hover={{
        bg: 'main.1',
      }}
      _active={{
        bg: 'main.1',
      }}
      {...rest}>
      {children ?? label}
    </Button>
  )
}
