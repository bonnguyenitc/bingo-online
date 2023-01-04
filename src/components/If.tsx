import React from 'react'

type Props = {
  condition?: boolean
  component?: React.ReactElement
  fallback?: React.ReactElement | null
}

export default function If({ condition, component, fallback = null }: Props) {
  return <>{condition ? component : fallback}</>
}
