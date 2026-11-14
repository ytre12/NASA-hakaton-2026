#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
video_to_music.py — без графічного інтерфейсу.

Покадрово аналізує відео і перетворює кольори кадру на музику.

Правила:
  * Чотири цільові кольори, кожен має свою ноту (від найвищої до найнижчої):
        #d33322 -> A4 (найвища)
        #d15c31 -> G4 (нижча)
        #dc8241 -> E4 (ще нижча)
        #d5b775 -> C4 (найнижча)
  * Пікселі рахуються ПОПІКСЕЛЬНО. Кожен теплий піксель відноситься до
    НАЙБЛИЖЧОГО з чотирьох кольорів (у просторі RGB).
  * Пікселі, у яких R < 200 АБО R > 220, не рахуються взагалі.
  * Білий, сірий, кремовий і будь-який ненасичений колір не рахуються:
    потрібна насиченість >= MIN_SAT.
  * Відтінок мусить бути в "тепловому" секторі: від жовтого до червоного
    (HUE_MIN..360 та 0..HUE_MAX). Зелений/синій/фіолетовий відсікаються.
  * Пікселі, що занадто далеко від усіх чотирьох кольорів, теж не рахуються.
  * Частка кожного кольору в кадрі = гучність відповідної ноти.
    Якщо жодного кольору в кадрі немає — тиша.
  * Переходи між кадрами плавні (інтерполяція + згладжування).
  * Аудіо вдвічі довше за відео: відео в результаті сповільнюється у 2 рази,
    щоб картинка й ноти лишалися синхронними.

Результат:
  * MP4 з відео + згенерована музика;
  * окремий MP4 лише з музикою (без відеодоріжки);
  * (за бажанням) проміжний WAV.

Приклад:
    python3 video_to_music.py video.mp4
    python3 video_to_music.py video.mp4 -o result.mp4 --threshold 70
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
import wave

try:
    import numpy as np
except ImportError:
    sys.exit("Потрібен numpy:  python3 -m pip install --user numpy")


# ----------------------------------------------------------------------------
#  Налаштування
# ----------------------------------------------------------------------------

# (колір, MIDI-нота, назва) — порядок: від найвищої ноти до найнижчої
# TARGETS = [
#     ((0xD3, 0x33, 0x22), 69, "C3"),   # найвища
#     ((0xD1, 0x5C, 0x31), 67, "G2"),   # трохи нижча
#     ((0xDC, 0x82, 0x41), 64, "C#2"),   # ще нижча
#     ((0xD5, 0xB7, 0x75), 60, "C2"),   # найнижча
# ]
TARGETS = [
    ((0xE7, 0x6C, 0x46), 14, "F1"),  # найвища (головна «космічна» нота)
    ((0xD8, 0x87, 0x40), 18, "C1"),   # трохи нижча
    ((0xA2, 0x88, 0x5A), 13, "G1"),   # ще нижча
    ((0xF0, 0x96, 0x49), 16, "C1"),   # найнижча
]

COLORS = np.array([t[0] for t in TARGETS], dtype=np.int32)

MIN_RED = 195          # нижня межа R (під колір 0xA2 = 162)
MAX_RED = 215          # верхня межа R (під кольори 0xE7 = 231 та 0xF0 = 240)

MIN_SAT = 0.25         # мінімальна насиченість: білий/сірий/кремовий — геть
HUE_MAX = 60.0         # тепловий сектор: жовтий ... червоний (0..60°)
HUE_MIN = 350.0        # ... і червоний з іншого боку нуля (350..360°)
COLOR_THRESHOLD = 70.0 # максимальна RGB-відстань, щоб вважати піксель "своїм"

ANALYSIS_WIDTH = 640   # ширина кадру для аналізу (кольори беруться без усереднення)
SAMPLE_RATE = 44100
AUDIO_STRETCH = 1.0    # аудіо (і відео) у 2 рази довше
CONTROL_RATE = 1000    # частота керуючих значень (Гц) для плавних переходів

ATTACK = 0.10          # плавний вхід без різкого клацання на низьких частотах, с
RELEASE = 0.45         # об'ємний шлейф без «гудіння» при накладанні басів, с

REF_COVERAGE = 0.015   # менший поріг площі = ноти швидше виходять на повну гучність
VOICE_GAIN = 0.25      # максимум гучності без кліпінгу (4 * 0.25 = 1.0)

