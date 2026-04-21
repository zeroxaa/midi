import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Music4, Piano, Play, RotateCcw, XCircle } from "lucide-react";

const BUILT_IN_LESSONS = [
  {
    id: "twinkle",
    title: "Twinkle Twinkle",
    notes: [
      "C4",
      "C4",
      "G4",
      "G4",
      "A4",
      "A4",
      "G4",
      "F4",
      "F4",
      "E4",
      "E4",
      "D4",
      "D4",
      "C4",
    ],
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    notes: [
      "E4",
      "D4",
      "C4",
      "D4",
      "E4",
      "E4",
      "E4",
      "D4",
      "D4",
      "D4",
      "E4",
      "G4",
      "G4",
    ],
  },
  {
    id: "ode",
    title: "Ode to Joy",
    notes: [
      "E4",
      "E4",
      "F4",
      "G4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "C4",
      "D4",
      "E4",
      "E4",
      "D4",
      "D4",
    ],
  },
];

const NOTE_TO_SEMITONE = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

const SEMITONE_TO_LABEL = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const WHITE_NOTES = new Set(["C", "D", "E", "F", "G", "A", "B"]);
const SHORTCUTS = {
  C4: "A",
  "C#4": "W",
  D4: "S",
  "D#4": "E",
  E4: "D",
  F4: "F",
  "F#4": "T",
  G4: "G",
  "G#4": "Y",
  A4: "H",
  "A#4": "U",
  B4: "J",
  C5: "K",
  "C#5": "O",
  D5: "L",
  "D#5": "P",
  E5: ";",
};

const KEYBOARD_RANGE = createKeyboardRange("C4", "C6");

