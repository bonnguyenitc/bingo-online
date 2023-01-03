import React from 'react'
import { VStack } from '@chakra-ui/react'
import styles from '../styles/Layout.module.css'

type Props = {
  children?: React.ReactNode
}

export default function Screen({ children }: Props) {
  return (
    <VStack flex={1} className={styles.mt0} bg="background" justifyContent="center" width="md">
      {children}
    </VStack>
  )
}
