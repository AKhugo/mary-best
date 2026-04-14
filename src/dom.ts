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

export function splitAndWrapText(el: HTMLElement): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }
  for (const node of textNodes) {
    if (!node.nodeValue) continue;
    const fragment = document.createDocumentFragment();
    // Split keeping whitespaces
    const words = node.nodeValue.split(/(\s+)/);
    for (const word of words) {
      if (!word) continue;
      if (word.trim() === '') {
        fragment.appendChild(document.createTextNode(word));
      } else {
        const span = document.createElement('span');
        span.className = 'word';
        span.style.display = 'inline-block';
        span.textContent = word;
        fragment.appendChild(span);
      }
    }
    node.parentNode?.replaceChild(fragment, node);
  }
}

// ─── Content Creators ─────────────────────────────────────────────────────────

function createIntroContent(): HTMLDivElement {
  const inner = createElement("div", "story-block__inner story-block__inner--intro");
  const title = createElement("h1", "story-intro__title");
  title.innerHTML = "J'ai quelque chose<br/>de vrai à te dire";
  splitAndWrapText(title);
  inner.append(title);
  return inner;
}

function createParagraphContent(copy: string): HTMLDivElement {
  const inner = createElement("div", "story-block__inner");
  const paragraph = createElement("p", "story-paragraph", copy);
  splitAndWrapText(paragraph);
  inner.append(paragraph);
  return inner;
}

function createFinalContent(): HTMLDivElement {
  const inner = createElement("div", "story-block__inner story-block__inner--final");

  const spacer = createElement("div", "story-final__spacer");
  spacer.setAttribute("aria-hidden", "true");

  const question = createElement("h2", "story-final__question", storyContent.finalQuestion);
  splitAndWrapText(question);
  const note = createElement(
    "p",
    "story-final__note",
    "Peut-être juste un jour à la fois. Mais pour de vrai."
  );
  splitAndWrapText(note);

  const actions = createElement("div", "story-final__actions");
  const yesBtn = createElement("button", "button button--primary", storyContent.yesLabel);
  yesBtn.type = "button";
  yesBtn.dataset.role = "yes";

  const noBtn = createElement("button", "button button--secondary", storyContent.noLabel);
  noBtn.type = "button";
  noBtn.dataset.role = "no";

  const replayBtn = createElement("button", "button button--secondary", storyContent.replayLabel);
  replayBtn.type = "button";
  replayBtn.dataset.role = "replay";

  actions.append(yesBtn, noBtn, replayBtn);
  inner.append(spacer, question, note, actions);
  return inner;
}

function createAnswerContent(): HTMLDivElement {
  const inner = createElement("div", "story-block__inner story-block__inner--answer");
  const label = createElement("p", "story-answer__label", "Et maintenant");
  const line = createElement("p", "story-answer__line", storyContent.finalAnswer);
  splitAndWrapText(label);
  splitAndWrapText(line);
  const waBtn = createElement("button", "button button--whatsapp", storyContent.whatsappButtonLabel);
  waBtn.type = "button";
  waBtn.dataset.role = "whatsapp-yes";
  inner.append(label, line, waBtn);
  return inner;
}

function createRefusalContent(): HTMLDivElement {
  const inner = createElement("div", "story-block__inner story-block__inner--refusal");
  const label = createElement("p", "story-answer__label", storyContent.refusalLabel);
  const line = createElement("p", "story-answer__line", storyContent.refusalAnswer);
  splitAndWrapText(label);
  splitAndWrapText(line);
  const waBtn = createElement("button", "button button--whatsapp", storyContent.whatsappButtonLabel);
  waBtn.type = "button";
  waBtn.dataset.role = "whatsapp-no";
  inner.append(label, line, waBtn);
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
  noButton: HTMLButtonElement;
  replayButton: HTMLButtonElement;
  whatsappYesButton: HTMLButtonElement;
  whatsappNoButton: HTMLButtonElement;
} {
  const stageCard = createElement("article", "stage-card");
  stageCard.setAttribute("aria-label", "Déclaration romantique");

  // All story blocks visible by default except "answer"
  const introBlock  = createRevealBlock("intro", createIntroContent());
  const p1Block     = createRevealBlock("p1", createParagraphContent(storyContent.paragraphs[0]));
  const p2Block     = createRevealBlock("p2", createParagraphContent(storyContent.paragraphs[1]));
  const p3Block     = createRevealBlock("p3", createParagraphContent(storyContent.paragraphs[2]));
  const p4Block     = createRevealBlock("p4", createParagraphContent(storyContent.paragraphs[3]));
  const p5Block     = createRevealBlock("p5", createParagraphContent(storyContent.paragraphs[4]));
  const p6Block     = createRevealBlock("p6", createParagraphContent(storyContent.paragraphs[5]));
  const finalBlock  = createRevealBlock("final", createFinalContent());
  const answerBlock  = createRevealBlock("answer",  createAnswerContent(),  false);
  const refusalBlock = createRevealBlock("refusal", createRefusalContent(), false);

  stageCard.append(
    introBlock.wrapper,
    p1Block.wrapper,
    p2Block.wrapper,
    p3Block.wrapper,
    p4Block.wrapper,
    p5Block.wrapper,
    p6Block.wrapper,
    finalBlock.wrapper,
    answerBlock.wrapper,
    refusalBlock.wrapper
  );

  const yesButton        = finalBlock.inner.querySelector<HTMLButtonElement>("[data-role='yes']");
  const noButton         = finalBlock.inner.querySelector<HTMLButtonElement>("[data-role='no']");
  const replayButton     = finalBlock.inner.querySelector<HTMLButtonElement>("[data-role='replay']");
  const whatsappYesButton = answerBlock.inner.querySelector<HTMLButtonElement>("[data-role='whatsapp-yes']");
  const whatsappNoButton  = refusalBlock.inner.querySelector<HTMLButtonElement>("[data-role='whatsapp-no']");
  if (!yesButton || !noButton || !replayButton || !whatsappYesButton || !whatsappNoButton)
    throw new Error("Missing CTA buttons.");

  const blocks = new Map<ChapterId, RevealBlock>([
    ["intro",   introBlock],
    ["p1",      p1Block],
    ["p2",      p2Block],
    ["p3",      p3Block],
    ["p4",      p4Block],
    ["p5",      p5Block],
    ["p6",      p6Block],
    ["final",   finalBlock],
    ["answer",  answerBlock],
    ["refusal", refusalBlock],
  ]);

  return { stageCard, blocks, yesButton, noButton, replayButton, whatsappYesButton, whatsappNoButton };
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

  const { stageCard, blocks, yesButton, noButton, replayButton, whatsappYesButton, whatsappNoButton } = buildContentStack();

  page.append(topBar, scrollHint, ambient, progress, stageCard);

  return {
    page,
    stageCard,
    scrollHint,
    progressItems,
    blocks,
    orbs,
    yesButton,
    noButton,
    replayButton,
    whatsappYesButton,
    whatsappNoButton,
  };
}
