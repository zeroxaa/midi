import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Soundfont from "soundfont-player";
import * as Tone from "tone";
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

const INSTRUMENTS = [
  { id: "acoustic_grand_piano", label: "Acoustic Grand Piano", source: "soundfont" },
  { id: "salamander", label: "Salamander Grand (HQ ~50MB)", source: "salamander" },
  { id: "bright_acoustic_piano", label: "Bright Acoustic Piano", source: "soundfont" },
  { id: "electric_piano_1", label: "Electric Piano", source: "soundfont" },
  { id: "honkytonk_piano", label: "Honky-tonk Piano", source: "soundfont" },
  { id: "harpsichord", label: "Harpsichord", source: "soundfont" },
  { id: "celesta", label: "Celesta", source: "soundfont" },
  { id: "music_box", label: "Music Box", source: "soundfont" },
  { id: "vibraphone", label: "Vibraphone", source: "soundfont" },
];

const SALAMANDER_URLS = {
  A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
  A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
  A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
  A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
  A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
  A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
  A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
  A7: "A7.mp3", C8: "C8.mp3",
};

function loadSalamander() {
  return new Promise((resolve, reject) => {
    try {
      const sampler = new Tone.Sampler({
        urls: SALAMANDER_URLS,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        release: 1,
        onload: () => {
          resolve({
            play(note, _time, options) {
              Tone.start();
              const velocity = Math.min(1, Math.max(0.05, options?.gain ?? 0.7));
              sampler.triggerAttackRelease(note, options?.duration ?? 0.5, undefined, velocity);
            },
            attack(note, velocity) {
              Tone.start();
              const v = Math.min(1, Math.max(0.05, velocity ?? 0.7));
              sampler.triggerAttack(note, undefined, v);
            },
            release(note) {
              sampler.triggerRelease(note);
            },
          });
        },
        onerror: (err) => reject(err),
      }).toDestination();
    } catch (err) {
      reject(err);
    }
  });
}

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
  {
    id: "happybirthday",
    title: "Happy Birthday",
    meter: "3/4",
    notes: [
      { note: "G4", beats: 0.5 },
      { note: "G4", beats: 0.5 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "B4", beats: 2 },
      { note: "G4", beats: 0.5 },
      { note: "G4", beats: 0.5 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "D5", beats: 1 },
      { note: "C5", beats: 2 },
      { note: "G4", beats: 0.5 },
      { note: "G4", beats: 0.5 },
      { note: "G5", beats: 1 },
      { note: "E5", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "B4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "F5", beats: 0.5 },
      { note: "F5", beats: 0.5 },
      { note: "E5", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "D5", beats: 1 },
      { note: "C5", beats: 2 },
    ],
  },
  {
    id: "auclair",
    title: "Au Clair de la Lune",
    meter: "4/4",
    notes: [
      { note: "C4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "C4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "E4", beats: 2 },
      { note: "D4", beats: 2 },
      { note: "C4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 4 },
    ],
  },
  {
    id: "ohsusanna",
    title: "Oh! Susanna",
    meter: "4/4",
    notes: [
      { note: "G4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "D5", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 2 },
      { note: "G4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "D5", beats: 1 },
      { note: "C5", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "G4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "D4", beats: 1 },
      { note: "C4", beats: 4 },
    ],
  },
  {
    id: "fingerfive",
    title: "5-Finger Warmup (both hands)",
    meter: "4/4",
    notes: [
      { rh: [{ note: "C4", finger: 1 }], lh: [{ note: "C3", finger: 5 }], beats: 1 },
      { rh: [{ note: "D4", finger: 2 }], lh: [{ note: "D3", finger: 4 }], beats: 1 },
      { rh: [{ note: "E4", finger: 3 }], lh: [{ note: "E3", finger: 3 }], beats: 1 },
      { rh: [{ note: "F4", finger: 4 }], lh: [{ note: "F3", finger: 2 }], beats: 1 },
      { rh: [{ note: "G4", finger: 5 }], lh: [{ note: "G3", finger: 1 }], beats: 2 },
      { rh: [{ note: "F4", finger: 4 }], lh: [{ note: "F3", finger: 2 }], beats: 1 },
      { rh: [{ note: "E4", finger: 3 }], lh: [{ note: "E3", finger: 3 }], beats: 1 },
      { rh: [{ note: "D4", finger: 2 }], lh: [{ note: "D3", finger: 4 }], beats: 1 },
      { rh: [{ note: "C4", finger: 1 }], lh: [{ note: "C3", finger: 5 }], beats: 4 },
    ],
  },
  {
    id: "twohands",
    title: "Two hands: Twinkle + bass",
    meter: "4/4",
    notes: [
      { rh: [{ note: "C5", finger: 1 }], lh: [{ note: "C3", finger: 5 }], beats: 1 },
      { rh: [{ note: "C5", finger: 1 }], lh: [{ note: "G3", finger: 1 }], beats: 1 },
      { rh: [{ note: "G5", finger: 5 }], lh: [{ note: "C3", finger: 5 }], beats: 1 },
      { rh: [{ note: "G5", finger: 5 }], lh: [{ note: "G3", finger: 1 }], beats: 1 },
      { rh: [{ note: "A5", finger: 5 }], lh: [{ note: "F3", finger: 2 }], beats: 1 },
      { rh: [{ note: "A5", finger: 5 }], lh: [{ note: "C3", finger: 5 }], beats: 1 },
      { rh: [{ note: "G5", finger: 5 }], lh: [{ note: "C3", finger: 5 }], beats: 2 },
      { rh: [{ note: "F5", finger: 4 }], lh: [{ note: "F3", finger: 2 }], beats: 1 },
      { rh: [{ note: "F5", finger: 4 }], lh: [{ note: "C3", finger: 5 }], beats: 1 },
      { rh: [{ note: "E5", finger: 3 }], lh: [{ note: "G3", finger: 1 }], beats: 1 },
      { rh: [{ note: "E5", finger: 3 }], lh: [{ note: "C3", finger: 5 }], beats: 1 },
      { rh: [{ note: "D5", finger: 2 }], lh: [{ note: "G3", finger: 1 }], beats: 1 },
      { rh: [{ note: "D5", finger: 2 }], lh: [{ note: "G3", finger: 1 }], beats: 1 },
      {
        rh: [{ note: "C5", finger: 1 }],
        lh: [
          { note: "C3", finger: 5 },
          { note: "E3", finger: 3 },
          { note: "G3", finger: 1 },
        ],
        beats: 2,
      },
    ],
  },
  {
    id: "triads",
    title: "Major Triads (chords)",
    meter: "4/4",
    notes: [
      { note: "C4", beats: 1 },
      { note: "E4", beats: 1 },
      { note: "G4", beats: 1 },
      { notes: ["C4", "E4", "G4"], beats: 1 },
      { note: "F4", beats: 1 },
      { note: "A4", beats: 1 },
      { note: "C5", beats: 1 },
      { notes: ["F4", "A4", "C5"], beats: 1 },
      { note: "G4", beats: 1 },
      { note: "B4", beats: 1 },
      { note: "D5", beats: 1 },
      { notes: ["G4", "B4", "D5"], beats: 1 },
      { notes: ["C4", "E4", "G4"], beats: 4 },
    ],
  },
  {
    id: "canon",
    title: "Pachelbel's Canon (simplified)",
    meter: "4/4",
    notes: [
      { rh: ["F#5"], lh: ["D3"], beats: 1 },
      { rh: ["E5"], lh: [], beats: 1 },
      { rh: ["D5"], lh: [], beats: 1 },
      { rh: ["C#5"], lh: [], beats: 1 },
      { rh: ["B4"], lh: ["A2"], beats: 1 },
      { rh: ["A4"], lh: [], beats: 1 },
      { rh: ["B4"], lh: [], beats: 1 },
      { rh: ["C#5"], lh: [], beats: 1 },
      { rh: ["D5"], lh: ["B2"], beats: 1 },
      { rh: ["C#5"], lh: [], beats: 1 },
      { rh: ["B4"], lh: [], beats: 1 },
      { rh: ["A4"], lh: [], beats: 1 },
      { rh: ["G4"], lh: ["F#2"], beats: 1 },
      { rh: ["F#4"], lh: [], beats: 1 },
      { rh: ["G4"], lh: [], beats: 1 },
      { rh: ["A4"], lh: [], beats: 1 },
      { rh: ["B4"], lh: ["G2"], beats: 1 },
      { rh: ["A4"], lh: [], beats: 1 },
      { rh: ["G4"], lh: [], beats: 1 },
      { rh: ["F#4"], lh: [], beats: 1 },
      { rh: ["E4"], lh: ["D3"], beats: 1 },
      { rh: ["F#4"], lh: [], beats: 1 },
      { rh: ["G4"], lh: [], beats: 1 },
      { rh: ["A4"], lh: [], beats: 1 },
      { rh: ["B4"], lh: ["G2"], beats: 1 },
      { rh: ["A4"], lh: [], beats: 1 },
      { rh: ["G4"], lh: [], beats: 1 },
      { rh: ["F#4"], lh: [], beats: 1 },
      { rh: ["E4"], lh: ["A2"], beats: 1 },
      { rh: ["D4"], lh: [], beats: 1 },
      { rh: ["E4"], lh: [], beats: 1 },
      { rh: ["F#4"], lh: [], beats: 1 },
    ],
  },
  {
    id: "canon2hand",
    title: "Pachelbel's Canon (two hands)",
    meter: "4/4",
    notes: [
      { rh: ["F#5"], lh: ["D3"], beats: 1 },
      { rh: ["E5"], lh: ["A3"], beats: 1 },
      { rh: ["D5"], lh: ["D3"], beats: 1 },
      { rh: ["C#5"], lh: ["A3"], beats: 1 },
      { rh: ["B4"], lh: ["A2"], beats: 1 },
      { rh: ["A4"], lh: ["E3"], beats: 1 },
      { rh: ["B4"], lh: ["A2"], beats: 1 },
      { rh: ["C#5"], lh: ["E3"], beats: 1 },
      { rh: ["D5"], lh: ["B2"], beats: 1 },
      { rh: ["C#5"], lh: ["F#3"], beats: 1 },
      { rh: ["B4"], lh: ["B2"], beats: 1 },
      { rh: ["A4"], lh: ["F#3"], beats: 1 },
      { rh: ["G4"], lh: ["F#2"], beats: 1 },
      { rh: ["F#4"], lh: ["C#3"], beats: 1 },
      { rh: ["G4"], lh: ["F#2"], beats: 1 },
      { rh: ["A4"], lh: ["C#3"], beats: 1 },
      { rh: ["B4"], lh: ["G2"], beats: 1 },
      { rh: ["A4"], lh: ["D3"], beats: 1 },
      { rh: ["G4"], lh: ["G2"], beats: 1 },
      { rh: ["F#4"], lh: ["D3"], beats: 1 },
      { rh: ["E4"], lh: ["D3"], beats: 1 },
      { rh: ["F#4"], lh: ["A3"], beats: 1 },
      { rh: ["G4"], lh: ["D3"], beats: 1 },
      { rh: ["A4"], lh: ["A3"], beats: 1 },
      { rh: ["B4"], lh: ["G2"], beats: 1 },
      { rh: ["A4"], lh: ["D3"], beats: 1 },
      { rh: ["G4"], lh: ["G2"], beats: 1 },
      { rh: ["F#4"], lh: ["D3"], beats: 1 },
      { rh: ["E4"], lh: ["A2"], beats: 1 },
      { rh: ["D4"], lh: ["E3"], beats: 1 },
      { rh: ["E4"], lh: ["A2"], beats: 1 },
      { rh: ["D4"], lh: ["A2"], beats: 1 },
    ],
  },
  {
    id: "canon2hand_compact",
    title: "Pachelbel's Canon (compact, fits C2–C5)",
    meter: "4/4",
    notes: [
      { rh: ["F#4"], lh: ["D3"], beats: 1 },
      { rh: ["E4"], lh: ["A3"], beats: 1 },
      { rh: ["D4"], lh: ["D3"], beats: 1 },
      { rh: ["C#4"], lh: ["A3"], beats: 1 },
      { rh: ["B3"], lh: ["A2"], beats: 1 },
      { rh: ["A3"], lh: ["E3"], beats: 1 },
      { rh: ["B3"], lh: ["A2"], beats: 1 },
      { rh: ["C#4"], lh: ["E3"], beats: 1 },
      { rh: ["D4"], lh: ["B2"], beats: 1 },
      { rh: ["C#4"], lh: ["F#3"], beats: 1 },
      { rh: ["B3"], lh: ["B2"], beats: 1 },
      { rh: ["A3"], lh: ["F#3"], beats: 1 },
      { rh: ["G3"], lh: ["F#2"], beats: 1 },
      { rh: ["F#3"], lh: ["C#3"], beats: 1 },
      { rh: ["G3"], lh: ["F#2"], beats: 1 },
      { rh: ["A3"], lh: ["C#3"], beats: 1 },
      { rh: ["B3"], lh: ["G2"], beats: 1 },
      { rh: ["A3"], lh: ["D3"], beats: 1 },
      { rh: ["G3"], lh: ["G2"], beats: 1 },
      { rh: ["F#3"], lh: ["D3"], beats: 1 },
      { rh: ["E3"], lh: ["D3"], beats: 1 },
      { rh: ["F#3"], lh: ["A3"], beats: 1 },
      { rh: ["G3"], lh: ["D3"], beats: 1 },
      { rh: ["A3"], lh: ["A3"], beats: 1 },
      { rh: ["B3"], lh: ["G2"], beats: 1 },
      { rh: ["A3"], lh: ["D3"], beats: 1 },
      { rh: ["G3"], lh: ["G2"], beats: 1 },
      { rh: ["F#3"], lh: ["D3"], beats: 1 },
      { rh: ["E3"], lh: ["A2"], beats: 1 },
      { rh: ["D3"], lh: ["E3"], beats: 1 },
      { rh: ["E3"], lh: ["A2"], beats: 1 },
      { rh: ["D3"], lh: ["A2"], beats: 1 },
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

const KEYBOARD_PRESETS = [
  { id: "full", label: "Full (C2–C6, 4 oct)", start: "C2", end: "C6" },
  { id: "flkey37-low", label: "FLkey 37 (C2–C5, 3 oct)", start: "C2", end: "C5" },
  { id: "flkey37-mid", label: "FLkey 37 alt (C3–C6, 3 oct)", start: "C3", end: "C6" },
  { id: "compact", label: "Compact (C4–C6, 2 oct)", start: "C4", end: "C6" },
];

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

function cleanNoteName(raw) {
  return raw
    .toUpperCase()
    .replace(/^([A-G])B(\d)$/, (_, pitch, octave) => {
      const flatMap = { AB: "G#", BB: "A#", DB: "C#", EB: "D#", GB: "F#" };
      const mapped = flatMap[`${pitch}B`];
      return mapped ? `${mapped}${octave}` : `${pitch}${octave}`;
    });
}

function parseCustomEvents(input) {
  const normalized = input.replace(/\|/g, " ");
  const rawTokens = normalized.split(/[\s,]+/).map((token) => token.trim()).filter(Boolean);

  return rawTokens
    .map((token) => {
      const [rawNote, rawBeats] = token.split(":");
      const beats = rawBeats ? Number(rawBeats) : 1;
      if (Number.isNaN(beats) || beats <= 0) return null;

      const pieces = rawNote.split("+").map(cleanNoteName);
      if (pieces.length === 0 || pieces.some((n) => noteToMidi(n) == null)) return null;

      if (pieces.length === 1) return { note: pieces[0], beats };
      return { notes: pieces, beats };
    })
    .filter(Boolean);
}

function toNoteName(item) {
  return typeof item === "string" ? item : item.note;
}

function toFinger(item) {
  if (typeof item === "string") return null;
  return item.finger ?? null;
}

function eventNotes(event) {
  if (event.rh || event.lh) {
    return [...(event.rh ?? []), ...(event.lh ?? [])].map(toNoteName);
  }
  return (event.notes ?? [event.note]).map(toNoteName);
}

function eventHandMap(event) {
  const map = new Map();
  if (event.rh || event.lh) {
    (event.rh ?? []).forEach((n) => map.set(toNoteName(n), "rh"));
    (event.lh ?? []).forEach((n) => map.set(toNoteName(n), "lh"));
    return map;
  }
  (event.notes ?? [event.note]).forEach((n) => map.set(toNoteName(n), "any"));
  return map;
}

function handNotesOf(event, hand) {
  if (!event) return [];
  if (event.rh || event.lh) {
    return (hand === "rh" ? event.rh : event.lh) ?? [];
  }
  return hand === "rh" ? (event.notes ?? [event.note]) : [];
}

function eventFingerMap(event) {
  const map = new Map();
  const items = event.rh || event.lh
    ? [...(event.rh ?? []), ...(event.lh ?? [])]
    : (event.notes ?? [event.note]);
  items.forEach((item) => {
    const finger = toFinger(item);
    if (finger != null) map.set(toNoteName(item), finger);
  });
  return map;
}

const WHITE_SEMITONE_MAP = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

function noteToWhiteIndex(midi) {
  if (midi == null) return null;
  const octave = Math.floor(midi / 12);
  return octave * 7 + WHITE_SEMITONE_MAP[midi % 12];
}

function computeAutoFingerings(sequence, hand) {
  if (!sequence || sequence.length === 0) return [];
  const whiteIndices = sequence.map((note) => noteToWhiteIndex(noteToMidi(note)));
  const dir = hand === "rh" ? 1 : -1;
  const fingers = new Array(sequence.length);

  const assignWindow = (start, end, minW, maxW) => {
    const anchor = hand === "rh" ? minW : maxW;
    for (let i = start; i <= end; i++) {
      const w = whiteIndices[i];
      if (w == null) {
        fingers[i] = 3;
        continue;
      }
      const offset = (w - anchor) * dir;
      fingers[i] = Math.max(1, Math.min(5, offset + 1));
    }
  };

  let windowStart = 0;
  let windowMin = whiteIndices[0];
  let windowMax = whiteIndices[0];
  for (let i = 1; i < whiteIndices.length; i++) {
    const w = whiteIndices[i];
    if (w == null) continue;
    const newMin = Math.min(windowMin, w);
    const newMax = Math.max(windowMax, w);
    if (newMax - newMin > 4) {
      assignWindow(windowStart, i - 1, windowMin, windowMax);
      windowStart = i;
      windowMin = w;
      windowMax = w;
    } else {
      windowMin = newMin;
      windowMax = newMax;
    }
  }
  assignWindow(windowStart, whiteIndices.length - 1, windowMin, windowMax);
  return fingers;
}

function computeLessonFingerings(events) {
  const rhSeq = [];
  const lhSeq = [];
  const rhPositions = [];
  const lhPositions = [];

  events.forEach((event, eventIdx) => {
    const lhSet = new Set((event.lh ?? []).map(toNoteName));
    const allNotes = eventNotes(event);
    for (const note of allNotes) {
      if (lhSet.has(note)) {
        lhSeq.push(note);
        lhPositions.push({ eventIdx, note });
      } else {
        rhSeq.push(note);
        rhPositions.push({ eventIdx, note });
      }
    }
  });

  const rhFingers = computeAutoFingerings(rhSeq, "rh");
  const lhFingers = computeAutoFingerings(lhSeq, "lh");

  const result = new Map();
  const add = (positions, fingers) => {
    positions.forEach(({ eventIdx, note }, i) => {
      if (!result.has(eventIdx)) result.set(eventIdx, new Map());
      result.get(eventIdx).set(note, fingers[i]);
    });
  };
  add(rhPositions, rhFingers);
  add(lhPositions, lhFingers);
  return result;
}

function lessonUsesHands(lesson) {
  return lesson.notes.some((event) => event.rh || event.lh);
}

function prettyNote(note) {
  return note.replace("#", "♯");
}

function prettyEvent(event) {
  if (event.rh || event.lh) {
    const rhText = event.rh?.length ? event.rh.map(toNoteName).map(prettyNote).join("+") : "—";
    const lhText = event.lh?.length ? event.lh.map(toNoteName).map(prettyNote).join("+") : "—";
    return `RH ${rhText} · LH ${lhText}`;
  }
  return eventNotes(event).map(prettyNote).join(" + ");
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

function notesToAbcChunk(noteList, duration) {
  if (noteList.length === 0) return `z${duration}`;
  if (noteList.length === 1) return `${noteToAbc(noteList[0])}${duration}`;
  return `[${noteList.map(noteToAbc).join("")}]${duration}`;
}

function abcLyricLabel(noteList) {
  if (noteList.length === 0) return "*";
  return noteList.map((n) => n.replace(/\d/g, "").replace("#", "♯")).join("+");
}

function lessonToAbc(lesson) {
  if (lessonUsesHands(lesson)) {
    return lessonToAbcGrand(lesson);
  }
  return lessonToAbcSingle(lesson);
}

function lessonToAbcSingle(lesson) {
  const measureBeats = parseMeterBeats(lesson.meter);
  let running = 0;
  const body = [];
  const lyrics = [];

  lesson.notes.forEach((event, index) => {
    const evNotes = eventNotes(event);
    const duration = durationToAbc(event.beats);
    body.push(notesToAbcChunk(evNotes, duration));
    lyrics.push(abcLyricLabel(evNotes));

    running += event.beats;
    const atMeasureBoundary = Math.abs(running % measureBeats) < 0.0001;
    if (atMeasureBoundary && index !== lesson.notes.length - 1) {
      body.push("|");
    }
  });

  return `X:1\nT:${lesson.title}\nM:${lesson.meter}\nL:1/4\nK:C clef=treble\n${body.join(" ")} |]\nw: ${lyrics.join(" ")}`;
}

function lessonToAbcGrand(lesson) {
  const measureBeats = parseMeterBeats(lesson.meter);
  let running = 0;
  const rhBody = [];
  const lhBody = [];
  const rhLyrics = [];
  const lhLyrics = [];

  lesson.notes.forEach((event, index) => {
    const duration = durationToAbc(event.beats);
    const rhRaw = event.rh ?? (event.lh ? [] : (event.notes ?? [event.note]));
    const rhNotes = rhRaw.map(toNoteName);
    const lhNotes = (event.lh ?? []).map(toNoteName);

    rhBody.push(notesToAbcChunk(rhNotes, duration));
    lhBody.push(notesToAbcChunk(lhNotes, duration));
    rhLyrics.push(abcLyricLabel(rhNotes));
    lhLyrics.push(abcLyricLabel(lhNotes));

    running += event.beats;
    const atMeasureBoundary = Math.abs(running % measureBeats) < 0.0001;
    if (atMeasureBoundary && index !== lesson.notes.length - 1) {
      rhBody.push("|");
      lhBody.push("|");
    }
  });

  return [
    "X:1",
    `T:${lesson.title}`,
    `M:${lesson.meter}`,
    "L:1/4",
    "%%score (V1 V2)",
    "V:V1 clef=treble",
    "V:V2 clef=bass",
    "K:C",
    `[V:V1] ${rhBody.join(" ")} |]`,
    `w: ${rhLyrics.join(" ")}`,
    `[V:V2] ${lhBody.join(" ")} |]`,
    `w: ${lhLyrics.join(" ")}`,
  ].join("\n");
}

function formatDeltaMs(deltaMs) {
  const rounded = Math.round(Math.abs(deltaMs));
  return `${rounded}ms`;
}

const WHITE_KEY_PX = 56;
const FINGER_SPACING_PX = 48;

function keyCenterX(key) {
  if (key.white) return key.whiteIndex * WHITE_KEY_PX + WHITE_KEY_PX / 2;
  return key.whiteIndex * WHITE_KEY_PX + WHITE_KEY_PX;
}

function getHandNotes(event, handType) {
  if (!event) return [];
  if (event.rh || event.lh) {
    const raw = (handType === "rh" ? event.rh : event.lh) ?? [];
    return raw.map((n) => ({ note: toNoteName(n), finger: toFinger(n) }));
  }
  if (handType === "rh") {
    return (event.notes ?? [event.note]).map((n) => ({ note: toNoteName(n), finger: toFinger(n) }));
  }
  return [];
}

function computeHandLayout(notes, handType, keyXMap) {
  if (!notes || notes.length === 0) return null;
  const direction = handType === "rh" ? 1 : -1;

  const activeX = new Map();
  notes.forEach((n) => {
    if (n.finger != null) {
      const x = keyXMap.get(n.note);
      if (x != null) activeX.set(n.finger, x);
    }
  });

  let anchorFinger;
  let anchorX;
  if (activeX.size > 0) {
    [anchorFinger, anchorX] = [...activeX.entries()][0];
  } else {
    const first = notes[0];
    anchorX = keyXMap.get(first.note);
    if (anchorX == null) return null;
    anchorFinger = 3;
  }

  const fingers = [1, 2, 3, 4, 5].map((finger) => {
    const x = activeX.has(finger)
      ? activeX.get(finger)
      : anchorX + (finger - anchorFinger) * FINGER_SPACING_PX * direction;
    return { finger, x, active: activeX.has(finger) || (activeX.size === 0 && finger === 3 && notes.some((n) => keyXMap.get(n.note) === x)) };
  });

  return { fingers };
}

function Hand({ notes, handType, keyXMap, tick, animate = true }) {
  const layout = useMemo(() => computeHandLayout(notes, handType, keyXMap), [notes, handType, keyXMap]);
  if (!layout) return null;

  const xs = layout.fingers.map((f) => f.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const palmCenter = (minX + maxX) / 2;
  const palmWidth = Math.max(140, maxX - minX + 60);

  const palmBg = handType === "rh" ? "bg-sky-400/60" : "bg-amber-400/60";
  const palmBorder = handType === "rh" ? "border-sky-200" : "border-amber-200";
  const fingerBase = handType === "rh" ? "bg-sky-500/70" : "bg-amber-500/70";
  const fingerActive = handType === "rh" ? "bg-sky-300" : "bg-amber-300";
  const label = handType === "rh" ? "RH" : "LH";

  return (
    <>
      <motion.div
        className={`absolute rounded-full ${palmBg} border ${palmBorder} shadow-lg flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90`}
        style={{ top: 0, width: palmWidth, height: 38 }}
        animate={{ left: palmCenter - palmWidth / 2 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {label}
      </motion.div>
      {layout.fingers.map((f) => (
        <motion.div
          key={`${handType}-${f.finger}`}
          className="absolute"
          style={{ top: 30, width: 22, height: 60 }}
          animate={{ left: f.x - 11 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <motion.div
            key={animate ? `${handType}-${f.finger}-dip-${tick}` : `${handType}-${f.finger}-static`}
            initial={{ y: 0, scale: 1 }}
            animate={f.active && animate ? { y: [0, 18, 6], scale: [1, 1.1, 1] } : { y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`h-full w-full rounded-full border border-white/40 shadow-md flex items-end justify-center pb-1 text-[10px] font-bold text-white ${
              f.active && animate ? fingerActive : fingerBase
            }`}
          >
            {f.finger}
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}

function HandsOverlay({ rhDisplay, lhDisplay, rhFingerMap, lhFingerMap, keyXMap, width, tick }) {
  const applyFingers = (list, fmap) =>
    list.map((item) => ({
      ...item,
      finger: item.finger ?? fmap?.get(item.note) ?? null,
    }));

  const rhNotes = rhDisplay
    ? applyFingers(getHandNotes(rhDisplay.event, "rh"), rhFingerMap)
    : [];
  const lhNotes = lhDisplay
    ? applyFingers(getHandNotes(lhDisplay.event, "lh"), lhFingerMap)
    : [];

  if (rhNotes.length === 0 && lhNotes.length === 0) return null;

  return (
    <div className="relative mb-2" style={{ width, height: 100 }}>
      {rhNotes.length > 0 && (
        <Hand notes={rhNotes} handType="rh" keyXMap={keyXMap} tick={tick} animate={rhDisplay.isCurrent} />
      )}
      {lhNotes.length > 0 && (
        <Hand notes={lhNotes} handType="lh" keyXMap={keyXMap} tick={tick} animate={lhDisplay.isCurrent} />
      )}
    </div>
  );
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

function PianoKey({ note, active, expected, finger, onPress }) {
  const baseClass = note.white
    ? "h-64 w-14 rounded-b-2xl border border-zinc-800 bg-white text-zinc-800 shadow-md"
    : "absolute top-0 z-20 h-40 w-9 rounded-b-xl border border-zinc-950 bg-zinc-900 text-white shadow-2xl";

  const expectedWhiteClass = {
    rh: "bg-sky-50 ring-2 ring-sky-400/70",
    lh: "bg-amber-50 ring-2 ring-amber-400/70",
    any: "bg-emerald-50 ring-2 ring-emerald-400/70",
  };
  const expectedBlackClass = {
    rh: "bg-sky-900 ring-2 ring-sky-400/70",
    lh: "bg-amber-900 ring-2 ring-amber-400/70",
    any: "bg-emerald-900 ring-2 ring-emerald-400/70",
  };

  const stateClass = note.white
    ? active
      ? "ring-4 ring-blue-400/80 bg-blue-50"
      : expected
      ? expectedWhiteClass[expected] ?? expectedWhiteClass.any
      : "hover:bg-zinc-100"
    : active
    ? "ring-4 ring-blue-400/80 bg-blue-900"
    : expected
    ? expectedBlackClass[expected] ?? expectedBlackClass.any
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
      <div className={`relative flex h-full flex-col justify-end pb-3 text-center ${note.white ? "" : "pb-2"}`}>
        {expected && finger != null ? (
          <div
            className={`absolute left-1/2 top-2 -translate-x-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-md ${
              expected === "rh"
                ? "bg-sky-600 text-white"
                : expected === "lh"
                ? "bg-amber-600 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {finger}
          </div>
        ) : null}
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
  const [selectedInstrument, setSelectedInstrument] = useState(INSTRUMENTS[0].id);
  const [instrumentStatus, setInstrumentStatus] = useState("idle");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [midiStatus, setMidiStatus] = useState("idle");
  const [midiDevices, setMidiDevices] = useState([]);
  const [midiOctaveOffset, setMidiOctaveOffset] = useState(-1);
  const [staffArrowX, setStaffArrowX] = useState(null);
  const [keyboardPresetId, setKeyboardPresetId] = useState("flkey37-low");

  const audioContextRef = useRef(null);
  const previewTimeoutsRef = useRef([]);
  const metronomeIntervalRef = useRef(null);
  const staffContainerRef = useRef(null);
  const instrumentRef = useRef(null);
  const instrumentLoadingRef = useRef(null);
  const pressedInEventRef = useRef(new Set());
  const midiAccessRef = useRef(null);
  const midiOctaveOffsetRef = useRef(0);
  const handleNotePressRef = useRef(null);
  const attackNoteRef = useRef(null);
  const releaseNoteRef = useRef(null);
  const registerPressRef = useRef(null);

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
  const expectedNotesList = expectedEvent ? eventNotes(expectedEvent) : [];
  const autoFingerings = useMemo(() => computeLessonFingerings(notes), [notes]);

  const displayIndex = isPreviewing && previewIndex >= 0 ? previewIndex : currentIndex;
  const displayEvent = notes[displayIndex] ?? null;

  const rhDisplay = useMemo(() => {
    for (let i = displayIndex; i >= 0; i--) {
      if (handNotesOf(notes[i], "rh").length > 0) {
        return { event: notes[i], atIndex: i, isCurrent: i === displayIndex };
      }
    }
    return null;
  }, [notes, displayIndex]);

  const lhDisplay = useMemo(() => {
    for (let i = displayIndex; i >= 0; i--) {
      if (handNotesOf(notes[i], "lh").length > 0) {
        return { event: notes[i], atIndex: i, isCurrent: i === displayIndex };
      }
    }
    return null;
  }, [notes, displayIndex]);

  const buildFingerMap = (displayState) => {
    if (!displayState) return new Map();
    const merged = new Map(autoFingerings.get(displayState.atIndex) ?? []);
    eventFingerMap(displayState.event).forEach((finger, note) => merged.set(note, finger));
    return merged;
  };
  const rhFingerMap = useMemo(() => buildFingerMap(rhDisplay), [rhDisplay, autoFingerings]);
  const lhFingerMap = useMemo(() => buildFingerMap(lhDisplay), [lhDisplay, autoFingerings]);

  const displayHandMap = useMemo(() => {
    const map = new Map();
    if (rhDisplay) handNotesOf(rhDisplay.event, "rh").forEach((item) => map.set(toNoteName(item), "rh"));
    if (lhDisplay) handNotesOf(lhDisplay.event, "lh").forEach((item) => map.set(toNoteName(item), "lh"));
    if (!rhDisplay && !lhDisplay && displayEvent) {
      eventHandMap(displayEvent).forEach((hand, note) => map.set(note, hand));
    }
    return map;
  }, [rhDisplay, lhDisplay, displayEvent]);

  const displayFingerMap = useMemo(() => {
    const merged = new Map(rhFingerMap);
    lhFingerMap.forEach((finger, note) => merged.set(note, finger));
    return merged;
  }, [rhFingerMap, lhFingerMap]);

  const activeNoteSet = useMemo(() => {
    if (isPreviewing && displayEvent) return new Set(eventNotes(displayEvent));
    return new Set();
  }, [isPreviewing, displayEvent]);
  const expectedNote = expectedNotesList[0] ?? null;
  const progress = notes.length ? Math.round((currentIndex / notes.length) * 100) : 0;
  const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 100;
  const beatMs = 60000 / bpm;
  const abcSource = useMemo(() => lessonToAbc(currentLesson), [currentLesson]);

  const keyboardRange = useMemo(() => {
    const preset = KEYBOARD_PRESETS.find((p) => p.id === keyboardPresetId) ?? KEYBOARD_PRESETS[0];
    return createKeyboardRange(preset.start, preset.end);
  }, [keyboardPresetId]);

  const visibleKeyboard = useMemo(() => {
    return keyboardRange.map((key) => ({
      ...key,
      shortcut: showShortcuts ? key.shortcut : "",
    }));
  }, [showShortcuts, keyboardRange]);

  const whiteKeys = visibleKeyboard.filter((key) => key.white);
  const blackKeys = visibleKeyboard.filter((key) => !key.white);
  const keyXMap = useMemo(() => {
    const map = new Map();
    visibleKeyboard.forEach((key) => map.set(key.note, keyCenterX(key)));
    return map;
  }, [visibleKeyboard]);
  const handTick = displayIndex;

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

    renderStaff().then(() => {
      if (!cancelled) requestAnimationFrame(updateStaffArrow);
    });
    return () => {
      cancelled = true;
      if (staffContainerRef.current) {
        staffContainerRef.current.innerHTML = "";
      }
    };
  }, [abcSource, isFocusMode]);

  function updateStaffArrow() {
    if (!staffContainerRef.current) {
      setStaffArrowX(null);
      return;
    }
    const allNotes = staffContainerRef.current.querySelectorAll(".abcjs-note");
    const targetIndex = isPreviewing && previewIndex >= 0 ? previewIndex : currentIndex;
    const target = allNotes[targetIndex];
    if (!target) {
      setStaffArrowX(null);
      return;
    }
    const containerRect = staffContainerRef.current.getBoundingClientRect();
    const noteRect = target.getBoundingClientRect();
    setStaffArrowX(noteRect.left + noteRect.width / 2 - containerRect.left);
  }

  useEffect(() => {
    updateStaffArrow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, previewIndex, isPreviewing]);

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
    ensureInstrument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInstrument]);

  useEffect(() => {
    if (!isFocusMode) return undefined;
    const handleEsc = (event) => {
      if (event.key === "Escape") setIsFocusMode(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFocusMode]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.requestMIDIAccess) {
      setMidiStatus("unsupported");
      return undefined;
    }

    let cancelled = false;
    setMidiStatus("requesting");

    const onMessage = (event) => {
      const [status, note, velocity] = event.data;
      const command = status & 0xf0;
      const adjusted = note + midiOctaveOffsetRef.current * 12;
      const noteName = midiToNote(adjusted);

      if (command === 0x90 && velocity > 0) {
        const norm = velocity / 127;
        attackNoteRef.current?.(noteName, norm);
        registerPressRef.current?.(noteName);
      } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
        releaseNoteRef.current?.(noteName);
      }
    };

    const refreshDevices = (access) => {
      const inputs = [...access.inputs.values()];
      setMidiDevices(inputs.map((input) => input.name || "Unknown device"));
      inputs.forEach((input) => {
        input.onmidimessage = onMessage;
      });
    };

    navigator
      .requestMIDIAccess({ sysex: false })
      .then((access) => {
        if (cancelled) return;
        midiAccessRef.current = access;
        setMidiStatus("ready");
        refreshDevices(access);
        access.onstatechange = () => refreshDevices(access);
      })
      .catch(() => {
        if (!cancelled) setMidiStatus("denied");
      });

    return () => {
      cancelled = true;
      const access = midiAccessRef.current;
      if (access) {
        [...access.inputs.values()].forEach((input) => {
          input.onmidimessage = null;
        });
        access.onstatechange = null;
      }
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
      pressedInEventRef.current = new Set();
      setWrongCount((count) => count + 1);
      setMissedCount((count) => count + 1);
      setFeedback({
        kind: "missed",
        text: `Missed ${prettyEvent(notes[currentIndex])} — move to the next beat.`,
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

  function ensureInstrument() {
    const name = selectedInstrument;
    const config = INSTRUMENTS.find((i) => i.id === name);
    if (instrumentRef.current?.name === name) return instrumentRef.current.player;
    if (instrumentLoadingRef.current?.name === name) return instrumentLoadingRef.current.promise;

    const audioContext = getAudioContext();
    if (!audioContext) return null;

    setInstrumentStatus("loading");
    const loader = config?.source === "salamander"
      ? loadSalamander()
      : Soundfont.instrument(audioContext, name).then((sf) => {
          const active = new Map();
          return {
            play(note, time, options) {
              sf.play(note, time, options);
            },
            attack(note, velocity) {
              const handle = sf.play(note, audioContext.currentTime, {
                gain: Math.min(1, Math.max(0.05, velocity ?? 0.7)),
              });
              active.set(note, handle);
            },
            release(note) {
              const handle = active.get(note);
              if (handle) {
                handle.stop(audioContext.currentTime);
                active.delete(note);
              }
            },
          };
        });

    const promise = loader
      .then((player) => {
        if (instrumentLoadingRef.current?.name === name) {
          instrumentRef.current = { name, player };
          instrumentLoadingRef.current = null;
          setInstrumentStatus("ready");
        }
        return player;
      })
      .catch(() => {
        if (instrumentLoadingRef.current?.name === name) {
          instrumentLoadingRef.current = null;
          setInstrumentStatus("error");
        }
        return null;
      });

    instrumentLoadingRef.current = { name, promise };
    return promise;
  }

  function playOscillatorTone(noteName, duration) {
    const midi = noteToMidi(noteName);
    if (midi == null) return;
    const audioContext = getAudioContext();
    if (!audioContext) return;

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

  async function playTone(noteName, duration = 0.45, gain = 0.8) {
    const audioContext = getAudioContext();
    if (!audioContext) return;
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    ensureInstrument();

    if (instrumentRef.current?.name === selectedInstrument) {
      instrumentRef.current.player.play(noteName, audioContext.currentTime, { duration, gain });
      return;
    }

    playOscillatorTone(noteName, duration);
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
    pressedInEventRef.current = new Set();
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
    if (!expectedEvent) {
      setFeedback({ kind: "complete", text: "Exercise complete." });
      return;
    }

    const expected = eventNotes(expectedEvent);
    if (!expected.includes(noteName)) {
      setWrongCount((count) => count + 1);
      setFeedback({ kind: "wrong", text: `Expected ${prettyEvent(expectedEvent)}.` });
      return;
    }

    pressedInEventRef.current.add(noteName);
    if (pressedInEventRef.current.size < expected.length) {
      setFeedback({
        kind: "correct",
        text: `${pressedInEventRef.current.size}/${expected.length} — keep going.`,
      });
      return;
    }

    pressedInEventRef.current = new Set();
    const nextIndex = currentIndex + 1;
    setCorrectCount((count) => count + 1);
    setFeedback({ kind: "correct", text: nextIndex >= notes.length ? "Exercise complete." : "Correct — keep going." });
    setCurrentIndex(nextIndex);
  }

  function handleRhythmModePress(noteName) {
    if (!expectedEvent || transportStartAt == null) return;

    const expected = eventNotes(expectedEvent);
    if (!expected.includes(noteName)) {
      setWrongCount((count) => count + 1);
      setFeedback({ kind: "wrong", text: `Wrong pitch — expected ${prettyEvent(expectedEvent)}.` });
      return;
    }

    const now = performance.now();
    const expectedAt = transportStartAt + noteStartBeats[currentIndex] * beatMs;
    const delta = now - expectedAt;

    const isFirstPress = pressedInEventRef.current.size === 0;
    if (isFirstPress && delta < -toleranceMs) {
      setWrongCount((count) => count + 1);
      setFeedback({ kind: "early", text: `Too early by ${formatDeltaMs(delta)}.` });
      return;
    }

    pressedInEventRef.current.add(noteName);
    if (pressedInEventRef.current.size < expected.length) {
      setFeedback({
        kind: "correct",
        text: `${pressedInEventRef.current.size}/${expected.length} — finish the chord.`,
      });
      return;
    }

    pressedInEventRef.current = new Set();
    if (Math.abs(delta) <= toleranceMs) {
      setCorrectCount((count) => count + 1);
      setOnTimeCount((count) => count + 1);
      setFeedback({ kind: "correct", text: `On time (${formatDeltaMs(delta)}).` });
      setCurrentIndex((index) => index + 1);
      return;
    }

    setWrongCount((count) => count + 1);
    setFeedback({ kind: "late", text: `Late by ${formatDeltaMs(delta)}.` });
    setCurrentIndex((index) => index + 1);
  }

  function registerPress(noteName) {
    if (isPreviewing) return;

    setLastPlayed(noteName);

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

  function handleNotePress(noteName) {
    if (isPreviewing) return;
    playTone(noteName);
    registerPress(noteName);
  }

  async function attackNote(noteName, velocity = 0.7) {
    const audioContext = getAudioContext();
    if (!audioContext) return;
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    ensureInstrument();

    const player = instrumentRef.current?.name === selectedInstrument
      ? instrumentRef.current.player
      : null;

    if (player?.attack) {
      player.attack(noteName, velocity);
    } else {
      playOscillatorTone(noteName, 0.5);
    }
  }

  function releaseNote(noteName) {
    const player = instrumentRef.current?.name === selectedInstrument
      ? instrumentRef.current.player
      : null;
    player?.release?.(noteName);
  }

  handleNotePressRef.current = handleNotePress;
  attackNoteRef.current = attackNote;
  releaseNoteRef.current = releaseNote;
  registerPressRef.current = registerPress;
  midiOctaveOffsetRef.current = midiOctaveOffset;

  function previewLesson() {
    if (!notes.length || isPreviewing) return;

    clearPreviewTimeouts();
    setIsPreviewing(true);
    setPreviewIndex(-1);

    const beatSec = beatMs / 1000;

    const eventStartBeats = [];
    let runningBeats = 0;
    notes.forEach((event) => {
      eventStartBeats.push(runningBeats);
      runningBeats += event.beats;
    });
    const totalBeats = runningBeats;

    const nextLHIndexFor = new Map();
    let lastLHIndex = -1;
    notes.forEach((event, index) => {
      if (event.lh && event.lh.length > 0) {
        if (lastLHIndex >= 0) nextLHIndexFor.set(lastLHIndex, index);
        lastLHIndex = index;
      }
    });

    notes.forEach((event, index) => {
      const baseDelay = eventStartBeats[index] * beatMs;
      const jitter = (Math.random() - 0.5) * 24;
      const startDelay = Math.max(0, baseDelay + jitter);
      const beatInMeasure = eventStartBeats[index] % measureBeats;
      const isDownbeat = Math.abs(beatInMeasure) < 0.001;

      const lhNoteSet = new Set((event.lh ?? []).map(toNoteName));
      const allNotes = eventNotes(event);

      const timeoutId = window.setTimeout(() => {
        setPreviewIndex(index);

        allNotes.forEach((note) => {
          const isLH = lhNoteSet.has(note);
          let duration;
          if (isLH) {
            const nextLH = nextLHIndexFor.get(index);
            if (nextLH != null) {
              const beatsUntil = eventStartBeats[nextLH] - eventStartBeats[index];
              duration = (beatsUntil + 0.2) * beatSec;
            } else {
              duration = 2.5;
            }
          } else {
            duration = Math.max(0.2, (event.beats + 0.15) * beatSec);
          }

          let gain;
          if (isLH) gain = 0.5;
          else if (isDownbeat) gain = 0.85;
          else gain = 0.65;

          playTone(note, duration, gain);
        });
      }, startDelay);

      previewTimeoutsRef.current.push(timeoutId);
    });

    const endingId = window.setTimeout(() => {
      setPreviewIndex(-1);
      setIsPreviewing(false);
    }, totalBeats * beatMs + 2500);
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

  const keyboardWidth = whiteKeys.length * 56;

  const keysBlock = (
    <div className="relative" style={{ width: `${keyboardWidth}px` }}>
      <div className="flex items-start">
        {whiteKeys.map((key) => (
          <PianoKey
            key={key.note}
            note={key}
            active={lastPlayed === key.note || activeNoteSet.has(key.note)}
            expected={displayHandMap.get(key.note) ?? null}
            finger={displayFingerMap.get(key.note) ?? null}
            onPress={handleNotePress}
          />
        ))}
      </div>
      {blackKeys.map((key) => (
        <PianoKey
          key={key.note}
          note={key}
          active={lastPlayed === key.note || activeNoteSet.has(key.note)}
          expected={displayHandMap.get(key.note) ?? null}
          finger={displayFingerMap.get(key.note) ?? null}
          onPress={handleNotePress}
        />
      ))}
    </div>
  );

  const keyboardPanel = (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto" style={{ width: `${keyboardWidth}px`, minWidth: `${keyboardWidth}px` }}>
        <HandsOverlay
          rhDisplay={rhDisplay}
          lhDisplay={lhDisplay}
          rhFingerMap={rhFingerMap}
          lhFingerMap={lhFingerMap}
          keyXMap={keyXMap}
          width={keyboardWidth}
          tick={handTick}
        />
        {keysBlock}
      </div>
    </div>
  );

  if (isFocusMode) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-zinc-50">
        <header className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Exercise</div>
              <div className="text-sm font-semibold text-white">{currentLesson.title}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Next</div>
              <div className={`text-sm font-semibold ${statusTone}`}>
                {expectedEvent ? prettyEvent(expectedEvent) : "Done"}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Progress</div>
              <div className="text-sm font-semibold text-white">{progress}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previewLesson}
              disabled={isPreviewing}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> Hear
            </button>
            {practiceMode === "rhythm" ? (
              <>
                <button
                  type="button"
                  onClick={startRhythmRun}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                >
                  <Play className="h-4 w-4" /> Start
                </button>
                <button
                  type="button"
                  onClick={stopRhythmRun}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
                >
                  <Square className="h-4 w-4" /> Stop
                </button>
              </>
            ) : null}
            <select
              value={keyboardPresetId}
              onChange={(event) => setKeyboardPresetId(event.target.value)}
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-blue-500"
            >
              {KEYBOARD_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsFocusMode(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
            >
              Exit (Esc)
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col overflow-auto px-4 pt-4 pb-4 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-white p-3 text-zinc-900 shadow-inner md:p-5">
            <div className="relative">
              <div ref={staffContainerRef} className="w-full overflow-x-auto" />
              {staffArrowX != null ? (
                <div
                  className="pointer-events-none absolute top-0 transition-all duration-200 ease-out"
                  style={{ left: `${staffArrowX - 10}px` }}
                >
                  <svg width="20" height="14" className="drop-shadow">
                    <polygon points="0,0 20,0 10,14" fill="#3b82f6" />
                  </svg>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex-1" />
          <div className="overflow-x-auto">
            <div className="mx-auto" style={{ width: `${keyboardWidth}px`, minWidth: `${keyboardWidth}px` }}>
              <HandsOverlay
                rhDisplay={rhDisplay}
                lhDisplay={lhDisplay}
                rhFingerMap={rhFingerMap}
                lhFingerMap={lhFingerMap}
                keyXMap={keyXMap}
                width={keyboardWidth}
                tick={handTick}
              />
            </div>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="mx-auto" style={{ width: `${keyboardWidth}px`, minWidth: `${keyboardWidth}px` }}>
              {keysBlock}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="min-w-0 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl">
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

            <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
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
                <div className="relative">
                  <div ref={staffContainerRef} className="w-full overflow-x-auto" />
                  {staffArrowX != null ? (
                    <div
                      className="pointer-events-none absolute top-0 transition-all duration-200 ease-out"
                      style={{ left: `${staffArrowX - 10}px` }}
                    >
                      <svg width="20" height="14" className="drop-shadow">
                        <polygon points="0,0 20,0 10,14" fill="#3b82f6" />
                      </svg>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 min-w-0">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Next note</div>
                  <div className="mt-1 text-3xl font-semibold text-white">
                    {expectedEvent ? prettyEvent(expectedEvent) : "Done"}
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
                    <span className="font-semibold text-white">{bpm} ({(60 / bpm).toFixed(1)}s/beat)</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="160"
                    step="1"
                    value={bpm}
                    onChange={(event) => setBpm(Number(event.target.value))}
                    className="mt-3 w-full"
                  />
                  <div className="mt-3 grid grid-cols-5 gap-1">
                    {[
                      { label: "5s", bpm: 12 },
                      { label: "3s", bpm: 20 },
                      { label: "2s", bpm: 30 },
                      { label: "1s", bpm: 60 },
                      { label: "0.5s", bpm: 120 },
                    ].map((preset) => (
                      <button
                        key={preset.bpm}
                        type="button"
                        onClick={() => setBpm(preset.bpm)}
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                          bpm === preset.bpm
                            ? "border-blue-500 bg-blue-600 text-white"
                            : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
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

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between text-sm text-zinc-300">
                    <span>Instrument</span>
                    <span className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {instrumentStatus === "loading"
                        ? "Loading…"
                        : instrumentStatus === "error"
                        ? "Failed"
                        : instrumentStatus === "ready"
                        ? "Ready"
                        : ""}
                    </span>
                  </div>
                  <select
                    value={selectedInstrument}
                    onChange={(event) => setSelectedInstrument(event.target.value)}
                    className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                  >
                    {INSTRUMENTS.map((instrument) => (
                      <option key={instrument.id} value={instrument.id}>
                        {instrument.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between text-sm text-zinc-300">
                    <span>MIDI input</span>
                    <span
                      className={`text-xs uppercase tracking-[0.16em] ${
                        midiStatus === "ready"
                          ? "text-emerald-300"
                          : midiStatus === "denied" || midiStatus === "unsupported"
                          ? "text-rose-300"
                          : "text-zinc-500"
                      }`}
                    >
                      {midiStatus === "requesting"
                        ? "Requesting…"
                        : midiStatus === "ready"
                        ? midiDevices.length > 0
                          ? "Connected"
                          : "No device"
                        : midiStatus === "denied"
                        ? "Permission denied"
                        : midiStatus === "unsupported"
                        ? "Unsupported"
                        : "Idle"}
                    </span>
                  </div>
                  {midiDevices.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                      {midiDevices.map((name) => (
                        <li key={name} className="truncate">{name}</li>
                      ))}
                    </ul>
                  ) : midiStatus === "ready" ? (
                    <div className="mt-2 text-xs text-zinc-500">Plug in a MIDI keyboard to play with real keys.</div>
                  ) : null}
                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                    <span>Octave offset</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setMidiOctaveOffset((v) => Math.max(-3, v - 1))}
                        className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200 transition hover:border-zinc-500"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">
                        {midiOctaveOffset > 0 ? `+${midiOctaveOffset}` : midiOctaveOffset}
                      </span>
                      <button
                        type="button"
                        onClick={() => setMidiOctaveOffset((v) => Math.min(3, v + 1))}
                        className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200 transition hover:border-zinc-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="text-sm text-zinc-300">Keyboard range</div>
                  <select
                    value={keyboardPresetId}
                    onChange={(event) => setKeyboardPresetId(event.target.value)}
                    className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
                  >
                    {KEYBOARD_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="inline-flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                  <span>Show keyboard shortcuts</span>
                  <input
                    type="checkbox"
                    checked={showShortcuts}
                    onChange={(event) => setShowShortcuts(event.target.checked)}
                    className="h-4 w-4 rounded border-zinc-600 bg-zinc-900"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setIsFocusMode(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
                >
                  Focus mode
                </button>

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
                Use note:beats pairs like C4:1 D4:1 E4:0.5 F4:0.5 G4:2. Join notes with + for chords: C4+E4+G4:2. The custom exercise shows up in the selector automatically.
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

          {keyboardPanel}
        </div>
      </div>
    </div>
  );
}

