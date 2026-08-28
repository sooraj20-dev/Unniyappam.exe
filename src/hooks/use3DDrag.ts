// ─────────────────────────────────────────────
//  use3DDrag.ts — 3D Drag & Drop Hook with Table Plane Raycasting
// ─────────────────────────────────────────────
import { useRef, useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface DragState {
  isDragging: boolean;
  itemType: string | null;
  position: [number, number, number];
}

export function use3DDrag(
  tableY: number = 0.445,
  liftY: number = 0.25,
  onDrop?: (itemType: string, dropPos: THREE.Vector3) => void
) {
  const { camera, raycaster, gl } = useThree();
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    itemType: null,
    position: [0, tableY, 0],
  });

  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -tableY - liftY));
  const currentPos = useRef(new THREE.Vector3());
  const activeItem = useRef<string | null>(null);

  const startDrag = useCallback(
    (itemType: string, initialPos: [number, number, number], e: { stopPropagation: () => void; point: THREE.Vector3 }) => {
      e.stopPropagation();
      activeItem.current = itemType;
      currentPos.current.set(initialPos[0], tableY + liftY, initialPos[2]);
      setDragState({
        isDragging: true,
        itemType,
        position: [initialPos[0], tableY + liftY, initialPos[2]],
      });
      gl.domElement.style.cursor = 'grabbing';
    },
    [gl, tableY, liftY]
  );

  const updateDrag = useCallback(
    (e: PointerEvent) => {
      if (!activeItem.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane.current, intersection);

      if (intersection) {
        currentPos.current.copy(intersection);
        setDragState(prev => ({
          ...prev,
          position: [intersection.x, intersection.y, intersection.z],
        }));
      }
    },
    [camera, gl, raycaster]
  );

  const endDrag = useCallback(() => {
    if (activeItem.current) {
      if (onDrop) {
        onDrop(activeItem.current, currentPos.current.clone());
      }
      activeItem.current = null;
      setDragState({
        isDragging: false,
        itemType: null,
        position: [0, tableY, 0],
      });
      gl.domElement.style.cursor = 'default';
    }
  }, [gl, onDrop, tableY]);

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
  };
}
