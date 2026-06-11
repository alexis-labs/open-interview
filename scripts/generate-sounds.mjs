/**
 * Generates minimal WAV SFX for public/sounds/.
 * Run: node scripts/generate-sounds.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'sounds');

function wavBuffer(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), 44 + i * 2);
  }
  return buffer;
}

function sineTone(freq, duration, sampleRate, envelope) {
  const n = Math.floor(duration * sampleRate);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    out[i] = Math.sin(2 * Math.PI * freq * t) * envelope(i / n);
  }
  return out;
}

function noiseBurst(duration, sampleRate, envelope) {
  const n = Math.floor(duration * sampleRate);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = (Math.random() * 2 - 1) * envelope(i / n);
  }
  return out;
}

function concat(...arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const arr of arrays) {
    out.set(arr, offset);
    offset += arr.length;
  }
  return out;
}

const exp = (p) => Math.exp(-p * 6);
const expSlow = (p) => Math.exp(-p * 3);

const sounds = {
  'stamp-windup.wav': concat(sineTone(180, 0.07, 44100, exp)),
  'stamp.wav': concat(
    noiseBurst(0.1, 44100, exp),
    sineTone(90, 0.12, 44100, expSlow),
  ),
  'correct.wav': concat(
    sineTone(523, 0.15, 44100, exp),
    sineTone(659, 0.15, 44100, exp),
    sineTone(784, 0.18, 44100, exp),
  ),
  'wrong.wav': sineTone(180, 0.25, 44100, (p) => (1 - p) * 0.6),
  'coin.wav': concat(sineTone(880, 0.1, 44100, exp), sineTone(1175, 0.12, 44100, exp)),
  'coin-loss.wav': sineTone(140, 0.2, 44100, expSlow),
  'paper.wav': noiseBurst(0.07, 44100, exp),
  'click.wav': sineTone(640, 0.04, 44100, exp),
  'confirm.wav': concat(
    sineTone(440, 0.12, 44100, exp),
    sineTone(554, 0.12, 44100, exp),
    sineTone(659, 0.14, 44100, exp),
  ),
  'seal.wav': concat(
    noiseBurst(0.12, 44100, exp),
    sineTone(85, 0.14, 44100, expSlow),
    sineTone(523, 0.15, 44100, exp),
  ),
};

mkdirSync(OUT, { recursive: true });
for (const [name, samples] of Object.entries(sounds)) {
  writeFileSync(join(OUT, name), wavBuffer(samples));
  console.log(`Wrote ${name}`);
}
