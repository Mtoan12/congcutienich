import { CopyButton } from "./copy-button";

export function NumberOutput({ result }: { result: string }) {
  return (
    <section className="output" aria-labelledby="result-heading">
      <div className="output-head">
        <h3 id="result-heading">Kết quả</h3>
        <CopyButton value={result} />
      </div>
      <p className={`result ${result ? "" : "empty"}`} aria-live="polite">
        {result || "Kết quả sẽ hiển thị tại đây"}
      </p>
    </section>
  );
}
