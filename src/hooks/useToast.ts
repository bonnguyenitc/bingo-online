import { useToast as useToastLib } from '@chakra-ui/react'
import { useCallback } from 'react'

export const useToast = () => {
  const toast = useToastLib()

  const toastError = useCallback(
    (description: string) => {
      return toast({
        title: 'Warning',
        description,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
    [toast],
  )

  const toastSuccess = useCallback(
    (description: string) => {
      return toast({
        title: '',
        description,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    [toast],
  )

  return { toastError, toastSuccess }
}
