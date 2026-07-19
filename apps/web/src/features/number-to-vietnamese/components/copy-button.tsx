"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type CopyStatus = "idle" | "copied" | "failed";

export function CopyButton({ value }: { value: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      trackEvent("result_copied", { tool: "number-to-vietnamese" });
    } catch {
      setStatus("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  };

  const label =
    status === "copied"
      ? "Đã sao chép"
      : status === "failed"
        ? "Không thể sao chép"
        : "Sao chép";
  return (
    <button
      className="button button-secondary"
      type="button"
      onClick={copy}
      disabled={!value}
    >
      {label}
    </button>
  );
}
