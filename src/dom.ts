import { scrollChapters, storyContent, type ChapterId } from "./story";
import type { AppDom, RevealBlock } from "./types";

// ─── Helper ───────────────────────────────────────────────────────────────────

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

// ─── Content Creators ─────────────────────────────────────────────────────────

function createIntroContent(): HTMLDivElement {
  const inner = createElement("div", "story-block__inner story-block__inner--intro");
  const title = createElement("h1", "story-intro__title");
  title.innerHTML = "J'ai quelque chose<br/>de vrai à te dire";
  inner.append(title);
  return inner;
}

function createParagraphContent(copy: string): HTMLDivElement {
  const inner = createElement("div", "story-block__inner");
  inner.append(createElement("p", "story-paragraph", copy));
  return inner;
}

function createFinalContent(): HTMLDivElement {
  const inner = createElement("div", "story-block__inner story-block__inner--final");

  const spacer = createElement("div", "story-final__spacer");
  spacer.setAttribute("aria-hidden", "true");

  const question = createElement("h2", "story-final__question", storyContent.finalQuestion);
  const note = createElement(
    "p",
    "story-final__note",
    "Peut-être juste un jour à la fois. Mais pour de vrai."
  );

  const actions = createElement("div", "story-final__actions");
  const yesBtn = createElement("button", "button button--primary", storyContent.yesLabel);
  yesBtn.type = "button";
  yesBtn.dataset.role = "yes";

  const replayBtn = createElement("button", "button button--secondary", storyContent.replayLabel);
  replayBtn.type = "button";
  replayBtn.dataset.role = "replay";

  actions.append(yesBtn, replayBtn);
  inner.append(spacer, question, note, actions);
  return inner;
}

function createAnswerContent(): HTMLDivElement {
  const inner = createElement("div", "story-block__inner story-block__inner--answer");
  inner.append(
    createElement("p", "story-answer__label", "Et maintenant"),
    createElement("p", "story-answer__line", storyContent.finalAnswer)
  );
  return inner;
}

// visible = true for all except answer (which appears after user clicks Oui)
export function createRevealBlock(
  id: ChapterId,
  inner: HTMLDivElement,
  visible = true
): RevealBlock {
  const wrapper = createElement("div", "story-block");
  wrapper.dataset.blockId = id;
  wrapper.dataset.open = String(visible);
  wrapper.setAttribute("aria-hidden", String(!visible));
  wrapper.append(inner);
  return { id, wrapper, inner };
}

// ─── Sub-builders ─────────────────────────────────────────────────────────────

function buildTopBar(): HTMLElement {
  const bar = createElement("header", "top-bar");
  bar.append(
    createElement("button", "top-bar__close", "×"),
    createElement("h1", "top-bar__title", "Une Confession")
  );
  return bar;
}

function buildScrollHint(): HTMLElement {
  const hint = createElement("div", "scroll-hint");
  hint.append(
    createElement("span", "scroll-hint__text", "DÉFILEZ"),
    createElement("span", "scroll-hint__icon", "v")
  );
  return hint;
}

function buildAmbient(): { ambient: HTMLElement; orbs: HTMLSpanElement[] } {
  const ambient = createElement("div", "ambient");
  ambient.setAttribute("aria-hidden", "true");
  const orbs = [
    createElement("span", "ambient__orb ambient__orb--primary"),
    createElement("span", "ambient__orb ambient__orb--secondary"),
    createElement("span", "ambient__orb ambient__orb--accent"),
  ];
  ambient.append(...orbs);
  return { ambient, orbs };
}

function buildProgress(): { progress: HTMLElement; progressItems: HTMLLIElement[] } {
  const progress = createElement("aside", "progress");
  progress.setAttribute("aria-hidden", "true");
  const list = createElement("ol", "progress__list");

  const progressItems = scrollChapters.map((chapter) => {
    const item = createElement("li", "progress__item");
    item.dataset.chapter = chapter.id;
    item.append(
      createElement("span", "progress__dot"),
      createElement("span", "progress__text", chapter.step)
    );
    return item;
  });

  list.append(...progressItems);
  progress.append(list);
  return { progress, progressItems };
}

function buildContentStack(): {
  stageCard: HTMLElement;
  blocks: Map<ChapterId, RevealBlock>;
  yesButton: HTMLButtonElement;
  replayButton: HTMLButtonElement;
} {
  const stageCard = createElement("article", "stage-card");
  stageCard.setAttribute("aria-label", "Déclaration romantique");

  // All story blocks visible by default except "answer"
  const introBlock  = createRevealBlock("intro", createIntroContent());
  const p1Block     = createRevealBlock("p1", createParagraphContent(storyContent.paragraphs[0]));
  const p2Block     = createRevealBlock("p2", createParagraphContent(storyContent.paragraphs[1]));
  const p3Block     = createRevealBlock("p3", createParagraphContent(storyContent.paragraphs[2]));
  const finalBlock  = createRevealBlock("final", createFinalContent());
  const answerBlock = createRevealBlock("answer", createAnswerContent(), false);

  stageCard.append(
    introBlock.wrapper,
    p1Block.wrapper,
    p2Block.wrapper,
    p3Block.wrapper,
    finalBlock.wrapper,
    answerBlock.wrapper
  );

  const yesButton = finalBlock.inner.querySelector<HTMLButtonElement>("[data-role='yes']");
  const replayButton = finalBlock.inner.querySelector<HTMLButtonElement>("[data-role='replay']");
  if (!yesButton || !replayButton) throw new Error("Missing CTA buttons in final chapter.");

  const blocks = new Map<ChapterId, RevealBlock>([
    ["intro",  introBlock],
    ["p1",     p1Block],
    ["p2",     p2Block],
    ["p3",     p3Block],
    ["final",  finalBlock],
    ["answer", answerBlock],
  ]);

  return { stageCard, blocks, yesButton, replayButton };
}

// ─── App Compositor ───────────────────────────────────────────────────────────

export function buildApp(): AppDom {
  const page = createElement("main", "page");
  page.dataset.chapter = "intro";
  page.dataset.answerOpen = "false";

  const topBar     = buildTopBar();
  const scrollHint = buildScrollHint();
  const { ambient, orbs } = buildAmbient();
  const { progress, progressItems } = buildProgress();

  const { stageCard, blocks, yesButton, replayButton } = buildContentStack();

  page.append(topBar, scrollHint, ambient, progress, stageCard);

  return {
    page,
    stageCard,
    scrollHint,
    progressItems,
    blocks,
    orbs,
    yesButton,
    replayButton,
  };
}
