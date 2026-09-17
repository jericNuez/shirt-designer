import * as THREE from 'three';

/**
 * Generates a photorealistic cotton fabric normal map procedurally
 */
export function generateFabricTexture(): {
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 512;
  
  // 1. Normal Map Canvas (fine cross-hatch fabric weave)
  const nCanvas = document.createElement('canvas');
  nCanvas.width = size;
  nCanvas.height = size;
  const nCtx = nCanvas.getContext('2d');
  
  if (nCtx) {
    const imgData = nCtx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        
        // Fine thread pattern
        const freq = 0.5;
        const weave1 = Math.sin(x * freq) * Math.cos(y * freq);
        const weave2 = Math.cos((x + y) * freq * 0.5) * 0.5;
        const noise = (Math.random() - 0.5) * 0.15;
        
        const total = (weave1 + weave2 + noise) * 0.5;
        
        // Normal vectors: RGB mapped from [-1..1] to [0..255]
        const nx = Math.sin(total * Math.PI) * 0.5 + 0.5;
        const ny = Math.cos(total * Math.PI) * 0.5 + 0.5;
        const nz = 0.9;
        
        imgData.data[i] = Math.floor(nx * 255);
        imgData.data[i + 1] = Math.floor(ny * 255);
        imgData.data[i + 2] = Math.floor(nz * 255);
        imgData.data[i + 3] = 255;
      }
    }
    nCtx.putImageData(imgData, 0, 0);
  }
  
  const normalMap = new THREE.CanvasTexture(nCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(16, 16);

  // 2. Roughness Map
  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d');
  if (rCtx) {
    rCtx.fillStyle = '#b0b0b0';
    rCtx.fillRect(0, 0, size, size);
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 2;
      rCtx.fillStyle = Math.random() > 0.5 ? '#cccccc' : '#909090';
      rCtx.beginPath();
      rCtx.arc(x, y, r, 0, Math.PI * 2);
      rCtx.fill();
    }
  }

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(16, 16);

  return { normalMap, roughnessMap };
}

/**
 * Creates high quality T-shirt geometry components: Body, Collar, Left Sleeve, Right Sleeve.
 */
export function createTShirtGeometries() {
  // Body Mesh (Smooth tailored torso)
  const bodyShape = new THREE.Shape();
  
  // Define T-shirt body outline profile
  const wTop = 1.35;    // Shoulder width half
  const wChest = 1.25;  // Chest width half
  const wWaist = 1.15;  // Waist width half
  const wBottom = 1.25; // Bottom hem width half
  const hTop = 1.65;    // Shoulder height
  const hNeck = 1.35;   // Front neck drop
  const hBottom = -1.6; // Bottom hem

  // Front curve
  bodyShape.moveTo(-0.45, hNeck);
  bodyShape.quadraticCurveTo(0, hNeck - 0.25, 0.45, hNeck); // Neckline scoop
  bodyShape.lineTo(wTop, hTop);                              // Right shoulder
  bodyShape.quadraticCurveTo(wChest + 0.05, 0.8, wChest, 0.5); // Underarm
  bodyShape.quadraticCurveTo(wWaist, -0.5, wBottom, hBottom);  // Right side torso
  bodyShape.quadraticCurveTo(0, hBottom - 0.08, -wBottom, hBottom); // Bottom hem curve
  bodyShape.quadraticCurveTo(-wWaist, -0.5, -wChest, 0.5);   // Left side torso
  bodyShape.quadraticCurveTo(-wChest - 0.05, 0.8, -wTop, hTop); // Left underarm
  bodyShape.lineTo(-0.45, hNeck);                            // Left shoulder to neck

  // Extrude with smooth bevel to create 3D garment volume
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 6,
    depth: 0.52,
    bevelEnabled: true,
    bevelThickness: 0.18,
    bevelSize: 0.12,
    bevelOffset: 0,
    bevelSegments: 8,
  };

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
  bodyGeo.center();
  bodyGeo.computeVertexNormals();

  // Collar Neckband (Toroid ribbon)
  const collarGeo = new THREE.TorusGeometry(0.55, 0.065, 16, 48);
  collarGeo.scale(1.0, 0.7, 1.2);
  collarGeo.rotateX(Math.PI * 0.42);
  collarGeo.translate(0, 1.28, 0.04);
  collarGeo.computeVertexNormals();

  // Sleeves - Left
  const sleeveLeftGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.9, 32, 4, true);
  sleeveLeftGeo.rotateZ(Math.PI * 0.22);
  sleeveLeftGeo.rotateX(Math.PI * 0.05);
  sleeveLeftGeo.translate(-1.48, 0.95, 0);
  sleeveLeftGeo.computeVertexNormals();

  // Sleeves - Right
  const sleeveRightGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.9, 32, 4, true);
  sleeveRightGeo.rotateZ(-Math.PI * 0.22);
  sleeveRightGeo.rotateX(Math.PI * 0.05);
  sleeveRightGeo.translate(1.48, 0.95, 0);
  sleeveRightGeo.computeVertexNormals();

  // Bottom Hem Ring
  const hemGeo = new THREE.TorusGeometry(1.26, 0.04, 12, 48);
  hemGeo.scale(1.0, 0.45, 1.0);
  hemGeo.rotateX(Math.PI * 0.5);
  hemGeo.translate(0, -1.68, 0);
  hemGeo.computeVertexNormals();

  return {
    bodyGeo,
    collarGeo,
    sleeveLeftGeo,
    sleeveRightGeo,
    hemGeo,
  };
}
