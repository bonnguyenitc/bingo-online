import { useRouter } from 'next/dist/client/router'
import TeamDetail from '../../src/components/TeamDetail'

export default function Page() {
  const router = useRouter()
  const { id } = router.query
  return <TeamDetail teamId={id + ''} />
}
