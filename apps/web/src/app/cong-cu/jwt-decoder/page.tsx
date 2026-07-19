import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "jwt-decoder";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
