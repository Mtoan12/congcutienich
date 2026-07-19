import { createToolMetadata, ToolPage } from "@/components/tool/tool-page";
const id = "so-sanh-van-ban";
export const metadata = createToolMetadata(id);
export default function Page() {
  return <ToolPage id={id} />;
}
