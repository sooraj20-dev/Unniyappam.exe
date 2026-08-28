// ─────────────────────────────────────────────
//  Appachatti.tsx — Authentic Traditional Kerala Cast-Iron Appa Chatti (15-Kuzhi Appam Pan)
//  Modular Architecture: <AppaChatti> -> <PanBody>, <CookingSurface>, <PanRim>, <PanHandle>, <KuzhiCollection>, <Kuzhi>
// ─────────────────────────────────────────────
import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { GamePhase, KuzhiId, KuzhiState } from '../types/game';
import {
  getCastIronTexture,
  getSeasonedKuzhiTexture,
  getFriedCrustTexture,
} from '../utils/textures';

// ── Types & Configuration ─────────────────────
export interface AppaChattiConfig {
  panRadius: number;
  bodyHeight: number;
  rimHeight: number;
  kuzhiRadius: number;
  kuzhiDepth: number;
}

export const PAN_CONFIG: AppaChattiConfig = {
  panRadius: 0.365,
  bodyHeight: 0.024,
  rimHeight: 0.008,
  kuzhiRadius: 0.046,
  kuzhiDepth: 0.020,
};

export type KuzhiPosition = {
  id: KuzhiId;
  pos: [number, number];
  index: number;
  size: number;
};

export interface AppaChattiProps {
  pos?: [number, number, number];
  phase: GamePhase;
  kuzhiStates: Record<KuzhiId, KuzhiState>;
  onKuzhiClick: (id: KuzhiId) => void;
  size?: number;
  interactive?: boolean;
}

export type AppachattiProps = AppaChattiProps;

export interface KuzhiProps {
  id: KuzhiId;
  x: number;
  z: number;
  index: number;
  size: number;
  kuzhi: KuzhiState;
  phase: GamePhase;
  canClick: boolean;
  onClick: () => void;
  castIronMap: THREE.CanvasTexture;
  seasonedKuzhiMap: THREE.CanvasTexture;
  friedCrustMap: THREE.CanvasTexture;
}

export interface PanHandleProps {
  side: 'left' | 'right';
  castIronMap: THREE.CanvasTexture;
}

// ── Concentric 15-Kuzhi Radial Layout (Authentic Kerala Layout) ──
export const KUZHI_LAYOUT: KuzhiPosition[] = [
  // 1: Center
  { id: 'KUZHI_01', pos: [0, 0], index: 1, size: 0.046 },
  // 2–7: Inner concentric ring (6 cavities at radius 0.128)
  ...([0, 1, 2, 3, 4, 5].map((i) => {
    const angle = (i / 6) * Math.PI * 2;
    const num = i + 2;
    return {
      id: `KUZHI_${String(num).padStart(2, '0')}` as KuzhiId,
      pos: [Math.cos(angle) * 0.128, Math.sin(angle) * 0.128] as [number, number],
      index: num,
      size: 0.046,
    };
  })),
  // 8–15: Outer concentric ring (8 cavities at radius 0.252)
  ...([0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const num = i + 8;
    return {
      id: `KUZHI_${String(num).padStart(2, '0')}` as KuzhiId,
      pos: [Math.cos(angle) * 0.252, Math.sin(angle) * 0.252] as [number, number],
      index: num,
      size: 0.046,
    };
  })),
];

