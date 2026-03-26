import Lenis from "lenis";
import { MotionAnimator } from "./animator";
import { buildApp } from "./dom";
import {
  ChapterManager,
  PageAttributeObserver,
  ProgressObserver,
  ParagraphStatusObserver,
  AnswerRevealObserver,
} from "./chapter";
import type { ChapterId } from "./story";
import type { MotionHandle } from "./types";
import "./styles/main.scss";

// ─── Bootstrap ────────────────────────────────────────────────────────────────

const appRoot = document.querySelector<HTMLDivElement>("#app");
if (!appRoot) throw new Error("Missing #app root element.");

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = reducedMotionQuery.matches;

const animator = new MotionAnimator();
const dom = buildApp();
appRoot.replaceChildren(dom.page);

// ─── Lenis (RAF loop uniquement — smooth scroll désactivé en mode fullpage) ───

const lenis = new Lenis({ smoothWheel: false });

let rafId: number;
function raf(time: number): void {
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}
rafId = requestAnimationFrame(raf);

// ─── Chapter Manager ──────────────────────────────────────────────────────────

const chapterManager = new ChapterManager()
  .register(new PageAttributeObserver({ page: dom.page, stageCard: dom.stageCard }))
  .register(new ProgressObserver({ progressItems: dom.progressItems }))
  .register(new ParagraphStatusObserver({ blocks: dom.blocks }))
  .register(new AnswerRevealObserver({ blocks: dom.blocks }));

// ─── Orb Animations ───────────────────────────────────────────────────────────

function startOrbAnimations(): MotionHandle[] {
  if (reducedMotion) {
    dom.orbs.forEach((orb) => { orb.style.transform = ""; });
    return [];
  }
  return [
    animator.animateEl(dom.orbs[0], { x: [0, 28, -16, 0], y: [0, 18, -12, 0] },  { duration: 18, repeat: Infinity, ease: "easeInOut" }),
    animator.animateEl(dom.orbs[1], { x: [0, -34, 20, 0], y: [0, 22, -14, 0] }, { duration: 22, repeat: Infinity, ease: "easeInOut" }),
    animator.animateEl(dom.orbs[2], { x: [0, 16, -12, 0], y: [0, -24, 16, 0] }, { duration: 20, repeat: Infinity, ease: "easeInOut" }),
  ];
}

let orbAnimations = startOrbAnimations();

// ─── Fullpage Navigator ────────────────────────────────────────────────────────

const CHAPTER_ORDER: ChapterId[] = ["intro", "p1", "p2", "p3", "final"];
let currentIndex = 0;
let isAnimating = false;
let answerOpen = false;

function initPositions(): void {
  CHAPTER_ORDER.forEach((id, i) => {
    const block = dom.blocks.get(id);
    if (!block) return;
    block.wrapper.style.transform = i === 0 ? "translateY(0%)" : "translateY(100%)";
  });
  const answer = dom.blocks.get("answer");
  if (answer) answer.wrapper.style.transform = "translateY(100%)";
}

function navigateTo(nextIndex: number): void {
  if (isAnimating || nextIndex === currentIndex) return;
  if (nextIndex < 0 || nextIndex >= CHAPTER_ORDER.length) return;

  isAnimating = true;
  const direction = nextIndex > currentIndex ? 1 : -1;
  const currentId = CHAPTER_ORDER[currentIndex];
  const nextId    = CHAPTER_ORDER[nextIndex];
  const currentBlock = dom.blocks.get(currentId)!;
  const nextBlock    = dom.blocks.get(nextId)!;
  const dur = reducedMotion ? 0.01 : 0.72;

  // Cacher le scroll hint dès la première navigation
  if (currentIndex === 0 && direction > 0) {
    dom.scrollHint.style.opacity = "0";
  }

  // Sortie section courante
  animator.animateEl(
    currentBlock.wrapper,
    { y: `${-direction * 100}%` },
    { duration: dur, ease: "easeInOut" }
  );

  // Positionner la prochaine section de l'autre côté avant l'animation
  nextBlock.wrapper.style.transform = `translateY(${direction * 100}%)`;

  // Entrée section suivante
  animator.animateEl(
    nextBlock.wrapper,
    { y: "0%" },
    { duration: dur, ease: "easeInOut" }
  ).finished.catch(() => undefined).then(() => {
    currentIndex = nextIndex;
    nextBlock.wrapper.classList.add("is-visible");
    chapterManager.apply(nextId);
    // Délai supplémentaire pour absorber l'élan du trackpad (évite de sauter des sections)
    setTimeout(() => { isAnimating = false; }, reducedMotion ? 0 : 350);
  });
}

// ─── Scroll / Touch / Keyboard ────────────────────────────────────────────────

window.addEventListener("wheel", (e) => {
  if (answerOpen) return;
  if (e.deltaY > 0) navigateTo(currentIndex + 1);
  else              navigateTo(currentIndex - 1);
}, { passive: true });

let touchStartY = 0;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener("touchend", (e) => {
  if (answerOpen) return;
  const delta = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(delta) > 40) delta > 0 ? navigateTo(currentIndex + 1) : navigateTo(currentIndex - 1);
}, { passive: true });

window.addEventListener("keydown", (e) => {
  if (answerOpen) return;
  if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); navigateTo(currentIndex + 1); }
  if (e.key === "ArrowUp")                    { e.preventDefault(); navigateTo(currentIndex - 1); }
});

// ─── Event Handlers ───────────────────────────────────────────────────────────

dom.yesButton.addEventListener("click", () => {
  if (answerOpen) return;
  answerOpen = true;
  CHAPTER_ORDER.push("answer");
  dom.page.dataset.answerOpen = "true";
  dom.yesButton.disabled = true;
  dom.replayButton.disabled = true;

  animator.animateEl(
    dom.stageCard,
    { scale: [1, 0.985, 1], y: [0, -6, 0] },
    { duration: reducedMotion ? 0.01 : 0.95, ease: "easeOut" }
  );

  setTimeout(() => {
    navigateTo(CHAPTER_ORDER.length - 1);
  }, reducedMotion ? 0 : 250);
});

dom.replayButton.addEventListener("click", () => {
  if (answerOpen) return;
  navigateTo(0);
});

reducedMotionQuery.addEventListener("change", (e) => {
  reducedMotion = e.matches;
  orbAnimations.forEach((a) => a.stop());
  orbAnimations = startOrbAnimations();
});

// ─── Init ─────────────────────────────────────────────────────────────────────

initPositions();
dom.blocks.get("intro")!.wrapper.classList.add("is-visible");
chapterManager.apply("intro", true);

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(rafId);
  lenis.destroy();
  orbAnimations.forEach((a) => a.stop());
});
