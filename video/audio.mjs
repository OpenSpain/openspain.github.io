// Synthesizes the soundtrack as a 16-bit stereo WAV, synced to the video's impact times.
import { writeFileSync } from 'node:fs';

export function synth({ duration, hits, flashes, pace = 1, out }) {
  const SR = 48000;
  const N = Math.ceil(duration * SR);
  const L = new Float32Array(N), R = new Float32Array(N);
  let seed = 7;
  const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 31 - 1; };
  const add = (i, l, r = l) => { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } };
  // Section times are authored at 120 BPM and stretched by the video's pace.
  const P = pace, CTA = 27 * P, BEAT = 0.5 * P;

  const kick = (t0, gain = 1) => {
    let ph = 0;
    for (let k = 0; k < SR * 0.6; k++) {
      const t = k / SR;
      const f = 42 + 160 * Math.exp(-t * 28);
      ph += 2 * Math.PI * f / SR;
      const v = Math.tanh(2.2 * Math.sin(ph) * Math.exp(-t * 6.5)) * gain * 0.7 + (t < 0.004 ? noise() * 0.5 * gain : 0);
      add(Math.round((t0 + t) * SR), v);
    }
  };
  const impact = (t0, gain = 1) => {
    kick(t0, gain * 1.2);
    let lp = 0;
    for (let k = 0; k < SR * 1.6; k++) {
      const t = k / SR;
      lp += (noise() - lp) * 0.08;
      const v = lp * Math.exp(-t * 3.2) * 0.9 * gain;
      add(Math.round((t0 + t) * SR), v, -v * 0.9 + lp * 0.1);
    }
  };
  const hat = (t0, gain = 1) => {
    let prev = 0;
    for (let k = 0; k < SR * 0.06; k++) {
      const n = noise(); const hp = n - prev; prev = n;
      add(Math.round((t0 + k / SR) * SR), hp * Math.exp(-k / SR * 70) * 0.12 * gain);
    }
  };
  const snare = t0 => {
    let ph = 0;
    for (let k = 0; k < SR * 0.25; k++) {
      const t = k / SR; ph += 2 * Math.PI * 190 / SR;
      add(Math.round((t0 + t) * SR), (noise() * 0.35 + Math.sin(ph) * 0.25) * Math.exp(-t * 18));
    }
  };
  const riser = (t0, t1) => {
    let lp = 0, ph = 0;
    for (let k = 0; k < (t1 - t0) * SR; k++) {
      const p = k / ((t1 - t0) * SR);
      lp += (noise() - lp) * (0.02 + 0.5 * p * p);
      ph += 2 * Math.PI * (200 + 1400 * p * p) / SR;
      const v = (lp * 0.5 + Math.sin(ph) * 0.06) * p * p * 0.7;
      add(Math.round((t0 + k / SR) * SR), v, v * (1 - 0.3 * Math.sin(p * 20)));
    }
  };

  // Sub bass drone in A minor; resolves to C major on the CTA.
  const notes = [[0, 55], [4.5 * P, 43.65], [10.5 * P, 49], [13.5 * P, 55], [18.5 * P, 43.65], [22.5 * P, 49], [25 * P, 41.2], [CTA, 65.41]];
  let ph = 0, ph2 = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const f = [...notes].reverse().find(n => t >= n[0])[1];
    ph += 2 * Math.PI * f / SR; ph2 += 2 * Math.PI * f * 2.003 / SR;
    const beatPos = (t % BEAT) / BEAT;
    const duck = t < CTA ? 0.35 + 0.65 * Math.min(1, beatPos * 3) : 1;
    const env = Math.min(1, t / 0.3) * (t > duration - 2.5 ? Math.max(0, (duration - t) / 2.5) : 1);
    const v = (Math.sin(ph) * 0.22 + Math.tanh(Math.sin(ph2) * 2) * 0.05) * duck * env;
    L[i] += v; R[i] += v;
  }
  // Warm pad on the CTA (C major), so the ending feels like an invitation.
  for (const [f, g] of [[261.63, .05], [329.63, .04], [392, .04], [523.25, .025]]) {
    let p1 = 0, p2 = 0;
    for (let i = Math.round(CTA * SR); i < N; i++) {
      const t = i / SR - CTA;
      p1 += 2 * Math.PI * f / SR; p2 += 2 * Math.PI * f * 1.004 / SR;
      const env = Math.min(1, t / 1.2) * Math.min(1, (duration - CTA - t) / 2.5);
      L[i] += Math.sin(p1) * g * env; R[i] += Math.sin(p2) * g * env;
    }
  }

  // Driving groove between the intro and the CTA.
  for (let t = 2.5 * P; t < CTA - 0.01; t += BEAT) {
    if (t >= 24.75 * P && t < CTA) continue;
    kick(t, 0.55);
    hat(t + BEAT / 2, 1);
    hat(t + BEAT * 0.75, 0.5);
    if (Math.round(t / BEAT) % 2 === 1 && t >= 4.5 * P) snare(t);
  }
  for (const h of hits) kick(h, h < 2.5 * P ? 0.9 : 0.5);
  for (const f of flashes) impact(f, Math.abs(f - CTA) < 1e-6 ? 1.3 : f === 0 ? 1 : 0.6);
  riser(23.5 * P, 25.0 * P);
  riser(25.6 * P, CTA);

  // Normalize, soft clip and write.
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = 0.95 / peak;
  const buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.round(Math.tanh(L[i] * g * 1.2) * 32000), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.tanh(R[i] * g * 1.2) * 32000), 46 + i * 4);
  }
  writeFileSync(out, buf);
}
