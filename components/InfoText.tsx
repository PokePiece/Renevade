import { Text } from '@react-three/drei'
import { Suspense } from 'react'

export default function InfoText() {
  return (
    <Suspense fallback={null}>
      <group position={[0, 3.5, 0]}>
        <Text
          position={[0, 1, 0]}
          fontSize={1}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          Webspace
        </Text>

        <Text
          position={[0, 0, 0]}
          fontSize={0.8}
          color="lightblue"
          anchorX="center"
          anchorY="middle"
        >
          From Heaven Brought Down
        </Text>

        <Text
          position={[0, -0.7, 0]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          A webspace.
        </Text>
      </group>
    </Suspense>
  )
}
