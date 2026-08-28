// ─────────────────────────────────────────────
//  GameState.ts — Central state store
// ─────────────────────────────────────────────
import type {
  GameStateData, GamePhase, KuzhiId,
  IngredientState, KuzhiState, CookingState,
} from '../types/game';
import { KUZHI_IDS } from '../types/game';

function makeKuzhiStates(): Record<KuzhiId, KuzhiState> {
  const result = {} as Record<KuzhiId, KuzhiState>;
  KUZHI_IDS.forEach((id) => {
    result[id] = {
      id,
      fillState: 'EMPTY',
      cookProgress: 0,
      isReady: false,
      isCounted: false,
      isFlipped: false,
    };
  });
  return result;
}

const defaultIngredients: IngredientState = {
  banana: false,
  jaggery: false,
  cardamom: false,
  batter: false,
};

const defaultCooking: CookingState = {
  heatLevel: 'OFF',
  panTemperature: 0,
  oilAdded: false,
  allKuzhiFilled: false,
  allFlipped: false,
  allReady: false,
};

export function createInitialGameState(): GameStateData {
  return {
    phase: 'INTRO',
    mixProgress: 0,
    ingredientsAdded: { ...defaultIngredients },
    kuzhiStates: makeKuzhiStates(),
    cooking: { ...defaultCooking },
    kuzhiCount: 0,
    completionTime: 0,
    startTime: Date.now(),
  };
}

const ALLOWED_TRANSITIONS: Partial<Record<GamePhase, GamePhase>> = {
  INTRO:               'PREPARE_INGREDIENTS',
  TUTORIAL:            'PREPARE_INGREDIENTS',
  PREPARE_INGREDIENTS: 'MIX_BATTER',
  MIX_BATTER:          'HEAT_PAN',
  HEAT_PAN:            'ADD_OIL',
  ADD_OIL:             'POUR_BATTER',
  POUR_BATTER:         'COOK',
  COOK:                'FLIP',
  FLIP:                'SERVE',
  SERVE:               'COUNT_KUZHI',
  COUNT_KUZHI:         'PRANK',
  PRANK:               'RESULT',
  RESULT:              'INTRO',
};

export function nextPhase(current: GamePhase): GamePhase {
  return ALLOWED_TRANSITIONS[current] ?? current;
}
