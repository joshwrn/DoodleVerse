import type { FC } from 'react'

export const Railing: FC = () => {
  return (
    <mesh scale={[100, 2, 1]} position={[50, 1, 0]}>
      <boxGeometry />
      <meshPhysicalMaterial
        color="rgb(156, 156, 156)"
        metalness={0}
        roughness={6}
        attach="material"
      />
    </mesh>
  )
}
