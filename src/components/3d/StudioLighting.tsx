import React from 'react';
import { useSceneStore } from '../../store/sceneStore';

export const StudioLighting: React.FC = () => {
  const lightingPreset = useSceneStore((s) => s.lightingPreset);

  switch (lightingPreset) {
    case 'warm_sunset':
      return (
        <>
          <ambientLight intensity={0.7} color="#FFF1E0" />
          <directionalLight position={[4, 5, 4]} intensity={1.8} color="#FF9E4A" castShadow shadow-mapSize={2048} />
          <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#9060EB" />
          <pointLight position={[0, -2, 3]} intensity={0.4} color="#FFAA5A" />
        </>
      );

    case 'cyber_neon':
      return (
        <>
          <ambientLight intensity={0.4} color="#10142A" />
          <directionalLight position={[-4, 4, 3]} intensity={2.2} color="#00F0FF" castShadow shadow-mapSize={2048} />
          <directionalLight position={[4, 2, -2]} intensity={2.0} color="#FF007F" />
          <pointLight position={[0, 3, 2]} intensity={0.8} color="#9D00FF" />
        </>
      );

    case 'daylight':
      return (
        <>
          <ambientLight intensity={1.1} color="#FFFFFF" />
          <directionalLight position={[3, 6, 4]} intensity={2.0} color="#FFFFFF" castShadow shadow-mapSize={2048} />
          <directionalLight position={[-3, 3, -3]} intensity={0.6} color="#E0F2FE" />
        </>
      );

    case 'dramatic':
      return (
        <>
          <ambientLight intensity={0.25} color="#1E293B" />
          <directionalLight position={[5, 6, 2]} intensity={3.0} color="#FFFFFF" castShadow shadow-mapSize={2048} />
          <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#3B82F6" />
        </>
      );

    case 'studio_clean':
    default:
      return (
        <>
          <ambientLight intensity={0.85} color="#FFFFFF" />
          <directionalLight position={[4, 5, 5]} intensity={1.5} color="#FFFFFF" castShadow shadow-mapSize={2048} />
          <directionalLight position={[-4, 3, 3]} intensity={0.9} color="#F1F5F9" />
          <directionalLight position={[0, -2, -4]} intensity={0.7} color="#CBD5E1" />
        </>
      );
  }
};
