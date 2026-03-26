import { animate, scroll } from "motion";
import type { MotionHandle } from "./types";

// ─── Interface (DIP: depend on abstraction, not motion directly) ──────────────

export interface AnimateOptions {
  duration: number;
  delay?: number;
  ease?: string;
  repeat?: number;
}

export interface IAnimator {
  animateEl(
    target: HTMLElement,
    keyframes: Record<string, unknown>,
    options: AnimateOptions
  ): MotionHandle;

  scrollObserve(
    target: Element,
    callback: (progress: number) => void,
    options: { offset: [string, string] }
  ): () => void;
}

// ─── Concrete Implementation ──────────────────────────────────────────────────

export class MotionAnimator implements IAnimator {
  animateEl(
    target: HTMLElement,
    keyframes: Record<string, unknown>,
    options: AnimateOptions
  ): MotionHandle {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return animate(target, keyframes as any, options as any) as unknown as MotionHandle;
  }

  scrollObserve(
    target: Element,
    callback: (progress: number) => void,
    options: { offset: [string, string] }
  ): () => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return scroll(callback, { target, offset: options.offset as any }) as () => void;
  }
}
