import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext } from 'next'

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

export const getAuthServerSide = async function (ctx: GetServerSidePropsContext) {
  const supabaseClient = createServerSupabaseClient(ctx)
  const refreshToken = ctx.req.cookies['my-refresh-token']
  const accessToken = ctx.req.cookies['my-access-token']

  if (refreshToken && accessToken) {
    await supabaseClient.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    })
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { user },
  }
}

export const delay = async (time: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
