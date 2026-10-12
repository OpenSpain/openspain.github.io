import { writeFileSync } from 'node:fs';

export function synth({ duration, out }) {
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('La duración de la música debe ser positiva.');
  const sampleRate = 48000;
  const samples = Math.ceil(duration * sampleRate);
  const left = new Float32Array(samples);
  const right = new Float32Array(samples);
  const chords = [
    [130.81, 164.81, 196, 246.94],
    [98, 146.83, 196, 246.94],
    [110, 164.81, 196, 261.63],
    [87.31, 130.81, 174.61, 220],
  ];
  const chordDuration = 8;
  const add = (index, l, r) => {
    if (index < samples) { left[index] += l; right[index] += r; }
  };

  for (let start = -2, chord = 0; start < duration; start += chordDuration, chord++) {
    const notes = chords[chord % chords.length];
    for (let k = 0; k < (chordDuration + 4) * sampleRate; k++) {
      const time = k / sampleRate;
      const index = Math.round((start + time) * sampleRate);
      if (index < 0) continue;
      const envelope = Math.min(1, time / 3, (chordDuration + 4 - time) / 4);
      for (const note of notes) {
        add(index, Math.sin(2 * Math.PI * note * time) * envelope * 0.025,
          Math.sin(2 * Math.PI * note * 1.001 * time) * envelope * 0.025);
      }
    }
    for (let step = 0; step < 4; step++) {
      const note = notes[[0, 2, 1, 3][step]] * 2;
      const onset = start + 2 + step * 2;
      for (let k = 0; k < 4 * sampleRate; k++) {
        const time = k / sampleRate;
        const index = Math.round((onset + time) * sampleRate);
        if (index < 0) continue;
        const envelope = Math.min(1, time / 0.035) * Math.exp(-time * 1.3);
        const tone = (Math.sin(2 * Math.PI * note * time)
          + 0.18 * Math.sin(2 * Math.PI * note * 2 * time)) * envelope * 0.075;
        add(index, tone * (step % 2 ? 0.85 : 1), tone * (step % 2 ? 1 : 0.85));
      }
    }
  }

  const buffer = Buffer.alloc(44 + samples * 4);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + samples * 4, 4); buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 4, 28);
  buffer.writeUInt16LE(4, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(samples * 4, 40);
  for (let i = 0; i < samples; i++) {
    const time = i / sampleRate;
    const fade = Math.min(1, time / 1.5, (duration - time) / 3);
    buffer.writeInt16LE(Math.round(left[i] * fade * 32767), 44 + i * 4);
    buffer.writeInt16LE(Math.round(right[i] * fade * 32767), 46 + i * 4);
  }
  writeFileSync(out, buffer);
}
