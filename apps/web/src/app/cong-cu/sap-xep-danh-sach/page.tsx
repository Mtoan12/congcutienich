import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "sap-xep-danh-sach";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
