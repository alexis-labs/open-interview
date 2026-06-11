import { loadSettings } from '../engine/settingsStore';
import { SOUND_IDS, type SoundId } from './soundIds';

type ZzfxParams = [
  volume?: number,
  randomness?: number,
  frequency?: number,
  attack?: number,
  sustain?: number,
  release?: number,
  shape?: number,
  shapeCurve?: number,
  slide?: number,
  deltaSlide?: number,
  pitchJump?: number,
  pitchJumpTime?: number,
  repeatTime?: number,
  noise?: number,
  modulation?: number,
  bitCrush?: number,
  delay?: number,
  sustainVolume?: number,
  decay?: number,
  tremolo?: number,
];

const ZZFX_SAMPLE_RATE = 44_100;
const MASTER_VOLUME = 0.38;

const DEBOUNCE_MS: Partial<Record<SoundId, number>> = {
  [SOUND_IDS.paper]: 100,
  [SOUND_IDS.uiHover]: 80,
};

const lastPlayedAt: Partial<Record<SoundId, number>> = {};

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;

const SOUND_PARAMS: Record<SoundId, ZzfxParams> = {
  [SOUND_IDS.stampWindup]: [0.32, 0.02, 155, 0.025, 0.03, 0.12, 0, 1.2, -80, 0, 0, 0, 0, 0.02],
  [SOUND_IDS.stampImpact]: [0.58, 0.035, 72, 0.012, 0.035, 0.22, 0, 1.35, -95, -1, 0, 0, 0, 0.18],
  [SOUND_IDS.correct]: [0.34, 0.015, 440, 0.035, 0.08, 0.28, 0, 1.05, 90, 0, 110, 0.08, 0, 0, 0.03],
  [SOUND_IDS.wrong]: [0.34, 0.02, 185, 0.025, 0.1, 0.34, 0, 1.15, -95, -0.8, -35, 0.12, 0, 0.02, 0.04],
  [SOUND_IDS.cashGain]: [0.34, 0.015, 660, 0.025, 0.06, 0.24, 0, 1.05, 85, 0, 120, 0.08, 0, 0, 0.02, 0, 0.05],
  [SOUND_IDS.cashLoss]: [0.3, 0.02, 150, 0.025, 0.08, 0.28, 0, 1.1, -65, -0.6, 0, 0, 0, 0.03, 0.04],
  [SOUND_IDS.paper]: [0.22, 0.08, 1200, 0.006, 0.03, 0.12, 4, 1.25, -55, 0, 0, 0, 0, 0.68, 0, 2],
  [SOUND_IDS.uiHover]: [0.12, 0.005, 420, 0.01, 0.012, 0.055, 0, 1.05, 22],
  [SOUND_IDS.uiConfirm]: [0.28, 0.01, 390, 0.025, 0.06, 0.2, 0, 1.05, 90, 0, 95, 0.08],
  [SOUND_IDS.seal]: [0.44, 0.02, 260, 0.035, 0.14, 0.42, 0, 1.05, 55, 0, 120, 0.12, 0, 0.035, 0.03, 0, 0.08],
};

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioContext({ sampleRate: ZZFX_SAMPLE_RATE });
    masterGain = audioContext.createGain();
    masterGain.gain.value = MASTER_VOLUME;
    masterGain.connect(audioContext.destination);
  }
  return audioContext;
}

