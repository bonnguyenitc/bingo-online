import React from 'react'
import { Text, VStack } from '@chakra-ui/react'
import { useAuthenticate } from '../hooks'
import Header from './Header'
import styles from '../styles/Layout.module.css'
import { useLoadingStore, useUserStore } from '../store'
import Screen from './Screen'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  useAuthenticate()
  const { init } = useLoadingStore()
  const { user } = useUserStore()
  return (
    <VStack h="100vh" background="main.1" w="100vw">
      <VStack width="100%" height="100%">
        <Header hasBack={!!user} />
        <VStack flex={1} overflow="scroll" className={styles.mt0} w="100%">
          {init ? (
            children
          ) : (
            <Screen>
              <Text color="text">Loading...</Text>
            </Screen>
          )}
        </VStack>
      </VStack>
    </VStack>
  )
}
