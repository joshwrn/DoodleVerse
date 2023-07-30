import { Player, usePlayerStore } from '@/state/settings/player'
import type { FC } from 'react'
import React from 'react'

const OtherPlayer = ({ player }: { player: Player }) => {
  return (
    <mesh
      rotation={[0, player.rotationY, 0]}
      position={[player.position.x, 0, player.position.z]}
    >
      <boxGeometry args={[5, 5, 5]} />
      <meshBasicMaterial color={player.brushColor} />
    </mesh>
  )
}

export const OtherPlayers: FC = () => {
  const otherPlayers = usePlayerStore((s) => s.otherPlayers)
  return (
    <>
      {otherPlayers.map((player) => (
        <OtherPlayer key={player.userId} player={player} />
      ))}
    </>
  )
}

export const OtherPlayers2 = () => {
  const { otherPlayers, id } = usePlayerStore((s) => ({
    otherPlayers: s.otherPlayers,
    id: s.userId,
  }))
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'white',
        zIndex: 1000,
      }}
    >
      <p>this id: {id}</p>
      {otherPlayers.map((player) => (
        <div key={player.userId}>
          {player.userId} - {player.rotationY}
        </div>
      ))}
    </div>
  )
}
