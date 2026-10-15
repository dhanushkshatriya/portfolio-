import { Component, type ErrorInfo, type ReactNode, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, MeshDistortMaterial, PresentationControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

type ZoneId = 'core' | 'security' | 'web' | 'ai'

const zones: Record<ZoneId, { number: string; title: string; detail: string }> = {
  core: { number: '00', title: 'Dhanush R. — World', detail: 'Drag the world. Select an orbit to explore what I build.' },
  security: { number: '01', title: 'Security orbit', detail: 'Tools and prototypes that investigate safer digital systems.' },
  web: { number: '02', title: 'Web orbit', detail: 'Interfaces shaped around clarity, flow, and practical use.' },
  ai: { number: '03', title: 'AI orbit', detail: 'Experiments that turn analysis, learning, and ideas into interaction.' },
}

function Zone({ id, position, active, onSelect, children }: { id: ZoneId; position: [number, number, number]; active: ZoneId; onSelect: (id: ZoneId) => void; children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const isActive = active === id
  useFrame((_, delta) => {
    if (!group.current) return
    const scale = isActive ? 1.13 : 1
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), Math.min(delta * 6, 1))
  })
  return <group ref={group} position={position} onClick={(event) => { event.stopPropagation(); onSelect(id) }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>{children}</group>
}

function WorldObjects({ active, onSelect }: { active: ZoneId; onSelect: (id: ZoneId) => void }) {
  const root = useRef<THREE.Group>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const move = (event: PointerEvent) => setPointer({ x: (event.clientX / window.innerWidth - 0.5) * 2, y: (event.clientY / window.innerHeight - 0.5) * 2 })
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useFrame((state) => {
    if (!root.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, reduced ? -0.2 : pointer.x * 0.13 - 0.2, 0.025)
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, reduced ? -0.08 : -pointer.y * 0.045 - 0.08, 0.025)
    if (!reduced) root.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.045
  })

  return <group ref={root}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.42, 0]} receiveShadow>
      <planeGeometry args={[13, 13, 1, 1]} />
      <meshStandardMaterial color="#e8e5dc" metalness={0.08} roughness={0.72} />
    </mesh>
    <gridHelper args={[12, 24, '#bab6ad', '#d6d2c9']} position={[0, -1.405, 0]} />
    <mesh rotation={[-Math.PI / 2, 0.12, 0]} position={[0, -1.37, 0]}>
      <torusGeometry args={[3.18, 0.017, 8, 100]} />
      <meshBasicMaterial color="#747168" transparent opacity={0.6} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, -0.8, 0]} position={[0, -1.35, 0]}>
      <torusGeometry args={[2.1, 0.01, 8, 100]} />
      <meshBasicMaterial color="#aaa69d" transparent opacity={0.76} />
    </mesh>

    <Zone id="core" active={active} onSelect={onSelect} position={[0, -0.25, 0]}>
      <Float speed={1.15} rotationIntensity={0.25} floatIntensity={0.34}>
        <RoundedBox args={[1.48, 1.1, 1.48]} radius={0.12} smoothness={5} castShadow>
          <meshPhysicalMaterial color="#1f1f1d" metalness={0.88} roughness={0.17} clearcoat={0.72} />
        </RoundedBox>
        <mesh position={[0, 0.79, 0]} rotation={[0.16, 0.4, 0]} castShadow>
          <icosahedronGeometry args={[0.64, 3]} />
          <MeshDistortMaterial color="#f0ece4" metalness={0.46} roughness={0.12} distort={0.17} speed={1.15} />
        </mesh>
        <mesh position={[0, 0.85, 0]} scale={0.5}>
          <sphereGeometry args={[1, 36, 36]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.74} roughness={0.04} thickness={1.1} />
        </mesh>
      </Float>
    </Zone>

    <Zone id="security" active={active} onSelect={onSelect} position={[-2.44, -0.76, 0.35]}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.24}>
        <RoundedBox args={[1.05, 0.65, 1.05]} radius={0.08} smoothness={4} castShadow>
          <meshStandardMaterial color={active === 'security' ? '#4a4944' : '#77736b'} metalness={0.62} roughness={0.31} />
        </RoundedBox>
        <mesh position={[0, 0.58, 0]} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.36, 1]} />
          <meshStandardMaterial color="#d8d4ca" metalness={0.84} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.54, 0.025, 8, 48]} />
          <meshBasicMaterial color="#f8f7f1" />
        </mesh>
      </Float>
    </Zone>

    <Zone id="web" active={active} onSelect={onSelect} position={[2.3, -0.85, 0.2]}>
      <Float speed={1.25} rotationIntensity={0.18} floatIntensity={0.31}>
        <RoundedBox args={[1.18, 0.52, 1.18]} radius={0.1} smoothness={4} castShadow>
          <meshStandardMaterial color={active === 'web' ? '#363633' : '#aaa69d'} metalness={0.53} roughness={0.22} />
        </RoundedBox>
        <mesh position={[0, 0.56, 0]} rotation={[-0.18, -0.22, 0.07]}>
          <boxGeometry args={[0.78, 0.56, 0.07]} />
          <meshStandardMaterial color="#eeeeea" metalness={0.32} roughness={0.12} />
        </mesh>
        <mesh position={[0, 0.56, 0.07]}>
          <planeGeometry args={[0.56, 0.07]} />
          <meshBasicMaterial color="#343330" />
        </mesh>
      </Float>
    </Zone>

    <Zone id="ai" active={active} onSelect={onSelect} position={[0.68, -0.96, -2.25]}>
      <Float speed={1.6} rotationIntensity={0.28} floatIntensity={0.36}>
        <RoundedBox args={[0.94, 0.48, 0.94]} radius={0.1} smoothness={4} castShadow>
          <meshStandardMaterial color={active === 'ai' ? '#5b5952' : '#89857c'} metalness={0.6} roughness={0.26} />
        </RoundedBox>
        <mesh position={[0, 0.56, 0]} rotation={[0.2, 0.25, 0]}>
          <dodecahedronGeometry args={[0.36, 1]} />
          <meshPhysicalMaterial color="#f1eee7" metalness={0.33} roughness={0.11} transmission={0.2} />
        </mesh>
      </Float>
    </Zone>
  </group>
}

