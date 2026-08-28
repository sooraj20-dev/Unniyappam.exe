// ─────────────────────────────────────────────
//  game.ts  —  Centralized type definitions
// ─────────────────────────────────────────────

export type GamePhase =
  | 'INTRO'
  | 'TUTORIAL'
  | 'PREPARE_INGREDIENTS'
  | 'MIX_BATTER'
  | 'HEAT_PAN'
  | 'ADD_OIL'
  | 'POUR_BATTER'
  | 'COOK'
  | 'FLIP'
  | 'SERVE'
  | 'COUNT_KUZHI'
  | 'PRANK'
  | 'RESULT';

export type KuzhiId =
  | 'KUZHI_01' | 'KUZHI_02' | 'KUZHI_03'
  | 'KUZHI_04' | 'KUZHI_05' | 'KUZHI_06'
  | 'KUZHI_07' | 'KUZHI_08' | 'KUZHI_09'
  | 'KUZHI_10' | 'KUZHI_11' | 'KUZHI_12'
  | 'KUZHI_13' | 'KUZHI_14' | 'KUZHI_15';

export type KuzhiFillState = 'EMPTY' | 'OILED' | 'BATTER' | 'COOKING' | 'READY';
export type UnniyappamCookState = 'RAW' | 'COOKING' | 'COOKED';
export type HeatLevel = 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface KuzhiState {
  id: KuzhiId;
  fillState: KuzhiFillState;
  cookProgress: number; // 0–1
  isReady: boolean;
  isCounted: boolean;
  isFlipped: boolean;
}

export interface IngredientState {
  banana: boolean;
  jaggery: boolean;
  cardamom: boolean;
  batter: boolean;
}

export interface CookingState {
  heatLevel: HeatLevel;
  panTemperature: number;
  oilAdded: boolean;
  allKuzhiFilled: boolean;
  allFlipped: boolean;
  allReady: boolean;
}

export interface GameStateData {
  phase: GamePhase;
  mixProgress: number;       // 0–100
  ingredientsAdded: IngredientState;
  kuzhiStates: Record<KuzhiId, KuzhiState>;
  cooking: CookingState;
  kuzhiCount: number;        // player's counted total
  completionTime: number;    // ms
  startTime: number;
}

export const KUZHI_IDS: KuzhiId[] = [
  'KUZHI_01','KUZHI_02','KUZHI_03','KUZHI_04','KUZHI_05',
  'KUZHI_06','KUZHI_07','KUZHI_08','KUZHI_09','KUZHI_10',
  'KUZHI_11','KUZHI_12','KUZHI_13','KUZHI_14','KUZHI_15',
];

export const TOTAL_KUZHI = 15;

export const PHASE_LABELS: Record<GamePhase, string> = {
  INTRO:               'Welcome',
  TUTORIAL:            'Tutorial',
  PREPARE_INGREDIENTS: 'Ingredients',
  MIX_BATTER:          'Mix Batter',
  HEAT_PAN:            'Heat Pan',
  ADD_OIL:             'Add Oil',
  POUR_BATTER:         'Pour Batter',
  COOK:                'Sizzle & Cook',
  FLIP:                'Flip Appams',
  SERVE:               'Serve Plate',
  COUNT_KUZHI:         'Count Kuzhi',
  PRANK:               'Audit Result',
  RESULT:              'Final Statistics',
};

export const VISIBLE_PHASES: GamePhase[] = [
  'PREPARE_INGREDIENTS',
  'MIX_BATTER',
  'HEAT_PAN',
  'ADD_OIL',
  'POUR_BATTER',
  'COOK',
  'FLIP',
  'SERVE',
  'COUNT_KUZHI',
];