NOTE_PANS = [-0.40, 0.30, -0.10, 0.05]  # F#3 і C3 ширше в просторі, баси G2 і C2 — по центру

# ----------------------------------------------------------------------------
#  Утиліти
# ----------------------------------------------------------------------------

def find_ffmpeg():
    """ffmpeg з PATH, або вбудований бінарник із пакета imageio-ffmpeg."""
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit(
            "ffmpeg не знайдено.\n"
            "Встановіть його одним із способів:\n"
            "  python3 -m pip install --user imageio-ffmpeg\n"
            "  brew install ffmpeg"
        )


def probe_video(ffmpeg, path):
    """Повертає (duration_sec, fps, width, height)."""
    res = subprocess.run(
        [ffmpeg, "-hide_banner", "-i", path],
        capture_output=True, text=True, errors="replace"
    )
    text = res.stderr

    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", text)
    if not m:
        sys.exit("Не вдалося визначити тривалість відео:\n" + text[-800:])
    duration = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))

    m = re.search(r"(\d+(?:\.\d+)?)\s+fps", text)
    fps = float(m.group(1)) if m else 30.0

    m = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", text)
    if not m:
        sys.exit("Не вдалося визначити розмір кадру:\n" + text[-800:])
    width, height = int(m.group(1)), int(m.group(2))

    return duration, fps, width, height


def read_exact(stream, size):
    """Читає рівно size байтів; None на EOF."""
    chunks = []
    remaining = size
    while remaining > 0:
        chunk = stream.read(remaining)
        if not chunk:
            return None
        chunks.append(chunk)
        remaining -= len(chunk)
    return b"".join(chunks)


def midi_to_freq(midi):
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))


# ----------------------------------------------------------------------------
#  Аналіз кадрів
# ----------------------------------------------------------------------------

def analyze_video(ffmpeg, path, fps, width, height, threshold, min_red, max_red,
                  min_sat, hue_min, hue_max, verbose, analysis_width):
    """Декодує відео через ffmpeg і повертає частки 4 кольорів по кадрах."""

    # зменшуємо без усереднення (nearest), щоб кольори лишалися "чистими"
    aw = max(16, width)
    out_w = min(analysis_width, aw)
    out_h = int(round(height * (out_w / float(width)) / 2.0)) * 2
    out_h = max(2, out_h)

    cmd = [
        ffmpeg, "-v", "error", "-i", path,
        "-vf", "scale=%d:%d:flags=neighbor" % (out_w, out_h),
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"
    ]

    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    frame_bytes = out_w * out_h * 3
    total_pixels = float(out_w * out_h)

    ratios = []     # частка кожного кольору серед "своїх" пікселів (0..1)
    coverage = []   # частка кадру, зайнята кольорами (0..1)
    dominant = []   # індекс домінантного кольору, або -1

    frame_idx = 0

    print("Аналіз кадрів: %dx%d, fps=%.3f" % (out_w, out_h, fps))
    print("  цільові кольори: " + ", ".join(
        "#%02x%02x%02x→%s" % (c[0], c[1], c[2], n) for (c, _, n) in TARGETS
    ))
    print("  поріг відстані: %.0f | R у межах %d..%d" % (threshold, min_red, max_red))
    print("  насиченість >= %.2f | відтінок %.0f..360 та 0..%.0f°" % (min_sat, hue_min, hue_max))

    while True:
        buf = read_exact(proc.stdout, frame_bytes)
        if buf is None:
            break

        frame = np.frombuffer(buf, dtype=np.uint8).reshape(out_h, out_w, 3)

        r = frame[:, :, 0]
        red_ok = (r >= min_red) & (r <= max_red)

        px = None
        if red_ok.any():
            px = frame[red_ok].astype(np.int32)

            # --- фільтр насиченості та відтінку (HSV) ---
            mx = px.max(axis=1).astype(np.float64)
            mn = px.min(axis=1).astype(np.float64)
            delta = mx - mn
            sat = np.divide(delta, mx, out=np.zeros_like(delta), where=mx > 0)

            hue = np.zeros(len(px), dtype=np.float64)
            colorful = delta > 1e-6
            imax = px.argmax(axis=1)
            r0, g0, b0 = px[:, 0], px[:, 1], px[:, 2]

            is_r = (imax == 0) & colorful
            is_g = (imax == 1) & colorful
            is_b = (imax == 2) & colorful

            hue[is_r] = ((g0 - b0)[is_r] / delta[is_r]) % 6.0
            hue[is_g] = ((b0 - r0)[is_g] / delta[is_g]) + 2.0
            hue[is_b] = ((r0 - g0)[is_b] / delta[is_b]) + 4.0
            hue *= 60.0

            warm = (hue <= hue_max) | (hue >= hue_min)
            keep = (sat >= min_sat) & warm
            px = px[keep]

        if px is not None and len(px) > 0:
            # квадрати відстаней до кожного з 4 кольорів
            dist2 = np.empty((px.shape[0], len(COLORS)), dtype=np.int32)
            for i in range(len(COLORS)):
                d = px - COLORS[i]
                dist2[:, i] = (d * d).sum(axis=1)

            nearest = dist2.argmin(axis=1)
            best = np.sqrt(dist2.min(axis=1).astype(np.float64))
            good = best <= threshold

            if good.any():
                counts = np.bincount(nearest[good], minlength=len(COLORS))
                total = counts.sum()
                r = counts.astype(np.float64) / total
                cov = total / total_pixels
                dom = int(counts.argmax())
            else:
                r = np.zeros(len(COLORS))
                cov = 0.0
                dom = -1
        else:
            r = np.zeros(len(COLORS))
            cov = 0.0
            dom = -1

        ratios.append(r)
        coverage.append(cov)
        dominant.append(dom)

        frame_idx += 1
        if frame_idx % 60 == 0:
            print("  кадр %d (%.1f с)" % (frame_idx, frame_idx / fps), end="\r", flush=True)

    proc.stdout.close()
    err = proc.stderr.read().decode("utf-8", "replace")
    code = proc.wait()

    print(" " * 60, end="\r")
    if code != 0:
        print(err[-1000:], file=sys.stderr)

    if frame_idx == 0:
        sys.exit("Не вдалося прочитати жодного кадру. Перевірте файл відео.")

    if verbose:
        print("\nДомінантний колір по секундах:")
        for sec in range(int(frame_idx / fps) + 1):
            a = int(sec * fps)
            b = min(frame_idx, int((sec + 1) * fps))
            if b <= a:
                continue
            block = np.asarray(ratios[a:b], dtype=np.float64)
            mean = block.mean(axis=0)
            if mean.sum() < 1e-9:
                label = "тиша"
            else:
                label = TARGETS[int(mean.argmax())][2]
            print("  %3d-%3d с: %s  (покриття %.3f%%)" %
                  (sec, sec + 1, label, 100.0 * float(np.mean(coverage[a:b]))))

    return (np.array(ratios, dtype=np.float64),
            np.array(coverage, dtype=np.float64),
            np.array(dominant, dtype=np.int32),
            frame_idx)


