export type ToolCategory = "vietnamese" | "text" | "developer" | "generator";
export interface ToolDefinition {
  id: string;
  name: string;
  shortDescription: string;
  path: string;
  category: ToolCategory;
  keywords: string[];
  icon: string;
  status: "available" | "coming-soon";
  featured?: boolean;
}
export const toolCategories: Record<ToolCategory, string> = {
  vietnamese: "Tiếng Việt",
  text: "Xử lý văn bản",
  developer: "Developer",
  generator: "Tạo nội dung",
};
export const tools: ToolDefinition[] = [
  {
    id: "chuyen-so-thanh-chu",
    name: "Chuyển số thành chữ",
    shortDescription: "Đọc số nguyên và số tiền bằng tiếng Việt.",
    path: "/cong-cu/chuyen-so-thanh-chu",
    category: "vietnamese",
    keywords: ["so chu tien viet"],
    icon: "calculator",
    status: "available",
    featured: true,
  },
  {
    id: "xoa-dau-tieng-viet",
    name: "Xóa dấu tiếng Việt",
    shortDescription: "Chuyển văn bản có dấu thành không dấu.",
    path: "/cong-cu/xoa-dau-tieng-viet",
    category: "vietnamese",
    keywords: ["xoa dau unicode"],
    icon: "type",
    status: "available",
    featured: true,
  },
  {
    id: "tao-slug",
    name: "Tạo slug tiếng Việt",
    shortDescription: "Tạo đường dẫn gọn, sạch từ tiêu đề tiếng Việt.",
    path: "/cong-cu/tao-slug",
    category: "vietnamese",
    keywords: ["slug url"],
    icon: "link",
    status: "available",
    featured: true,
  },
  {
    id: "chuyen-chu-hoa-thuong",
    name: "Chuyển kiểu chữ",
    shortDescription: "Đổi chữ hoa, chữ thường, tiêu đề và câu.",
    path: "/cong-cu/chuyen-chu-hoa-thuong",
    category: "vietnamese",
    keywords: ["hoa thuong title case"],
    icon: "case",
    status: "available",
  },
  {
    id: "dem-tu-ky-tu",
    name: "Đếm từ và ký tự",
    shortDescription: "Thống kê từ, ký tự, dòng và thời gian đọc.",
    path: "/cong-cu/dem-tu-ky-tu",
    category: "vietnamese",
    keywords: ["dem tu ky tu"],
    icon: "count",
    status: "available",
    featured: true,
  },
  {
    id: "chuan-hoa-khoang-trang",
    name: "Chuẩn hóa khoảng trắng",
    shortDescription: "Dọn space, dòng trống và khoảng cách dấu câu.",
    path: "/cong-cu/chuan-hoa-khoang-trang",
    category: "text",
    keywords: ["space khoang trang"],
    icon: "align",
    status: "available",
  },
  {
    id: "xoa-dong-trung",
    name: "Xóa dòng trùng lặp",
    shortDescription: "Loại dòng lặp nhưng vẫn giữ thứ tự ban đầu.",
    path: "/cong-cu/xoa-dong-trung",
    category: "text",
    keywords: ["duplicate line"],
    icon: "layers",
    status: "available",
  },
  {
    id: "sap-xep-danh-sach",
    name: "Sắp xếp danh sách",
    shortDescription: "Sắp xếp văn bản, số hoặc trộn các dòng.",
    path: "/cong-cu/sap-xep-danh-sach",
    category: "text",
    keywords: ["sort list a z"],
    icon: "sort",
    status: "available",
  },
  {
    id: "so-sanh-van-ban",
    name: "So sánh hai văn bản",
    shortDescription: "Xem các dòng được thêm, xóa và giữ nguyên.",
    path: "/cong-cu/so-sanh-van-ban",
    category: "text",
    keywords: ["diff compare"],
    icon: "compare",
    status: "available",
    featured: true,
  },
  {
    id: "tim-va-thay-the",
    name: "Tìm và thay thế",
    shortDescription: "Thay thế thường, nguyên từ hoặc bằng regex.",
    path: "/cong-cu/tim-va-thay-the",
    category: "text",
    keywords: ["find replace regex"],
    icon: "search",
    status: "available",
  },
  {
    id: "xoa-dong-trong",
    name: "Xóa dòng trống",
    shortDescription: "Xóa hoặc gộp các dòng trống trong văn bản.",
    path: "/cong-cu/xoa-dong-trong",
    category: "text",
    keywords: ["blank empty line"],
    icon: "minus",
    status: "available",
  },
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    shortDescription: "Format, minify, kiểm tra và sắp xếp key JSON.",
    path: "/cong-cu/json-formatter",
    category: "developer",
    keywords: ["json format validate minify"],
    icon: "braces",
    status: "available",
    featured: true,
  },
  {
    id: "json-sang-typescript",
    name: "JSON sang TypeScript",
    shortDescription: "Sinh interface hoặc type an toàn từ JSON.",
    path: "/cong-cu/json-sang-typescript",
    category: "developer",
    keywords: ["typescript interface type"],
    icon: "code",
    status: "available",
    featured: true,
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Giải mã header, payload và thời hạn JWT cục bộ.",
    path: "/cong-cu/jwt-decoder",
    category: "developer",
    keywords: ["jwt token decode"],
    icon: "key",
    status: "available",
    featured: true,
  },
];
export const availableTools = tools.filter(
  (tool) => tool.status === "available",
);
export interface ToolContent {
  example: string;
  usage: string;
  note: string;
}
export const toolContent: Record<string, ToolContent> = {
  "chuyen-so-thanh-chu": {
    example: "125430 → một trăm hai mươi lăm nghìn bốn trăm ba mươi.",
    usage:
      "Nhập số nguyên; dấu chấm, dấu phẩy hoặc khoảng trắng chỉ được dùng theo nhóm ba chữ số.",
    note: "Không hỗ trợ số thập phân và giới hạn tối đa 66 chữ số.",
  },
  "xoa-dau-tieng-viet": {
    example: "Tiếng Việt rất đẹp → Tieng Viet rat dep.",
    usage:
      "Dán văn bản có dấu và chọn có chuyển riêng chữ đ/Đ thành d/D hay không.",
    note: "Emoji, xuống dòng và ký tự không phải dấu tiếng Việt được giữ nguyên.",
  },
  "tao-slug": {
    example: "Công cụ xử lý tiếng Việt → cong-cu-xu-ly-tieng-viet.",
    usage:
      "Nhập tiêu đề, chọn dấu gạch ngang hoặc gạch dưới và tùy chọn giới hạn 80 ký tự.",
    note: "Khi cắt độ dài, separator cuối chuỗi được loại bỏ tự động.",
  },
  "chuyen-chu-hoa-thuong": {
    example: "đặng thái sơn → Đặng Thái Sơn ở chế độ Title Case.",
    usage:
      "Chọn lowercase, UPPERCASE, Sentence case, Title Case hoặc đảo hoa thường.",
    note: "Khoảng trắng và dấu câu được giữ; Sentence/Title Case chuẩn hóa phần chữ còn lại về chữ thường.",
  },
  "dem-tu-ky-tu": {
    example: "“Việt Nam, Việt Nam!” có 4 từ; Việt và Nam xuất hiện hai lần.",
    usage:
      "Nhập văn bản để xem thống kê realtime và chọn có phân biệt hoa/thường khi tính top từ.",
    note: "Số ký tự dùng Unicode grapheme segmentation, gần với ký tự người dùng nhìn thấy hơn JavaScript string length.",
  },
  "chuan-hoa-khoang-trang": {
    example: "“Xin   chào , bạn” → “Xin chào, bạn”.",
    usage: "Nhập nội dung rồi chỉ bật thêm khoảng trắng sau dấu câu khi cần.",
    note: "Tùy chọn thêm khoảng trắng mặc định tắt và bỏ qua token giống URL hoặc email.",
  },
  "xoa-dong-trung": {
    example:
      "Apple, apple, banana còn hai dòng khi bật không phân biệt hoa/thường.",
    usage: "Chọn cách so sánh, trim, bỏ dòng trống hoặc chỉ xem các lần lặp.",
    note: "Giá trị hiển thị đầu tiên và thứ tự xuất hiện ban đầu luôn được giữ.",
  },
  "sap-xep-danh-sach": {
    example: "10, 2, 1 → 1, 2, 10 ở chế độ số tăng dần.",
    usage:
      "Mỗi mục nằm trên một dòng; chọn sort chữ Việt, số, độ dài, đảo hoặc trộn.",
    note: "Sort chữ dùng Intl.Collator locale vi; shuffle không làm mất hay thêm dòng.",
  },
  "so-sanh-van-ban": {
    example:
      "Chèn một dòng ở đầu chỉ tạo một dòng thêm, các dòng còn lại giữ nguyên.",
    usage:
      "Nhập bản gốc và bản mới, sau đó tùy chỉnh case, trim và dòng trống.",
    note: "Đây là diff theo dòng bằng LCS, không phải diff theo từng ký tự.",
  },
  "tim-va-thay-the": {
    example:
      "Tìm “VietTools” và thay bằng “Viet Tools” ở lần đầu hoặc toàn bộ.",
    usage:
      "Nhập find/replace, chọn thay lần đầu hay tất cả, rồi bật whole word, case hoặc regex nếu cần.",
    note: "Regex replacement hỗ trợ capture group như $1; replacement thường là text literal. Pattern lặp lồng nguy hiểm bị từ chối.",
  },
  "xoa-dong-trong": {
    example: "Ba dòng trống liên tiếp có thể bị xóa hết hoặc gộp thành một.",
    usage: "Chọn xóa mọi dòng trống hoặc chỉ gộp chuỗi dòng trống.",
    note: "CRLF và CR được chuẩn hóa thành LF; có thể xem dòng chỉ chứa space/tab là dòng trống.",
  },
  "json-formatter": {
    example:
      '{"name":"VietTools"} được format thành JSON thụt lề hai khoảng trắng.',
    usage:
      "Dán JSON hợp lệ, chọn format/minify và có thể sắp xếp key trước khi copy hoặc tải file.",
    note: "Array không bị sắp xếp. Duplicate key tuân theo JSON.parse: giá trị sau cùng được giữ.",
  },
  "json-sang-typescript": {
    example: '{"name":"VietTools"} → interface Root { name: string; }.',
    usage:
      "Nhập JSON, đặt tên root và chọn interface/type, optional, readonly hoặc semicolon.",
    note: "Mảng rỗng mặc định sinh unknown[]; key không hợp lệ được quote và không sinh any mặc định.",
  },
  "jwt-decoder": {
    example:
      "JWT ba segment hiển thị riêng header, payload và trạng thái exp nếu có.",
    usage: "Dán JWT; công cụ decode Base64URL và parse hai segment JSON.",
    note: "Không xác minh chữ ký, không đánh giá token đáng tin cậy và giới hạn 100.000 ký tự.",
  },
};
export function getTool(id: string): ToolDefinition {
  const tool = tools.find((item) => item.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}
export function searchTools(
  query: string,
  category: ToolCategory | "all" = "all",
): ToolDefinition[] {
  const normalized = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/đ/giu, "d")
    .toLocaleLowerCase("vi")
    .trim();
  return availableTools.filter((tool) => {
    const matchesCategory = category === "all" || tool.category === category;
    const haystack = [tool.name, tool.shortDescription, ...tool.keywords]
      .join(" ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/gu, "")
      .replace(/đ/giu, "d")
      .toLocaleLowerCase("vi");
    return matchesCategory && haystack.includes(normalized);
  });
}
