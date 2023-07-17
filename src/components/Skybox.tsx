import { useThree } from '@react-three/fiber'
import { CubeTextureLoader } from 'three'

export function SkyBox() {
  const { scene } = useThree()
  const loader = new CubeTextureLoader()
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    'skybox/px.png',
    'skybox/nx.png',

    'skybox/py.png',
    'skybox/ny.png',

    'skybox/pz.png',
    'skybox/nz.png',
  ])

  // Set the scene background property to the resulting texture.
  if (!scene.background) {
    scene.background = texture
  }

  return null
}