# ----------------------------------------------------------------------------
#  Гучність і плавні переходи
# ----------------------------------------------------------------------------

def control_envelope(track, n_frames, fps, stretch):
    """Розтягує значення кадрів на час аудіо і згладжує (атака/спад)."""

    audio_dur = n_frames / fps * stretch
    n_ctrl = max(2, int(round(audio_dur * CONTROL_RATE)))

    t_ctrl = np.arange(n_ctrl, dtype=np.float64) / CONTROL_RATE
    t_frames = (np.arange(n_frames, dtype=np.float64) + 0.5) / fps * stretch

    raw = np.interp(t_ctrl, t_frames, track,
                    left=track[0], right=track[-1])

    # однополюсне згладжування: швидка атака, повільний спад
    a_att = 1.0 - np.exp(-1.0 / (CONTROL_RATE * ATTACK))
    a_rel = 1.0 - np.exp(-1.0 / (CONTROL_RATE * RELEASE))

    out = np.empty_like(raw)
    y = raw[0]
    for i in range(n_ctrl):
        target = raw[i]
        k = a_att if target > y else a_rel
        y += (target - y) * k
        out[i] = y
    return out


def resample(control, n_samples):
    """Контрольна огинаюча (CONTROL_RATE) → частота дискретизації аудіо."""
    n_ctrl = len(control)
    t_ctrl = np.arange(n_ctrl, dtype=np.float64) / CONTROL_RATE
    t_out = np.arange(n_samples, dtype=np.float64) / SAMPLE_RATE
    return np.interp(t_out, t_ctrl, control, left=control[0], right=control[-1])


# ----------------------------------------------------------------------------
#  Синтез
# ----------------------------------------------------------------------------

