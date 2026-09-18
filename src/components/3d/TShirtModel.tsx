import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Decal } from '@react-three/drei';
import { useEditorStore } from '../../store/editorStore';
import { useSceneStore } from '../../store/sceneStore';
import { renderLayersToCanvas } from '../../utils/canvasRenderer';

export const TShirtModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Load user's GLB model
  const { nodes, materials } = useGLTF('/models/shirt_model.glb') as any;

  // Store subscriptions
  const colors = useEditorStore((s) => s.colors);
  const fabric = useEditorStore((s) => s.fabric);
  const layers = useEditorStore((s) => s.layers);

  const isTurntableActive = useSceneStore((s) => s.isTurntableActive);
  const turntableSpeed = useSceneStore((s) => s.turntableSpeed);
  const wireframe = useSceneStore((s) => s.wireframe);

  const shirtMesh = nodes?.T_Shirt_male || Object.values(nodes).find((n: any) => (n as any).isMesh);

  // Update material color, roughness, metalness, and wireframe
  useEffect(() => {
    if (materials?.lambert1) {
      materials.lambert1.color = new THREE.Color(colors.body);
      materials.lambert1.roughness = fabric.roughness;
      materials.lambert1.metalness = fabric.metalness;
      materials.lambert1.wireframe = wireframe;
      materials.lambert1.side = THREE.DoubleSide;
      materials.lambert1.needsUpdate = true;
    }
  }, [colors.body, fabric, wireframe, materials]);

  // Offscreen canvases for dynamic textures
  const canvases = useMemo(() => {
    const size = 1024;
    const create = () => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      return c;
    };
    return {
      front: create(),
      back: create(),
      sleeve_left: create(),
      sleeve_right: create(),
    };
  }, []);

  // Three.js Canvas Textures
  const textures = useMemo(() => {
    return {
      front: new THREE.CanvasTexture(canvases.front),
      back: new THREE.CanvasTexture(canvases.back),
      sleeve_left: new THREE.CanvasTexture(canvases.sleeve_left),
      sleeve_right: new THREE.CanvasTexture(canvases.sleeve_right),
    };
  }, [canvases]);

  // Configure texture properties for sharp decals
  useEffect(() => {
    Object.values(textures).forEach((tex) => {
      tex.anisotropy = 16;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });
  }, [textures]);

  // Track previous layers state per zone to prevent redundant redraws
  const prevZoneLayersRef = useRef<Record<string, string>>({});

  // Re-render canvases only for modified zones
  useEffect(() => {
    const zones: ('front' | 'back' | 'sleeve_left' | 'sleeve_right')[] = [
      'front',
      'back',
      'sleeve_left',
      'sleeve_right',
    ];

    zones.forEach(async (zone) => {
      const zoneLayers = layers.filter((l) => l.zone === zone && l.visible);
      const zoneKey = JSON.stringify(
        zoneLayers.map((l) => `${l.id}-${l.x}-${l.y}-${l.scale}-${l.rotation}-${l.opacity}`)
      );

      if (prevZoneLayersRef.current[zone] === zoneKey) {
        return;
      }
      prevZoneLayersRef.current[zone] = zoneKey;

      const canvas = canvases[zone];
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      await renderLayersToCanvas(ctx, zoneLayers, canvas.width, canvas.height);
      textures[zone].needsUpdate = true;
    });
  }, [layers, canvases, textures]);

  // Turntable animation frame
  useFrame((_, delta) => {
    if (isTurntableActive && groupRef.current) {
      groupRef.current.rotation.y += delta * turntableSpeed * 0.8;
    }
  });

  const hasFront = layers.some((l) => l.zone === 'front' && l.visible);
  const hasBack = layers.some((l) => l.zone === 'back' && l.visible);
  const hasLeftSleeve = layers.some((l) => l.zone === 'sleeve_left' && l.visible);
  const hasRightSleeve = layers.some((l) => l.zone === 'sleeve_right' && l.visible);

  if (!shirtMesh) {
    return null;
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={2.8} dispose={null}>
      <mesh castShadow receiveShadow geometry={shirtMesh.geometry} material={materials.lambert1}>
        {/* Front Chest Decal */}
        {hasFront && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.26}
            map={textures.front}
          />
        )}

        {/* Back Print Decal */}
        {hasBack && (
          <Decal
            position={[0, 0.04, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={0.26}
            map={textures.back}
          />
        )}

        {/* Left Sleeve Decal */}
        {hasLeftSleeve && (
          <Decal
            position={[-0.23, 0.08, 0.02]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={0.14}
            map={textures.sleeve_left}
          />
        )}

        {/* Right Sleeve Decal */}
        {hasRightSleeve && (
          <Decal
            position={[0.23, 0.08, 0.02]}
            rotation={[0, Math.PI / 2, 0]}
            scale={0.14}
            map={textures.sleeve_right}
          />
        )}
      </mesh>
    </group>
  );
};

// Preload the GLB model
useGLTF.preload('/models/shirt_model.glb');
