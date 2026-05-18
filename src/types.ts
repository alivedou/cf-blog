/** 
 * Author: adou | alivedou@outlook.com
 * 定义项目中通用的数据模型结构（TypeScript 接口）。
 */

/** 文章元数据：用于列表页面展示 */
export interface PostMetadata {
  title: string;       // 文章标题
  date: string;        // 发布日期
  description: string; // 简短描述
  image?: string;      // 封面图 URL (可选)
  tags?: string[];     // 标签数组 (可选)
  categories?: string[]; // 分类数组 (可选)
  slug: string;        // 唯一识别路径（通常是文件名）
  sticky?: number | null; // 置顶权重，数字越小越靠前
  updated?: string;    // 最后更新日期 (可选)
}

/** 文章详情：包含元数据和全文 Markdown 内容 */
export interface PostDetail {
  slug: string;
  metadata: PostMetadata;
  content: string;     // Markdown 格式的正文
}
