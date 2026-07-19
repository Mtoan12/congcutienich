import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "chuyen-so-thanh-chu";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
