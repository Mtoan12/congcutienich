import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "tao-slug";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
