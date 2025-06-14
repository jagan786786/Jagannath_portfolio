"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"

function Stars(props: any) {
  const ref = useRef<any>()

  // Generate points manually to avoid NaN issues
  const points = useMemo(() => {
    const positions = new Float32Array(3000 * 3) // Reduced count for better performance
    for (let i = 0; i < 3000; i++) {
      // Generate random points in a sphere using proper spherical coordinates
      const radius = Math.random() * 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10
      ref.current.rotation.y -= delta / 15
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#60a5fa" size={0.003} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  )
}

function FloatingCube() {
  const meshRef = useRef<any>()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[3, 0, -2]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#60a5fa" wireframe />
    </mesh>
  )
}

function FloatingSphere() {
  const meshRef = useRef<any>()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 1.2) * 0.15
    }
  })

  return (
    <mesh ref={meshRef} position={[-3, 0, -2]}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial color="#a855f7" wireframe />
    </mesh>
  )
}

function FloatingTorus() {
  const meshRef = useRef<any>()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 2, -3]}>
      <torusGeometry args={[0.3, 0.1, 16, 100]} />
      <meshStandardMaterial color="#10b981" wireframe />
    </mesh>
  )
}

export default function Hero() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />
      <Stars />
      <FloatingCube />
      <FloatingSphere />
      <FloatingTorus />
    </>
  )
}
