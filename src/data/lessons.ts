const SILENCE_AUDIO = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";

export type LessonStepIntro = {
  id: string;
  type: "intro";
  title: string;
  description: string;
  audio?: string;
};

export type LessonStepPractice = {
  id: string;
  type: "practice";
  prompt: string;
  romaji: string;
  hint: string;
  example: string;
};

export type LessonStepQuiz = {
  id: string;
  type: "quiz";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LessonStep = LessonStepIntro | LessonStepPractice | LessonStepQuiz;

export type LessonMeta = {
  id: string;
  title: string;
  script: "hiragana" | "katakana" | "kanji";
  level: "starter" | "casual" | "challenge";
  durationMinutes: number;
  xpReward: number;
  prerequisites?: string[];
  steps: LessonStep[];
};

export const lessons: LessonMeta[] = [
  {
    id: "hiragana-a",
    title: "Get comfy with あ",
    script: "hiragana",
    level: "starter",
    durationMinutes: 4,
    xpReward: 80,
    steps: [
      {
        id: "intro",
        type: "intro",
        title: "Sound & vibe",
        description:
          "Huruf あ dibaca \"a\" seperti pada kata \"aku\". Yuk dengerin audio supaya ketauan ritmenya.",
        audio: SILENCE_AUDIO,
      },
      {
        id: "practice",
        type: "practice",
        prompt: "Tulis あ sambil ucapkan keras-keras.",
        romaji: "a",
        hint: "Mulai dari garis horizontal, turun melengkung, dan tutup dengan garis miring kecil.",
        example: "あい (ai) artinya cinta",
      },
      {
        id: "quiz",
        type: "quiz",
        question: "Mana kombinasi huruf latin yang cocok buat あ?",
        options: ["ka", "a", "e"],
        correctIndex: 1,
        explanation: "あ melambangkan bunyi vokal \"a\" murni.",
      },
    ],
  },
  {
    id: "hiragana-ka",
    title: "Kana combo か",
    script: "hiragana",
    level: "starter",
    durationMinutes: 5,
    xpReward: 90,
    prerequisites: ["hiragana-a"],
    steps: [
      {
        id: "intro",
        type: "intro",
        title: "Kenalan sama か",
        description:
          "Huruf か dibaca \"ka\". Perhatikan garis tegak dan kait kecil di kanan atas.",
        audio: SILENCE_AUDIO,
      },
      {
        id: "practice",
        type: "practice",
        prompt: "Gambarkan か tiga kali sambil cek urutan stroke-nya.",
        romaji: "ka",
        hint: "Stroke pertama vertikal, lanjut garis horizontal, akhiri dengan kait.",
        example: "かさ (kasa) artinya payung",
      },
      {
        id: "quiz",
        type: "quiz",
        question: "Pilih kata yang mengandung bunyi か.",
        options: ["sushi", "kasa", "inu"],
        correctIndex: 1,
        explanation: "かsa dimulai dengan huruf か.",
      },
    ],
  },
  {
    id: "katakana-ne",
    title: "Neon ネ",
    script: "katakana",
    level: "casual",
    durationMinutes: 4,
    xpReward: 100,
    prerequisites: ["hiragana-a", "hiragana-ka"],
    steps: [
      {
        id: "intro",
        type: "intro",
        title: "Katakana mode",
        description:
          "ネ dipake buat kata serapan kayak ネオン (neon). Dengerin cara bacanya.",
        audio: SILENCE_AUDIO,
      },
      {
        id: "practice",
        type: "practice",
        prompt: "Ikuti tracing garis lurus tajam ala katakana buat ネ.",
        romaji: "ne",
        hint: "Stroke pertama diagonal turun, kedua horizontal, ketiga tarik vertikal panjang.",
        example: "ネコ (neko) artinya kucing dengan gaya katakana.",
      },
      {
        id: "quiz",
        type: "quiz",
        question: "Mana yang biasanya ditulis dengan katakana?",
        options: ["さむい", "ネオン", "たべる"],
        correctIndex: 1,
        explanation: "Kata serapan seperti neon biasanya pakai katakana.",
      },
    ],
  },
  {
    id: "kanji-sun",
    title: "Kanji spotlight 日",
    script: "kanji",
    level: "challenge",
    durationMinutes: 5,
    xpReward: 120,
    prerequisites: ["hiragana-a", "hiragana-ka", "katakana-ne"],
    steps: [
      {
        id: "intro",
        type: "intro",
        title: "Makna & On-yomi",
        description:
          "Kanji 日 berarti matahari atau hari. On-yomi nya にち/nichi sedangkan kun-yomi nya ひ/hi.",
        audio: SILENCE_AUDIO,
      },
      {
        id: "practice",
        type: "practice",
        prompt: "Tulis 日 dengan empat stroke rapi.",
        romaji: "hi",
        hint: "Stroke: horizontal atas, vertikal, horizontal bawah, garis penutup tengah.",
        example: "日本 (nihon) = Jepang",
      },
      {
        id: "quiz",
        type: "quiz",
        question: "Apa arti kata 日本?",
        options: ["Matahari terbit", "Bahasa Jepang", "Gunung Fuji"],
        correctIndex: 0,
        explanation: "日本 secara harfiah negeri matahari terbit.",
      },
    ],
  },
];
