export type ChapterId = "intro" | "p1" | "p2" | "p3" | "p4" | "final" | "answer";
export type ScrollChapterId = Exclude<ChapterId, "answer">;

export interface ChapterMeta {
  id: ScrollChapterId;
  label: string;
  step: string;
  ghost: string;
}

export interface StoryContent {
  intro: string;
  paragraphs: readonly [string, string, string, string];
  finalQuestion: string;
  replayLabel: string;
  yesLabel: string;
  finalAnswer: string;
}

export const storyContent: StoryContent = {
  intro: "J’ai quelque chose de vrai à te dire",
  paragraphs: [
    "Je voulais revenir sur notre dernière discussion, parce qu’avec du recul je me rends compte que je ne me suis pas bien exprimé, et que j’ai pu te blesser. Je suis vraiment désolé pour ça.",
    "La vérité, c’est que tu comptes beaucoup pour moi. Et plus j’y réfléchis, plus je me dis que ça serait dommage de laisser la peur du futur nous empêcher de vivre quelque chose de beau maintenant.",
    "Je ne prétends pas avoir toutes les réponses sur demain. Mais ce que je sais, c’est que ce que je ressens pour toi est sincère, et que je n’ai pas envie de faire comme si ce n’était pas important.",
    "J’ai envie qu’on puisse vivre ça simplement, honnêtement, sans laisser les doutes décider à notre place."
  ],
  finalQuestion: "Alors je te le demande avec sincérité : est-ce que tu veux être ma petite amie ?",
  replayLabel: "Relire le message",
  yesLabel: "Oui",
  finalAnswer: "Alors, vivons-le. Doucement, sincèrement, un jour à la fois."
};

export const scrollChapters: readonly ChapterMeta[] = [
  {
    id: "intro",
    label: "Ouverture",
    step: "01",
    ghost: "J’ai quelque chose de vrai à te dire"
  },
  {
    id: "p1",
    label: "Fragment 01",
    step: "02",
    ghost: "Je suis vraiment désolé pour ça"
  },
  {
    id: "p2",
    label: "Fragment 02",
    step: "03",
    ghost: "Tu comptes beaucoup pour moi"
  },
  {
    id: "p3",
    label: "Fragment 03",
    step: "04",
    ghost: "Sans laisser les doutes décider"
  },
  {
    id: "p4",
    label: "Fragment 04",
    step: "05",
    ghost: "Simplement, honnêtement"
  },
  {
    id: "final",
    label: "Maintenant",
    step: "06",
    ghost: "La question qui reste"
  }
] as const;

export const visibleBlockIds: Record<ChapterId, readonly ChapterId[]> = {
  intro: ["intro"],
  p1: ["p1"],
  p2: ["p1", "p2"],
  p3: ["p1", "p2", "p3"],
  p4: ["p1", "p2", "p3", "p4"],
  final: ["p1", "p2", "p3", "p4", "final"],
  answer: ["answer"]
};

export const paragraphIds = ["p1", "p2", "p3", "p4"] as const;

// OCP fix: animation delays as data — no hardcoded if/else needed in orchestration
export const blockAnimationDelays: Partial<Record<ChapterId, number>> = {
  final: 0.14,
  answer: 0.2,
};
