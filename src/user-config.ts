/**
 * Author: adou | alivedou@outlook.com
 * 本文件由 adou 开发，旨在为小白提供最简单的个人博客配置体验。
 * 尊重开源劳动成果，引用请保留作者信息。
 */

import { Home, Archive, Tag, User, MessageCircle, Tv, Share2, HelpCircle } from 'lucide-react';

/**
 * ==========================================
 *           网站基础信息 (必须修改)
 * ==========================================
 */

// 1. 网站标题（显示在浏览器标签页上）
export const SITE_TITLE = "张三的个人博客";

// 2. 网站名称（显示在侧边栏顶部）
export const BLOG_NAME = "张三的个人博客";

// 3. 网站描述（用于搜索引擎优化）
export const BLOG_DESCRIPTION = "一个基于 Vite + React 的极简静态博客。";


/**
 * ==========================================
 *           个人信息 (必须修改)
 * ==========================================
 */

// 4. 用户名
export const AUTHOR_NAME = "张三";

// 5. 职业称号/简介
export const AUTHOR_TITLE = "一个热爱生活的开发者";

// 6. 头像图片路径
// 可以使用远程链接，或者将图片放入 public/images/ 后使用 "/images/文件名.jpg"
export const AUTHOR_AVATAR = "https://i.urusai.cc/wx3iV.jpg";


/**
 * ==========================================
 *           侧边栏菜单配置
 * ==========================================
 */

// 7. 导航菜单列表
export const MENU_ITEMS = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'archive', label: '归档', icon: Archive },
  { id: 'tags', label: '标签', icon: Tag },
  { id: 'about', label: '关于', icon: User },
];

// 8. 侧边栏底部的社交/推荐链接
export const RECOMMENDED_LINKS = [
  { label: 'GitHub', url: 'https://github.com', icon: Share2 },
  { label: '我的主站', url: 'https://example.com', icon: Tv },
  { label: '联系我', url: 'mailto:webmaster@example.com', icon: MessageCircle },
];


/**
 * ==========================================
 *           关于页面内容
 * ==========================================
 */

export const ABOUT_PAGE_CONFIG = {
  name: AUTHOR_NAME,
  title: AUTHOR_TITLE,
  image: "https://i.urusai.cc/PDOiV.png", // 背景大图
  description: `
你好！我是${AUTHOR_NAME}。

这里是我的个人空间，记录我的学习、思考和生活点滴。
我热爱技术，也喜欢探索生活中的各种可能性。
希望这里的内容能给你带来一些启发。
  `.trim()
};


/**
 * ==========================================
 *            外观定制
 * ==========================================
 */

// 9. 主题色 (Tailwind 颜色名，如 orange, blue, rose, emerald)
export const THEME_COLOR = "indigo"; 

// 10. 网站背景图片透明度（0.0 到 1.0 之间，数值越小，背景图越清晰）
// 建议：浅色模式 0.7-0.9，深色模式 0.8-0.95
export const SITE_BG_OPACITY = 0.75;


/**
 * ==========================================
 *           文章详情页高级设置
 * ==========================================
 */

// 11. 文章底部显示的自定义图片列表 (例如二维码、打赏码)
// 可以添加多个，会自动并排显示
export const POST_BOTTOM_IMAGES = [
  {
    enabled: true,
    url: "https://i.urusai.cc/wx3iV.jpg",
    label: "关注我的公众号" 
  },
];

// 12. 真实阅读量统计 (基于 LeanCloud)
// 如果不需要统计，请将 enabled 设为 false
export const LEANCLOUD_CONFIG = {
  enabled: false, // 初始设为 false，小白配置好后再开启
  appId: "",      // LeanCloud AppID
  appKey: "",     // LeanCloud AppKey
  serverURL: ""   // LeanCloud 服务器地址
};
