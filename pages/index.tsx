import { Welcome } from '../src/components/Welcome'
import MainPlay from '../src/components/MainPlay'
import { useUserStore } from '../src/store'

export default function Page() {
  const hasUser = useUserStore(state => !!state.user)

  return <>{hasUser ? <MainPlay /> : <Welcome />}</>
}

// export const getServerSideProps = async function (ctx: GetServerSidePropsContext) {
//   const supabaseClient = createServerSupabaseClient(ctx)
//   const refreshToken = ctx.req.cookies['my-refresh-token']
//   const accessToken = ctx.req.cookies['my-access-token']

//   if (refreshToken && accessToken) {
//     await supabaseClient.auth.setSession({
//       refresh_token: refreshToken,
//       access_token: accessToken,
//     })
//   } else {
//     return {
//       props: {
//         user: null,
//       },
//     }
//   }

//   const {
//     data: { user },
//   } = await supabaseClient.auth.getUser()

//   return {
//     props: { user },
//   }
// }
