// ─────────────────────────────────────────────
//  Kitchen.tsx — Stylized Realistic Diorama Kitchen with Wood Grain & Metal PBR Textures
// ─────────────────────────────────────────────
import { useMemo } from 'react';
import type * as THREE from 'three';
import { getWoodGrainTexture, getBrushedMetalTexture } from '../utils/textures';

// ── Low-Poly Palette ─────────────────────────
const C = {
  pedestal:    '#d7b89c',
  floorPlank1: '#e4b684',
  floorPlank2: '#d8a56f',
  mat:         '#fcf6e8',
  walls:       '#f7f2ea',
  wallTrim:    '#ebdccb',
  cabinetMint: '#79b896',
  cabinetDark: '#609a7a',
  counterTop:  '#fdfbf7',
  woodTable:   '#a37346',
  woodLeg:     '#805630',
  shelf:       '#c8a27a',
  fridgeMint:  '#74b490',
  sinkCeramic: '#ffffff',
  faucetBrass: '#bfa15f',
  stoveBody:   '#f4f1ea',
  stoveGrate:  '#3d3d3d',
  windowFrame: '#eedcca',
  curtain:     '#f8b4b4',
  plantGreen:  '#5da359',
  plantPot:    '#c85a32',
  dishWhite:   '#f5f5f0',
  steelCup:    '#dcdad5',
};

function Box({
  pos, size, color, rot = [0, 0, 0], castShadow = true, receiveShadow = true, map,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color?: string;
  rot?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  map?: THREE.CanvasTexture;
}) {
  return (
    <mesh position={pos} rotation={rot} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} map={map} roughness={0.7} metalness={0.05} />
    </mesh>
  );
}

