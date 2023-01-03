import { Box, HStack, IconButton, Text } from '@chakra-ui/react'
import React, { memo } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { Member } from '../db/v1'

type Props = {
  data: Member
  index: number
  onDelete: () => void
}

export default memo(function ItemMember({ data, index, onDelete }: Props) {
  return (
    <HStack w="100%">
      <Box flex={1}>
        <Text color="text" fontSize="md">
          {index}.
        </Text>
      </Box>
      <Box flex={7}>
        <Text color="text" fontSize="md">
          {data?.users?.email}
        </Text>
      </Box>
      <HStack flex={2} justifyContent="flex-end">
        <IconButton
          aria-label="delete-member"
          onClick={onDelete}
          colorScheme="red"
          icon={<FaRegTrashAlt />}
        />
      </HStack>
    </HStack>
  )
})
