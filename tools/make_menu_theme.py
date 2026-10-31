"""Procedural main-menu theme for Finalist Arena (pure Python, no deps).
D minor, 70 BPM, 28 bars. Builds suspense: drone -> strings -> war drums ->
crowd cheer that warps into horror. Also renders a low-HP distorted variant.
Usage: python3 make_menu_theme.py [outdir]
"""
import math, random, struct, sys, wave

SR = 22050
BPM = 70
BEAT = 60.0 / BPM
BAR = BEAT * 4
BARS = 28
N = int(SR * BAR * BARS)
random.seed(7)

mix = [0.0] * N

def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)

def add(start, dur, fn, vol):
    s = int(start * SR)
    n = int(dur * SR)
    for i in range(n):
        j = s + i
        if j >= N:
            break
        mix[j] += fn(i / SR, dur) * vol

def env(t, d, a=0.05, r=0.3):
    if t < a:
        return t / a
    if t > d - r:
        return max(0.0, (d - t) / r)
    return 1.0

def drone(start, dur, midi, vol):
    f = hz(midi)
    def fn(t, d):
        wob = 1 + 0.003 * math.sin(2 * math.pi * 0.2 * t)
        v = math.sin(2 * math.pi * f * wob * t) + 0.5 * math.sin(2 * math.pi * f * 2.01 * t)
        return v * env(t, d, 2.0, 2.0)
    add(start, dur, fn, vol)

def strings(start, dur, midi, vol, detune=0.006):
    f = hz(midi)
    def fn(t, d):
        v = 0.0
        for k, dt in enumerate((-detune, 0, detune)):
            ff = f * (1 + dt)
            ph = (ff * t) % 1.0
            v += (2 * ph - 1) * (1 - 0.3 * k)
        vib = 1 + 0.15 * math.sin(2 * math.pi * 5.2 * t)
        return v * 0.33 * vib * env(t, d, 1.2, 1.2)
    add(start, dur, fn, vol)

def choir(start, dur, midi, vol):
    f = hz(midi)
    def fn(t, d):
        v = sum(math.sin(2 * math.pi * f * h * t) / h for h in (1, 2, 3, 4, 5))
        return v * 0.4 * env(t, d, 1.5, 1.5) * (0.8 + 0.2 * math.sin(2 * math.pi * 4.5 * t))
    add(start, dur, fn, vol)

def drum(start, vol, pitch=60.0, dur=0.5):
    def fn(t, d):
        f = pitch * (1 + 1.5 * math.exp(-t * 18))
        return (math.sin(2 * math.pi * f * t) + 0.25 * (random.random() * 2 - 1) * math.exp(-t * 30)) * math.exp(-t * 7)
    add(start, dur, fn, vol)

def metal(start, vol, dur=1.6):
    def fn(t, d):
        v = sum(math.sin(2 * math.pi * f * t) for f in (523.0, 811.0, 1234.0, 1678.0))
        return v * math.exp(-t * 3.0) * 0.25
    add(start, dur, fn, vol)

def scrape(start, dur, vol):
    state = [0.0]
    def fn(t, d):
        state[0] = 0.92 * state[0] + 0.08 * (random.random() * 2 - 1)
        return state[0] * 3 * env(t, d, 0.5, 0.5) * (0.5 + 0.5 * math.sin(2 * math.pi * 0.7 * t))
    add(start, dur, fn, vol)

def crowd(start, dur, vol, warp):
    # filtered noise swell (cheer) with a sliding formant; warp>0 makes it unsettling
    lp = [0.0, 0.0]
    def fn(t, d):
        w = random.random() * 2 - 1
        a = 0.10 + 0.05 * math.sin(2 * math.pi * (0.4 + warp) * t)
        lp[0] += a * (w - lp[0])
        lp[1] += a * (lp[0] - lp[1])
        swell = math.sin(math.pi * min(1.0, t / d)) ** 1.5
        return lp[1] * 9 * swell
    add(start, dur, fn, vol)

