import React, { memo } from 'react'
import Screen from './Screen'
import Layout from './Layout'
import { Text } from '@chakra-ui/react'

type Props = {
  error: any
  resetErrorBoundary: () => void
}

export default memo(function Crash({ error, resetErrorBoundary }: Props) {
  return (
    <Layout>
      <Screen>
        <Text fontSize="xl" color="text">
          Oops, there is an error!
        </Text>
      </Screen>
    </Layout>
  )
})
