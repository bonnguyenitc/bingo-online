import React from 'react'
import { VStack } from '@chakra-ui/react'
import { useAuthenticate } from '../hooks'
import Header from './Header'
import styles from '../styles/Layout.module.css'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  useAuthenticate()
  return (
    <VStack h="100vh" background="main.1" w="100vw">
      <VStack width="100%" height="100%">
        <Header hasBack />
        <VStack flex={1} overflow="scroll" className={styles.mt0} w="100%">
          {children}
        </VStack>
      </VStack>
    </VStack>
  )
}