export function Kitchen() {
  const woodGrainMap = useMemo(() => getWoodGrainTexture(), []);
  const brushedMetalMap = useMemo(() => getBrushedMetalTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. DIORAMA PEDESTAL BASE ─────────────── */}
      <Box pos={[0, -0.15, 0]} size={[4.6, 0.3, 4.6]} color={C.pedestal} receiveShadow />

      {/* ── 2. REALISTIC WOOD PLANK FLOOR & MAT ─── */}
      {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((x, i) => (
        <group key={i} position={[x, 0.01, 0]}>
          <Box pos={[0, 0, -1.05]} size={[0.54, 0.02, 2.0]} map={woodGrainMap} color={i % 2 === 0 ? C.floorPlank1 : C.floorPlank2} receiveShadow />
          <Box pos={[0, 0, 1.05]} size={[0.54, 0.02, 2.0]} map={woodGrainMap} color={i % 2 === 0 ? C.floorPlank2 : C.floorPlank1} receiveShadow />
        </group>
      ))}

      {/* Soft cozy woven kitchen rug */}
      <Box pos={[0.1, 0.025, 0.4]} size={[1.65, 0.015, 1.15]} color={C.mat} receiveShadow />

      {/* ── 3. CORNER WALLS & TRIMS ──────────────── */}
      <Box pos={[0, 1.4, -2.15]} size={[4.6, 2.8, 0.3]} color={C.walls} receiveShadow />
      <Box pos={[-2.15, 1.4, 0]} size={[0.3, 2.8, 4.6]} color={C.walls} receiveShadow />

      <Box pos={[0.1, 0.08, -1.98]} size={[4.2, 0.14, 0.06]} color={C.wallTrim} />
      <Box pos={[-1.98, 0.08, 0.1]} size={[0.06, 0.14, 4.2]} color={C.wallTrim} />

      {/* ── 4. COZY SUNLIT WINDOW & CURTAIN ──────── */}
      <group position={[0.75, 1.8, -1.98]}>
        <Box pos={[0, 0, 0]} size={[1.5, 1.1, 0.08]} color={C.windowFrame} />
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.3, 0.9]} />
          <meshBasicMaterial color="#fff6d6" />
        </mesh>
        <Box pos={[0, -0.56, 0.08]} size={[1.65, 0.08, 0.2]} color={C.counterTop} />
        <mesh position={[-0.45, -0.44, 0.08]} castShadow>
          <cylinderGeometry args={[0.045, 0.035, 0.08, 8]} />
          <meshStandardMaterial color={C.plantPot} />
        </mesh>
        <mesh position={[-0.45, -0.36, 0.08]} castShadow>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color={C.plantGreen} roughness={0.6} />
        </mesh>
        <Box pos={[0, 0.46, 0.1]} size={[1.55, 0.04, 0.04]} color={C.shelf} />
        <Box pos={[0, 0.32, 0.11]} size={[1.4, 0.24, 0.03]} color={C.curtain} />
      </group>

      {/* ── 5. FLOATING CORNER SHELF WITH KERALA VESSELS ── */}
      <group position={[-0.9, 2.0, -1.92]}>
        <Box pos={[0, 0, 0]} size={[1.25, 0.06, 0.28]} map={woodGrainMap} color={C.shelf} castShadow />
        <mesh position={[-0.45, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.06, 16]} />
          <meshStandardMaterial color={C.dishWhite} roughness={0.3} />
        </mesh>
        {/* Stainless Steel Kerala Tumblers with brushed metal */}
        <mesh position={[-0.22, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.032, 0.1, 14]} />
          <meshStandardMaterial map={brushedMetalMap} color={C.steelCup} metalness={0.88} roughness={0.2} />
        </mesh>
        <mesh position={[-0.11, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.032, 0.1, 14]} />
          <meshStandardMaterial map={brushedMetalMap} color={C.steelCup} metalness={0.88} roughness={0.2} />
        </mesh>
        <Box pos={[0.12, 0.11, 0]} size={[0.055, 0.16, 0.18]} color="#f48fb1" />
        <Box pos={[0.19, 0.11, 0]} size={[0.055, 0.16, 0.18]} color="#90caf9" />
        <mesh position={[0.42, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.045, 0.1, 10]} />
          <meshStandardMaterial color={C.plantPot} />
        </mesh>
        <mesh position={[0.42, 0.17, 0]} castShadow>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color={C.plantGreen} roughness={0.6} />
        </mesh>
      </group>

      {/* ── 6. RETRO MINT REFRIGERATOR (LEFT) ─────── */}
      <group position={[-1.45, 0.85, -0.6]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 1.4, 0.8]} />
          <meshStandardMaterial color={C.fridgeMint} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.7, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.7, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={C.fridgeMint} roughness={0.45} />
        </mesh>
        <Box pos={[0.37, 0.1, 0.15]} size={[0.04, 0.22, 0.04]} color="#dddddd" />
      </group>

      {/* ── 7. RETRO KITCHEN COUNTER & SINK ───────── */}
      <group position={[0.45, 0.5, -1.6]}>
        <Box pos={[0, 0, 0]} size={[2.1, 0.96, 0.8]} color={C.cabinetMint} castShadow receiveShadow />
        <Box pos={[0, 0.5, 0.02]} size={[2.15, 0.06, 0.84]} color={C.counterTop} castShadow receiveShadow />

        {/* Drawers & Knobs */}
        <Box pos={[0.65, 0.25, 0.41]} size={[0.65, 0.35, 0.02]} color={C.cabinetDark} />
        <mesh position={[0.65, 0.25, 0.44]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <Box pos={[0.65, -0.15, 0.41]} size={[0.65, 0.4, 0.02]} color={C.cabinetDark} />
        <mesh position={[0.65, -0.15, 0.44]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <Box pos={[-0.1, -0.1, 0.38]} size={[0.7, 0.45, 0.04]} color="#ffe082" />

        {/* Ceramic Sink */}
        <mesh position={[-0.1, 0.44, 0.05]} castShadow>
          <boxGeometry args={[0.75, 0.2, 0.5]} />
          <meshStandardMaterial color={C.sinkCeramic} roughness={0.25} />
        </mesh>
        <mesh position={[-0.1, 0.64, -0.12]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 10]} />
          <meshStandardMaterial color={C.faucetBrass} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Wooden Cutting Board with Teak Texture */}
        <Box pos={[0.7, 0.54, 0.05]} size={[0.45, 0.03, 0.32]} map={woodGrainMap} color={C.woodTable} />
      </group>

      {/* ── 8. SOLID HARDWOOD WORKSPACE TABLE WITH REAL TEAK GRAIN ── */}
      <group position={[0, 0.44, 0.45]}>
        <Box pos={[0, 0, 0]} size={[2.1, 0.08, 1.15]} map={woodGrainMap} color={C.woodTable} castShadow receiveShadow />
        <Box pos={[0, -0.05, 0]} size={[2.0, 0.04, 1.05]} map={woodGrainMap} color={C.woodLeg} />
        {[
          [-0.94, -0.42, -0.46],
          [ 0.94, -0.42, -0.46],
          [-0.94, -0.42,  0.46],
          [ 0.94, -0.42,  0.46],
        ].map((p, i) => (
          <Box key={i} pos={p as [number, number, number]} size={[0.09, 0.8, 0.09]} map={woodGrainMap} color={C.woodLeg} castShadow />
        ))}
        <Box pos={[-0.94, -0.55, 0]} size={[0.06, 0.04, 0.86]} map={woodGrainMap} color={C.woodLeg} />
        <Box pos={[ 0.94, -0.55, 0]} size={[0.06, 0.04, 0.86]} map={woodGrainMap} color={C.woodLeg} />
      </group>
    </group>
  );
}
