import { NUMBER_EXAMPLES } from "../constants/examples";

export function NumberExamples({
  onChoose,
}: {
  onChoose: (value: string) => void;
}) {
  return (
    <div>
      <h3 style={{ marginTop: "1.5rem" }}>Ví dụ nhanh</h3>
      <div className="examples">
        {NUMBER_EXAMPLES.map((value) => (
          <button
            className="example"
            type="button"
            key={value}
            onClick={() => onChoose(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
