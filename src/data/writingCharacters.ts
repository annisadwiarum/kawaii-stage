export type WritingScript = "hiragana" | "katakana" | "kanji";

export type WritingStrokePoint = {
  x: number;
  y: number;
};

export type WritingStroke = {
  id: string;
  order: number;
  points: WritingStrokePoint[];
};

export type WritingCharacter = {
  id: string;
  glyph: string;
  romaji: string;
  meaning: string;
  script: WritingScript;
  difficulty: "starter" | "casual" | "challenge";
  vibe: string;
  strokes: WritingStroke[];
};

const createStroke = (id: string, order: number, points: [number, number][]): WritingStroke => ({
  id,
  order,
  points: points.map(([x, y]) => ({ x, y })),
});

export const writingCharacters: WritingCharacter[] = [
  {
    id: "hiragana-a",
    glyph: "あ",
    romaji: "a",
    meaning: "vokal dasar",
    script: "hiragana",
    difficulty: "starter",
    vibe: "Mulai dari garis lebar lalu lengkung dramatis, akhiri kait imut di kanan.",
    strokes: [
      createStroke("a-1", 1, [[17.0, 25.2], [24.5, 30.1], [43.0, 29.9], [68.1, 23.5]]),
      createStroke("a-2", 2, [[32.3, 13.4], [41.0, 18.1], [36.4, 37.9], [35.8, 61.7], [39.9, 71.1], [42.1, 75.9]]),
      createStroke("a-3", 3, [[55.6, 42.9], [59.5, 47.3], [44.9, 70.9], [19.5, 81.5], [17.7, 66.6], [33.4, 54.3], [45.5, 50.2], [62.6, 48.7], [73.5, 50.8], [81.8, 59.2], [82.5, 74.5], [68.6, 84.8], [49.6, 90.0]])
    ],
  },
  {
    id: "hiragana-ka",
    glyph: "か",
    romaji: "ka",
    meaning: "hiragana k-series",
    script: "hiragana",
    difficulty: "starter",
    vibe: "Stroke panjang tegas dengan kait kecil yang nge-pop.",
    strokes: [
      createStroke("ka-1", 1, [
        [30, 18],
        [30, 48],
        [30, 84],
        [36, 90],
      ]),
      createStroke("ka-2", 2, [
        [20, 38],
        [44, 36],
      ]),
      createStroke("ka-3", 3, [
        [64, 24],
        [78, 34],
        [70, 52],
        [78, 74],
        [72, 90],
        [64, 94],
      ]),
    ],
  },
  {
    id: "katakana-ne",
    glyph: "ネ",
    romaji: "ne",
    meaning: "katakana twist",
    script: "katakana",
    difficulty: "casual",
    vibe: "Sudut tajam dan garis lurus ala neon signage.",
    strokes: [
      createStroke("ne-1", 1, [
        [28, 28],
        [74, 64],
      ]),
      createStroke("ne-2", 2, [
        [24, 46],
        [76, 46],
      ]),
      createStroke("ne-3", 3, [
        [58, 18],
        [58, 60],
        [50, 78],
        [56, 92],
      ]),
    ],
  },
  {
    id: "katakana-su",
    glyph: "ス",
    romaji: "su",
    meaning: "katakana breeze",
    script: "katakana",
    difficulty: "casual",
    vibe: "Mulai dari diagonal halus lalu tarik garis panjang ke bawah.",
    strokes: [
      createStroke("su-1", 1, [
        [32, 22],
        [64, 32],
      ]),
      createStroke("su-2", 2, [
        [24, 34],
        [78, 34],
      ]),
      createStroke("su-3", 3, [
        [70, 28],
        [58, 48],
        [36, 80],
        [28, 88],
        [44, 94],
      ]),
    ],
  },
  {
    id: "kanji-hi",
    glyph: "日",
    romaji: "hi",
    meaning: "matahari / hari",
    script: "kanji",
    difficulty: "starter",
    vibe: "Bingkai rapi dengan garis penutup yang presisi.",
    strokes: [
      createStroke("hi-1", 1, [
        [20, 22],
        [80, 22],
      ]),
      createStroke("hi-2", 2, [
        [24, 24],
        [24, 84],
        [78, 84],
      ]),
      createStroke("hi-3", 3, [
        [78, 24],
        [78, 82],
      ]),
      createStroke("hi-4", 4, [
        [26, 54],
        [78, 54],
      ]),
    ],
  },
  {
    id: "kanji-mizu",
    glyph: "水",
    romaji: "mizu",
    meaning: "air / water",
    script: "kanji",
    difficulty: "challenge",
    vibe: "Garis tengah kuat dengan percikan diagonal di kiri dan kanan.",
    strokes: [
      createStroke("mizu-1", 1, [
        [44, 20],
        [32, 32],
      ]),
      createStroke("mizu-2", 2, [
        [52, 12],
        [52, 70],
        [46, 92],
      ]),
      createStroke("mizu-3", 3, [
        [48, 46],
        [26, 72],
      ]),
      createStroke("mizu-4", 4, [
        [56, 48],
        [78, 80],
      ]),
    ],
  },
];