function zzfxBuffer(ctx: AudioContext, params: ZzfxParams): AudioBuffer {
  let [
    volume = 1,
    randomness = 0.05,
    frequency = 220,
    attack = 0,
    sustain = 0,
    release = 0.1,
    shape = 0,
    shapeCurve = 1,
    slide = 0,
    deltaSlide = 0,
    pitchJump = 0,
    pitchJumpTime = 0,
    repeatTime = 0,
    noise = 0,
    modulation = 0,
    bitCrush = 0,
    delay = 0,
    sustainVolume = 1,
    decay = 0,
    tremolo = 0,
  ] = params;

  frequency *= 1 + randomness * (Math.random() * 2 - 1);

  const attackSamples = Math.max(0, attack * ZZFX_SAMPLE_RATE);
  const sustainSamples = Math.max(0, sustain * ZZFX_SAMPLE_RATE);
  const releaseSamples = Math.max(1, release * ZZFX_SAMPLE_RATE);
  const delaySamples = Math.max(0, delay * ZZFX_SAMPLE_RATE);
  const length = Math.max(1, Math.ceil(attackSamples + sustainSamples + releaseSamples + delaySamples));
  const buffer = ctx.createBuffer(1, length, ZZFX_SAMPLE_RATE);
  const data = buffer.getChannelData(0);

  let phase = 0;
  let crushSample = 0;
  let crushHold = 0;
  let slidePerSample = slide / ZZFX_SAMPLE_RATE ** 2;
  const deltaSlidePerSample = deltaSlide / ZZFX_SAMPLE_RATE ** 3;
  const jumpSample = pitchJumpTime * ZZFX_SAMPLE_RATE;
  const repeatSample = repeatTime * ZZFX_SAMPLE_RATE;
  const startFrequency = frequency;

  for (let i = 0; i < length; i += 1) {
    if (repeatSample && i && i % repeatSample < 1) {
      frequency = startFrequency;
      slidePerSample = slide / ZZFX_SAMPLE_RATE ** 2;
    }
    if (pitchJump && i > jumpSample) {
      frequency += pitchJump;
      pitchJump = 0;
    }

    let envelope = 1;
    if (i < attackSamples) {
      envelope = attackSamples ? i / attackSamples : 1;
    } else if (i < attackSamples + sustainSamples) {
      const progress = sustainSamples ? (i - attackSamples) / sustainSamples : 1;
      envelope = 1 - progress * (1 - sustainVolume);
    } else {
      const progress = Math.min(1, (i - attackSamples - sustainSamples) / releaseSamples);
      envelope = (1 - progress) ** (decay || 1);
    }

    frequency = Math.max(20, frequency + slidePerSample * ZZFX_SAMPLE_RATE);
    slidePerSample += deltaSlidePerSample * ZZFX_SAMPLE_RATE;
    phase += (frequency * Math.PI * 2) / ZZFX_SAMPLE_RATE;

    const mod = modulation ? Math.sin((phase * modulation) / 100) : 0;
    const shapedPhase = phase + mod;
    let sample =
      shape === 1
        ? 1 - 4 * Math.abs(Math.round(shapedPhase / Math.PI / 2) - shapedPhase / Math.PI / 2)
        : shape === 2
          ? Math.sign(Math.sin(shapedPhase))
          : shape === 3
            ? (2 * (shapedPhase / (Math.PI * 2) - Math.floor(0.5 + shapedPhase / (Math.PI * 2))))
            : shape === 4
              ? Math.random() * 2 - 1
              : Math.sin(shapedPhase);

    if (noise) sample = sample * (1 - noise) + (Math.random() * 2 - 1) * noise;
    sample = Math.sign(sample) * Math.abs(sample) ** shapeCurve;
    if (tremolo) sample *= 1 - tremolo / 2 + (tremolo / 2) * Math.sin((Math.PI * 2 * i) / ZZFX_SAMPLE_RATE * 18);
    if (bitCrush) {
      crushHold += 1;
      if (crushHold >= bitCrush) {
        crushHold = 0;
        crushSample = sample;
      }
      sample = crushSample;
    }

    data[i] = Math.max(-1, Math.min(1, sample * envelope * volume));
  }

  if (delaySamples > 0) {
    for (let i = delaySamples; i < length; i += 1) {
      data[i] += data[i - delaySamples] * 0.35;
    }
  }

  return buffer;
}

function pitchShift(params: ZzfxParams, pitch: number): ZzfxParams {
  const next = [...params] as ZzfxParams;
  next[2] = (next[2] ?? 220) * pitch;
  next[8] = (next[8] ?? 0) * pitch;
  next[10] = (next[10] ?? 0) * pitch;
  return next;
}

function pitchVariance(): number {
  return 0.94 + Math.random() * 0.12;
}

function playZzfx(id: SoundId, volume: number, pitch: number): void {
  const ctx = ensureContext();
  if (!ctx || !masterGain) return;

  const params = pitchShift(SOUND_PARAMS[id], pitch);
  params[0] = (params[0] ?? 1) * volume;

  const source = ctx.createBufferSource();
  source.buffer = zzfxBuffer(ctx, params);
  source.connect(masterGain);
  source.start();
}

export const soundManager = {
  async init(): Promise<void> {
    const ctx = ensureContext();
    if (ctx?.state === 'suspended') await ctx.resume();
  },

  play(id: SoundId, options?: { volume?: number; pitch?: number }): void {
    const settings = loadSettings();
    if (!settings.soundEnabled) return;

    const now = Date.now();
    const debounce = DEBOUNCE_MS[id];
    if (debounce && lastPlayedAt[id] && now - lastPlayedAt[id]! < debounce) return;
    lastPlayedAt[id] = now;

    const ctx = ensureContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();

    const volume = (options?.volume ?? 1) * settings.sfxVolume;
    const pitch = options?.pitch ?? pitchVariance();
    playZzfx(id, volume, pitch);
  },

  /** Test helper - reset singleton state. */
  _resetForTests(): void {
    if (audioContext && audioContext.state !== 'closed') {
      void audioContext.close();
    }
    audioContext = null;
    masterGain = null;
    Object.keys(lastPlayedAt).forEach((key) => {
      delete lastPlayedAt[key as SoundId];
    });
  },
};

export interface DecisionJuiceParams {
  decision: 'hire' | 'reject';
  correct: boolean;
  delta: number;
}

const decisionTimeouts: ReturnType<typeof setTimeout>[] = [];

export function playDecisionJuice({ correct, delta }: DecisionJuiceParams): void {
  clearDecisionJuice();
  decisionTimeouts.push(
    setTimeout(() => soundManager.play(SOUND_IDS.stampWindup), 0),
    setTimeout(() => soundManager.play(SOUND_IDS.stampImpact), 60),
    setTimeout(() => soundManager.play(correct ? SOUND_IDS.correct : SOUND_IDS.wrong), 100),
    setTimeout(() => soundManager.play(delta > 0 ? SOUND_IDS.cashGain : SOUND_IDS.cashLoss), 180),
  );
}

export function clearDecisionJuice(): void {
  while (decisionTimeouts.length > 0) {
    clearTimeout(decisionTimeouts.pop()!);
  }
}
