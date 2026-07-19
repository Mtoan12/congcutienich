import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "tim-va-thay-the";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
