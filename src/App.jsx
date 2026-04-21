import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Music4,
  Piano,
  Play,
  RotateCcw,
  Square,
  TimerReset,
  XCircle,
} from "lucide-react";

const BUILT_IN_LESSONS = [
  {
    id: "twinkle",
    title: "Twinkle Twinkle",
    meter: "4/4",
    notes: [
      { note: "C4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "F4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
    ],
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    meter: "4/4",
    notes: [
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 2 },
      { note: "D4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "D4", beats: 2 },
      { note: "E4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "G4", beats: 2 },
    ],
  },
  {
    id: "ode",
    title: "Ode to Joy",
    meter: "4/4",
    notes: [
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "D4", beats: 2 },
    ],
  },
  {
    id: "hotcrossbuns",
    title: "Hot Cross Buns",
    meter: "4/4",
    notes: [
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
      { note: "C4", beats: 0.5 },
      { note: "C4", beats: 0.5 },
      { note: "C4", beats: 0.5 },
      { note: "C4", beats: 0.5 },
      { note: "D4", beats: 0.5 },
      { note: "D4", beats: 0.5 },
      { note: "D4", beats: 0.5 },
      { note: "D4", beats: 0.5 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 2 },
    ],
  },
  {
    id: "jinglebells",
    title: "Jingle Bells",
    meter: "4/4",
    notes: [
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 2 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 2 },
      { note: "E4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "E4", beats: 4 },
      { note: "F4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 2 },
      { note: "G4", beats: 2 },
    ],
  },
  {
    id: "londonbridge",
    title: "London Bridge",
    meter: "4/4",
    notes: [
      { note: "G4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "D4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "F4", beats: 2 },
      { note: "E4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "G4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "D4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "C4", beats: 1 },
    ],
  },
  {
    id: "oldmacdonald",
    title: "Old MacDonald",
    meter: "4/4",
    notes: [
      { note: "G4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 2 },
      { note: "B4", beats: 1 },
      { note: "B4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 4 },
    ],
  },
  {
    id: "saints",
    title: "When the Saints Go Marching In",
    meter: "4/4",
    notes: [
      { note: "C4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "F4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "F4", beats: 2 },
      { note: "E4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 4 },
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

function parseCustomEvents(input) {
  const normalized = input.replace(/\|/g, " ");
  const rawTokens = normalized.split(/[\s,]+/).map((token) => token.trim()).filter(Boolean);

  return rawTokens
    .map((token) => {
      const [rawNote, rawBeats] = token.split(":");
      const cleaned = rawNote
        .toUpperCase()
        .replace(/^([A-G])B(\d)$/, (_, pitch, octave) => {
          const flatMap = { AB: "G#", BB: "A#", DB: "C#", EB: "D#", GB: "F#" };
          const mapped = flatMap[`${pitch}B`];
          return mapped ? `${mapped}${octave}` : `${pitch}${octave}`;
        });

      const beats = rawBeats ? Number(rawBeats) : 1;
      if (noteToMidi(cleaned) == null || Number.isNaN(beats) || beats <= 0) {
        return null;
      }

      return { note: cleaned, beats };
    })
    .filter(Boolean);
}

function prettyNote(note) {
  return note.replace("#", "♯");
}

function parseMeterBeats(meter) {
  const [top] = meter.split("/");
  const beats = Number(top);
  return Number.isFinite(beats) && beats > 0 ? beats : 4;
}

function durationToAbc(beats) {
  if (beats === 1) return "";
  if (beats === 0.5) return "/";
  if (beats === 0.25) return "//";
  if (Number.isInteger(beats)) return String(beats);
  if (beats === 1.5) return "3/2";
  if (beats === 0.75) return "3/4";

  const scaled = Math.round(beats * 4);
  const gcd = greatestCommonDivisor(scaled, 4);
  const numerator = scaled / gcd;
  const denominator = 4 / gcd;
  return `${numerator}/${denominator}`;
}

function greatestCommonDivisor(a, b) {
  if (!b) return a;
  return greatestCommonDivisor(b, a % b);
}

function noteToAbc(note) {
  const match = /^([A-G])(#?)(\d)$/.exec(note);
  if (!match) return "C";

  const [, pitch, sharp, octaveText] = match;
  const octave = Number(octaveText);
  const accidental = sharp ? "^" : "";

  if (octave <= 3) {
    return `${accidental}${pitch.toUpperCase()},`;
  }
  if (octave === 4) {
    return `${accidental}${pitch.toUpperCase()}`;
  }
  if (octave === 5) {
    return `${accidental}${pitch.toLowerCase()}`;
  }
  return `${accidental}${pitch.toLowerCase()}'`;
}

function lessonToAbc(lesson) {
  const measureBeats = parseMeterBeats(lesson.meter);
  let running = 0;
  const body = [];

  lesson.notes.forEach((event, index) => {
    body.push(`${noteToAbc(event.note)}${durationToAbc(event.beats)}`);
    running += event.beats;

    const atMeasureBoundary = Math.abs(running % measureBeats) < 0.0001;
    if (atMeasureBoundary && index !== lesson.notes.length - 1) {
      body.push("|");
    }
  });

  return `X:1\nT:${lesson.title}\nM:${lesson.meter}\nL:1/4\nK:C clef=treble\n${body.join(" ")} |]`;
}

function formatDeltaMs(deltaMs) {
  const rounded = Math.round(Math.abs(deltaMs));
  return `${rounded}ms`;
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
  const [customInput, setCustomInput] = useState("C4:1 D4:1 E4:1 F4:1 G4:1 A4:1 B4:1 C5:2");
  const [selectedLessonId, setSelectedLessonId] = useState(BUILT_IN_LESSONS[0].id);
  const [practiceMode, setPracticeMode] = useState("rhythm");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastPlayed, setLastPlayed] = useState("");
  const [feedback, setFeedback] = useState({ kind: "idle", text: "Press start or play the highlighted note." });
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [onTimeCount, setOnTimeCount] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(-1);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [bpm, setBpm] = useState(80);
  const [toleranceMs, setToleranceMs] = useState(220);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);
  const [countInBeats, setCountInBeats] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [transportStartAt, setTransportStartAt] = useState(null);
  const [nowMs, setNowMs] = useState(0);

  const audioContextRef = useRef(null);
  const previewTimeoutsRef = useRef([]);
  const metronomeIntervalRef = useRef(null);
  const staffContainerRef = useRef(null);

  const customLesson = useMemo(() => {
    const notes = parseCustomEvents(customInput);
    if (notes.length === 0) return null;
    return {
      id: "custom",
      title: "Custom exercise",
      meter: "4/4",
      notes,
    };
  }, [customInput]);

  const lessons = useMemo(() => {
    return customLesson ? [...BUILT_IN_LESSONS, customLesson] : BUILT_IN_LESSONS;
  }, [customLesson]);

  useEffect(() => {
    if (!lessons.some((lesson) => lesson.id === selectedLessonId)) {
      setSelectedLessonId(BUILT_IN_LESSONS[0].id);
    }
  }, [lessons, selectedLessonId]);

  const currentLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const notes = currentLesson.notes;
  const measureBeats = parseMeterBeats(currentLesson.meter);
  const noteStartBeats = useMemo(() => {
    let running = 0;
    return notes.map((event) => {
      const start = running;
      running += event.beats;
      return start;
    });
  }, [notes]);
  const totalBeats = useMemo(() => notes.reduce((sum, event) => sum + event.beats, 0), [notes]);
  const expectedEvent = notes[currentIndex] ?? null;
  const expectedNote = expectedEvent?.note ?? null;
  const progress = notes.length ? Math.round((currentIndex / notes.length) * 100) : 0;
  const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 100;
  const beatMs = 60000 / bpm;
  const abcSource = useMemo(() => lessonToAbc(currentLesson), [currentLesson]);

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
    let cancelled = false;

    async function renderStaff() {
      if (!staffContainerRef.current) return;
      const abcjs = await import("abcjs");
      if (cancelled || !staffContainerRef.current) return;

      staffContainerRef.current.innerHTML = "";
      abcjs.renderAbc(staffContainerRef.current, abcSource, {
        responsive: "resize",
        staffwidth: 900,
        add_classes: true,
        scale: 1.1,
        paddingtop: 10,
        paddingbottom: 10,
      });
    }

    renderStaff();
    return () => {
      cancelled = true;
      if (staffContainerRef.current) {
        staffContainerRef.current.innerHTML = "";
      }
    };
  }, [abcSource]);

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
  }, [visibleKeyboard, practiceMode, currentIndex, isRunning, transportStartAt, toleranceMs, bpm]);

  useEffect(() => {
    return () => {
      clearPreviewTimeouts();
      stopMetronome();
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return undefined;

    let rafId = 0;
    const updateClock = () => {
      setNowMs(performance.now());
      rafId = window.requestAnimationFrame(updateClock);
    };
    rafId = window.requestAnimationFrame(updateClock);
    return () => window.cancelAnimationFrame(rafId);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || practiceMode !== "rhythm" || transportStartAt == null || currentIndex >= notes.length) {
      return undefined;
    }

    const expectedAt = transportStartAt + noteStartBeats[currentIndex] * beatMs;
    const msUntilMiss = Math.max(0, expectedAt + toleranceMs - performance.now());

    const timeoutId = window.setTimeout(() => {
      setWrongCount((count) => count + 1);
      setMissedCount((count) => count + 1);
      setFeedback({
        kind: "missed",
        text: `Missed ${prettyNote(notes[currentIndex].note)} — move to the next beat.`,
      });
      setCurrentIndex((index) => index + 1);
    }, msUntilMiss);

    return () => window.clearTimeout(timeoutId);
  }, [isRunning, practiceMode, transportStartAt, currentIndex, noteStartBeats, beatMs, toleranceMs, notes]);

  useEffect(() => {
    if (currentIndex < notes.length) return;
    stopMetronome();
    setIsRunning(false);
    setTransportStartAt(null);
    setFeedback({ kind: "complete", text: "Exercise complete." });
  }, [currentIndex, notes.length]);

  useEffect(() => {
    if (!isRunning || practiceMode !== "rhythm" || transportStartAt == null) return;

    const remaining = transportStartAt - nowMs;
    if (remaining > 0) {
      const beatsLeft = Math.max(1, Math.ceil(remaining / beatMs));
      setFeedback({ kind: "countin", text: `Count in: ${beatsLeft}` });
    }
  }, [isRunning, practiceMode, transportStartAt, nowMs, beatMs]);

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

  async function playMetronomeClick(accent = false) {
    const audioContext = getAudioContext();
    if (!audioContext) return;
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = accent ? 1320 : 880;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.15 : 0.1, audioContext.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.06);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
  }

  function stopMetronome() {
    if (metronomeIntervalRef.current) {
      window.clearInterval(metronomeIntervalRef.current);
      metronomeIntervalRef.current = null;
    }
  }

  function startMetronome() {
    stopMetronome();
    if (!metronomeEnabled) return;

    let beatIndex = 0;
    playMetronomeClick(true);
    metronomeIntervalRef.current = window.setInterval(() => {
      beatIndex += 1;
      const accent = beatIndex % measureBeats === 0;
      playMetronomeClick(accent);
    }, beatMs);
  }

  function resetCounters() {
    setCurrentIndex(0);
    setLastPlayed("");
    setCorrectCount(0);
    setWrongCount(0);
    setMissedCount(0);
    setOnTimeCount(0);
  }

  function resetSession() {
    clearPreviewTimeouts();
    stopMetronome();
    setIsPreviewing(false);
    setPreviewIndex(-1);
    setIsRunning(false);
    setTransportStartAt(null);
    setNowMs(0);
    resetCounters();
    setFeedback({ kind: "idle", text: "Press start or play the highlighted note." });
  }

  function startRhythmRun() {
    clearPreviewTimeouts();
    resetCounters();
    const startAt = performance.now() + countInBeats * beatMs;
    setTransportStartAt(startAt);
    setNowMs(performance.now());
    setIsRunning(true);
    setFeedback({ kind: "countin", text: `Count in: ${countInBeats}` });
    startMetronome();
  }

  function stopRhythmRun() {
    stopMetronome();
    setIsRunning(false);
    setTransportStartAt(null);
    setFeedback({ kind: "idle", text: "Stopped. Press start to try again." });
  }

  function handleOrderModePress(noteName) {
    if (!expectedNote) {
      setFeedback({ kind: "complete", text: "Exercise complete." });
      return;
    }

    if (noteName === expectedNote) {
      const nextIndex = currentIndex + 1;
      setCorrectCount((count) => count + 1);
      setFeedback({ kind: "correct", text: nextIndex >= notes.length ? "Exercise complete." : "Correct — keep going." });
      setCurrentIndex(nextIndex);
    } else {
      setWrongCount((count) => count + 1);
      setFeedback({ kind: "wrong", text: `Expected ${prettyNote(expectedNote)}.` });
    }
  }

  function handleRhythmModePress(noteName) {
    if (!expectedEvent || transportStartAt == null) return;

    const now = performance.now();
    const expectedAt = transportStartAt + noteStartBeats[currentIndex] * beatMs;
    const delta = now - expectedAt;

    if (noteName !== expectedEvent.note) {
      setWrongCount((count) => count + 1);
      setFeedback({ kind: "wrong", text: `Wrong pitch — expected ${prettyNote(expectedEvent.note)}.` });
      return;
    }

    if (Math.abs(delta) <= toleranceMs) {
      setCorrectCount((count) => count + 1);
      setOnTimeCount((count) => count + 1);
      setFeedback({ kind: "correct", text: `On time (${formatDeltaMs(delta)}).` });
      setCurrentIndex((index) => index + 1);
      return;
    }

    if (delta < -toleranceMs) {
      setWrongCount((count) => count + 1);
      setFeedback({ kind: "early", text: `Too early by ${formatDeltaMs(delta)}.` });
      return;
    }

    setWrongCount((count) => count + 1);
    setFeedback({ kind: "late", text: `Late by ${formatDeltaMs(delta)}.` });
    setCurrentIndex((index) => index + 1);
  }

  function handleNotePress(noteName) {
    if (isPreviewing) return;

    setLastPlayed(noteName);
    playTone(noteName);

    if (practiceMode === "order") {
      handleOrderModePress(noteName);
      return;
    }

    if (!isRunning) {
      setFeedback({ kind: "idle", text: "Press start to begin the timed run." });
      return;
    }

    if (transportStartAt != null && performance.now() < transportStartAt - toleranceMs) {
      setFeedback({ kind: "countin", text: "Wait for the count-in." });
      return;
    }

    handleRhythmModePress(noteName);
  }

  function previewLesson() {
    if (!notes.length || isPreviewing) return;

    clearPreviewTimeouts();
    setIsPreviewing(true);
    setPreviewIndex(-1);

    let runningBeats = 0;
    notes.forEach((event, index) => {
      const startDelay = runningBeats * beatMs;
      const timeoutId = window.setTimeout(() => {
        setPreviewIndex(index);
        playTone(event.note, Math.max(0.16, event.beats * 0.3));
      }, startDelay);
      previewTimeoutsRef.current.push(timeoutId);
      runningBeats += event.beats;
    });

    const endingId = window.setTimeout(() => {
      setPreviewIndex(-1);
      setIsPreviewing(false);
    }, runningBeats * beatMs + 120);
    previewTimeoutsRef.current.push(endingId);
  }

  const statusTone = {
    idle: "text-zinc-300",
    correct: "text-emerald-300",
    wrong: "text-rose-300",
    missed: "text-amber-300",
    early: "text-amber-300",
    late: "text-orange-300",
    countin: "text-blue-300",
    complete: "text-blue-300",
  }[feedback.kind] ?? "text-zinc-300";

  const currentBeatNumber = isRunning && transportStartAt != null
    ? Math.max(0, Math.floor((nowMs - transportStartAt) / beatMs) + 1)
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
                  <Piano className="h-3.5 w-3.5" />
                  Virtual piano trainer
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Real staff, timed notes, metronome.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                  The lesson is rendered as sheet music with abcjs, and rhythm mode grades your input
                  against a tempo instead of just checking note order.
                </p>
              </div>

              <div className="grid min-w-[240px] gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                <label className="text-xs uppercase tracking-[0.18em] text-zinc-400">Exercise</label>
                <select
                  value={selectedLessonId}
                  onChange={(event) => setSelectedLessonId(event.target.value)}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                >
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>

                <label className="text-xs uppercase tracking-[0.18em] text-zinc-400">Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPracticeMode("order")}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      practiceMode === "order"
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    Order only
                  </button>
                  <button
                    type="button"
                    onClick={() => setPracticeMode("rhythm")}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      practiceMode === "rhythm"
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    Rhythm + tempo
                  </button>
                </div>

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
                    Hear lesson
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
              <StatCard label="Progress" value={`${progress}%`} tone="accent" />
              <StatCard label="Correct" value={correctCount} tone="good" />
              <StatCard label="Wrong" value={wrongCount} tone="bad" />
              <StatCard label="On time" value={onTimeCount} tone="good" />
              <StatCard label="Missed" value={missedCount} />
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
                <div className={`text-sm font-medium ${statusTone}`}>{feedback.text}</div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-zinc-800 bg-white p-3 text-zinc-900 shadow-inner md:p-5">
                <div ref={staffContainerRef} className="w-full overflow-x-auto" />
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

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between text-sm text-zinc-300">
                    <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> BPM</span>
                    <span className="font-semibold text-white">{bpm}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    step="1"
                    value={bpm}
                    onChange={(event) => setBpm(Number(event.target.value))}
                    className="mt-3 w-full"
                  />
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between text-sm text-zinc-300">
                    <span className="flex items-center gap-2"><TimerReset className="h-4 w-4" /> Timing tolerance</span>
                    <span className="font-semibold text-white">±{toleranceMs}ms</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="400"
                    step="10"
                    value={toleranceMs}
                    onChange={(event) => setToleranceMs(Number(event.target.value))}
                    className="mt-3 w-full"
                  />
                </div>

                <label className="inline-flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                  <span>Metronome</span>
                  <input
                    type="checkbox"
                    checked={metronomeEnabled}
                    onChange={(event) => setMetronomeEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-zinc-600 bg-zinc-900"
                  />
                </label>

                <label className="inline-flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                  <span>Show keyboard shortcuts</span>
                  <input
                    type="checkbox"
                    checked={showShortcuts}
                    onChange={(event) => setShowShortcuts(event.target.checked)}
                    className="h-4 w-4 rounded border-zinc-600 bg-zinc-900"
                  />
                </label>

                {practiceMode === "rhythm" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={startRhythmRun}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                    >
                      <Play className="h-4 w-4" />
                      Start run
                    </button>
                    <button
                      type="button"
                      onClick={stopRhythmRun}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </button>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span>Beat duration</span>
                      <span className="text-zinc-200">{Math.round(beatMs)}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Current beat</span>
                      <span className="text-zinc-200">{currentBeatNumber || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total beats</span>
                      <span className="text-zinc-200">{totalBeats}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
                  <div className="flex items-start gap-3">
                    {feedback.kind === "wrong" || feedback.kind === "late" ? (
                      <XCircle className="mt-0.5 h-4 w-4 flex-none text-rose-400" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
                    )}
                    <div>
                      The notation is separate from the input engine. Later, you can swap the
                      virtual keyboard for Web MIDI without changing the staff or rhythm scheduler.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Custom exercise</div>
              <div className="mt-2 text-lg font-medium text-white">Paste notes with durations</div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Use note:beats pairs like C4:1 D4:1 E4:0.5 F4:0.5 G4:2. The custom exercise shows up in the selector automatically.
              </p>
              <textarea
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
                className="mt-4 min-h-[120px] w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-blue-500"
                placeholder="C4:1 D4:1 E4:0.5 F4:0.5 G4:2"
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
              Click a key or use your computer keyboard. In rhythm mode, notes are scored against the tempo.
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

