import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useLoadingStore, useUserStore } from '../store'
import { usePolicyStore } from '../store/usePolicyStore'
import { useRoles } from './useRoles'
import { useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'

export const useAuthenticate = () => {
  const user = useUserStore(state => state.user)
  const { getPolicy } = usePolicyStore()
  const signInByGoogle = useUserStore(state => state.signInByGoogle)
  const { hideLoading, showLoading } = useLoadingStore()
  const supabaseClient = useSupabaseClient()

  const { getUserByEmail, setUser } = useUserStore()

  const getData = useCallback(async () => {
    showLoading()
    const client = await supabaseClient.auth.getUser()
    const email = client.data?.user?.email
    if (email) {
      const data = await getUserByEmail(email)
      if (data) setUser(data)
    }
    hideLoading()
  }, [getUserByEmail, hideLoading, setUser, showLoading, supabaseClient.auth])

  useEffect(() => {
    getData()
  }, [getData])

  const { roles } = useRoles()

  const normalRole = useMemo(
    () => roles.find(item => item.alias === 'NORMAL'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(roles)],
  )

  useEffect(() => {
    getPolicy(user?.roles?.policies_id)
  }, [user?.roles?.policies_id, getPolicy])

  const router = useRouter()

  useEffect(() => {
    if (!normalRole) return
    const { data } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null)
        const expires = new Date(0).toUTCString()
        document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`
        document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`
        if (router.pathname !== '/') {
          return router.replace('/')
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { user: userSession, access_token, refresh_token } = session ?? {}
        if (!userSession || !access_token || !refresh_token || user) return
        showLoading()
        await signInByGoogle({
          type: 'real',
          avatar_url: userSession?.user_metadata?.avatar_url,
          email: userSession?.email,
          full_name: userSession?.user_metadata?.full_name,
          id_oauth: userSession?.id,
          username: '',
          role_id: normalRole.id,
          provider: userSession?.app_metadata?.provider,
        })
        hideLoading()
        const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
        document.cookie = `my-access-token=${access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
        document.cookie = `my-refresh-token=${refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hideLoading,
    router,
    setUser,
    showLoading,
    signInByGoogle,
    supabaseClient.auth,
    normalRole,
    user,
  ])
}
