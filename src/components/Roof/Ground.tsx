import { useBox, usePlane } from '@react-three/cannon'
import { Mesh } from 'three'
import { useAddPhysicsObject } from '@/hooks/useAddPhysicsObject'

export const Ground = (): React.ReactElement => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [100, -7, 0],
    type: `Static`,
  }))
  const boxSize: [x: number, y: number, z: number] = [150, 20, 10]
  const boxSize2: [x: number, y: number, z: number] = [100, 20, 10]
  const [boxRef1] = useBox<Mesh>(() => ({
    args: boxSize,
    position: [75, 5, -70],
  }))
  const [boxRef2] = useBox<Mesh>(() => ({
    args: boxSize,
    position: [75, 5, 30],
  }))
  const [boxRef3] = useBox<Mesh>(() => ({
    args: boxSize2,
    position: [160, 5, -25],
    rotation: [0, Math.PI / 2, 0],
  }))
  const [boxRef4] = useBox<Mesh>(() => ({
    args: boxSize2,
    position: [-10, 5, -25],
    rotation: [0, Math.PI / 2, 0],
  }))
  useAddPhysicsObject({ ref })
  return (
    <>
      <mesh ref={ref} scale={250}>
        <planeGeometry />
        <meshBasicMaterial attach="material" transparent opacity={0} />
      </mesh>
      <mesh ref={boxRef1} scale={boxSize} />
      <mesh ref={boxRef2} scale={boxSize} />
      <mesh ref={boxRef3} scale={boxSize2} />
      <mesh ref={boxRef4} scale={boxSize2} />
    </>
  )
}
