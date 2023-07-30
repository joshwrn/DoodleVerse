import { Player, usePlayerStore } from '@/state/settings/player'
import type { FC } from 'react'
import React from 'react'
import { Male } from './Avatar/Male'
import { Woman } from './Avatar/Female'

const OtherPlayer = ({ player }: { player: Player }) => {
  return (
    <group
      rotation={[0, player.rotationY, 0]}
      position={[player.position.x, 0, player.position.z]}
    >
      {player.avatar === 1 && (
        <Male brushColor={player.brushColor} isSelection={false} />
      )}
      {player.avatar === 2 && (
        <Woman brushColor={player.brushColor} isSelection={false} />
      )}
    </group>
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

export const DebugPlayers = () => {
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
          {player.userId} - {player.position.x} - {player.position.z}
        </div>
      ))}
    </div>
  )
}
