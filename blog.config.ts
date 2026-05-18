/**
 * Author: adou | alivedou@outlook.com
 * 本文件由 adou 开发，旨在为小白提供最简单的个人博客配置体验。
 * 尊重开源劳动成果，引用请保留作者信息。
 */

import { Home, Archive, Tag, User, MessageCircle, Tv, Share2,Image, HelpCircle, Layout } from 'lucide-react';

/**
 * ==========================================
 *           网站基础信息 (必须修改)
 * ==========================================
 */

// 1. 网站标题（显示在浏览器标签页上）
export const SITE_TITLE = "张三的个人博客";

// 2. 网站首页描述（显示在首页标题下方，简短介绍）
export const HOME_PAGE_DESCRIPTION = "分享关于设计、技术与创意过程的思考。";

/**
 * ==========================================
 *           个人信息 (必须修改)
 * ==========================================
 */

// 3. 用户名
export const AUTHOR_NAME = "张三";

// 4. 职业称号/简介
export const AUTHOR_TITLE = "一个热爱生活的开发者";

// 5. 联系邮箱/链接 (显示在头像下方)
export const AUTHOR_CONTACT = "mailto:webmaster@example.com";

// 6. 头像图片路径
// 可以使用远程链接，或者将图片放入 public/images/ 后使用 "/images/文件名.jpg"
export const AUTHOR_AVATAR = "public/images/kun.jpg";


/**
 * ==========================================
 *           侧边栏菜单配置
 * ==========================================
 * 
 * 【如何更换自定义图标？】
 * 本项目使用 lucide-react 作为图标库。
 * 1. 请访问 https://lucide.dev/icons/ 寻找你需要图标的名字。
 * 2. 在本文件的最上方 import 区，将图标的英文名添加进去（首字母大写，如 'Camera'）。
 * 3. 将下面配置中的 icon 字段替换为你刚导入的名字即可。
 */

// 7. 导航菜单列表
export const MENU_ITEMS = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'archive', label: '归档', icon: Archive },
  { id: 'categories', label: '分类', icon: Layout },
  { id: 'tags', label: '标签', icon: Tag },
  { id: 'about', label: '关于', icon: User },
];

// 8. 侧边栏底部的社交/推荐链接：
//预置了一个免费图床和一个高清图片壁纸站按钮,由于后者被墙，需要把后者的图片放到前面的图床后，再复制链接给你的博客配图
export const RECOMMENDED_LINKS = [
  { label: 'GitHub', url: 'https://github.com', icon: Share2 },
  { label: '我的主站', url: 'https://example.com', icon: Tv },
  { label: '第三方图床', url: 'https://urusai.cc', icon: Image },
  { label: '壁纸图片网站', url: 'https://wallhaven.cc', icon: Image },
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

// 9. 主题色 (Tailwind 颜色名，如 orange, blue, rose, emerald)其他颜色定制请自行用AI或搜索浏览器得到答案
export const THEME_COLOR = "indigo"; 

// 10. 网站背景图片透明度（0.0 到 1.0 之间，数值越小，背景图越清晰）
// 建议：浅色模式 0.7-0.9，深色模式 0.8-0.95
export const SITE_BG_OPACITY = 0.85;


/**
 * ==========================================
 *           文章详情页高级设置
 * ==========================================
 */

// 11. 文章底部显示的自定义图片列表 (例如二维码、打赏码)
// 可以添加多个，会自动并排显示，但需要格式保持一致，不然网站会崩。
export const POST_BOTTOM_IMAGES = [
  {
    enabled: true,
    url: "public/images/kun.jpg",
    label: "关注我的公众号" 
  },
];

// 12. 真实阅读量统计 (基于 LeanCloud)，该功能要求能力比较高，小白请勿更改。
// 如果不需要统计，请将 enabled 设为 false
export const LEANCLOUD_CONFIG = {
  enabled: false, // 初始设为 false，小白配置好后再开启
  appId: "",      // LeanCloud AppID
  appKey: "",     // LeanCloud AppKey
  serverURL: ""   // LeanCloud 服务器地址
};