# Progression in D minor: Dm | Bb | Gm | A  (one chord per bar, 4-bar cycle)
chords = [(50, 53, 57, 62), (46, 53, 58, 62), (43, 50, 55, 58), (45, 52, 57, 61)]

for bar in range(BARS):
    t0 = bar * BAR
    ch = chords[bar % 4]
    # Section map: 0-3 intro drone; 4-11 strings; 12-19 drums+choir; 20-23 crowd/glory; 24-27 horror collapse
    if bar % 4 == 0:
        drone(t0, BAR * 4, 38, 0.30)
    if bar >= 4:
        for m in ch[1:]:
            strings(t0, BAR, m + 12 * (1 if bar >= 20 else 0), 0.10 + 0.002 * bar)
    if bar >= 12:
        for b in range(4):
            drum(t0 + b * BEAT, 0.55 if b == 0 else 0.35, 55)
        if bar >= 16:
            for b in (0.5, 1.5, 2.5, 3.5):
                drum(t0 + b * BEAT, 0.18, 90, 0.3)
        choir(t0, BAR, ch[0] + 24, 0.07)
    if bar in (3, 11, 19):
        scrape(t0 + BAR * 0.4, BAR * 0.6, 0.10)
    if bar >= 20 and bar < 24:
        crowd(t0, BAR, 0.20 + 0.04 * (bar - 20), 0.0)
        choir(t0, BAR, ch[3] + 24, 0.09)   # glory anthem lift
    if bar >= 24:
        # horror: crowd warps, dissonant tritone/minor-2nd cluster, metal hits, tempo of drums doubles
        crowd(t0, BAR, 0.22, 0.5 * (bar - 23))
        choir(t0, BAR, 62 + (bar - 24) * 0.5, 0.10)
        choir(t0, BAR, 68, 0.06)
        for b in range(8):
            drum(t0 + b * BEAT / 2, 0.30, 48 - (bar - 24))
        metal(t0 + BEAT * 2, 0.25)
    if bar % 8 == 0 and bar > 0:
        metal(t0, 0.2)

# Fade the final bar so the loop point lands in the intro drone smoothly
fade = int(SR * BAR * 2)
for i in range(fade):
    mix[N - 1 - i] *= i / fade

# simple comb reverb
def reverb(x, delays=(0.071, 0.113, 0.167), fb=0.35):
    out = x[:]
    for dly in delays:
        d = int(dly * SR)
        for i in range(d, len(out)):
            out[i] += fb * out[i - d] * 0.6
    return out

def normalize(x, peak=0.89):
    m = max(abs(v) for v in x) or 1.0
    return [v / m * peak for v in x]

def write(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v)) * 32767)) for v in x))

def low_hp(x):
    """Critical-health variant: low-pass, pitch wobble, bit-crush and soft clip + heartbeat."""
    out = []
    lp = 0.0
    for i, v in enumerate(x):
        # wobble via fractional read-back
        off = 40 * math.sin(2 * math.pi * 0.3 * i / SR)
        j = int(i - 60 - off)
        s = x[j] if 0 <= j < len(x) else 0.0
        lp += 0.12 * (s - lp)
        c = round(lp * 12) / 12.0           # bit-crush
        c = math.tanh(c * 3.0)              # distortion
        tb = (i / SR) % 0.9                 # heartbeat
        hb = (math.sin(2 * math.pi * 55 * tb) * math.exp(-tb * 14)
              + 0.7 * math.sin(2 * math.pi * 50 * (tb - 0.22)) * math.exp(-(tb - 0.22) * 14) * (tb > 0.22))
        out.append(c + 0.5 * hb)
    return out

if __name__ == '__main__':
    outdir = sys.argv[1] if len(sys.argv) > 1 else '.'
    base = normalize(reverb(mix))
    write(outdir + '/finalist_arena_main_menu.wav', base)
    write(outdir + '/finalist_arena_main_menu_lowhp.wav', normalize(low_hp(base)))
    print('duration %.1fs' % (N / SR))
