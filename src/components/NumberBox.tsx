import {
  Button,
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from '@chakra-ui/react'
import React, { memo } from 'react'

type Props = {
  number: number
  onDelete: (v: number) => void
}

export default memo(function NumberBox({ number, onDelete }: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          background="main.2"
          mr="4"
          mb="4"
          fontWeight="medium"
          fontSize="xl"
          color="textLight"
          _hover={{
            bg: 'main.1',
          }}
          _active={{
            bg: 'main.1',
          }}>
          {number}
        </Button>
      </PopoverTrigger>
      <PopoverContent w="180px" color="white" bg="main.2" borderColor="main.2">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Button
            colorScheme="red"
            mt="4"
            mr="4"
            mb="4"
            fontWeight="medium"
            fontSize="xl"
            onClick={() => onDelete(number)}>
            Remove {number}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
})
