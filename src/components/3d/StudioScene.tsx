import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { StudioLighting } from './StudioLighting';
import { TShirtModel } from './TShirtModel';
import { ViewportOverlay } from './ViewportOverlay';
import { useSceneStore } from '../../store/sceneStore';

// Camera controller helper to smoothly reposition camera on preset changes
const CameraManager: React.FC = () => {
  const { camera } = useThree();
  const cameraPreset = useSceneStore((s) => s.cameraPreset);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    let targetPos = new THREE.Vector3(0, 0, 2.6);
    let lookTarget = new THREE.Vector3(0, -0.05, 0);

    switch (cameraPreset) {
      case 'front':
        targetPos.set(0, 0, 2.6);
        break;
      case 'back':
        targetPos.set(0, 0, -2.6);
        break;
      case 'sleeve_left':
        targetPos.set(-2.2, 0.1, 1.4);
        break;
      case 'sleeve_right':
        targetPos.set(2.2, 0.1, 1.4);
        break;
      case 'isometric':
        targetPos.set(1.8, 1.2, 2.2);
        break;
      case 'hero':
        targetPos.set(1.5, -0.2, 2.0);
        break;
    }

    camera.position.set(targetPos.x, targetPos.y, targetPos.z);
    camera.lookAt(lookTarget);
    if (controlsRef.current) {
      controlsRef.current.target.copy(lookTarget);
      controlsRef.current.update();
    }
  }, [cameraPreset, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.06}
      minDistance={1.2}
      maxDistance={6.0}
      maxPolarAngle={Math.PI * 0.9}
      minPolarAngle={0.1}
    />
  );
};

interface StudioSceneProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const StudioScene: React.FC<StudioSceneProps> = ({ canvasRef }) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        ref={canvasRef as any}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <CameraManager />
          <StudioLighting />

          {/* 3D GLB Garment Model with subtle organic float */}
          <Float
            speed={1.0}
            rotationIntensity={0.05}
            floatIntensity={0.08}
            floatingRange={[-0.03, 0.03]}
          >
            <TShirtModel />
          </Float>

          {/* Soft Contact Ground Shadows */}
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.65}
            scale={4}
            blur={2.0}
            far={3}
            color="#000000"
          />
        </Suspense>
      </Canvas>

      {/* Floating Viewport Overlay */}
      <ViewportOverlay />
    </div>
  );
};
