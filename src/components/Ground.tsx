import { useEffect } from 'react'
import { usePlane } from '@react-three/cannon'
import { Mesh } from 'three'
import { useObjectStore } from '@/state/objects/objects'

export const Ground = (): React.ReactElement => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [100, 0, 0],
  }))
  const { addObject } = useObjectStore()

  useEffect(() => {
    if (!ref.current) return
    addObject(ref.current)
  }, [ref])

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial
        color="rgb(48, 74, 52)"
        metalness={0}
        roughness={6}
        attach="material"
      />
    </mesh>
  )
}