// ── Helper: Generate Physical Carved Concave Cooking Surface Geometry ──
function createCarvedCookingSurfaceGeometry(
  panRadius: number,
  kuzhis: KuzhiPosition[],
  kuzhiDepth: number
): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const numRings = 72;
  const numSegments = 96;

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // 1. Center vertex
  let centerY = 0;
  for (const k of kuzhis) {
    const d = Math.sqrt(k.pos[0] * k.pos[0] + k.pos[1] * k.pos[1]);
    if (d < k.size) {
      const ratio = d / k.size;
      const dep = -kuzhiDepth * Math.pow(1 - ratio * ratio, 0.65);
      if (dep < centerY) centerY = dep;
    }
  }
  positions.push(0, centerY, 0);
  uvs.push(0.5, 0.5);

  // 2. Concentric ring vertices
  for (let r = 1; r <= numRings; r++) {
    const ringRadius = (r / numRings) * panRadius;
    for (let s = 0; s < numSegments; s++) {
      const theta = (s / numSegments) * Math.PI * 2;
      const x = Math.cos(theta) * ringRadius;
      const z = Math.sin(theta) * ringRadius;

      let y = 0;
      for (const k of kuzhis) {
        const dx = x - k.pos[0];
        const dz = z - k.pos[1];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < k.size) {
          const ratio = dist / k.size;
          // Smooth concave depression with zero slope at rim
          const dep = -kuzhiDepth * Math.pow(1 - ratio * ratio, 0.65);
          if (dep < y) y = dep;
        }
      }

      positions.push(x, y, z);
      uvs.push(x / (2 * panRadius) + 0.5, z / (2 * panRadius) + 0.5);
    }
  }

  // 3. Generate Triangles (indices)
  for (let s = 0; s < numSegments; s++) {
    const nextS = (s + 1) % numSegments;
    indices.push(0, 1 + s, 1 + nextS);
  }

  for (let r = 1; r < numRings; r++) {
    const currentRingStart = 1 + (r - 1) * numSegments;
    const nextRingStart = 1 + r * numSegments;

    for (let s = 0; s < numSegments; s++) {
      const nextS = (s + 1) % numSegments;

      const c1 = currentRingStart + s;
      const c2 = currentRingStart + nextS;
      const n1 = nextRingStart + s;
      const n2 = nextRingStart + nextS;

      indices.push(c1, n1, c2);
      indices.push(c2, n1, n2);
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}

// ── 1. PanHandle Component (Solid Short Horizontal Cast-Iron Side Tabs) ──
export function PanHandle({ side, castIronMap }: PanHandleProps) {
  const isLeft = side === 'left';
  const posX = isLeft ? -0.395 : 0.395;

  return (
    <group position={[posX, 0.008, 0]}>
      {/* Solid cast-iron side ear tab seamlessly integrated with pan body */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.055, 0.012, 0.12]} />
        <meshStandardMaterial
          map={castIronMap}
          bumpMap={castIronMap}
          bumpScale={0.012}
          color="#222120"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>
    </group>
  );
}

// ── 2. PanRim Component ──
export function PanRim() {
  return null;
}

