// ─────────────────────────────────────────────
//  Effects.tsx — Dynamic Smoke & Steam Particle System
//  Light wisps on normal heat; Heavy billowing black smoke on HIGH overheat
// ─────────────────────────────────────────────
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import type { GamePhase, HeatLevel } from '../types/game';

interface EffectsProps {
  phase: GamePhase;
  heatLevel: HeatLevel;
}

export function Effects({ phase, heatLevel }: EffectsProps) {
  const steamRef = useRef<THREE.Points>(null);
  const blackSmokeRef = useRef<THREE.Points>(null);
  const confettiRef = useRef<THREE.Points>(null);

  // 1. Light White Steam / Cooking Wisps (LOW / MEDIUM / COOK / FLIP / SERVE)
  const steamCount = 45;
  const steamPositions = useMemo(() => {
    const arr = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      arr[i * 3 + 0] = 0.12 + (Math.random() - 0.5) * 0.45;
      arr[i * 3 + 1] = 0.55 + Math.random() * 0.5;
      arr[i * 3 + 2] = 0.35 + (Math.random() - 0.5) * 0.45;
    }
    return arr;
  }, []);

  // 2. Heavy Billowing Black Smoke (HIGH Flame Overheat)
  const blackSmokeCount = 80;
  const blackSmokePositions = useMemo(() => {
    const arr = new Float32Array(blackSmokeCount * 3);
    for (let i = 0; i < blackSmokeCount; i++) {
      arr[i * 3 + 0] = 0.12 + (Math.random() - 0.5) * 0.35;
      arr[i * 3 + 1] = 0.55 + Math.random() * 0.9;
      arr[i * 3 + 2] = 0.35 + (Math.random() - 0.5) * 0.35;
    }
    return arr;
  }, []);

  // 3. Festive Confetti
  const confettiCount = 90;
  const { confettiPositions, confettiColors } = useMemo(() => {
    const pos = new Float32Array(confettiCount * 3);
    const col = new Float32Array(confettiCount * 3);
    const palette = [
      [1.0, 0.84, 0.0],  // Gold
      [1.0, 0.4, 0.1],   // Saffron
      [0.2, 0.8, 0.3],   // Banana leaf green
      [0.9, 0.2, 0.2],   // Festive red
      [1.0, 0.95, 0.7],  // Cardamom cream
    ];

    for (let i = 0; i < confettiCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 2.2;
      pos[i * 3 + 1] = 1.0 + Math.random() * 1.5;
      pos[i * 3 + 2] = 0.45 + (Math.random() - 0.5) * 2.2;

      const c = palette[i % palette.length];
      col[i * 3 + 0] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return { confettiPositions: pos, confettiColors: col };
  }, []);

  const hasNormalSmoke =
    heatLevel === 'LOW' ||
    heatLevel === 'MEDIUM' ||
    phase === 'COOK' ||
    phase === 'FLIP' ||
    phase === 'SERVE';

  const hasOverheatBlackSmoke = heatLevel === 'HIGH';

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Animate Light Steam / White Smoke
    if (steamRef.current && hasNormalSmoke && !hasOverheatBlackSmoke) {
      const positions = steamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < steamCount; i++) {
        positions[i * 3 + 1] += delta * 0.4;
        positions[i * 3 + 0] += Math.sin(t * 3 + i) * 0.003;
        positions[i * 3 + 2] += Math.cos(t * 3 + i) * 0.003;

        if (positions[i * 3 + 1] > 1.35) {
          positions[i * 3 + 1] = 0.55;
          positions[i * 3 + 0] = 0.12 + (Math.random() - 0.5) * 0.42;
          positions[i * 3 + 2] = 0.45 + (Math.random() - 0.5) * 0.42;
        }
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Billowing Heavy Black Smoke (HIGH Overheat)
    if (blackSmokeRef.current && hasOverheatBlackSmoke) {
      const positions = blackSmokeRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < blackSmokeCount; i++) {
        positions[i * 3 + 1] += delta * 0.85; // Faster upward surge
        // Turbulent expansion outward as it rises
        const heightFactor = Math.max(0.1, positions[i * 3 + 1] - 0.55);
        positions[i * 3 + 0] += Math.sin(t * 6 + i) * 0.008 * heightFactor;
        positions[i * 3 + 2] += Math.cos(t * 6 + i) * 0.008 * heightFactor;

        if (positions[i * 3 + 1] > 1.85) {
          positions[i * 3 + 1] = 0.55;
          positions[i * 3 + 0] = 0.12 + (Math.random() - 0.5) * 0.3;
          positions[i * 3 + 2] = 0.45 + (Math.random() - 0.5) * 0.3;
        }
      }
      blackSmokeRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Festive Confetti
    if (confettiRef.current && (phase === 'SERVE' || phase === 'RESULT')) {
      const positions = confettiRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < confettiCount; i++) {
        positions[i * 3 + 1] -= delta * 0.6;
        positions[i * 3 + 0] += Math.sin(positions[i * 3 + 1] * 4) * 0.005;
        if (positions[i * 3 + 1] < 0.1) {
          positions[i * 3 + 1] = 2.5;
        }
      }
      confettiRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Gentle White Steam & Cooking Smoke */}
      {hasNormalSmoke && !hasOverheatBlackSmoke && (
        <points ref={steamRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[steamPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.075}
            color="#f5f5f5"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </points>
      )}

      {/* 2. Heavy Billowing Dark/Black Smoke on Overheat (HIGH) */}
      {hasOverheatBlackSmoke && (
        <points ref={blackSmokeRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[blackSmokePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.14}
            color="#141414"
            transparent
            opacity={0.88}
            depthWrite={false}
          />
        </points>
      )}

      {/* 3. Confetti on Serve/Result */}
      {(phase === 'SERVE' || phase === 'RESULT') && (
        <points ref={confettiRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[confettiPositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[confettiColors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            vertexColors
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
