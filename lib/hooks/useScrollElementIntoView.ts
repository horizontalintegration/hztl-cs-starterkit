/**
 * @file useScrollElementIntoView.ts
 * @description Hook and helpers for scrolling an element into view with sticky header offset and animation support.
 */

import { useCallback, useEffect, useRef } from 'react';

interface ScrollElementIntoViewOptions {
  /** Disable scroll behavior (use when hook must be called unconditionally) */
  disableScroll?: boolean;
  /** ID of sticky header element for offset (element must have height in DOM) */
  stickyHeaderId?: string;
  /** When true, scrolls to element automatically (triggers on false→true) */
  condition?: boolean;
  /** Wait for this element's animations to finish before scrolling */
  animationElement?: HTMLElement | null;
  /** ID to set on the scroll anchor element */
  scrollTargetId?: string;
  /** Delay in ms before scrolling (prefer animationElement when possible) */
  delay?: number;
  /** Allow scroll on initial load when condition is already true */
  allowScrollOnLoad?: boolean;
}

/**
 * Scrolls an element into view with optional sticky header offset and animation wait.
 * Accepts element ref, HTMLElement, or ID string. Returns a function to trigger scroll manually.
 *
 * @example
 * const scrollToSection = useScrollElementIntoView(sectionRef, {
 *   condition: isExpanded,
 *   stickyHeaderId: 'header',
 * });
 */
export function useScrollElementIntoView<TElement extends HTMLElement>(
  element: TElement | string | null,
  options: ScrollElementIntoViewOptions = {
    disableScroll: false,
    stickyHeaderId: '',
    condition: false,
    animationElement: null,
    delay: 0,
    allowScrollOnLoad: false,
  }
) {
  const {
    disableScroll,
    stickyHeaderId,
    condition,
    scrollTargetId,
    animationElement,
    delay,
    allowScrollOnLoad,
  } = options;

  const scrollElementRef = useRef<HTMLDivElement | undefined>(undefined);

  // Create scroll anchor element and container (positioned before target)
  useEffect(() => {
    if (disableScroll) return;

    const domElement = typeof element === 'string' ? document.getElementById(element) : element;
    if (!domElement) return;

    const scrollElement = document.createElement('div');
    scrollElement.classList.add('absolute', 'left-0');
    if (scrollTargetId) scrollElement.id = scrollTargetId;
    scrollElementRef.current = scrollElement as HTMLDivElement;

    const container = document.createElement('div');
    container.classList.add('relative');
    container.appendChild(scrollElement);
    domElement.insertAdjacentElement('beforebegin', container);

    return () => container.remove();
  }, [element, disableScroll, scrollTargetId]);

  const scrollToElement = useCallback(() => {
    if (!disableScroll) {
      smoothScrollToElement(scrollElementRef.current, stickyHeaderId ?? '', animationElement, delay);
    }
  }, [animationElement, delay, disableScroll, stickyHeaderId]);

  // Only scroll when condition transitions from false to true (unless allowScrollOnLoad)
  const prevCondition = useRef(allowScrollOnLoad ? false : condition);
  useEffect(() => {
    if (disableScroll) return;
    if (condition && !prevCondition.current) {
      scrollToElement();
    }
    prevCondition.current = condition;
  }, [condition, disableScroll, scrollToElement]);

  return scrollToElement;
}

/** Smoothly scrolls element into view (block: start, behavior: smooth) */
const smoothScroll = (element: HTMLElement) => {
  element?.scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'smooth',
  });
};

/**
 * Scrolls to an element with sticky header offset and optional animation wait or delay.
 * Sets scroll element's top to negative header height so content appears below the header.
 */
export const smoothScrollToElement = (
  scrollElement: HTMLElement | undefined,
  stickyHeaderId?: string,
  animationElement?: HTMLElement | null,
  delay = 0,
  additionalHeight?: number,
  callback?: () => void
) => {
  if (!scrollElement) return;

  let height = 0;
  const header = stickyHeaderId && document.getElementById(stickyHeaderId);
  if (header) height = header.getBoundingClientRect().height || 0;
  if (additionalHeight) height += additionalHeight;

  scrollElement.style.top = `-${height}px`;

  if (animationElement) {
    Promise.all(animationElement.getAnimations().map((anim) => anim.finished)).then(() => {
      smoothScroll(scrollElement);
      callback?.();
    });
  } else {
    setTimeout(() => {
      smoothScroll(scrollElement);
      callback?.();
    }, delay);
  }
};
