import React from 'react'

type Props = {
  condition?: boolean
  component?: React.ReactElement
  fallback?: React.ReactElement
}

export default function If({ condition, component, fallback = <div /> }: Props) {
  return <>{condition ? component : fallback}</>
}
