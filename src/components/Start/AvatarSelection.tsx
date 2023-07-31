import type { FC } from 'react'
import React, { useEffect } from 'react'

import { Male } from '../Avatar/Male'
import { Woman } from '../Avatar/Female'
import { usePlayerStore } from '@/state/settings/player'
import { motion } from 'framer-motion-3d'
import { useSpring } from 'framer-motion'
import useSound from 'use-sound'

export const AvatarSelection: FC = () => {
  const { setAvatar, avatar } = usePlayerStore((s) => ({
    setAvatar: s.setAvatar,
    avatar: s.avatar,
  }))
  const [hoveredAvatar, setHoveredAvatar] = React.useState<number | null>(null)
  const [play] = useSound(`/sounds/hover.mp3`, {
    volume: 0.5,
    loop: false,
    interrupt: true,
  })
  useEffect(() => {
    if (hoveredAvatar) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'default'
    }
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [hoveredAvatar])

  const shouldHighlight = (a: number) => {
    if (a === hoveredAvatar) {
      return true
    }
    if (a === avatar && !hoveredAvatar) {
      return true
    }
    return false
  }
  const config = {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  }
  const brightness1 = useSpring(0, config)
  const brightness2 = useSpring(0, config)
  useEffect(() => {
    brightness1.set(shouldHighlight(1) ? 10 : 0)
    brightness2.set(shouldHighlight(2) ? 5 : 0)
  }, [hoveredAvatar, avatar])
  return (
    <>
      <motion.group
        animate={{
          y: shouldHighlight(1) ? -4 : -5,
        }}
        transition={config}
      >
        <Male
          isSelection={true}
          onClick={() => {
            setAvatar(1)
            play()
          }}
          onPointerOver={() => setHoveredAvatar(1)}
          onPointerOut={() => setHoveredAvatar(null)}
          position={[-8, 0, -20]}
          rotation={[0, 0.5, 0]}
        />
        <motion.pointLight
          position={[-10, 5, -20]}
          distance={30}
          // @ts-ignore
          intensity={brightness1}
          color="#d106ff"
        />
      </motion.group>
      <motion.group
        animate={{
          y: shouldHighlight(2) ? -4 : -5,
        }}
        transition={config}
      >
        <Woman
          isSelection={true}
          onClick={() => {
            setAvatar(2)
            play()
          }}
          onPointerOver={() => setHoveredAvatar(2)}
          onPointerOut={() => setHoveredAvatar(null)}
          position={[8, 0, -20]}
          rotation={[0, -0.5, 0]}
        />
        <motion.pointLight
          position={[10, 15, -19]}
          distance={30}
          // @ts-ignore
          intensity={brightness2}
          color="#d106ff"
        />
      </motion.group>
    </>
  )
}