def synthesize(ratios, coverage, n_frames, fps, out_wav):
    """4 голоси, гучність яких = частка відповідного кольору."""

    audio_dur = n_frames / fps * AUDIO_STRETCH
    n_samples = int(round(audio_dur * SAMPLE_RATE))

    print("Синтез аудіо: %.2f с (відео %.2f с × %.1f)" %
          (audio_dur, n_frames / fps, AUDIO_STRETCH))

    # загальна гучність від покриття кадру
    loud_ctrl = control_envelope(
        np.clip(np.sqrt(np.maximum(coverage, 0.0) / REF_COVERAGE), 0.0, 1.0),
        n_frames, fps, AUDIO_STRETCH
    )
    loud = resample(loud_ctrl, n_samples).astype(np.float32)

    # огинаючі для кожного кольору
    amps = []
    for i in range(len(TARGETS)):
        c = control_envelope(ratios[:, i], n_frames, fps, AUDIO_STRETCH)
        amps.append(resample(c, n_samples).astype(np.float32))

    freqs = [midi_to_freq(t[1]) for t in TARGETS]
    pans = NOTE_PANS
    left = np.zeros(n_samples, dtype=np.float32)
    right = np.zeros(n_samples, dtype=np.float32)

    block = SAMPLE_RATE  # по секунді
    for start in range(0, n_samples, block):
        end = min(start + block, n_samples)
        n = end - start
        t = np.arange(start, end, dtype=np.float64) / SAMPLE_RATE

        for i, f in enumerate(freqs):
            amp = amps[i][start:end] * loud[start:end] * VOICE_GAIN
            if not amp.any():
                continue

            # м'який тембр: основний тон + дві гармоніки
            w = (np.sin(2 * np.pi * f * t) +
                 0.33 * np.sin(4 * np.pi * f * t) +
                 0.12 * np.sin(6 * np.pi * f * t))

            pan = pans[i]
            gl = (1.0 - pan) * 0.5
            gr = (1.0 + pan) * 0.5
            left[start:end] += (w * amp * gl).astype(np.float32)
            right[start:end] += (w * amp * gr).astype(np.float32)

    # нормалізація гучності: піднімаємо/опускаємо весь трек до -1 dBFS
    peak = float(max(np.abs(left).max(initial=0.0), np.abs(right).max(initial=0.0)))
    if peak > 1e-6:
        scale = 0.89 / peak
        left *= scale
        right *= scale
        peak *= scale
    else:
        print("  Увага: у відео не знайдено жодного з 4 кольорів — буде тиша.")

    stereo = np.stack([left, right], axis=1)
    pcm = np.clip(stereo * 32767.0, -32768, 32767).astype(np.int16)

    with wave.open(out_wav, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(pcm.tobytes())

    silent = float(np.mean(np.abs(loud) < 1e-4)) * 100.0
    print("  WAV: %s (%.1f с, пік після нормалізації %.2f, тиша %.0f%% часу)" %
          (out_wav, audio_dur, peak, silent))
    return audio_dur


# ----------------------------------------------------------------------------
#  Збірка MP4
# ----------------------------------------------------------------------------

def build_mp4(ffmpeg, video, wav, out_mp4, fps, stretch):
    """Сповільнює відео у stretch разів і додає згенероване аудіо."""

    print("Збірка MP4: відео сповільнюється ×%.1f ..." % stretch)

    cmd = [
        ffmpeg, "-y", "-hide_banner", "-loglevel", "warning",
        "-i", video,
        "-i", wav,
        "-filter_complex",
        "[0:v]setpts=%.4f*PTS,fps=%s[v]" % (stretch, ("%g" % min(fps, 30.0))),
        "-map", "[v]", "-map", "1:a",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart",
        "-shortest",
        out_mp4,
    ]

    res = subprocess.run(cmd)
    if res.returncode != 0:
        sys.exit("ffmpeg не зміг зібрати MP4 (код %d)." % res.returncode)


def build_audio_mp4(ffmpeg, wav, out_mp4):
    """Збирає MP4-контейнер лише з аудіодоріжкою (без відео)."""

    print("Збірка аудіо-MP4: %s ..." % out_mp4)

    cmd = [
        ffmpeg, "-y", "-hide_banner", "-loglevel", "warning",
        "-i", wav,
        "-map", "0:a",
        "-c:a", "aac", "-b:a", "192k",
        "-vn",
        "-movflags", "+faststart",
        out_mp4,
    ]

    res = subprocess.run(cmd)
    if res.returncode != 0:
        sys.exit("ffmpeg не зміг зібрати аудіо-MP4 (код %d)." % res.returncode)


# ----------------------------------------------------------------------------
#  main
# ----------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(
        description="Перетворює кольори відео на музику (4 кольори → 4 ноти)."
    )
    ap.add_argument("video", nargs="?", default="video.mp4", help="вхідний файл (типово video.mp4)")
    ap.add_argument("-o", "--output", default="output.mp4", help="вихідний MP4 (типово output.mp4)")
    ap.add_argument("--audio-out", default=None,
                    help="MP4 лише з музикою (типово <output>_music.mp4)")
    ap.add_argument("--threshold", type=float, default=COLOR_THRESHOLD,
                    help="максимальна RGB-відстань до цільового кольору (типово %.0f)" % COLOR_THRESHOLD)
    ap.add_argument("--min-red", type=int, default=MIN_RED,
                    help="нижня межа R пікселя, інакше не рахується (типово %d)" % MIN_RED)
    ap.add_argument("--max-red", type=int, default=MAX_RED,
                    help="верхня межа R пікселя, інакше не рахується (типово %d)" % MAX_RED)
    ap.add_argument("--min-sat", type=float, default=MIN_SAT,
                    help="мінімальна насиченість; білий/сірий не рахуються (типово %.2f)" % MIN_SAT)
    ap.add_argument("--hue-min", type=float, default=HUE_MIN,
                    help="нижня межа відтінку в градусах (типово %.0f)" % HUE_MIN)
    ap.add_argument("--hue-max", type=float, default=HUE_MAX,
                    help="верхня межа відтінку в градусах (типово %.0f)" % HUE_MAX)
    ap.add_argument("--width", type=int, default=ANALYSIS_WIDTH,
                    help="ширина кадру для аналізу (типово %d)" % ANALYSIS_WIDTH)
    ap.add_argument("--stretch", type=float, default=AUDIO_STRETCH,
                    help="у скільки разів аудіо довше за відео (типово 2.0)")
    ap.add_argument("--keep-wav", action="store_true", help="лишити проміжний WAV")
    ap.add_argument("-v", "--verbose", action="store_true", help="друкувати домінанту по секундах")
    args = ap.parse_args()

    if not os.path.isfile(args.video):
        sys.exit("Файл не знайдено: %s" % args.video)

    ffmpeg = find_ffmpeg()

    duration, fps, width, height = probe_video(ffmpeg, args.video)
    print("Вхід: %s" % args.video)
    print("  %.2f с, %.3f fps, %dx%d" % (duration, fps, width, height))

    ratios, coverage, dominant, n_frames = analyze_video(
        ffmpeg, args.video, fps, width, height,
        args.threshold, args.min_red, args.max_red,
        args.min_sat, args.hue_min, args.hue_max,
        args.verbose, args.width
    )

    print("Оброблено кадрів: %d" % n_frames)

    total = ratios.sum(axis=0)
    if total.sum() > 0:
        share = total / total.sum()
        print("Середня частка кольорів за весь ролик:")
        for i, (color, midi, name) in enumerate(TARGETS):
            print("  #%02x%02x%02x → %-3s  %5.1f%%" %
                  (color[0], color[1], color[2], name, 100.0 * share[i]))
    print("Кадрів, де цей колір домінує:")
    for i, (color, midi, name) in enumerate(TARGETS):
        n_dom = int(np.sum(dominant == i))
        print("  %-3s  %5.1f%%" % (name, 100.0 * n_dom / max(1, n_frames)))

    silent_frames = int(np.sum(coverage <= 0.0))
    print("Кадрів без жодного з 4 кольорів: %d (%.0f%%)" %
          (silent_frames, 100.0 * silent_frames / max(1, n_frames)))

    wav_path = os.path.splitext(args.output)[0] + ".wav"
    audio_out = args.audio_out
    if not audio_out:
        audio_out = os.path.splitext(args.output)[0] + "_music.mp4"

    synthesize(ratios, coverage, n_frames, fps, wav_path)
    build_mp4(ffmpeg, args.video, wav_path, args.output, fps, args.stretch)
    build_audio_mp4(ffmpeg, wav_path, audio_out)

    if not args.keep_wav:
        try:
            os.remove(wav_path)
        except OSError:
            pass

    print("Готово: %s" % args.output)
    print("Музика без відео: %s" % audio_out)
    if args.keep_wav:
        print("WAV: %s" % wav_path)


if __name__ == "__main__":
    main()
