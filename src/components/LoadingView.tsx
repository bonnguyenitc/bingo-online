import React, { useEffect } from 'react'
import { Modal, ModalOverlay, ModalContent, useDisclosure, Spinner, Center } from '@chakra-ui/react'
import { useLoading } from '../hooks'
type Props = {
  //
}

export default function LoadingView(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoading } = useLoading()
  useEffect(() => {
    isLoading ? onOpen() : onClose()
  }, [isLoading, onClose, onOpen])
  return (
    <Modal isOpen={isOpen} closeOnOverlayClick={false} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bg="transparent">
        <Center flex={1}>
          <Spinner color="main.3" size="xl" />
        </Center>
      </ModalContent>
    </Modal>
  )
}
