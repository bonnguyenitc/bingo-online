import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { useCallback, useState } from 'react'
import { theme } from '../src/theme'
import Layout from '../src/components/Layout'
import { ErrorBoundary } from 'react-error-boundary'
import Crash from '../src/components/Crash'
import LoadingView from '../src/components/LoadingView'

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  const myErrorHandler = useCallback((error: Error, info: { componentStack: string }) => {
    // Do something with the error
  }, [])

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary FallbackComponent={Crash} onError={myErrorHandler}>
          <Layout>
            <Component {...pageProps} />
            <LoadingView />
          </Layout>
        </ErrorBoundary>
      </ChakraProvider>
    </SessionContextProvider>
  )
}