function WorldScene() {
  const [active, setActive] = useState<ZoneId>('core')
  return <div className="world-shell">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2.6, 7.1], fov: 43 }} shadows gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={1.8} />
        <hemisphereLight args={['#ffffff', '#6e6a61', 1.6]} />
        <directionalLight position={[5, 7, 4]} intensity={2.8} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-5, 2, 1]} intensity={1.25} color="#ded9cf" />
        <PresentationControls global rotation={[-0.08, -0.3, 0]} polar={[-0.28, 0.16]} azimuth={[-0.72, 0.5]} speed={1.08} damping={0.14} snap>
          <WorldObjects active={active} onSelect={setActive} />
        </PresentationControls>
        <ContactShadows position={[0, -1.38, 0]} opacity={0.38} scale={11} blur={2.5} far={3.8} />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
    <div className="world-readout"><span>{zones[active].number}</span><div><strong>{zones[active].title}</strong><p>{zones[active].detail}</p></div></div>
    <div className="world-nav" aria-label="Explore portfolio world">{(Object.keys(zones) as ZoneId[]).map((zone) => <button key={zone} className={active === zone ? 'active' : ''} onClick={() => setActive(zone)} aria-pressed={active === zone}><span />{zones[zone].title.replace(' — World', '')}</button>)}</div>
    <p className="world-hint">Drag to orbit <span>↗</span> Select a node</p>
  </div>
}

class WorldBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(_error: Error, _info: ErrorInfo) {}
  render() { return this.state.failed ? <WorldFallback /> : this.props.children }
}

function WorldFallback() {
  return <div className="world-fallback" aria-label="Abstract project world"><span /><i /><b /><em /></div>
}

export default function PortfolioWorld() {
  return <WorldBoundary><WorldScene /></WorldBoundary>
}
