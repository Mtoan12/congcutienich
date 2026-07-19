"use client";

import type { FormEvent } from "react";
import { useNumberConverter } from "../hooks/use-number-converter";
import { NumberExamples } from "./number-examples";
import { NumberOutput } from "./number-output";

export function NumberInputForm() {
  const converter = useNumberConverter();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    converter.convert();
  };
  return (
    <div className="card converter">
      <form onSubmit={submit} noValidate>
        <label className="field-label" htmlFor="number-input">
          Số cần chuyển
        </label>
        <input
          className="input"
          id="number-input"
          name="number"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Ví dụ: 125.430"
          value={converter.input}
          onChange={(event) => converter.setInput(event.target.value)}
          aria-invalid={Boolean(converter.error)}
          aria-describedby={converter.error ? "number-error" : "number-help"}
        />
        {converter.error ? (
          <p className="error" id="number-error" role="alert">
            {converter.error}
          </p>
        ) : (
          <p className="helper" id="number-help">
            Hỗ trợ số nguyên, số âm và dấu phân tách hàng nghìn.
          </p>
        )}
        <fieldset className="options">
          <legend className="field-label">Tùy chọn cách đọc</legend>
          <label className="check-label">
            <input
              type="checkbox"
              checked={converter.currency}
              onChange={(event) => converter.setCurrency(event.target.checked)}
            />
            Đọc dưới dạng tiền Việt Nam
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={converter.capitalize}
              onChange={(event) =>
                converter.setCapitalize(event.target.checked)
              }
            />
            Viết hoa chữ cái đầu
          </label>
        </fieldset>
        <div className="actions">
          <button className="button button-primary" type="submit">
            Chuyển đổi
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={converter.clear}
          >
            Xóa
          </button>
        </div>
      </form>
      <NumberOutput result={converter.result} />
      <NumberExamples onChoose={converter.chooseExample} />
    </div>
  );
}
