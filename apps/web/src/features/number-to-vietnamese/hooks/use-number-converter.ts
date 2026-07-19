"use client";

import { numberToVietnameseWords } from "@viettools/vietnamese-utils";
import { useCallback, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { validateNumberInput } from "../schemas/number-input-schema";

export function useNumberConverter() {
  const [input, setInput] = useState("");
  const [currency, setCurrency] = useState(false);
  const [capitalize, setCapitalize] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const convert = useCallback(
    (nextInput = input) => {
      const validation = validateNumberInput(nextInput);
      if (!validation.success) {
        setError(validation.error);
        setResult("");
        return;
      }
      setError("");
      setResult(numberToVietnameseWords(nextInput, { currency, capitalize }));
      trackEvent("tool_used", { tool: "number-to-vietnamese" });
    },
    [capitalize, currency, input],
  );

  const clear = () => {
    setInput("");
    setResult("");
    setError("");
    setCurrency(false);
    setCapitalize(false);
  };
  const chooseExample = (value: string) => {
    setInput(value);
    setError("");
    setResult(numberToVietnameseWords(value, { currency, capitalize }));
    trackEvent("example_clicked", { tool: "number-to-vietnamese" });
  };
  return {
    input,
    setInput,
    currency,
    setCurrency,
    capitalize,
    setCapitalize,
    result,
    error,
    convert,
    clear,
    chooseExample,
  };
}
