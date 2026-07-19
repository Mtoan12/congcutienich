import Link from "next/link";
import { CalculatorIcon } from "./icons";

export function ToolCard() {
  return (
    <Link className="card tool-card" href="/cong-cu/chuyen-so-thanh-chu">
      <span className="icon-box">
        <CalculatorIcon />
      </span>
      <h3>Chuyển số thành chữ</h3>
      <p>Đọc số nguyên và số tiền thành chữ tiếng Việt chính xác.</p>
    </Link>
  );
}
