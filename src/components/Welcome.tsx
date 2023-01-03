import { Button } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { getURL } from '../utils/helpers'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Screen from './Screen'
import { Provider } from '@supabase/supabase-js'

export const Welcome = () => {
  const supabaseClient = useSupabaseClient()

  const signIn = useCallback(
    (provider: Provider) => async () => {
      await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getURL(),
        },
      })
    },
    [supabaseClient],
  )

  return (
    <Screen>
      <Button
        mb="4"
        leftIcon={<FaGoogle />}
        colorScheme="pink"
        size="lg"
        w="200px"
        onClick={signIn('google')}>
        Google
      </Button>
      <Button
        leftIcon={<FaGithub />}
        colorScheme="cyan"
        size="lg"
        w="200px"
        onClick={signIn('github')}>
        Github
      </Button>
    </Screen>
  )
}
