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
