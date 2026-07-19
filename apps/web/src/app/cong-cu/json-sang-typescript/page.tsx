import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "json-sang-typescript";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
