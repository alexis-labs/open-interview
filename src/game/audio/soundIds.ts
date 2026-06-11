export const SOUND_IDS = {
  stampWindup: 'stamp_windup',
  stampImpact: 'stamp_impact',
  correct: 'correct',
  wrong: 'wrong',
  cashGain: 'cash_gain',
  cashLoss: 'cash_loss',
  paper: 'paper',
  uiHover: 'ui_hover',
  uiConfirm: 'ui_confirm',
  seal: 'seal',
} as const;

export type SoundId = (typeof SOUND_IDS)[keyof typeof SOUND_IDS];

export const SOUND_FILES: Record<SoundId, string> = {
  [SOUND_IDS.stampWindup]: '/sounds/stamp-windup.wav',
  [SOUND_IDS.stampImpact]: '/sounds/stamp.wav',
  [SOUND_IDS.correct]: '/sounds/correct.wav',
  [SOUND_IDS.wrong]: '/sounds/wrong.wav',
  [SOUND_IDS.cashGain]: '/sounds/coin.wav',
  [SOUND_IDS.cashLoss]: '/sounds/coin-loss.wav',
  [SOUND_IDS.paper]: '/sounds/paper.wav',
  [SOUND_IDS.uiHover]: '/sounds/click.wav',
  [SOUND_IDS.uiConfirm]: '/sounds/confirm.wav',
  [SOUND_IDS.seal]: '/sounds/seal.wav',
};
