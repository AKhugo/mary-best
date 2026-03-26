import type { ChapterId } from "./story";

// ─── Animation ────────────────────────────────────────────────────────────────

export type MotionHandle = {
  stop: () => void;
  finished: Promise<unknown>;
};

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  activeChapter: ChapterId;
  finalQuestionVisible: boolean;
  answerOpen: boolean;
  reducedMotion: boolean;
}

// ─── DOM Building ─────────────────────────────────────────────────────────────

export interface RevealBlock {
  id: ChapterId;
  wrapper: HTMLDivElement;
  inner: HTMLDivElement;
}

// ─── ISP: focused DOM sub-interfaces ─────────────────────────────────────────

export interface PageDom {
  page: HTMLElement;
  stageCard: HTMLElement;
}

export interface ScrollHintDom {
  scrollHint: HTMLElement;
}

export interface KickerDom {
  kickerLabel: HTMLSpanElement;
  kickerStep: HTMLSpanElement;
}

export interface ProgressDom {
  progressItems: HTMLLIElement[];
}

export interface BlocksDom {
  blocks: Map<ChapterId, RevealBlock>;
}

export interface OrbsDom {
  orbs: HTMLSpanElement[];
}

export interface ButtonsDom {
  yesButton: HTMLButtonElement;
  replayButton: HTMLButtonElement;
}

// Full composed interface for app initialization
export interface AppDom
  extends PageDom,
    ScrollHintDom,
    ProgressDom,
    BlocksDom,
    OrbsDom,
    ButtonsDom {}
