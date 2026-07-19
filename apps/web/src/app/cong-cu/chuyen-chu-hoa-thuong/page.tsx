import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "chuyen-chu-hoa-thuong";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
