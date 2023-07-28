import type { FC } from 'react'
import React, { useEffect } from 'react'

import { Male } from '../Avatar/Male'
import { Woman } from '../Avatar/Female'
import { usePlayerStore } from '@/state/settings/player'

export const Scene: FC = () => {
  const { setAvatar, avatar } = usePlayerStore((s) => ({
    setAvatar: s.setAvatar,
    avatar: s.avatar,
  }))
  const [hoveredAvatar, setHoveredAvatar] = React.useState<number | null>(null)
  useEffect(() => {
    if (hoveredAvatar) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'default'
    }
  }, [hoveredAvatar])
  return (
    <>
      <Male
        onClick={() => {
          setAvatar(1)
        }}
        onPointerOver={() => setHoveredAvatar(1)}
        onPointerOut={() => setHoveredAvatar(null)}
        isSelection={true}
        position={[-10, hoveredAvatar === 1 ? -16 : -17, -20]}
        rotation={[0, 0.5, 0]}
      />
      <Woman
        onClick={() => {
          setAvatar(2)
        }}
        onPointerOver={() => setHoveredAvatar(2)}
        onPointerOut={() => setHoveredAvatar(null)}
        position={[10, hoveredAvatar === 2 ? -16 : -17, -20]}
        rotation={[0, -0.5, 0]}
      />
    </>
  )
}
