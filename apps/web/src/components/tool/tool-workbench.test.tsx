import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ToolWorkbench } from "./tool-workbench";
describe("ToolWorkbench", () => {
  it("transforms Vietnamese text and clears it", () => {
    render(<ToolWorkbench toolId="xoa-dau-tieng-viet" />);
    const input = screen.getByLabelText("Dữ liệu đầu vào");
    fireEvent.change(input, { target: { value: "Tiếng Việt đẹp" } });
    expect(screen.getByLabelText("Kết quả")).toHaveValue("Tieng Viet dep");
    fireEvent.click(screen.getByRole("button", { name: "Xóa" }));
    expect(input).toHaveValue("");
  });
  it("shows regex validation instead of crashing", () => {
    render(<ToolWorkbench toolId="tim-va-thay-the" />);
    fireEvent.change(screen.getByLabelText("Dữ liệu đầu vào"), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText("Tìm"), { target: { value: "[" } });
    fireEvent.click(screen.getByLabelText("Regex"));
    expect(screen.getByRole("alert")).toHaveTextContent("không hợp lệ");
  });
  it("shows the JWT signature warning", () => {
    render(<ToolWorkbench toolId="jwt-decoder" />);
    expect(screen.getByRole("note")).toHaveTextContent("không xác minh chữ ký");
  });
  it("copies through the shared clipboard utility", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<ToolWorkbench toolId="xoa-dau-tieng-viet" />);
    fireEvent.change(screen.getByLabelText("Dữ liệu đầu vào"), {
      target: { value: "Việt" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sao chép" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("Viet"));
  });
});
