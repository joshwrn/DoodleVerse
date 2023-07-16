import { usePlane } from '@react-three/cannon'
import { Mesh } from 'three'
import { useAddPhysicsObject } from '@/hooks/useAddPhysicsObject'

export const Ground = (): React.ReactElement => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [100, 0, 0],
    type: `Static`,
  }))
  useAddPhysicsObject({ ref })
  return (
    <mesh ref={ref} receiveShadow scale={250}>
      <planeGeometry />
      <meshStandardMaterial
        color="rgb(156, 156, 156)"
        metalness={0}
        roughness={6}
        attach="material"
      />
    </mesh>
  )
}
