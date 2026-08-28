// ─────────────────────────────────────────────
//  CookingItems.tsx — High-Quality Realistic Kerala Kitchen Props, Tabletop Stove with Top Knob & LPG Cylinder with Hose
// ─────────────────────────────────────────────
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { GamePhase, HeatLevel, IngredientState, KuzhiId } from '../types/game';
import { audio } from '../audio/AudioManager';
import {
  getBananaTexture,
  getBananaLeafTexture,
  getBrushedMetalTexture,
  getJaggeryTexture,
  getWoodGrainTexture,
  getCastIronTexture,
} from '../utils/textures';

interface CookingItemsProps {
  phase: GamePhase;
  ingredients: IngredientState;
  onAddIngredient: (name: keyof IngredientState) => void;
  mixProgress: number;
  onMixProgressDelta: (delta: number) => void;
  heatLevel: HeatLevel;
  onToggleStoveKnob: () => void;
  onFillKuzhiWithOil: (id?: KuzhiId) => void;
  onFillKuzhiWithBatter: (id?: KuzhiId) => void;
  setIsDragging?: (dragging: boolean) => void;
}

export function CookingItems({
  phase,
  ingredients,
  onAddIngredient,
  mixProgress,
  onMixProgressDelta,
  heatLevel,
  onToggleStoveKnob,
  onFillKuzhiWithOil,
  onFillKuzhiWithBatter,
  setIsDragging,
}: CookingItemsProps) {
  const { camera, raycaster, gl } = useThree();

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<[number, number, number]>([0, 0.75, 0]);
  const [isNearBowl, setIsNearBowl] = useState(false);
  const [isNearPan, setIsNearPan] = useState(false);

  const spoonRef = useRef<THREE.Group>(null);
  const isStirDragging = useRef(false);
  const lastStirAngle = useRef(0);
  const lastSoundTime = useRef(0);
  const flameRef = useRef<THREE.Group>(null);

  // Procedural PBR Textures
  const bananaMap = useMemo(() => getBananaTexture(), []);
  const bananaLeafMap = useMemo(() => getBananaLeafTexture(), []);
  const brushedMetalMap = useMemo(() => getBrushedMetalTexture(), []);
  const jaggeryMap = useMemo(() => getJaggeryTexture(), []);
  const woodGrainMap = useMemo(() => getWoodGrainTexture(), []);
  const castIronMap = useMemo(() => getCastIronTexture(), []);

  // Table surface Y = 0.48
  const tableY = 0.48;
  const bowlPos = new THREE.Vector3(-0.65, tableY, 0.45);
  const panPos = new THREE.Vector3(0.12, tableY + 0.068, 0.35);

  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.75));

  const handlePointerDownItem = useCallback(
    (item: string, initialPos: [number, number, number], e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setDraggedItem(item);
      setDragPos([initialPos[0], 0.75, initialPos[2]]);
      gl.domElement.style.cursor = 'grabbing';
      if (setIsDragging) setIsDragging(true);
      audio.playClick();
    },
    [gl, setIsDragging]
  );

  // Global window pointer tracking
  useEffect(() => {
    const onWindowPointerMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane.current, intersection);

      if (!intersection) return;

      // 1. Dragged Item
      if (draggedItem) {
        setDragPos([intersection.x, 0.75, intersection.z]);

        const distToBowl = new THREE.Vector2(intersection.x, intersection.z).distanceTo(
          new THREE.Vector2(bowlPos.x, bowlPos.z)
        );
        setIsNearBowl(distToBowl < 0.38);

        const distToPan = new THREE.Vector2(intersection.x, intersection.z).distanceTo(
          new THREE.Vector2(panPos.x, panPos.z)
        );
        setIsNearPan(distToPan < 0.45);

        if (draggedItem === 'oil' && distToPan < 0.45 && phase === 'ADD_OIL') {
          onFillKuzhiWithOil();
        }
        if (draggedItem === 'ladle' && distToPan < 0.45 && phase === 'POUR_BATTER') {
          onFillKuzhiWithBatter();
        }
      }

      // 2. Smooth Spoon Stirring
      if (isStirDragging.current && phase === 'MIX_BATTER') {
        const dx = intersection.x - bowlPos.x;
        const dz = intersection.z - bowlPos.z;
        const angle = Math.atan2(dz, dx);

        let diff = Math.abs(angle - lastStirAngle.current);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;

        if (diff > 0.08) {
          lastStirAngle.current = angle;
          onMixProgressDelta(2.5);

          const now = performance.now();
          if (now - lastSoundTime.current > 120) {
            audio.playStir();
            lastSoundTime.current = now;
          }

          if (spoonRef.current) {
            const orbitR = 0.045;
            spoonRef.current.position.x = 0.03 + Math.cos(angle) * orbitR;
            spoonRef.current.position.z = Math.sin(angle) * orbitR;
            spoonRef.current.rotation.z = Math.sin(angle) * 0.3 - 0.2;
            spoonRef.current.rotation.x = Math.cos(angle) * 0.2;
          }
        }
      }
    };

    const onWindowPointerUp = () => {
      if (draggedItem) {
        if (isNearBowl && phase === 'PREPARE_INGREDIENTS') {
          if (draggedItem === 'banana' && !ingredients.banana) {
            audio.playDropSplash(380);
            onAddIngredient('banana');
          } else if (draggedItem === 'jaggery' && !ingredients.jaggery) {
            audio.playDropSplash(320);
            onAddIngredient('jaggery');
          } else if (draggedItem === 'cardamom' && !ingredients.cardamom) {
            audio.playDropSplash(540);
            onAddIngredient('cardamom');
          } else if (draggedItem === 'batter' && !ingredients.batter) {
            audio.playDropSplash(420);
            onAddIngredient('batter');
          }
        }

        setDraggedItem(null);
        setIsNearBowl(false);
        setIsNearPan(false);
        gl.domElement.style.cursor = 'default';
        if (setIsDragging) setIsDragging(false);
      }

      if (isStirDragging.current) {
        isStirDragging.current = false;
        gl.domElement.style.cursor = 'default';
        if (setIsDragging) setIsDragging(false);
      }
    };

    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
    };
  }, [
    camera,
    draggedItem,
    gl,
    isNearBowl,
    phase,
    ingredients,
    onAddIngredient,
    onFillKuzhiWithBatter,
    onFillKuzhiWithOil,
    onMixProgressDelta,
    setIsDragging,
    bowlPos,
    panPos,
    raycaster,
  ]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (flameRef.current && heatLevel !== 'OFF') {
      const scaleBase = heatLevel === 'LOW' ? 0.65 : heatLevel === 'MEDIUM' ? 1.05 : 1.45;
      const flicker = 1 + Math.sin(t * 35) * 0.12 + (Math.random() - 0.5) * 0.08;
      flameRef.current.scale.set(scaleBase * flicker, scaleBase * flicker, scaleBase * flicker);
    }
  });

  const handleStartStirring = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (phase === 'MIX_BATTER') {
      isStirDragging.current = true;
      gl.domElement.style.cursor = 'grabbing';
      if (setIsDragging) setIsDragging(true);
      audio.playStir();
    }
  };

  return (
    <group>
      {/* ── 1. MAIN MIXING BOWL VESSEL (LEFT: X = -0.65) ── */}
      <group
        position={[bowlPos.x, bowlPos.y, bowlPos.z]}
        onPointerDown={handleStartStirring}
        onPointerOver={() => {
          if (phase === 'MIX_BATTER') gl.domElement.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          if (!isStirDragging.current && phase === 'MIX_BATTER') {
            gl.domElement.style.cursor = 'default';
          }
        }}
      >
        {draggedItem && (
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.22, 0.28, 28]} />
            <meshBasicMaterial
              color={isNearBowl ? '#00e676' : '#ffd54f'}
              transparent
              opacity={0.75}
            />
          </mesh>
        )}

        {/* Flared Pedestal Base Ring */}
        <mesh position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.02, 28]} />
          <meshStandardMaterial color="#6a421b" roughness={0.6} metalness={0.4} />
        </mesh>

        {/* Main Curved Basin Body */}
        <mesh castShadow receiveShadow position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.20, 0.13, 0.16, 28]} />
          <meshStandardMaterial
            color="#9b6833"
            roughness={0.45}
            metalness={0.55}
          />
        </mesh>

        {/* Rounded Rim Lip */}
        <mesh position={[0, 0.17, 0]}>
          <torusGeometry args={[0.20, 0.014, 12, 28]} />
          <meshStandardMaterial color="#683d16" roughness={0.55} metalness={0.5} />
        </mesh>

        {/* Uruli Side Handles */}
        {[-0.21, 0.21].map((x, i) => (
          <mesh key={i} position={[x, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.032, 0.008, 8, 16]} />
            <meshStandardMaterial color="#58310f" roughness={0.6} metalness={0.5} />
          </mesh>
        ))}

        {/* Ingredient Chunks inside Bowl */}
        {ingredients.banana && mixProgress < 80 && (
          <mesh position={[-0.04, 0.05, 0.03]} rotation={[0.2, 0.5, 0.1]} castShadow>
            <cylinderGeometry args={[0.02, 0.024, 0.09, 8]} />
            <meshStandardMaterial map={bananaMap} roughness={0.6} />
          </mesh>
        )}
        {ingredients.jaggery && mixProgress < 80 && (
          <mesh position={[0.05, 0.05, -0.02]} rotation={[0.1, 0.3, 0]} castShadow>
            <boxGeometry args={[0.055, 0.045, 0.055]} />
            <meshStandardMaterial map={jaggeryMap} roughness={0.8} />
          </mesh>
        )}
        {ingredients.cardamom && mixProgress < 80 && (
          <mesh position={[0.02, 0.06, 0.04]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshStandardMaterial color="#437330" />
          </mesh>
        )}

        {/* Liquid Sweet Batter Fill */}
        {(ingredients.batter || mixProgress > 0) && (
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.18, 0.16, 0.06, 24]} />
            <meshStandardMaterial
              color={
                mixProgress >= 100
                  ? '#a8662f'
                  : mixProgress > 50
                  ? '#bf864e'
                  : '#ecd0a4'
              }
              roughness={0.42}
            />
          </mesh>
        )}

        {/* Wooden Cooking Spoon (Only during prep & mixing) */}
        {(phase === 'PREPARE_INGREDIENTS' || phase === 'MIX_BATTER') && (
          <group
            ref={spoonRef}
            position={[0.03, 0.15, 0]}
            onPointerDown={handleStartStirring}
          >
            <mesh castShadow position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.009, 0.013, 0.3, 10]} />
              <meshStandardMaterial map={woodGrainMap} color="#8a5324" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.13, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <sphereGeometry args={[0.034, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial map={woodGrainMap} color="#8a5324" roughness={0.8} />
            </mesh>
          </group>
        )}
      </group>

      {/* ── 2. INGREDIENTS AROUND THE BOWL ─────────── */}

      {/* (A) Bananas */}
      {!ingredients.banana && (
        <group
          position={draggedItem === 'banana' ? dragPos : [-0.82, tableY + 0.02, 0.22]}
          rotation={draggedItem === 'banana' ? [0.4, 0.6, 0.2] : [0, 0.4, 0]}
          onPointerDown={(e) => handlePointerDownItem('banana', [-0.82, tableY + 0.02, 0.22], e)}
          onPointerOver={() => {
            if (phase === 'PREPARE_INGREDIENTS') gl.domElement.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            if (phase === 'PREPARE_INGREDIENTS') gl.domElement.style.cursor = 'default';
          }}
        >
          <group position={[0, 0, 0]} rotation={[0.1, 0.3, 0.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.023, 0.027, 0.09, 12]} />
              <meshStandardMaterial map={bananaMap} roughness={0.5} />
            </mesh>
            <mesh position={[0.015, 0.065, 0]} rotation={[0, 0, -0.3]} castShadow>
              <cylinderGeometry args={[0.018, 0.023, 0.07, 12]} />
              <meshStandardMaterial map={bananaMap} roughness={0.5} />
            </mesh>
            <mesh position={[-0.012, -0.065, 0]} rotation={[0, 0, 0.3]} castShadow>
              <cylinderGeometry args={[0.027, 0.016, 0.06, 12]} />
              <meshStandardMaterial map={bananaMap} roughness={0.5} />
            </mesh>
            <mesh position={[0.035, 0.11, 0]} rotation={[0, 0, -0.4]} castShadow>
              <cylinderGeometry args={[0.007, 0.01, 0.03, 6]} />
              <meshStandardMaterial color="#4e5b22" roughness={0.8} />
            </mesh>
          </group>

          <group position={[0.035, 0.01, 0.03]} rotation={[0.1, 0.7, -0.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.022, 0.026, 0.16, 12]} />
              <meshStandardMaterial map={bananaMap} roughness={0.5} />
            </mesh>
          </group>
        </group>
      )}

      {/* (B) Jaggery Block */}
      {!ingredients.jaggery && (
        <group
          position={draggedItem === 'jaggery' ? dragPos : [-0.58, tableY + 0.03, 0.18]}
          rotation={draggedItem === 'jaggery' ? [0.3, 0.2, 0.4] : [0, 0.2, 0]}
          onPointerDown={(e) => handlePointerDownItem('jaggery', [-0.58, tableY + 0.03, 0.18], e)}
          onPointerOver={() => {
            if (phase === 'PREPARE_INGREDIENTS') gl.domElement.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            if (phase === 'PREPARE_INGREDIENTS') gl.domElement.style.cursor = 'default';
          }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.045, 0.055, 0.07, 8]} />
            <meshStandardMaterial map={jaggeryMap} roughness={0.92} />
          </mesh>
          <mesh position={[0.01, 0.04, 0]} rotation={[0.2, 0.3, 0.1]} castShadow>
            <cylinderGeometry args={[0.025, 0.045, 0.03, 7]} />
            <meshStandardMaterial map={jaggeryMap} roughness={0.92} />
          </mesh>
          <mesh position={[-0.045, -0.02, 0.03]} castShadow>
            <boxGeometry args={[0.02, 0.015, 0.018]} />
            <meshStandardMaterial map={jaggeryMap} roughness={0.9} />
          </mesh>
          <mesh position={[0.04, -0.02, -0.03]} castShadow>
            <boxGeometry args={[0.018, 0.014, 0.016]} />
            <meshStandardMaterial map={jaggeryMap} roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* (C) Cardamom Pods */}
      {!ingredients.cardamom && (
        <group
          position={draggedItem === 'cardamom' ? dragPos : [-0.34, tableY + 0.015, 0.20]}
          rotation={draggedItem === 'cardamom' ? [0.2, 0.4, 0.1] : [0, 0, 0]}
          onPointerDown={(e) => handlePointerDownItem('cardamom', [-0.34, tableY + 0.015, 0.20], e)}
          onPointerOver={() => {
            if (phase === 'PREPARE_INGREDIENTS') gl.domElement.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            if (phase === 'PREPARE_INGREDIENTS') gl.domElement.style.cursor = 'default';
          }}
        >
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.055, 0.042, 0.018, 16]} />
            <meshStandardMaterial color="#9e5638" roughness={0.85} />
          </mesh>
          {[-0.018, 0, 0.018].map((x, i) => (
            <group key={i} position={[x, 0.015, (i - 1) * 0.013]} rotation={[0.2, i * 1.2, 0.1]}>
              <mesh castShadow>
                <sphereGeometry args={[0.013, 8, 8]} />
                <meshStandardMaterial color="#4a7c36" roughness={0.65} />
              </mesh>
              <mesh position={[0, 0.012, 0]}>
                <coneGeometry args={[0.007, 0.014, 6]} />
                <meshStandardMaterial color="#3d682c" roughness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* (D) Rice Flour in Brass Container */}
      {!ingredients.batter && (
        <group
          position={draggedItem === 'batter' ? dragPos : [-0.84, tableY + 0.05, 0.56]}
          rotation={draggedItem === 'batter' ? [0.4, 0.3, -0.3] : [0, 0, 0]}
          onPointerDown={(e) => handlePointerDownItem('batter', [-0.84, tableY + 0.05, 0.56], e)}
          onPointerOver={() => {
            if (phase === 'PREPARE_INGREDIENTS') gl.domElement.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            if (phase === 'PREPARE_INGREDIENTS') gl.domElement.style.cursor = 'default';
          }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.068, 0.052, 0.11, 20]} />
            <meshStandardMaterial color="#c59b27" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.055, 0]}>
            <torusGeometry args={[0.068, 0.008, 8, 20]} />
            <meshStandardMaterial color="#b38820" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.048, 0]}>
            <cylinderGeometry args={[0.064, 0.064, 0.014, 16]} />
            <meshStandardMaterial color="#fafafa" roughness={0.96} />
          </mesh>
        </group>
      )}

      {/* ── 3. REALISTIC OIL BOTTLE & FLOWING STREAM ── */}
      <group
        position={draggedItem === 'oil' ? dragPos : [0.68, tableY + 0.08, 0.22]}
        rotation={draggedItem === 'oil' ? (isNearPan ? [0.85, 0.15, -1.15] : [0.6, 0.2, -0.8]) : [0, 0, 0]}
        onPointerDown={(e) => {
          if (phase === 'ADD_OIL') {
            handlePointerDownItem('oil', [0.68, tableY + 0.08, 0.22], e);
          }
        }}
        onPointerOver={() => {
          if (phase === 'ADD_OIL') gl.domElement.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          if (phase === 'ADD_OIL') gl.domElement.style.cursor = 'default';
        }}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.048, 0.054, 0.16, 20]} />
          <meshStandardMaterial
            color="#ffe082"
            transparent
            opacity={0.82}
            roughness={0.12}
            metalness={0.25}
          />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.024, 0.048, 0.04, 16]} />
          <meshStandardMaterial color="#ffe082" transparent opacity={0.82} roughness={0.12} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.018, 0.024, 0.04, 14]} />
          <meshStandardMaterial color="#ffe082" transparent opacity={0.82} />
        </mesh>
        <mesh position={[0, 0.155, 0]}>
          <cylinderGeometry args={[0.008, 0.014, 0.035, 10]} />
          <meshStandardMaterial map={brushedMetalMap} color="#e0e0e0" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Dynamic Glistening Oil Stream */}
        {draggedItem === 'oil' && isNearPan && (
          <group position={[0, 0.18, 0]}>
            <mesh position={[0, -0.16, 0.06]} rotation={[0.45, 0, 0]}>
              <cylinderGeometry args={[0.007, 0.018, 0.36, 12]} />
              <meshStandardMaterial
                color="#ffca28"
                emissive="#ff9800"
                emissiveIntensity={0.4}
                roughness={0.05}
                metalness={0.7}
                transparent
                opacity={0.92}
              />
            </mesh>
            <mesh position={[0, -0.32, 0.14]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.02, 0.055, 18]} />
              <meshBasicMaterial color="#ffd54f" transparent opacity={0.75} />
            </mesh>
            <mesh position={[0.02, -0.30, 0.13]}>
              <sphereGeometry args={[0.008, 8, 8]} />
              <meshBasicMaterial color="#ffe082" />
            </mesh>
            <mesh position={[-0.018, -0.29, 0.15]}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshBasicMaterial color="#ffe082" />
            </mesh>
          </group>
        )}
      </group>

      {/* ── 4. TRADITIONAL BATTER LADLE (RESTING INSIDE MIXING BOWL VESSEL) ── */}
      {(phase === 'POUR_BATTER' || phase === 'COOK') && (
        <group
          position={draggedItem === 'ladle' ? dragPos : [-0.65, tableY + 0.16, 0.45]}
          rotation={draggedItem === 'ladle' ? (isNearPan ? [0.65, 0.25, -0.85] : [0.4, 0.2, -0.6]) : [0.35, 0.15, -0.45]}
          onPointerDown={(e) => {
            if (phase === 'POUR_BATTER') {
              handlePointerDownItem('ladle', [-0.65, tableY + 0.16, 0.45], e);
            }
          }}
          onPointerOver={() => {
            if (phase === 'POUR_BATTER') gl.domElement.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            if (phase === 'POUR_BATTER') gl.domElement.style.cursor = 'default';
          }}
        >
          <mesh castShadow>
            <cylinderGeometry args={[0.008, 0.011, 0.26, 8]} />
            <meshStandardMaterial map={woodGrainMap} color="#5d4037" roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.13, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <sphereGeometry args={[0.042, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#3e2723" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.12, 0]}>
            <sphereGeometry args={[0.035, 12, 8]} />
            <meshStandardMaterial color="#a8662f" roughness={0.5} />
          </mesh>

          {/* Dynamic Batter Pouring Stream */}
          {draggedItem === 'ladle' && isNearPan && (
            <group position={[0, -0.14, 0]}>
              <mesh position={[0, -0.12, 0.05]} rotation={[0.3, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.024, 0.28, 10]} />
                <meshStandardMaterial color="#a8662f" roughness={0.45} />
              </mesh>
              <mesh position={[0, -0.26, 0.09]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.032, 14]} />
                <meshBasicMaterial color="#bf864e" />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* ── 5. HEAVY BRASS SERVING THALI (RIGHT: X = 0.74) ── */}
      {(phase === 'SERVE' || phase === 'COUNT_KUZHI' || phase === 'PRANK' || phase === 'RESULT') && (
        <group position={[0.74, tableY + 0.01, 0.48]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.19, 0.022, 32]} />
            <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.013, 0]}>
            <cylinderGeometry args={[0.20, 0.20, 0.004, 32]} />
            <meshStandardMaterial map={bananaLeafMap} roughness={0.65} />
          </mesh>

          {/* 15 Golden Cooked Unniyappams Stacked */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const angle = (i / 7) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.095, 0.038, Math.sin(angle) * 0.095]}
                rotation={[0.1, i, 0]}
                castShadow
              >
                <sphereGeometry args={[0.034, 14, 12]} />
                <meshStandardMaterial color="#6a3612" roughness={0.65} />
              </mesh>
            );
          })}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2 + 0.4;
            return (
              <mesh
                key={i + 10}
                position={[Math.cos(angle) * 0.05, 0.068, Math.sin(angle) * 0.05]}
                rotation={[-0.1, i * 0.8, 0.1]}
                castShadow
              >
                <sphereGeometry args={[0.032, 14, 12]} />
                <meshStandardMaterial color="#7a431a" roughness={0.65} />
              </mesh>
            );
          })}
          <mesh position={[0, 0.095, 0]} castShadow>
            <sphereGeometry args={[0.034, 14, 12]} />
            <meshStandardMaterial color="#5a2e0e" roughness={0.65} />
          </mesh>
          <mesh position={[0.02, 0.125, -0.01]} castShadow>
            <sphereGeometry args={[0.03, 14, 12]} />
            <meshStandardMaterial color="#6a3612" roughness={0.65} />
          </mesh>
        </group>
      )}

      {/* ── 6. REALISTIC TABLETOP STOVE WITH BOLD TOP KNOB (X = 0.12) ── */}
      <group position={[0.12, tableY + 0.024, 0.42]}>
        {/* Stainless Steel / Glass Stove Body Chassis */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.82, 0.048, 0.78]} />
          <meshStandardMaterial
            map={brushedMetalMap}
            color="#222222"
            metalness={0.88}
            roughness={0.18}
          />
        </mesh>

        {/* Toughened Black Glass Top Plate with Chrome Trim */}
        <mesh position={[0, 0.025, 0]} receiveShadow>
          <boxGeometry args={[0.80, 0.006, 0.76]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.08}
            metalness={0.92}
          />
        </mesh>

        {/* 4 Corner Rubber Support Feet */}
        {[
          [-0.36, -0.028, -0.34],
          [ 0.36, -0.028, -0.34],
          [-0.36, -0.028,  0.34],
          [ 0.36, -0.028,  0.34],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.022, 0.026, 0.012, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        ))}

        {/* Stainless Steel Drip Spill Tray under Pan */}
        <mesh position={[0, 0.03, -0.07]}>
          <cylinderGeometry args={[0.30, 0.32, 0.008, 32]} />
          <meshStandardMaterial map={brushedMetalMap} color="#e0e0e0" metalness={0.92} roughness={0.15} />
        </mesh>

        {/* Heavy Cast-Iron Burner Base & 4 Pan Support Prongs */}
        <mesh position={[0, 0.035, -0.07]}>
          <cylinderGeometry args={[0.26, 0.28, 0.01, 28]} />
          <meshStandardMaterial map={castIronMap} color="#1a1a1a" roughness={0.88} metalness={0.3} />
        </mesh>

        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.25, 0.046, -0.07 + Math.sin(angle) * 0.25]}
            rotation={[0, -angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.16, 0.022, 0.038]} />
            <meshStandardMaterial map={castIronMap} color="#1a1a1a" roughness={0.9} metalness={0.3} />
          </mesh>
        ))}

        {/* Gas Burner Flame Ring */}
        {heatLevel !== 'OFF' && (
          <group ref={flameRef} position={[0, 0.042, -0.07]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08, 0.16, 24]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.92} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.16, 0.24, 24]} />
              <meshBasicMaterial
                color={heatLevel === 'HIGH' ? '#ff3d00' : heatLevel === 'MEDIUM' ? '#2979ff' : '#00b0ff'}
                transparent
                opacity={0.8}
              />
            </mesh>
            <pointLight
              color={heatLevel === 'HIGH' ? '#ff5722' : '#29b6f6'}
              intensity={heatLevel === 'HIGH' ? 3.5 : 2.0}
              distance={2.5}
            />
          </group>
        )}

        {/* Rear Brass Gas Inlet Nozzle */}
        <mesh position={[0.38, 0, -0.28]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.06, 12]} />
          <meshStandardMaterial color="#c59b27" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* ── BOLD, PROMINENT TOP-FRONT CONTROL CONSOLE & KNOB ── */}
        <group
          position={[0, 0.028, 0.31]}
          onClick={(e) => {
            e.stopPropagation();
            if (phase === 'HEAT_PAN' || phase === 'COOK') {
              audio.playClick();
              onToggleStoveKnob();
            }
          }}
          onPointerOver={() => {
            if (phase === 'HEAT_PAN' || phase === 'COOK') gl.domElement.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            if (phase === 'HEAT_PAN' || phase === 'COOK') gl.domElement.style.cursor = 'default';
          }}
        >
          {/* Raised Beveled Chrome Dial Platform */}
          <mesh position={[0, 0.005, 0]}>
            <cylinderGeometry args={[0.075, 0.082, 0.01, 32]} />
            <meshStandardMaterial color="#e0e0e0" metalness={0.92} roughness={0.15} />
          </mesh>

          {/* Printed Dial Ring with Position Dots */}
          <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.055, 0.072, 32]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          <mesh position={[0, 0.012, -0.062]}>
            <circleGeometry args={[0.006, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.062, 0.012, 0]}>
            <circleGeometry args={[0.006, 8]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          <mesh position={[0, 0.012, 0.062]}>
            <circleGeometry args={[0.007, 8]} />
            <meshBasicMaterial color="#ffeb3b" />
          </mesh>
          <mesh position={[0.062, 0.012, 0]}>
            <circleGeometry args={[0.007, 8]} />
            <meshBasicMaterial color="#ff3d00" />
          </mesh>

          {/* 3D Bold Rotary Knob */}
          <group
            position={[0, 0.022, 0]}
            rotation={[
              0,
              heatLevel === 'OFF'
                ? 0
                : heatLevel === 'LOW'
                ? Math.PI / 2
                : heatLevel === 'MEDIUM'
                ? Math.PI
                : (3 * Math.PI) / 2,
              0,
            ]}
          >
            {/* Grip Dial Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.046, 0.048, 0.026, 28]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.35} metalness={0.65} />
            </mesh>
            {/* Red Crown Top */}
            <mesh position={[0, 0.014, 0]}>
              <cylinderGeometry args={[0.042, 0.044, 0.006, 28]} />
              <meshStandardMaterial color="#d32f2f" roughness={0.3} />
            </mesh>
            {/* White Pointer Marker */}
            <mesh position={[0, 0.018, -0.036]}>
              <boxGeometry args={[0.008, 0.006, 0.022]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── 7. RED LPG GAS CYLINDER (FLOOR RIGHT) & CONNECTING HOSE PIPE ── */}
      <group position={[1.35, 0.28, 0.40]}>
        {/* Base Support Ring Collar */}
        <mesh position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.165, 0.165, 0.035, 24]} />
          <meshStandardMaterial color="#b71c1c" roughness={0.5} />
        </mesh>

        {/* Main Red Steel LPG Tank Cylinder Body */}
        <mesh castShadow position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.36, 28]} />
          <meshStandardMaterial color="#d32f2f" roughness={0.42} metalness={0.25} />
        </mesh>

        {/* Top Hemispherical Dome */}
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#d32f2f" roughness={0.42} metalness={0.25} />
        </mesh>

        {/* Center Welded Ring Seam */}
        <mesh position={[0, -0.06, 0]}>
          <torusGeometry args={[0.181, 0.006, 8, 28]} />
          <meshStandardMaterial color="#b71c1c" roughness={0.5} />
        </mesh>

        {/* Top Shroud Handle Collar */}
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.10, 24, 1, true]} />
          <meshStandardMaterial color="#d32f2f" roughness={0.45} side={THREE.DoubleSide} />
        </mesh>

        {/* Top Brass Gas Regulator Valve & Switch */}
        <mesh position={[0, 0.20, 0]}>
          <cylinderGeometry args={[0.032, 0.038, 0.06, 16]} />
          <meshStandardMaterial color="#fbc02d" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.03, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
        <mesh position={[0.02, 0.245, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.04, 10]} />
          <meshStandardMaterial color="#d32f2f" roughness={0.4} />
        </mesh>

        {/* ── Flexible Orange Suraksha Gas Hose Pipe Connecting to Stove ── */}
        <mesh position={[0, 0, 0]}>
          <tubeGeometry
            args={[
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0.20, 0),             // From Cylinder Regulator (1.35, 0.48, 0.40)
                new THREE.Vector3(-0.13, -0.10, -0.15),    // Loops down beside cylinder (1.22, 0.18, 0.25)
                new THREE.Vector3(-0.40, -0.16, -0.32),    // Along floor behind table (0.95, 0.12, 0.08)
                new THREE.Vector3(-0.65, -0.12, -0.34),    // Running behind stove along back rail (0.70, 0.16, 0.06)
                new THREE.Vector3(-0.80, 0.10, -0.32),     // Ascending behind stove (0.55, 0.38, 0.08)
                new THREE.Vector3(-0.85, 0.224, -0.26),    // Enters rear brass inlet nozzle (0.50, 0.504, 0.14)
              ]),
              40,
              0.011,
              10,
              false,
            ]}
          />
          <meshStandardMaterial color="#ff6f00" roughness={0.65} metalness={0.15} />
        </mesh>
      </group>
    </group>
  );
}
