import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows, Decal } from '@react-three/drei';
import * as THREE from 'three';
import { useEditorStore } from '../../store/editorStore';

const AnimatedTShirt: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { nodes, materials } = useGLTF('/models/shirt_model.glb') as any;
  const colors = useEditorStore((s) => s.colors);

  // Mouse tracking state for parallax tilt
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollOffset = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to [-1..1]
      mousePos.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollOffset.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Update material color
  useEffect(() => {
    if (materials?.lambert1) {
      materials.lambert1.color = new THREE.Color(colors.body || '#111827');
      materials.lambert1.roughness = 0.75;
      materials.lambert1.metalness = 0.1;
      materials.lambert1.side = THREE.DoubleSide;
      materials.lambert1.needsUpdate = true;
    }
  }, [colors.body, materials]);

  // Smooth lerp animation loop on frame
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth lerp for mouse parallax
    mousePos.current.x = THREE.MathUtils.lerp(mousePos.current.x, mousePos.current.targetX, 0.06);
    mousePos.current.y = THREE.MathUtils.lerp(mousePos.current.y, mousePos.current.targetY, 0.06);

    // Scroll rotation factor
    const scrollRotY = scrollOffset.current * 0.003;
    const scrollPosZ = THREE.MathUtils.clamp(scrollOffset.current * 0.001, 0, 0.5);

    // Target rotation based on mouse + scroll + subtle continuous drift
    const time = state.clock.getElapsedTime();
    const targetRotX = mousePos.current.y * 0.35 + Math.sin(time * 0.8) * 0.05;
    const targetRotY = mousePos.current.x * 0.75 + scrollRotY + Math.sin(time * 0.5) * 0.15;
    const targetRotZ = -mousePos.current.x * 0.15;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.08);

    // Subtle scale breathing & vertical float
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.06;
    groupRef.current.position.z = -scrollPosZ;
  });

  const shirtMesh = nodes?.T_Shirt_male || Object.values(nodes).find((n: any) => (n as any).isMesh);

  if (!shirtMesh) return null;

  return (
    <group ref={groupRef} scale={2.85} position={[0, 0, 0]}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={shirtMesh.geometry}
        material={materials.lambert1}
      />
    </group>
  );
};

export const HeroAnimatedShirt: React.FC = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 2.7], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Dynamic Studio Lighting */}
          <ambientLight intensity={0.9} color="#ffffff" />
          <directionalLight position={[4, 5, 5]} intensity={2.0} color="#ffffff" castShadow shadow-mapSize={1024} />
          <directionalLight position={[-4, 3, 2]} intensity={1.2} color="#a5b4fc" />
          <directionalLight position={[0, -3, -4]} intensity={0.8} color="#f43f5e" />
          <pointLight position={[0, 2, 2]} intensity={1.0} color="#ffffff" />

          {/* Interactive Animated Shirt */}
          <AnimatedTShirt />

          {/* Ground shadow plane */}
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.7}
            scale={4.2}
            blur={2.2}
            far={3.5}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload('/models/shirt_model.glb');
