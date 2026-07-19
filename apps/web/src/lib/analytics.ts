import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "tool_viewed"
  | "tool_used"
  | "result_copied"
  | "result_downloaded"
  | "example_clicked"
  | "related_tool_clicked"
  | "tool_search_used";

/** Privacy-safe analytics boundary. Input values must never be passed here. */
export function trackEvent(
  event: AnalyticsEvent,
  properties: { tool: string; action?: string },
): void {
  if (typeof window === "undefined") return;
  track(event, properties);
}
