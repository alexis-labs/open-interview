import { loadSettings } from '../engine/settingsStore';
import { SOUND_FILES, SOUND_IDS, type SoundId } from './soundIds';

type ProceduralFn = (ctx: AudioContext, dest: AudioNode, volume: number, pitch: number) => void;

const DEBOUNCE_MS: Partial<Record<SoundId, number>> = {
  [SOUND_IDS.paper]: 100,
  [SOUND_IDS.uiHover]: 80,
};

const lastPlayedAt: Partial<Record<SoundId, number>> = {};

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let initialized = false;
const buffers = new Map<SoundId, AudioBuffer>();
const useProcedural = new Set<SoundId>();

const PROCEDURAL: Record<SoundId, ProceduralFn> = {
  [SOUND_IDS.stampWindup]: (ctx, dest, vol, pitch) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90 * pitch, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol * 0.35, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  },

  [SOUND_IDS.stampImpact]: (ctx, dest, vol, pitch) => {
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.08));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 420 * pitch;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.9, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);
    noise.start();

    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(95 * pitch, ctx.currentTime);
    thud.frequency.exponentialRampToValueAtTime(42 * pitch, ctx.currentTime + 0.1);
    thudGain.gain.setValueAtTime(vol * 0.7, ctx.currentTime);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
    thud.connect(thudGain);
    thudGain.connect(dest);
    thud.start();
    thud.stop(ctx.currentTime + 0.15);
  },

  [SOUND_IDS.correct]: (ctx, dest, vol, pitch) => {
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = ctx.currentTime + i * 0.055;
      osc.frequency.setValueAtTime(freq * pitch, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol * 0.45, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  },

  [SOUND_IDS.wrong]: (ctx, dest, vol, pitch) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(85 * pitch, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(vol * 0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  },

  [SOUND_IDS.cashGain]: (ctx, dest, vol, pitch) => {
    [880, 1174.66].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.04;
      osc.frequency.setValueAtTime(freq * pitch, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol * 0.5, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.14);
    });
  },

  [SOUND_IDS.cashLoss]: (ctx, dest, vol, pitch) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70 * pitch, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
  },

  [SOUND_IDS.paper]: (ctx, dest, vol, pitch) => {
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2200 * pitch;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start();
  },

  [SOUND_IDS.uiHover]: (ctx, dest, vol, pitch) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(640 * pitch, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol * 0.2, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  },

  [SOUND_IDS.uiConfirm]: (ctx, dest, vol, pitch) => {
    [440, 554.37, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = ctx.currentTime + i * 0.045;
      osc.frequency.setValueAtTime(freq * pitch, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol * 0.4, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.17);
    });
  },

  [SOUND_IDS.seal]: (ctx, dest, vol, pitch) => {
    playProcedural(SOUND_IDS.stampImpact, ctx, dest, vol * 1.1, pitch * 0.95);
    const notes = [392, 523.25, 659.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = ctx.currentTime + 0.08 + i * 0.06;
      osc.frequency.setValueAtTime(freq * pitch, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol * 0.4, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  },
};

function playProcedural(
  id: SoundId,
  ctx: AudioContext,
  dest: AudioNode,
  volume: number,
  pitch: number,
): void {
  PROCEDURAL[id](ctx, dest, volume, pitch);
}

function pitchVariance(): number {
  return 0.94 + Math.random() * 0.12;
}

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
  }
  return audioContext;
}

async function loadBuffer(id: SoundId, url: string): Promise<void> {
  const ctx = ensureContext();
  if (!ctx) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    buffers.set(id, decoded);
  } catch {
    useProcedural.add(id);
  }
}

export const soundManager = {
  async init(): Promise<void> {
    if (initialized) {
      const ctx = ensureContext();
      if (ctx?.state === 'suspended') await ctx.resume();
      return;
    }
    const ctx = ensureContext();
    if (!ctx) return;
    initialized = true;

    await Promise.all(
      (Object.entries(SOUND_FILES) as [SoundId, string][]).map(([id, url]) =>
        loadBuffer(id, url),
      ),
    );

    if (ctx.state === 'suspended') await ctx.resume();
  },

  play(id: SoundId, options?: { volume?: number; pitch?: number }): void {
    const settings = loadSettings();
    if (!settings.soundEnabled) return;

    const now = Date.now();
    const debounce = DEBOUNCE_MS[id];
    if (debounce && lastPlayedAt[id] && now - lastPlayedAt[id]! < debounce) return;
    lastPlayedAt[id] = now;

    const ctx = ensureContext();
    if (!ctx || !masterGain) return;
    if (ctx.state === 'suspended') void ctx.resume();

    const volume = (options?.volume ?? 1) * settings.sfxVolume;
    const pitch = options?.pitch ?? pitchVariance();

    const buffer = buffers.get(id);
    if (buffer && !useProcedural.has(id)) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = buffer;
      source.playbackRate.value = pitch;
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(masterGain);
      source.start();
      return;
    }

    playProcedural(id, ctx, masterGain, volume, pitch);
  },

  /** Test helper — reset singleton state */
  _resetForTests(): void {
    initialized = false;
    buffers.clear();
    useProcedural.clear();
    if (audioContext && audioContext.state !== 'closed') {
      void audioContext.close();
    }
    audioContext = null;
    masterGain = null;
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
    setTimeout(
      () => soundManager.play(correct ? SOUND_IDS.correct : SOUND_IDS.wrong),
      100,
    ),
    setTimeout(
      () => soundManager.play(delta > 0 ? SOUND_IDS.cashGain : SOUND_IDS.cashLoss),
      180,
    ),
  );
}

export function clearDecisionJuice(): void {
  while (decisionTimeouts.length > 0) {
    clearTimeout(decisionTimeouts.pop()!);
  }
}
