import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NumberInputForm } from "./number-input-form";

describe("NumberInputForm", () => {
  it("converts input and clears the form", () => {
    render(<NumberInputForm />);
    fireEvent.change(screen.getByLabelText("Số cần chuyển"), {
      target: { value: "125" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Chuyển đổi" }));
    expect(screen.getByText("một trăm hai mươi lăm")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Xóa" }));
    expect(screen.getByText("Kết quả sẽ hiển thị tại đây")).toBeInTheDocument();
  });
  it("shows an accessible validation message", () => {
    render(<NumberInputForm />);
    fireEvent.click(screen.getByRole("button", { name: "Chuyển đổi" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Vui lòng nhập một số.",
    );
  });
  it("loads a quick example", () => {
    render(<NumberInputForm />);
    fireEvent.click(screen.getByRole("button", { name: "1.005" }));
    expect(
      screen.getByText("một nghìn không trăm linh năm"),
    ).toBeInTheDocument();
  });
});
