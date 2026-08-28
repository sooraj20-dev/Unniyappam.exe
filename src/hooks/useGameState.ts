// ─────────────────────────────────────────────
//  useGameState.ts — React hook wrapping game state
// ─────────────────────────────────────────────
import { useState, useCallback, useRef } from 'react';
import type {
  GameStateData, GamePhase, KuzhiId,
} from '../types/game';
import { createInitialGameState, nextPhase } from '../gameplay/GameState';

export function useGameState() {
  const [state, setState] = useState<GameStateData>(createInitialGameState);
  const startTimeRef = useRef<number>(Date.now());

  const advance = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: nextPhase(prev.phase),
    }));
  }, []);

  const setPhase = useCallback((phase: GamePhase) => {
    setState(prev => ({ ...prev, phase }));
  }, []);

  const setMixProgress = useCallback((value: number) => {
    setState(prev => ({ ...prev, mixProgress: Math.min(100, value) }));
  }, []);

  const addIngredient = useCallback((key: keyof GameStateData['ingredientsAdded']) => {
    setState(prev => ({
      ...prev,
      ingredientsAdded: { ...prev.ingredientsAdded, [key]: true },
    }));
  }, []);

  const setHeatLevel = useCallback((level: GameStateData['cooking']['heatLevel']) => {
    setState(prev => ({
      ...prev,
      cooking: { ...prev.cooking, heatLevel: level },
    }));
  }, []);

  const markOilAdded = useCallback(() => {
    setState(prev => ({
      ...prev,
      cooking: { ...prev.cooking, oilAdded: true },
    }));
  }, []);

  const toggleKuzhiCounted = useCallback((id: KuzhiId) => {
    setState(prev => {
      const kuzhi = prev.kuzhiStates[id];
      const wasCounted = kuzhi.isCounted;
      const delta = wasCounted ? -1 : 1;
      return {
        ...prev,
        kuzhiCount: prev.kuzhiCount + delta,
        kuzhiStates: {
          ...prev.kuzhiStates,
          [id]: { ...kuzhi, isCounted: !wasCounted },
        },
      };
    });
  }, []);

  const resetKuzhiCount = useCallback(() => {
    setState(prev => {
      const reset = { ...prev.kuzhiStates };
      (Object.keys(reset) as KuzhiId[]).forEach(id => {
        reset[id] = { ...reset[id], isCounted: false };
      });
      return { ...prev, kuzhiCount: 0, kuzhiStates: reset };
    });
  }, []);

  const recordCompletionTime = useCallback(() => {
    setState(prev => ({
      ...prev,
      completionTime: Date.now() - startTimeRef.current,
    }));
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = Date.now();
    setState(createInitialGameState());
  }, []);

  return {
    state,
    advance,
    setPhase,
    setMixProgress,
    addIngredient,
    setHeatLevel,
    markOilAdded,
    toggleKuzhiCounted,
    resetKuzhiCount,
    recordCompletionTime,
    reset,
  };
}
