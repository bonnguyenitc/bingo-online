import { IconButton, Flex, useColorMode, Avatar, Text, HStack, Box } from '@chakra-ui/react'
import { useRouter } from 'next/dist/client/router'
import { memo, useCallback, useMemo } from 'react'
import { FaSun, FaMoon, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa'
import { useLoadingStore, useUserStore } from '../store'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import styles from '../styles/Layout.module.css'
import Link from 'next/link'

type Props = {
  hasBack?: boolean
  title?: string
  label?: string
}

export default memo(function Header({ hasBack, title = 'Bingo Online', label }: Props) {
  const { colorMode, toggleColorMode } = useColorMode()
  const user = useUserStore(state => state.user)
  const supabaseClient = useSupabaseClient()
  const { hideLoading, showLoading } = useLoadingStore()

  const icon = colorMode === 'dark' ? <FaMoon /> : <FaSun />

  const router = useRouter()

  const signOut = useCallback(async () => {
    showLoading()
    await supabaseClient.auth.signOut()
    hideLoading()
  }, [hideLoading, showLoading, supabaseClient.auth])

  const isHome = useMemo(() => router.pathname === '/', [router.pathname])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <HStack bg="main.3" px="4" w="md" justifyContent="space-between" alignItems="center">
        <Link href="/">
          <Text fontSize="3xl" color="white">
            Bingo
          </Text>
        </Link>
        <Flex alignItems="center" color="main.4" flex={1} justifyContent="end">
          {!!user && (
            <>
              <Avatar
                mr="2"
                size="sm"
                name={user?.full_name || user?.email}
                src={user?.avatar_url}
              />
              <Text fontSize="sm" fontWeight="semibold" wordBreak="break-word" noOfLines={2}>
                {user?.full_name || user?.email}
              </Text>
            </>
          )}
          <IconButton
            colorScheme="teal"
            aria-label="change-theme"
            ml="2"
            bg="main.3"
            icon={icon}
            onClick={toggleColorMode}
          />
          {!!user && (
            <IconButton
              colorScheme="teal"
              aria-label="log-out"
              ml="2"
              bg="main.3"
              icon={<FaSignOutAlt />}
              onClick={signOut}
            />
          )}
        </Flex>
      </HStack>
      {hasBack && (
        <HStack className={styles.mt0} py="4" px="4" background="background" width="md">
          {!isHome && (
            <IconButton
              onClick={router.back}
              aria-label="go-back"
              icon={<FaArrowLeft />}
              colorScheme="teal"
              variant="solid"
              borderRadius="full"
              background="main.3"
            />
          )}
          <Box pl="4">
            <Text fontSize="xl" noOfLines={1} fontWeight="bold">
              {label}
            </Text>
          </Box>
        </HStack>
      )}
    </>
  )
})
