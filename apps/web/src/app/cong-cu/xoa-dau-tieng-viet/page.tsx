import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "xoa-dau-tieng-viet";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
