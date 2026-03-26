export type ChapterId = "intro" | "p1" | "p2" | "p3" | "final" | "answer";
export type ScrollChapterId = Exclude<ChapterId, "answer">;

export interface ChapterMeta {
  id: ScrollChapterId;
  label: string;
  step: string;
  ghost: string;
}

export interface StoryContent {
  intro: string;
  paragraphs: readonly [string, string, string];
  finalQuestion: string;
  replayLabel: string;
  yesLabel: string;
  finalAnswer: string;
}

export const storyContent: StoryContent = {
  intro: "J’ai quelque chose de vrai à te dire",
  paragraphs: [
    "Il y a des sentiments qu'on ne peut pas vraiment faire taire, même quand on essaie. Et ce que je ressens pour toi, ça n'a pas disparu.",
    "Je sais que c'est compliqué. Je sais aussi qu'on ne peut pas prédire l'avenir. Mais ce dont je suis sûr, c'est de ce que j'ai quand je pense à toi, quand je te parle, quand je t'imagine dans ma vie maintenant.",
    "Je ne veux pas que la peur de demain nous prive de quelque chose de vrai aujourd'hui. J'ai juste envie qu'on vive ce qu'on ressent avec sincérité."
  ],
  finalQuestion: "Alors... tu acceptes d’être ma petite amie ?",
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
    ghost: "Ce qui ne disparaît pas"
  },
  {
    id: "p2",
    label: "Fragment 02",
    step: "03",
    ghost: "Ce que je sais maintenant"
  },
  {
    id: "p3",
    label: "Fragment 03",
    step: "04",
    ghost: "Ne pas laisser demain voler aujourd’hui"
  },
  {
    id: "final",
    label: "Maintenant",
    step: "05",
    ghost: "La question qui reste"
  }
] as const;

export const visibleBlockIds: Record<ChapterId, readonly ChapterId[]> = {
  intro: ["intro"],
  p1: ["p1"],
  p2: ["p1", "p2"],
  p3: ["p1", "p2", "p3"],
  final: ["p1", "p2", "p3", "final"],
  answer: ["answer"]
};

export const paragraphIds = ["p1", "p2", "p3"] as const;

// OCP fix: animation delays as data — no hardcoded if/else needed in orchestration
export const blockAnimationDelays: Partial<Record<ChapterId, number>> = {
  final: 0.14,
  answer: 0.2,
};
