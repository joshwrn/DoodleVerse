import { useBox } from '@react-three/cannon'
import { Mesh } from 'three'
import { useAddPhysicsObject } from '@/hooks/useAddPhysicsObject'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const boxSize: [x: number, y: number, z: number] = [150, 20, 10]
const boxSize2: [x: number, y: number, z: number] = [100, 20, 10]
const groundSize: [x: number, y: number, z: number] = [148, 1, 78]

export const Ground = (): React.ReactElement => {
  const [ref] = useBox<Mesh>(() => ({
    rotation: [0, 0, 0],
    position: [75, -8, -20],
    args: groundSize,
    type: `Static`,
  }))
  const props = useTexture(
    {
      map: 'marble-texture/Marble_White_006_basecolor.jpg',
      displacementMap: 'marble-texture/Marble_White_006_height.png',
      normalMap: 'marble-texture/Marble_White_006_normal.jpg',
      roughnessMap: 'marble-texture/Marble_White_006_roughness.jpg',
      aoMap: 'marble-texture/Marble_White_006_ambientOcclusion.jpg',
    },
    (textures) => {
      for (const texture of Object.values(textures)) {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(8, 8)
      }
    }
  )

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
      <mesh ref={ref} scale={groundSize} castShadow receiveShadow>
        <boxGeometry />
        <meshBasicMaterial
          attach="material"
          // {...props}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={boxRef1} scale={boxSize} />
      <mesh ref={boxRef2} scale={boxSize} />
      <mesh ref={boxRef3} scale={boxSize2} />
      <mesh ref={boxRef4} scale={boxSize2} />
    </>
  )
}
