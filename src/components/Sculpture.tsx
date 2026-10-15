import { Component, type ErrorInfo, type ReactNode, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function SculptureMesh() {
  const group = useRef<THREE.Group>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('pointermove', updatePointer, { passive: true })
    return () => window.removeEventListener('pointermove', updatePointer)
  }, [])

  useFrame((state) => {
    if (!group.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      reduced ? 0.22 : pointer.x * 0.28 + state.clock.elapsedTime * 0.12,
      0.05,
    )
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, reduced ? -0.15 : -pointer.y * 0.16, 0.05)
  })

  return (
    <group ref={group} rotation={[-0.1, 0.25, 0]}>
      <Float speed={1.45} rotationIntensity={0.38} floatIntensity={0.56}>
        <mesh castShadow receiveShadow rotation={[0.45, 0.16, -0.55]}>
          <torusKnotGeometry args={[1.04, 0.3, 250, 32, 3, 5]} />
          <MeshDistortMaterial color="#1c1c1b" metalness={0.87} roughness={0.16} distort={0.14} speed={1.1} />
        </mesh>
        <mesh position={[0.1, 0.04, -0.28]} scale={0.66} rotation={[0.1, -0.6, 0.2]}>
          <icosahedronGeometry args={[1, 3]} />
          <meshPhysicalMaterial color="#f4f1ea" metalness={0.3} roughness={0.08} transmission={0.13} thickness={1.2} />
        </mesh>
        <mesh position={[-0.8, 0.76, 0.44]} scale={0.2}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial color="#b2aea5" metalness={1} roughness={0.11} />
        </mesh>
      </Float>
    </group>
  )
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(_error: Error, _info: ErrorInfo) {}
  render() { return this.state.failed ? <FallbackArt /> : this.props.children }
}

function FallbackArt() {
  return <div className="sculpture-fallback" aria-label="Abstract metallic sculpture"><span /><i /><b /></div>
}

export default function Sculpture() {
  return (
    <SceneBoundary>
      <div className="sculpture" role="img" aria-label="Interactive abstract metallic 3D sculpture">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.7], fov: 42 }} shadows gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={null}>
            <ambientLight intensity={1.5} />
            <spotLight position={[3.5, 5, 4]} intensity={3.3} angle={0.48} penumbra={0.85} castShadow />
            <pointLight position={[-4, -2, 2]} intensity={1.3} color="#d7d2c7" />
            <SculptureMesh />
            <ContactShadows position={[0, -1.55, 0]} opacity={0.3} scale={5.8} blur={2.8} far={3} />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>
    </SceneBoundary>
  )
}