// ── 3. PanBody Component (Very Shallow Cast-Iron Silhouette) ──
export function PanBody({
  castIronMap,
}: {
  castIronMap: THREE.CanvasTexture;
}) {
  return (
    <group>
      {/* Shallow outer sidewall with subtle draft angle (#242322 to #202020) */}
      <mesh castShadow receiveShadow position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.372, 0.358, 0.022, 64]} />
        <meshStandardMaterial
          map={castIronMap}
          bumpMap={castIronMap}
          bumpScale={0.014}
          color="#222120"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* Shallow bottom plate */}
      <mesh position={[0, -0.009, 0]} receiveShadow>
        <cylinderGeometry args={[0.356, 0.354, 0.006, 48]} />
        <meshStandardMaterial
          map={castIronMap}
          color="#1c1b1a"
          roughness={0.92}
          metalness={0.06}
        />
      </mesh>

      {/* Underside subtle convex heat conduction pods */}
      {KUZHI_LAYOUT.map(({ id, pos: [x, z] }) => (
        <mesh key={`under_${id}`} position={[x, -0.002, z]} castShadow>
          <sphereGeometry args={[0.044, 14, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial
            map={castIronMap}
            color="#181716"
            roughness={0.94}
            metalness={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── 4. CookingSurface Component (Physical Carved Concave Plate) ──
export function CookingSurface({
  castIronMap,
  seasonedKuzhiMap,
}: {
  castIronMap: THREE.CanvasTexture;
  seasonedKuzhiMap: THREE.CanvasTexture;
}) {
  // Generate carved concave surface mesh geometry once
  const carvedGeometry = useMemo(() => {
    return createCarvedCookingSurfaceGeometry(
      PAN_CONFIG.panRadius,
      KUZHI_LAYOUT,
      PAN_CONFIG.kuzhiDepth
    );
  }, []);

  return (
    <mesh
      geometry={carvedGeometry}
      position={[0, 0.014, 0]}
      receiveShadow
      castShadow
    >
      <meshStandardMaterial
        map={seasonedKuzhiMap}
        bumpMap={castIronMap}
        bumpScale={0.012}
        color="#252423"
        roughness={0.84}
        metalness={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── 5. Kuzhi Component (Interactive Food, Oil & Count State inside Well) ──
export function Kuzhi({
  id,
  x,
  z,
  index,
  size,
  kuzhi,
  phase,
  canClick,
  onClick,
  friedCrustMap,
}: KuzhiProps) {
  const [isHovered, setIsHovered] = useState(false);
  const bubblesRef = useRef<THREE.Group>(null);
  const unniRef = useRef<THREE.Group>(null);

  const isCountingPhase = phase === 'COUNT_KUZHI';
  const isCooking = phase === 'COOK';

  const hasOil =
    phase !== 'COUNT_KUZHI' &&
    (kuzhi.fillState === 'OILED' ||
      kuzhi.fillState === 'BATTER' ||
      kuzhi.fillState === 'COOKING' ||
      kuzhi.fillState === 'READY');

  const hasAppam =
    phase !== 'SERVE' &&
    phase !== 'COUNT_KUZHI' &&
    phase !== 'PRANK' &&
    phase !== 'RESULT' &&
    kuzhi.fillState !== 'EMPTY' &&
    kuzhi.fillState !== 'OILED';

  // Dynamic color transition: Pure creamy white when poured -> golden -> deep roasted brown during cooking
  const cookProgress = kuzhi.cookProgress || 0;
  let appamColor = '#faf8f4'; // Pure creamy white rice-flour batter when freshly poured
  let appamRoughness = 0.32;
  let useCrustMap = false;

  if (kuzhi.fillState === 'COOKING' || kuzhi.fillState === 'READY') {
    if (cookProgress < 0.22) {
      // 0% - 22%: Starts warming from white to light cream
      appamColor = '#f5ebd9';
      appamRoughness = 0.42;
      useCrustMap = false;
    } else if (cookProgress < 0.48) {
      // 22% - 48%: Golden browning
      appamColor = '#e0a048';
      appamRoughness = 0.58;
      useCrustMap = true;
    } else if (cookProgress < 0.78) {
      // 48% - 78%: Deep golden brown
      appamColor = '#a8541a';
      appamRoughness = 0.66;
      useCrustMap = true;
    } else {
      // 78% - 100% / Ready: Deep caramelized mahogany
      appamColor = '#4e230a';
      appamRoughness = 0.72;
      useCrustMap = true;
    }
  } else if (kuzhi.isFlipped) {
    appamColor = '#4e230a';
    appamRoughness = 0.72;
    useCrustMap = true;
  }

  const seed = (index * 67) % 360;
  const rotY = (seed * Math.PI) / 180;
  const scaleVar = 0.96 + ((index % 5) * 0.02);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bubblesRef.current && (isCooking || phase === 'HEAT_PAN')) {
      bubblesRef.current.position.y = -0.006 + Math.sin(t * 12 + index) * 0.0005;
    }
    if (unniRef.current && isCooking) {
      unniRef.current.position.y = -0.002 + Math.sin(t * 35 + index * 2) * 0.0004;
    }
  });

  return (
    <group
      name={id}
      position={[x, 0.014, z]}
      onClick={(e) => {
        e.stopPropagation();
        if (canClick) onClick();
      }}
      onPointerOver={(e) => {
        if (canClick) {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* ── 5A. Glistening Pure Coconut Oil Pool (Sits inside carved cavity) ── */}
      {hasOil && (
        <group ref={bubblesRef} position={[0, -0.004, 0]}>
          {/* Main Translucent Golden Liquid Pool */}
          <mesh position={[0, -0.003, 0]}>
            <cylinderGeometry args={[size * 0.88, size * 0.72, 0.008, 28]} />
            <meshStandardMaterial
              color="#ffb800"
              emissive="#ff9100"
              emissiveIntensity={0.28}
              roughness={0.03}
              metalness={0.45}
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Meniscus Top Surface Glaze & Glistening Specular Highlight */}
          <mesh position={[0, 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[size * 0.88, 28]} />
            <meshStandardMaterial
              color="#ffe082"
              emissive="#ffab00"
              emissiveIntensity={0.15}
              roughness={0.02}
              metalness={0.3}
              transparent
              opacity={0.75}
            />
          </mesh>

          {/* Sizzling & Simmering Micro-Bubbles */}
          {(isCooking || phase === 'HEAT_PAN' || phase === 'POUR_BATTER' || phase === 'ADD_OIL') && (
            <group position={[0, 0.003, 0]}>
              {[0, 1, 2, 3, 4, 5].map((b) => {
                const bAngle = (b / 6) * Math.PI * 2 + (index * 0.7);
                const bRadius = size * 0.68 + (b % 3) * 0.003;
                return (
                  <mesh
                    key={b}
                    position={[
                      Math.cos(bAngle) * bRadius,
                      0.001,
                      Math.sin(bAngle) * bRadius,
                    ]}
                  >
                    <sphereGeometry args={[0.0022, 6, 6]} />
                    <meshStandardMaterial
                      color="#fffde7"
                      emissive="#fff59d"
                      emissiveIntensity={0.4}
                      roughness={0.05}
                      transparent
                      opacity={0.9}
                    />
                  </mesh>
                );
              })}
            </group>
          )}
        </group>
      )}

      {/* ── 5B. Puffed Unniyappam (Rises naturally from inside well) ── */}
      {hasAppam && (
        <group
          ref={unniRef}
          rotation={[kuzhi.isFlipped ? Math.PI : 0, rotY, 0]}
          position={[0, -0.002, 0]}
          scale={[scaleVar, scaleVar, scaleVar]}
        >
          {/* Main puffed dome top */}
          <mesh castShadow receiveShadow position={[0, 0.006, 0]}>
            <sphereGeometry args={[size * 0.92, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              map={useCrustMap ? friedCrustMap : undefined}
              color={appamColor}
              roughness={appamRoughness}
              metalness={0.08}
            />
          </mesh>

          {/* Waistline body */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[size * 0.92, size * 0.84, 0.012, 24]} />
            <meshStandardMaterial
              map={useCrustMap ? friedCrustMap : undefined}
              color={kuzhi.isFlipped ? '#3e1a06' : appamColor}
              roughness={appamRoughness + 0.05}
              metalness={0.10}
            />
          </mesh>

          {/* Lower base fitting into well */}
          <mesh position={[0, -0.006, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[size * 0.84, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              map={useCrustMap ? friedCrustMap : undefined}
              color={kuzhi.isFlipped ? appamColor : (useCrustMap ? '#3a1604' : '#f0ece3')}
              roughness={0.76}
            />
          </mesh>

          {/* Roasted Coconut Bits (Thenga Kothu) */}
          {(cookProgress > 0.4 || kuzhi.isReady || kuzhi.isFlipped) && (
            <group position={[0, 0.01, 0]}>
              <mesh position={[0.014, 0.022, 0.01]} rotation={[0.2, 0.4, 0.1]} castShadow>
                <boxGeometry args={[0.008, 0.005, 0.006]} />
                <meshStandardMaterial color="#dfb97c" roughness={0.5} />
              </mesh>
              <mesh position={[-0.016, 0.02, -0.012]} rotation={[-0.2, 0.8, 0.3]} castShadow>
                <boxGeometry args={[0.007, 0.004, 0.007]} />
                <meshStandardMaterial color="#cfa261" roughness={0.5} />
              </mesh>
              <mesh position={[0.005, 0.026, -0.015]} rotation={[0.4, -0.2, 0]} castShadow>
                <boxGeometry args={[0.006, 0.004, 0.005]} />
                <meshStandardMaterial color="#9d5e24" roughness={0.6} />
              </mesh>

              {/* Roasted Black Sesame Specks */}
              {[
                [-0.01, 0.028, 0.015],
                [0.018, 0.018, -0.01],
                [-0.02, 0.015, 0.007],
                [0.01, 0.026, 0.018],
              ].map((spPos, spIdx) => (
                <mesh key={spIdx} position={spPos as [number, number, number]}>
                  <sphereGeometry args={[0.0018, 6, 6]} />
                  <meshBasicMaterial color="#1a0e06" />
                </mesh>
              ))}
            </group>
          )}

          {/* Sizzling Crispy Fried Lace Ring during cooking */}
          {kuzhi.fillState === 'COOKING' && (
            <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size * 0.88, size * 0.98, 24]} />
              <meshStandardMaterial
                color="#e68a19"
                emissive="#ff6f00"
                emissiveIntensity={0.3}
                roughness={0.4}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}
        </group>
      )}

      {/* ── 5C. Hover & Counting Highlight Glow ── */}
      {isCountingPhase && (
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[size * 0.85, 24]} />
          <meshBasicMaterial
            color={kuzhi.isCounted ? '#ff6d00' : isHovered ? '#ffab00' : '#ffa000'}
            transparent
            opacity={kuzhi.isCounted ? 0.35 : isHovered ? 0.30 : 0.08}
          />
        </mesh>
      )}

      {/* ── 5D. Sleek Count Badge with Index & Checkmark ── */}
      {isCountingPhase && kuzhi.isCounted && (
        <Html position={[0, 0.045, 0]} center distanceFactor={3.6}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '2px 6px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff5722, #e64a19)',
              color: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              fontSize: '11px',
              fontWeight: 800,
              boxShadow: '0 3px 8px rgba(0,0,0,0.6)',
              cursor: 'pointer',
              userSelect: 'none',
              animation: 'bounceIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <span>{index}</span>
            <span style={{ fontSize: '9px', opacity: 0.9 }}>✓</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// ── 6. KuzhiCollection Component ────────────────
export function KuzhiCollection({
  phase,
  kuzhiStates,
  onKuzhiClick,
  castIronMap,
  seasonedKuzhiMap,
  friedCrustMap,
}: {
  phase: GamePhase;
  kuzhiStates: Record<KuzhiId, KuzhiState>;
  onKuzhiClick: (id: KuzhiId) => void;
  castIronMap: THREE.CanvasTexture;
  seasonedKuzhiMap: THREE.CanvasTexture;
  friedCrustMap: THREE.CanvasTexture;
}) {
  return (
    <group name="KUZHI_COLLECTION">
      {KUZHI_LAYOUT.map(({ id, pos: [x, z], index, size }) => {
        const kuzhi = kuzhiStates[id] || {
          id,
          fillState: 'EMPTY',
          cookProgress: 0,
          isFlipped: false,
          isCounted: false,
          isReady: false,
        };

        const isCountingPhase = phase === 'COUNT_KUZHI';
        const isPourPhase = phase === 'POUR_BATTER';
        const isOilPhase = phase === 'ADD_OIL';
        const isFlipPhase = phase === 'FLIP';

        const canClick =
          isCountingPhase ||
          (isOilPhase && kuzhi.fillState === 'EMPTY') ||
          (isPourPhase && (kuzhi.fillState === 'OILED' || kuzhi.fillState === 'EMPTY')) ||
          (isFlipPhase && !kuzhi.isFlipped && kuzhi.fillState !== 'EMPTY');

        return (
          <Kuzhi
            key={id}
            id={id}
            x={x}
            z={z}
            index={index}
            size={size}
            kuzhi={kuzhi}
            phase={phase}
            canClick={canClick}
            onClick={() => onKuzhiClick(id)}
            castIronMap={castIronMap}
            seasonedKuzhiMap={seasonedKuzhiMap}
            friedCrustMap={friedCrustMap}
          />
        );
      })}
    </group>
  );
}

// ── Main AppaChatti Component ───────────────────
export function AppaChatti({
  pos = [0, 0, 0],
  phase,
  kuzhiStates,
  onKuzhiClick,
}: AppaChattiProps) {
  const panRef = useRef<THREE.Group>(null);
  const castIronMap = useMemo(() => getCastIronTexture(), []);
  const seasonedKuzhiMap = useMemo(() => getSeasonedKuzhiTexture(), []);
  const friedCrustMap = useMemo(() => getFriedCrustTexture(), []);

  // Cooking vibration
  useFrame((state) => {
    if (!panRef.current) return;
    if (phase === 'COOK') {
      const t = state.clock.getElapsedTime();
      panRef.current.position.y = pos[1] + Math.sin(t * 45) * 0.0008;
    } else {
      panRef.current.position.y = pos[1];
    }
  });

  return (
    <group ref={panRef} position={pos} name="APPACHATTI">
      {/* 1. Shallow Cast-Iron Pan Silhouette Body */}
      <PanBody castIronMap={castIronMap} />

      {/* 2. Broad Flat Cooking Surface with 15 Subtractive Carved Concave Kuzhis */}
      <CookingSurface
        castIronMap={castIronMap}
        seasonedKuzhiMap={seasonedKuzhiMap}
      />

      {/* 3. Two Short Horizontal Cast-Iron Side Grips */}
      <PanHandle side="left" castIronMap={castIronMap} />
      <PanHandle side="right" castIronMap={castIronMap} />

      {/* 5. Interactive Kuzhi Collection (Oil, Batter, Appam & Count State) */}
      <KuzhiCollection
        phase={phase}
        kuzhiStates={kuzhiStates}
        onKuzhiClick={onKuzhiClick}
        castIronMap={castIronMap}
        seasonedKuzhiMap={seasonedKuzhiMap}
        friedCrustMap={friedCrustMap}
      />
    </group>
  );
}

// Export aliases for compatibility
export const Appachatti = AppaChatti;
export const KuzhiGrid = KuzhiCollection;
export const KuzhiCavity = Kuzhi;

