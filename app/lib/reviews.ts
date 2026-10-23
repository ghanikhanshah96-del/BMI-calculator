export type UserReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  tool?: string;
};

const PROMPT_KEY = "fcp-review-prompt-v1";
function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
type PromptState = {
  dismissedUntil?: number;
  lastSubmittedAt?: number;
};

function loadPromptState(): PromptState {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(PROMPT_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? (parsed as PromptState) : {};
  } catch {
    return {};
  }
}

function savePromptState(state: PromptState) {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(PROMPT_KEY, JSON.stringify(state));
  } catch {
    /* Optional preference storage. */
  }
}

/** True when we may politely ask for a review after a download. */
export function shouldAskForReview(): boolean {
  const state = loadPromptState();
  const now = Date.now();
  if (state.dismissedUntil && state.dismissedUntil > now) return false;
  if (
    state.lastSubmittedAt &&
    now - state.lastSubmittedAt < 1000 * 60 * 60 * 24 * 30
  ) {
    return false;
  }
  return true;
}

export function dismissReviewPrompt(days = 14) {
  const state = loadPromptState();
  state.dismissedUntil = Date.now() + days * 24 * 60 * 60 * 1000;
  savePromptState(state);
}

export function markReviewSubmitted() {
  const state = loadPromptState();
  state.lastSubmittedAt = Date.now();
  state.dismissedUntil = Date.now() + 90 * 24 * 60 * 60 * 1000;
  savePromptState(state);
}