function noteToMidi(note) {
  const match = /^([A-G]#?)(\d)$/.exec(note.trim());
  if (!match) return null;
  const [, pitch, octaveText] = match;
  const octave = Number(octaveText);
  const semitone = NOTE_TO_SEMITONE[pitch];
  if (semitone === undefined) return null;
  return 12 * (octave + 1) + semitone;
}

function midiToNote(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const label = SEMITONE_TO_LABEL[midi % 12];
  return `${label}${octave}`;
}

function isWhite(note) {
  const pitch = note.replace(/\d/g, "");
  return WHITE_NOTES.has(pitch);
}

function createKeyboardRange(startNote, endNote) {
  const startMidi = noteToMidi(startNote);
  const endMidi = noteToMidi(endNote);
  if (startMidi == null || endMidi == null || endMidi < startMidi) return [];

  let whiteIndex = -1;
  const keys = [];

  for (let midi = startMidi; midi <= endMidi; midi += 1) {
    const note = midiToNote(midi);
    const white = isWhite(note);
    if (white) whiteIndex += 1;

    keys.push({
      midi,
      note,
      white,
      whiteIndex,
      frequency: 440 * Math.pow(2, (midi - 69) / 12),
      shortcut: SHORTCUTS[note] ?? "",
    });
  }

  return keys;
}

function parseCustomNotes(input) {
  const tokens = input
    .split(/[\s,|]+/)
    .map((token) => token.trim().toUpperCase())
    .filter(Boolean)
    .map((token) => token.replace(/^([A-G])B(\d)$/, (_, note, octave) => {
      const flatMap = { AB: "G#", BB: "A#", DB: "C#", EB: "D#", GB: "F#" };
      const mapped = flatMap[`${note}B`];
      return mapped ? `${mapped}${octave}` : `${note}${octave}`;
    }));

  return tokens.filter((token) => noteToMidi(token) !== null);
}

function prettyNote(note) {
  return note.replace("#", "♯");
}

function StatCard({ label, value, tone = "neutral" }) {
  const toneClasses = {
    neutral: "border-zinc-800 bg-zinc-900/70 text-zinc-100",
    good: "border-emerald-900 bg-emerald-950/50 text-emerald-200",
    bad: "border-rose-900 bg-rose-950/40 text-rose-200",
    accent: "border-blue-900 bg-blue-950/40 text-blue-200",
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClasses[tone]}`}>
      <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function PianoKey({ note, active, expected, onPress }) {
  const baseClass = note.white
    ? "h-64 w-14 rounded-b-2xl border border-zinc-800 bg-white text-zinc-800 shadow-md"
    : "absolute top-0 z-20 h-40 w-9 rounded-b-xl border border-zinc-950 bg-zinc-900 text-white shadow-2xl";

  const stateClass = note.white
    ? active
      ? "ring-4 ring-blue-400/80 bg-blue-50"
      : expected
      ? "bg-emerald-50 ring-2 ring-emerald-400/70"
      : "hover:bg-zinc-100"
    : active
    ? "ring-4 ring-blue-400/80 bg-blue-900"
    : expected
    ? "bg-emerald-900 ring-2 ring-emerald-400/70"
    : "hover:bg-zinc-800";

  return (
    <button
      onMouseDown={() => onPress(note.note)}
      onTouchStart={() => onPress(note.note)}
      className={`${baseClass} ${stateClass} transition-all duration-150 select-none`}
      style={
        note.white
          ? undefined
          : {
              left: `${note.whiteIndex * 56 + 56 - 18}px`,
            }
      }
      title={`${note.note}${note.shortcut ? ` · ${note.shortcut}` : ""}`}
      type="button"
    >
      <div className={`flex h-full flex-col justify-end pb-3 text-center ${note.white ? "" : "pb-2"}`}>
        <div className={`text-[11px] font-semibold ${note.white ? "text-zinc-500" : "text-zinc-400"}`}>
          {prettyNote(note.note)}
        </div>
        {note.shortcut ? (
          <div className={`mt-1 text-[10px] uppercase ${note.white ? "text-zinc-400" : "text-zinc-500"}`}>
            {note.shortcut}
          </div>
        ) : null}
      </div>
    </button>
  );
}

export default function VirtualPianoTrainer() {
  const [customInput, setCustomInput] = useState("C4 D4 E4 F4 G4 A4 B4 C5");
  const [selectedLessonId, setSelectedLessonId] = useState(BUILT_IN_LESSONS[0].id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastPlayed, setLastPlayed] = useState("");
  const [feedback, setFeedback] = useState("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(true);

  const audioContextRef = useRef(null);
  const previewTimeoutsRef = useRef([]);

  const customLesson = useMemo(() => {
    const notes = parseCustomNotes(customInput);
    if (notes.length === 0) return null;
    return {
      id: "custom",
      title: "Custom exercise",
      notes,
    };
  }, [customInput]);

  const lessons = useMemo(() => {
    return customLesson ? [...BUILT_IN_LESSONS, customLesson] : BUILT_IN_LESSONS;
  }, [customLesson]);

  const currentLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const notes = currentLesson.notes;
  const expectedNote = notes[currentIndex] ?? null;
  const progress = notes.length ? Math.round((currentIndex / notes.length) * 100) : 0;
  const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 100;

  const visibleKeyboard = useMemo(() => {
    return KEYBOARD_RANGE.map((key) => ({
      ...key,
      shortcut: showShortcuts ? key.shortcut : "",
    }));
  }, [showShortcuts]);

  const whiteKeys = visibleKeyboard.filter((key) => key.white);
  const blackKeys = visibleKeyboard.filter((key) => !key.white);

  useEffect(() => {
    resetSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLessonId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        return;
      }

      const pressed = event.key.toUpperCase();
      const match = visibleKeyboard.find((key) => key.shortcut === pressed);
      if (!match) return;

      event.preventDefault();
      handleNotePress(match.note);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visibleKeyboard, expectedNote, currentIndex, isPreviewing]);

  useEffect(() => {
    return () => clearPreviewTimeouts();
  }, []);

  function clearPreviewTimeouts() {
    previewTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    previewTimeoutsRef.current = [];
  }

  function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioContextRef.current = new AudioContextClass();
    }
    return audioContextRef.current;
  }

  async function playTone(noteName, duration = 0.45) {
    const midi = noteToMidi(noteName);
    if (midi == null) return;

    const audioContext = getAudioContext();
    if (!audioContext) return;
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.03);
  }

  function resetSession() {
    clearPreviewTimeouts();
    setCurrentIndex(0);
    setLastPlayed("");
    setFeedback("idle");
    setCorrectCount(0);
    setWrongCount(0);
    setPreviewIndex(-1);
    setIsPreviewing(false);
  }

  function handleNotePress(noteName) {
    if (isPreviewing) return;

    setLastPlayed(noteName);
    playTone(noteName);

    if (!expectedNote) {
      setFeedback("complete");
      return;
    }

    if (noteName === expectedNote) {
      const nextIndex = currentIndex + 1;
      setCorrectCount((count) => count + 1);
      setFeedback(nextIndex >= notes.length ? "complete" : "correct");
      setCurrentIndex(nextIndex);
    } else {
      setWrongCount((count) => count + 1);
      setFeedback("wrong");
    }
  }

  function previewLesson() {
    if (!notes.length || isPreviewing) return;

    clearPreviewTimeouts();
    setIsPreviewing(true);
    setPreviewIndex(-1);

    notes.forEach((note, index) => {
      const timeoutId = window.setTimeout(() => {
        setPreviewIndex(index);
        playTone(note, 0.4);
      }, index * 500);
      previewTimeoutsRef.current.push(timeoutId);
    });

    const endingId = window.setTimeout(() => {
      setPreviewIndex(-1);
      setIsPreviewing(false);
    }, notes.length * 500 + 100);
    previewTimeoutsRef.current.push(endingId);
  }

  const statusTone =
    feedback === "correct"
      ? "text-emerald-300"
      : feedback === "wrong"
      ? "text-rose-300"
      : feedback === "complete"
      ? "text-blue-300"
      : "text-zinc-300";

  const statusLabel =
    feedback === "correct"
      ? "Correct — keep going"
      : feedback === "wrong"
      ? "Not that one — try the highlighted note"
      : feedback === "complete"
      ? "Exercise complete"
      : "Press the highlighted note to start";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
                  <Piano className="h-3.5 w-3.5" />
                  Virtual piano trainer
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Practice now, wire MIDI later.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                  This MVP behaves like a beginner piano-learning app: it shows a note sequence,
                  listens for input from a virtual keyboard, checks whether you played the expected
                  note, and advances only when you get it right.
                </p>
              </div>

              <div className="grid min-w-[220px] gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <label className="text-xs uppercase tracking-[0.18em] text-zinc-400">Exercise</label>
                <select
                  value={selectedLessonId}
                  onChange={(event) => setSelectedLessonId(event.target.value)}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none ring-0 transition focus:border-blue-500"
                >
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={resetSession}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={previewLesson}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isPreviewing}
                  >
                    <Play className="h-4 w-4" />
                    Hear notes
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <StatCard label="Progress" value={`${progress}%`} tone="accent" />
              <StatCard label="Correct" value={correctCount} tone="good" />
              <StatCard label="Wrong" value={wrongCount} tone="bad" />
              <StatCard label="Accuracy" value={`${accuracy}%`} />
            </div>

            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 md:p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Current exercise</div>
                  <div className="mt-1 flex items-center gap-2 text-lg font-medium text-white">
                    <Music4 className="h-4 w-4 text-zinc-400" />
                    {currentLesson.title}
                  </div>
                </div>
                <div className={`text-sm font-medium ${statusTone}`}>{statusLabel}</div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-5 overflow-x-auto pb-2">
                <div className="flex min-w-max items-center gap-2">
                  {notes.map((note, index) => {
                    const isCurrent = index === currentIndex && feedback !== "complete";
                    const isPassed = index < currentIndex;
                    const isPreview = index === previewIndex;

                    return (
                      <motion.div
                        key={`${note}-${index}`}
                        layout
                        className={[
                          "flex h-16 min-w-[72px] items-center justify-center rounded-2xl border px-3 text-sm font-semibold shadow-sm transition-all",
                          isPassed
                            ? "border-emerald-800 bg-emerald-950/60 text-emerald-200"
                            : isCurrent
                            ? "border-blue-700 bg-blue-950/60 text-blue-100"
                            : isPreview
                            ? "border-amber-700 bg-amber-950/50 text-amber-100"
                            : "border-zinc-800 bg-zinc-950 text-zinc-300",
                        ].join(" ")}
                        animate={isCurrent || isPreview ? { y: [0, -4, 0] } : { y: 0 }}
                        transition={{ duration: 0.6, repeat: isCurrent || isPreview ? Infinity : 0 }}
                      >
                        <div className="text-center">
                          <div>{prettyNote(note)}</div>
                          <div className="mt-1 text-[10px] font-normal uppercase tracking-[0.16em] text-zinc-500">
                            {Math.floor(index / 4) + 1}.{(index % 4) + 1}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Next note</div>
                  <div className="mt-1 text-3xl font-semibold text-white">
                    {expectedNote ? prettyNote(expectedNote) : "Done"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Last played</div>
                  <div className="mt-1 text-xl font-medium text-zinc-200">
                    {lastPlayed ? prettyNote(lastPlayed) : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="inline-flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                  <span>Show keyboard shortcuts</span>
                  <input
                    type="checkbox"
                    checked={showShortcuts}
                    onChange={(event) => setShowShortcuts(event.target.checked)}
                    className="h-4 w-4 rounded border-zinc-600 bg-zinc-900"
                  />
                </label>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
                  <div className="flex items-start gap-3">
                    {feedback === "wrong" ? (
                      <XCircle className="mt-0.5 h-4 w-4 flex-none text-rose-400" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
                    )}
                    <div>
                      In a real version, this exact input layer can be swapped with Web MIDI so a
                      physical keyboard drives the same practice engine.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Custom exercise</div>
              <div className="mt-2 text-lg font-medium text-white">Paste your own note sequence</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Use note names like C4 D4 E4 F4 or G4,A4,B4,C5. When valid notes are present, the
                custom exercise appears in the lesson selector.
              </p>
              <textarea
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
                className="mt-4 min-h-[120px] w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-blue-500"
                placeholder="C4 D4 E4 F4 G4"
              />
              <div className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                Parsed notes: {customLesson ? customLesson.notes.length : 0}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4 md:p-6 shadow-2xl">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Input surface</div>
              <div className="mt-1 text-xl font-semibold text-white">Virtual piano keyboard</div>
            </div>
            <div className="text-sm text-zinc-400">
              Click a key or use your computer keyboard. The highlighted key is the expected note.
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="relative mx-auto" style={{ width: `${whiteKeys.length * 56}px`, minWidth: `${whiteKeys.length * 56}px` }}>
              <div className="flex items-start">
                {whiteKeys.map((key) => (
                  <PianoKey
                    key={key.note}
                    note={key}
                    active={lastPlayed === key.note}
                    expected={expectedNote === key.note}
                    onPress={handleNotePress}
                  />
                ))}
              </div>
              {blackKeys.map((key) => (
                <PianoKey
                  key={key.note}
                  note={key}
                  active={lastPlayed === key.note}
                  expected={expectedNote === key.note}
                  onPress={handleNotePress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

