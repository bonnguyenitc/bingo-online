import { useRouter } from 'next/dist/client/router'
import React from 'react'
import GameManagement from '../../src/components/GameManagement'

export default function Page() {
  const router = useRouter()
  const { id } = router.query
  return <GameManagement id={id + ''} />
}
