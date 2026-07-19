export type AnalyticsEvent =
  | "tool_viewed"
  | "tool_used"
  | "result_copied"
  | "example_clicked"
  | "related_tool_clicked";

/** Privacy-safe analytics boundary. Input values must never be passed here. */
export function trackEvent(
  event: AnalyticsEvent,
  properties: { tool: string },
): void {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_ID || typeof window === "undefined")
    return;
  window.dispatchEvent(
    new CustomEvent("viettools:analytics", {
      detail: { event, ...properties },
    }),
  );
}
