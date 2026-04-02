export type ChapterId = "intro" | "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "final" | "answer";
export type ScrollChapterId = Exclude<ChapterId, "answer">;

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
  finalAnswer: string;
}

export const storyContent: StoryContent = {
  intro: "J'ai quelque chose de vrai à te dire",
  paragraphs: [
    "Je veux d'abord m'excuser pour notre dernière discussion. Je n'ai pas su bien expliquer ce que je ressentais vraiment et j'ai laissé des questions compliquées gâcher quelque chose de simple. Je sais que ça t'a blessée et je suis vraiment désolé.",
    "J'ai beaucoup réfléchi depuis. Et j'ai réalisé que j'étais en train de faire quelque chose de stupide — je me projetais trop loin, je pensais à demain, après-demain, dans dix ans. Je construisais des murs pour des problèmes qui n'existent que dans ma tête. Au lieu de simplement vivre ce qu'il y a maintenant avec toi.",
    "Oui, on ne croit pas pareil. C'est vrai. Et oui, c'est un truc compliqué, je ne dis pas le contraire. Mais pourquoi faut qu'on en fasse une raison d'abandonner maintenant ? Pourquoi faut qu'on laisse ces questions nous détruire ce qu'on a en ce moment, ce qui est réel et beau ?",
    "Je ne parle pas d'ignorer nos différences à jamais. Mais on peut les mettre de côté pour l'instant. On peut juste... être ensemble. Vivre ce moment sans se demander si c'est « compatible » ou si ça va marcher dans dix ans. Peut-être que ça va marcher, peut-être que non. Mais on ne le saura jamais si on ne l'essaie pas vraiment.",
    "Ce que je sais, c'est ce que je ressens quand je suis avec toi, quand on se parle, quand je pense à toi. C'est réel. C'est fort. Et je ne veux pas laisser passer ça en restant paralysé par des doutes.",
    "Je veux juste vivre ce qu'on ressent. Toi et moi. Maintenant. Avec sincérité. Sans me soucier de demain, sans me soucier de ce qui pourrait mal tourner. Juste... nous."
  ],
  finalQuestion: "Et c'est pour ça que je te le demande avec tout mon cœur : est-ce que tu veux être ma petite amie ?",
  replayLabel: "Relire le message",
  yesLabel: "Oui",
  finalAnswer: "Alors, vivons-le. Doucement, sincèrement, un jour à la fois."
};

export const scrollChapters: readonly ChapterMeta[] = [
  { id: "intro", label: "Ouverture",   step: "01", ghost: "J'ai quelque chose de vrai à te dire" },
  { id: "p1",    label: "Fragment 01", step: "02", ghost: "Je suis vraiment désolé" },
  { id: "p2",    label: "Fragment 02", step: "03", ghost: "Je construisais des murs qui n'existent pas" },
  { id: "p3",    label: "Fragment 03", step: "04", ghost: "Ce qu'on a est réel et beau" },
  { id: "p4",    label: "Fragment 04", step: "05", ghost: "Juste être ensemble" },
  { id: "p5",    label: "Fragment 05", step: "06", ghost: "C'est réel. C'est fort." },
  { id: "p6",    label: "Fragment 06", step: "07", ghost: "Juste... nous" },
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
  answer: ["answer"]
};

export const paragraphIds = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;

// OCP fix: animation delays as data — no hardcoded if/else needed in orchestration
export const blockAnimationDelays: Partial<Record<ChapterId, number>> = {
  final: 0.14,
  answer: 0.2,
};
