import { styled } from 'styled-components'

const COLORS = ['#7700b3', '#00b3ff']

const GradientPart1 = styled.div`
  z-index: 0;
  position: absolute;
  bottom: 95vh;
  right: -10vh;
  width: 45vw;
  height: 70vh;
  background: ${COLORS[0]};
  filter: blur(512px);
`
const GradientPart2 = styled.div`
  z-index: 0;
  position: absolute;
  top: 115vh;
  left: -25vh;
  width: 90vw;
  height: 70vh;
  background: ${COLORS[1]};
  filter: blur(512px);
`

export const Gradients = () => {
  return (
    <>
      <GradientPart1 />
      <GradientPart2 />
    </>
  )
}

export const GradientLighting = () => {
  return (
    <>
      <pointLight
        color={'#d7fcff'}
        castShadow
        position={[100, 80, 20]}
        intensity={0.5}
      />
      <hemisphereLight
        intensity={3}
        color={COLORS[0]}
        groundColor={COLORS[1]}
      />
    </>
  )
}
