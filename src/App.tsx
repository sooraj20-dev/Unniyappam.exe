// ─────────────────────────────────────────────
//  App.tsx — Unniyappam 3D (Mobile-Friendly & Malayalam Comedy Edition)
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { useGameState } from './hooks/useGameState';
import type { HeatLevel, KuzhiId } from './types/game';
import { KUZHI_IDS } from './types/game';
import { audio } from './audio/AudioManager';
import { MALAYALAM_PHASE_CONTENT, AMMACHI_REACTIONS } from './utils/malayalamContent';

import { Kitchen } from './scene/Kitchen';
import { Appachatti } from './scene/Appachatti';
import { CookingItems } from './scene/CookingItems';
import { CameraController } from './scene/CameraController';
import { Effects } from './scene/Effects';

import { GameHUD } from './ui/GameHUD';
import { IntroModal } from './ui/IntroModal';
import { StageActionBanner } from './ui/StageActionBanner';
import { KuzhiCounterModal } from './ui/KuzhiCounterModal';
import { PrankModal } from './ui/PrankModal';
import { ResultScreen } from './ui/ResultScreen';
import { AmmachiBubble } from './ui/AmmachiBubble';

import './App.css';

export default function App() {
  const {
    state,
    advance,
    setPhase,
    setMixProgress,
    addIngredient,
    setHeatLevel,
    toggleKuzhiCounted,
    resetKuzhiCount,
    recordCompletionTime,
    reset,
  } = useGameState();

  const [isMuted, setIsMuted] = useState(false);
  const [kuzhiStates, setKuzhiStates] = useState(state.kuzhiStates);
  const cookingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const [isDraggingItem, setIsDraggingItem] = useState(false);

  // Ammachi's live reactive dialogue
  const [ammachiDialogue, setAmmachiDialogue] = useState<string>(
    MALAYALAM_PHASE_CONTENT[state.phase]?.ammachiTip || 'ഉണ്ണിയപ്പം ഉണ്ടാക്കാം!'
  );

  // Update Ammachi tip when phase changes
  useEffect(() => {
    const tip = MALAYALAM_PHASE_CONTENT[state.phase]?.ammachiTip;
    if (tip) {
      setAmmachiDialogue(tip);
    }
  }, [state.phase]);

  useEffect(() => {
    setKuzhiStates(state.kuzhiStates);
  }, [state.kuzhiStates]);

  const handleToggleMute = useCallback(() => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleAddIngredient = useCallback((name: keyof typeof state.ingredientsAdded) => {
    addIngredient(name);
    const reactions = AMMACHI_REACTIONS[name];
    if (reactions && reactions.length > 0) {
      const chosen = reactions[Math.floor(Math.random() * reactions.length)];
      setAmmachiDialogue(chosen);
    }
  }, [addIngredient]);

  const handleAddAllIngredients = useCallback(() => {
    (['banana', 'jaggery', 'cardamom', 'batter'] as const).forEach((ing) => {
      addIngredient(ing);
    });
    audio.playSuccessChime();
    setAmmachiDialogue('ചേരുവകളെല്ലാം ചേർത്തു! ഇനി തവിയെടുത്ത് നല്ലോണം ഇളക്കിക്കോ! 🥣💪');
  }, [addIngredient]);

  const handleMixProgressDelta = useCallback((delta: number) => {
    const newProgress = Math.min(100, state.mixProgress + delta);
    setMixProgress(newProgress);
    if (newProgress >= 100 && state.mixProgress < 100) {
      audio.playSuccessChime();
      setAmmachiDialogue('ആഹാ! മാവ് നല്ല വെണ്ണ പോലെ മയപ്പെട്ടു! ഇനി ചട്ടി ചൂടാക്കാം! ✨👌');
    }
  }, [state.mixProgress, setMixProgress]);

  const handleFastMix = useCallback(() => {
    audio.playStir();
    setMixProgress(100);
    audio.playSuccessChime();
    setAmmachiDialogue('വേഗത്തിൽ മാവ് കുഴച്ചു! കട്ടയൊന്നുമില്ലാത്ത നല്ല കിടിലൻ മാവ്! 🥄✨');
  }, [setMixProgress]);

  const handleSetHeat = useCallback((level: HeatLevel) => {
    setHeatLevel(level);
    audio.playClick();
    if (level === 'HIGH') {
      audio.playWarningBuzzer();
      const highReactions = AMMACHI_REACTIONS.heatHigh;
      setAmmachiDialogue(highReactions[Math.floor(Math.random() * highReactions.length)]);
    } else if (level === 'MEDIUM') {
      audio.playSuccessChime();
      const medReactions = AMMACHI_REACTIONS.heatMedium;
      setAmmachiDialogue(medReactions[Math.floor(Math.random() * medReactions.length)]);
    } else if (level === 'LOW') {
      setAmmachiDialogue(AMMACHI_REACTIONS.heatLow[0]);
    }
  }, [setHeatLevel]);

  const handleToggleStoveKnob = useCallback(() => {
    const levels: HeatLevel[] = ['OFF', 'LOW', 'MEDIUM', 'HIGH'];
    const currIdx = levels.indexOf(state.cooking.heatLevel);
    const nextLevel = levels[(currIdx + 1) % levels.length];
    handleSetHeat(nextLevel);
  }, [state.cooking.heatLevel, handleSetHeat]);

  const handleFillAllOil = useCallback(() => {
    audio.playPour();
    setKuzhiStates((prev) => {
      const updated = { ...prev };
      KUZHI_IDS.forEach((id) => {
        updated[id] = { ...updated[id], fillState: 'OILED' };
      });
      return updated;
    });
    setAmmachiDialogue(AMMACHI_REACTIONS.oiled[0]);
  }, []);

  const handleFillKuzhiWithOil = useCallback((id?: KuzhiId) => {
    audio.playPour();
    setKuzhiStates((prev) => {
      const updated = { ...prev };
      if (id) {
        updated[id] = { ...updated[id], fillState: 'OILED' };
      } else {
        const nextEmpty = KUZHI_IDS.find(k => updated[k].fillState === 'EMPTY');
        if (nextEmpty) {
          updated[nextEmpty] = { ...updated[nextEmpty], fillState: 'OILED' };
        }
      }
      return updated;
    });
  }, []);

  const handleFillAllBatter = useCallback(() => {
    audio.playPour();
    setKuzhiStates((prev) => {
      const updated = { ...prev };
      KUZHI_IDS.forEach((id) => {
        updated[id] = { ...updated[id], fillState: 'BATTER' };
      });
      return updated;
    });
    setAmmachiDialogue(AMMACHI_REACTIONS.batterPoured[0]);
  }, []);

  const handleFillKuzhiWithBatter = useCallback((id?: KuzhiId) => {
    audio.playPour();
    setKuzhiStates((prev) => {
      const updated = { ...prev };
      if (id) {
        updated[id] = { ...updated[id], fillState: 'BATTER' };
      } else {
        const nextOiled = KUZHI_IDS.find(k => updated[k].fillState === 'OILED' || updated[k].fillState === 'EMPTY');
        if (nextOiled) {
          updated[nextOiled] = { ...updated[nextOiled], fillState: 'BATTER' };
        }
      }
      return updated;
    });
  }, []);

  const handleFlipAll = useCallback(() => {
    audio.playFlip();
    setKuzhiStates((prev) => {
      const updated = { ...prev };
      KUZHI_IDS.forEach((id) => {
        updated[id] = { ...updated[id], isFlipped: true, cookProgress: 1.0, isReady: true };
      });
      return updated;
    });
    const flipLines = AMMACHI_REACTIONS.flipped;
    setAmmachiDialogue(flipLines[Math.floor(Math.random() * flipLines.length)]);
  }, []);

  const handleFlipKuzhi = useCallback((id?: KuzhiId) => {
    audio.playFlip();
    if (id) {
      setKuzhiStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isFlipped: true, cookProgress: 1.0, isReady: true },
      }));
    }
  }, []);

  useEffect(() => {
    if (state.phase === 'COOK') {
      audio.startSizzle();
      let progress = 0;
      cookingTimerRef.current = setInterval(() => {
        progress += 0.08;
        setKuzhiStates((prev) => {
          const updated = { ...prev };
          KUZHI_IDS.forEach((id) => {
            updated[id] = { ...updated[id], cookProgress: Math.min(1.0, progress), fillState: 'COOKING' };
          });
          return updated;
        });

        if (progress >= 0.9) {
          if (cookingTimerRef.current) clearInterval(cookingTimerRef.current);
        }
      }, 200);

      return () => {
        if (cookingTimerRef.current) clearInterval(cookingTimerRef.current);
      };
    } else {
      audio.stopSizzle();
    }
  }, [state.phase]);

  const handleKuzhiClick = useCallback((id: KuzhiId) => {
    if (state.phase === 'COUNT_KUZHI') {
      const willBeCounted = !kuzhiStates[id]?.isCounted;
      toggleKuzhiCounted(id);
      const nextCount = state.kuzhiCount + (willBeCounted ? 1 : 0);
      audio.playKuzhiPing(nextCount);
      audio.triggerHaptic('light');
      setAmmachiDialogue(AMMACHI_REACTIONS.kuzhiTap(nextCount));
    } else if (state.phase === 'ADD_OIL') {
      handleFillKuzhiWithOil(id);
    } else if (state.phase === 'POUR_BATTER') {
      handleFillKuzhiWithBatter(id);
    } else if (state.phase === 'FLIP') {
      handleFlipKuzhi(id);
    }
  }, [state.phase, state.kuzhiCount, kuzhiStates, toggleKuzhiCounted, handleFillKuzhiWithOil, handleFillKuzhiWithBatter, handleFlipKuzhi]);

  const handleServe = useCallback(() => {
    audio.playSuccessChime();
    setAmmachiDialogue(AMMACHI_REACTIONS.served[0]);
    advance();
  }, [advance]);

  const handleSubmitCount = useCallback(() => {
    recordCompletionTime();
    setPhase('PRANK');
  }, [recordCompletionTime, setPhase]);

  // 3D Camera Quick Angle Switcher
  const handleRotateCamera = useCallback((angle: 'iso' | 'close' | 'top' | 'side') => {
    if (!orbitRef.current) return;
    audio.playClick();
    if (angle === 'iso') {
      orbitRef.current.object.position.set(2.2, 3.1, 3.6);
      orbitRef.current.target.set(0, 0.48, 0.45);
    } else if (angle === 'close') {
      orbitRef.current.object.position.set(0, 1.8, 1.6);
      orbitRef.current.target.set(0, 0.48, 0.45);
    } else if (angle === 'top') {
      orbitRef.current.object.position.set(0.12, 1.85, 0.352);
      orbitRef.current.target.set(0.12, 0.552, 0.35);
    } else if (angle === 'side') {
      orbitRef.current.object.position.set(-2.2, 2.2, 1.8);
      orbitRef.current.target.set(0, 0.48, 0.45);
    }
    orbitRef.current.update();
  }, []);

  const currentPhaseContent = MALAYALAM_PHASE_CONTENT[state.phase] || {
    malayalamObjective: '',
    englishObjective: '',
  };

  const isOverheating = state.cooking.heatLevel === 'HIGH' && (state.phase === 'HEAT_PAN' || state.phase === 'COOK');

  return (
    <div className="game-viewport">
      {/* ── 3D Canvas Layer ───────────────────── */}
      <div className="three-canvas-layer">
        <Canvas
          shadows
          camera={{ position: [2.2, 3.1, 3.6], fov: 42 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          {/* Soft Warm Diorama Lighting */}
          <ambientLight intensity={0.8} color="#fff8ec" />
          <directionalLight
            position={[4, 7, 5]}
            intensity={1.4}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
            shadow-radius={2}
          />
          <directionalLight position={[1, 3, -3]} intensity={0.6} color="#ffe8b3" />
          <pointLight position={[0, 1.4, 0.45]} intensity={0.6} color="#fff0d0" distance={3} />

          {/* Diorama Kitchen Scene */}
          <Kitchen />

          {/* Hero Appachatti Pan */}
          <Appachatti
            pos={[0.12, 0.552, 0.35]}
            phase={state.phase}
            kuzhiStates={kuzhiStates}
            onKuzhiClick={handleKuzhiClick}
          />

          {/* Low-Poly Interactive Props */}
          <CookingItems
            phase={state.phase}
            ingredients={state.ingredientsAdded}
            onAddIngredient={handleAddIngredient}
            mixProgress={state.mixProgress}
            onMixProgressDelta={handleMixProgressDelta}
            heatLevel={state.cooking.heatLevel}
            onToggleStoveKnob={handleToggleStoveKnob}
            onFillKuzhiWithOil={handleFillKuzhiWithOil}
            onFillKuzhiWithBatter={handleFillKuzhiWithBatter}
            setIsDragging={setIsDraggingItem}
          />

          {/* Dynamic Steam, White Smoke & Overheat Black Smoke */}
          <Effects phase={state.phase} heatLevel={state.cooking.heatLevel} />

          {/* Isometric Camera Transitions */}
          <CameraController phase={state.phase} />

          {/* Free 3D Orbit Controls */}
          <OrbitControls
            ref={orbitRef}
            enabled={!isDraggingItem && state.phase !== 'PRANK'}
            enablePan={!isDraggingItem}
            enableRotate={!isDraggingItem}
            enableZoom={!isDraggingItem}
            enableDamping={true}
            dampingFactor={0.08}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={1.0}
            maxDistance={6.5}
            target={[0.12, 0.48, 0.45]}
          />
        </Canvas>
      </div>

      {/* ── Top Game HUD with 3D Camera Switcher ── */}
      <GameHUD
        phase={state.phase}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReset={reset}
        objectiveMalayalam={
          isOverheating
            ? '⚠️ തീ കൂടി കരിഞ്ഞുപോവും! നോബ് Medium-ലേക്ക് മാറ്റൂ!'
            : currentPhaseContent.malayalamObjective
        }
        objectiveEnglish={
          isOverheating
            ? 'Pan is overheating in high flame! Turn knob down to Medium'
            : currentPhaseContent.englishObjective
        }
        isOverheating={isOverheating}
        onRotateCamera={handleRotateCamera}
      />

      {/* ── Live Malayalam Ammachi / Chef Commentary Bubble ── */}
      {state.phase !== 'INTRO' && state.phase !== 'PRANK' && state.phase !== 'RESULT' && (
        <AmmachiBubble
          currentText={ammachiDialogue}
          avatar="👵"
          author="അമ്മായി"
          onRefreshDialogue={() => {
            const list = [
              'ഉണ്ണിയപ്പത്തിന് നല്ല നാടൻ വെളിച്ചെണ്ണ തന്നെ വേണം! 🥥',
              'ചായയിലിടാൻ കുറച്ചു ഏലക്കായയും ഇഞ്ചിയും ചതച്ചു വെച്ചോ! ☕',
              'അപ്പം തിന്നാൻ വരുന്ന അളിയന് കൊടുക്കാൻ 2 എണ്ണം മാറ്റി വെക്കണം! 😂',
              'അരിപ്പൊടി വറുത്തതാണോ എന്ന് ഒരിക്കൽ കൂടി നോക്കിക്കോ! 🍚',
              'ഇത്രേം നല്ല ഉണ്ണിയപ്പം ഈ നാട്ടിൽ വേറെ ആരും ഉണ്ടാക്കിയിട്ടുണ്ടാവില്ല! 🏆',
            ];
            setAmmachiDialogue(list[Math.floor(Math.random() * list.length)]);
          }}
        />
      )}

      {/* ── Intro Modal ───────────────────────── */}
      {state.phase === 'INTRO' && (
        <IntroModal onStart={() => setPhase('PREPARE_INGREDIENTS')} />
      )}

      {/* ── Compact Floating Action Controls ──── */}
      <StageActionBanner
        phase={state.phase}
        ingredients={state.ingredientsAdded}
        onAddAllIngredients={handleAddAllIngredients}
        mixProgress={state.mixProgress}
        onFastMix={handleFastMix}
        heatLevel={state.cooking.heatLevel}
        onSetHeat={handleSetHeat}
        onFillAllOil={handleFillAllOil}
        onFillAllBatter={handleFillAllBatter}
        kuzhiStates={kuzhiStates}
        onFlipAll={handleFlipAll}
        onServeAppam={handleServe}
        onAdvance={advance}
      />

      {/* ── Step 9: Kuzhi Inspection Card ─────── */}
      {state.phase === 'COUNT_KUZHI' && (
        <KuzhiCounterModal
          count={state.kuzhiCount}
          onResetCount={resetKuzhiCount}
          onSubmitCount={handleSubmitCount}
        />
      )}

      {/* ── The Prank Reveal Modal ────────────── */}
      {state.phase === 'PRANK' && (
        <PrankModal onContinueToResult={() => setPhase('RESULT')} />
      )}

      {/* ── Final Result Statistics ───────────── */}
      {state.phase === 'RESULT' && (
        <ResultScreen
          timeElapsedMs={state.completionTime}
          kuzhiCounted={state.kuzhiCount}
          onReplay={reset}
        />
      )}
    </div>
  );
}
