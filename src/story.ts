export type ChapterId = "intro" | "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "final" | "answer" | "refusal";
export type ScrollChapterId = Exclude<ChapterId, "answer" | "refusal">;

export interface ChapterMeta {
  id: ScrollChapterId;
  label: string;
  step: string;
  ghost: string;
}

export interface StoryContent {
  intro: string;
  paragraphs: readonly [string, string, string, string, string, string];
  finalQuestion: string;
  replayLabel: string;
  yesLabel: string;
  noLabel: string;
  finalAnswer: string;
  refusalLabel: string;
  refusalAnswer: string;
  notificationPhone: string;
  whatsappYesMessage: string;
  whatsappNoMessage: string;
  whatsappButtonLabel: string;
}

export const storyContent: StoryContent = {
  intro: "J'ai quelque chose de vrai à te dire",
  paragraphs: [
    "Tu sais, même sans parler, on se comprend. Et c'est bizarre parce que je suis pas le mec qui parle beaucoup, mais avec toi c'est différent. C'est facile.",
    "Tu dis que je suis ta safe place. Eh ben tu es mon truc, tu sais ? Pas juste ton corps qui m'énerve (bon, ça aussi hein), mais toi. Ton énergie, ta façon de penser, comment tu ris quand je fais mes blagues débiles. Comment tu me taquines et tu essaies de rester sérieuse mais tu cragues toujours.",
    "J'aime ce qu'on a. Cette légèreté. Ces moments où on parle de rien et ça me remplit. Comme ce jour au bus pour Port-Bouët — juste nous deux, pas besoin de grand-chose. C'est ça qui compte.",
    "Je sais que tu aimes te projeter et moi aussi en vrai, mais ce qui est cool c'est qu'on peut juste... être. Maintenant. Pas toujours penser à demain. Et je crois que c'est ça qui manquait avant.",
    "Mais voilà, je vais te dire la vérité : dans ma tête, je vois toi et moi. Longtemps. Pas juste maintenant. Je veux que tu sois ma partenaire pour tout ça. Pour les blagues pourries, pour les trucs sérieux, pour les nuits coquines, pour les silences aussi.",
    "Je t'aime, chékrèb"
  ],
  finalQuestion: "Et c'est pour ça que je te le demande avec tout mon cœur : puis-je être ton petit ami ?",
  replayLabel: "Relire le message",
  yesLabel: "Oui",
  noLabel: "Non",
  finalAnswer: "Alors, vivons-le. Doucement, sincèrement, un jour à la fois.",
  refusalLabel: "C'est compris.",
  refusalAnswer: "Je respecte ta décision. Je prie que tu trouves quelqu'un qui reconnaitra ta valeur.",
  notificationPhone: "2250777597197",
  whatsappYesMessage: "J'ai dit Oui ❤️, je t'aime mon rouuuaaaa",
  whatsappNoMessage: "J'ai dit Non, désolé.",
  whatsappButtonLabel: "Envoyer ma réponse sur WhatsApp",
};

export const scrollChapters: readonly ChapterMeta[] = [
  { id: "intro", label: "Ouverture",   step: "01", ghost: "J'ai quelque chose de vrai à te dire" },
  { id: "p1",    label: "Fragment 01", step: "02", ghost: "C'est facile, avec toi" },
  { id: "p2",    label: "Fragment 02", step: "03", ghost: "Tu es mon truc" },
  { id: "p3",    label: "Fragment 03", step: "04", ghost: "Ce jour au bus pour Port-Bouët" },
  { id: "p4",    label: "Fragment 04", step: "05", ghost: "On peut juste... être" },
  { id: "p5",    label: "Fragment 05", step: "06", ghost: "Je te vois longtemps" },
  { id: "p6",    label: "Fragment 06", step: "07", ghost: "Je t'aime, Ochékrébo" },
  { id: "final", label: "Maintenant",  step: "08", ghost: "La question qui reste" }
] as const;

export const visibleBlockIds: Record<ChapterId, readonly ChapterId[]> = {
  intro:  ["intro"],
  p1:     ["p1"],
  p2:     ["p1", "p2"],
  p3:     ["p1", "p2", "p3"],
  p4:     ["p1", "p2", "p3", "p4"],
  p5:     ["p1", "p2", "p3", "p4", "p5"],
  p6:     ["p1", "p2", "p3", "p4", "p5", "p6"],
  final:  ["p1", "p2", "p3", "p4", "p5", "p6", "final"],
  answer: ["answer"],
  refusal: ["refusal"]
};

export const paragraphIds = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;

// OCP fix: animation delays as data — no hardcoded if/else needed in orchestration
export const blockAnimationDelays: Partial<Record<ChapterId, number>> = {
  final: 0.14,
  answer: 0.2,
  refusal: 0.2,
};
