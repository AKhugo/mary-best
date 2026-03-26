import { scrollChapters, paragraphIds, type ChapterId } from "./story";
import type { ProgressDom, BlocksDom, PageDom } from "./types";

// ─── Observer Interface ───────────────────────────────────────────────────────

export interface IChapterObserver {
  onChapterChange(next: ChapterId, instant: boolean): void;
}

// ─── Observer: Page data-attributes ──────────────────────────────────────────

export class PageAttributeObserver implements IChapterObserver {
  constructor(private readonly dom: PageDom) {}

  onChapterChange(next: ChapterId): void {
    this.dom.page.dataset.chapter = next;
    this.dom.stageCard.dataset.mode = next;
  }
}

// ─── Observer: Progress dots ──────────────────────────────────────────────────

export class ProgressObserver implements IChapterObserver {
  private readonly chapterOrder: ChapterId[];

  constructor(private readonly dom: ProgressDom) {
    this.chapterOrder = scrollChapters.map((c) => c.id);
  }

  onChapterChange(next: ChapterId): void {
    const completedIndex =
      next === "answer"
        ? this.chapterOrder.length - 1
        : this.chapterOrder.indexOf(next);

    this.dom.progressItems.forEach((item, index) => {
      if (index < completedIndex) {
        item.dataset.state = "past";
      } else if (index === completedIndex) {
        item.dataset.state = next === "answer" ? "past" : "current";
      } else {
        item.dataset.state = "future";
      }
    });
  }
}

// ─── Observer: Paragraph status (visual emphasis on current section) ──────────

export class ParagraphStatusObserver implements IChapterObserver {
  constructor(private readonly dom: BlocksDom) {}

  onChapterChange(next: ChapterId): void {
    const currentIndex =
      next === "answer"
        ? paragraphIds.length - 1
        : paragraphIds.indexOf(next as (typeof paragraphIds)[number]);

    paragraphIds.forEach((id, index) => {
      const block = this.dom.blocks.get(id);
      if (!block) return;

      let status = "future";
      if (next === "final" || next === "answer") {
        status = "past";
      } else if (currentIndex !== -1) {
        status = index < currentIndex ? "past" : index === currentIndex ? "current" : "future";
      }

      block.wrapper.dataset.status = status;
    });
  }
}

// ─── Observer: Answer block aria/data state ──────────────────────────────────
// La position (translateY) est gérée par le navigateur fullpage dans main.ts

export class AnswerRevealObserver implements IChapterObserver {
  constructor(private readonly dom: BlocksDom) {}

  onChapterChange(next: ChapterId): void {
    const block = this.dom.blocks.get("answer");
    if (!block) return;
    const shouldShow = next === "answer";
    block.wrapper.dataset.open = String(shouldShow);
    block.wrapper.setAttribute("aria-hidden", String(!shouldShow));
  }
}

// ─── Chapter Manager ──────────────────────────────────────────────────────────

export class ChapterManager {
  private readonly observers: IChapterObserver[] = [];
  private _activeChapter: ChapterId = "intro";

  register(observer: IChapterObserver): this {
    this.observers.push(observer);
    return this;
  }

  apply(next: ChapterId, instant = false): void {
    this._activeChapter = next;
    for (const obs of this.observers) {
      obs.onChapterChange(next, instant);
    }
  }

  get activeChapter(): ChapterId {
    return this._activeChapter;
  }
}
