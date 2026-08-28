// ─────────────────────────────────────────────
//  CameraController.tsx — 3D Camera with Smooth Phase Transitions + Free Orbit Movement
// ─────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { GamePhase } from '../types/game';

interface CameraControllerProps {
  phase: GamePhase;
  manualViewAngle?: string;
}

export function CameraController({ phase }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(2.2, 3.1, 3.6));
  const isTransitioning = useRef(true);
  const transitionTimer = useRef(0);

  // When phase changes, trigger a smooth transition
  useEffect(() => {
    isTransitioning.current = true;
    transitionTimer.current = 0;

    if (phase === 'INTRO' || phase === 'TUTORIAL') {
      targetPos.current.set(2.2, 3.1, 3.6);
    } else if (phase === 'PREPARE_INGREDIENTS' || phase === 'MIX_BATTER') {
      targetPos.current.set(-0.45, 2.1, 1.9);
    } else if (phase === 'HEAT_PAN' || phase === 'ADD_OIL' || phase === 'POUR_BATTER' || phase === 'COOK' || phase === 'FLIP') {
      targetPos.current.set(0.18, 2.0, 1.75);
    } else if (phase === 'SERVE') {
      targetPos.current.set(0.5, 1.9, 1.7);
    } else if (phase === 'COUNT_KUZHI') {
      targetPos.current.set(0.12, 1.85, 0.352);
    } else if (phase === 'PRANK' || phase === 'RESULT') {
      targetPos.current.set(1.8, 3.0, 3.5);
    }
  }, [phase]);

  useFrame((_, delta) => {
    if (isTransitioning.current) {
      transitionTimer.current += delta;
      camera.position.lerp(targetPos.current, Math.min(3.5 * delta, 0.12));

      // After 1.2 seconds, finish automated transition so user has full uninterrupted 3D control
      if (transitionTimer.current > 1.2 || camera.position.distanceTo(targetPos.current) < 0.05) {
        isTransitioning.current = false;
      }
    }
  });

  return null;
}
