# ✨ 极简 AI 协作博客模板 (CF-blog)

> **小白也能轻松上手的个人静态博客网站。** 无需学习复杂的后端，只需修改配置文件和 Markdown，即可拥有属于自己的数字花园。

Author: adou | [alivedou@outlook.com](mailto:alivedou@outlook.com)
项目开源地址：[https://github.com/alivedou/cf-blog](https://github.com/alivedou/cf-blog)

## 部署后的效果图如下：

！[项目部署效果图](https://i.urusai.cc/2u1Ar.png)

---

## 🛠️ 准备阶段 (部署前必看)

为了实现“零成本”发布您的博客，您需要先准备好以下两个**免费**账号：

1.  **[GitHub 账号](https://github.com/join)**：用于管理您的博客代码和文章。
2.  **[Cloudflare 账号](https://dash.cloudflare.com/sign-up)**：用于将代码发布为真实的网站（Cloudflare Pages）。

---

## 🔥 为什么选择本项目？
*   **💸 零元购**: 配合 Cloudflare Pages，终身免费，无需服务器费用。
*   **⚡ 闪电快**: 静态导出，全球 CDN 分发，秒开网页。
*   **🖋️ 写作爽**: 只需写 Markdown 丢进文件夹，网站自动更新。
*   **🎨 随心改**: 内置主题换色、背景透明度调节、侧边栏实时背景切换。
*   **📌 置顶文章**: 支持将精选文章置顶至主页的显眼推荐位置，置顶顺序可由数字权重自由调节。
*   **🏷️ 多标签**: 每篇文章支持添加多个标签，分类检索更方便。（注：请确保标签值不为空）
*   **🚀 新功能**: 
    *   **返回顶部/底部**: 极速导航，阅读体验更顺滑。
    *   **时间线归档**: 按年、月自动组织文章，回忆不再凌乱。
    *   **多码支持**: 底部支持展示多个二维码（如微信号+打赏码）。
    *   **容错增强**: 增强了对非法日期和空白标签的兼容性，系统更稳定。

---

## 🚀 部署方式 (根据您的程度选择)

本项目支持多种部署方式，您可以根据自己的技术水平选择最适合的一种：

### 🧊 模式一：极简部署 (小白/新手推荐)
**特点**：无需安装任何开发环境，完全在浏览器内通过鼠标操作完成，终身免费。

**1. 准备项目代码**
*   登录您的 [GitHub](https://github.com/) 账号（没有请注册）。
*   找到本项目仓库：[cf-blog](https://github.com/alivedou/cf-blog)。
*   点击右上角的 **Fork** 按钮。
*   **💡 关键一步**：在 `Create a new fork` 页面，你可以修改 **Repository name**（例如改为 `my-blog` 或任何你喜欢的名字）。
*   点击下方的 **Create fork** 按钮。现在，你已经拥有了一份完全属于你自己的博客代码库！

**2. 在 Cloudflare Pages 部署 (魔法开始的地方)**
*   访问 [Cloudflare 控制台](https://dash.cloudflare.com/) 并登录。
*   在左侧菜单选择 **Workers & Pages** -> **Create application**。
*   切换到 **Pages** 选项卡，点击 **Connect to Git**。
*   选择您的 GitHub 账号，并选中刚才 Fork 的项目，点击 **Begin setup**。
*   在“Build settings”中配置如下：
    *   **Framework preset**: 留空，不填写任何内容。
    *   **Build command**: 输入 `npm run build`。
    *   **Build output directory**: 输入 `dist`。
*   点击 **Save and Deploy**，等待 1-2 分钟，您的网站就正式上线了！

**3. 如何添加文章与修改信息？**
*   **修改个人信息**：点击您 GitHub 仓库中的 `blog.config.ts` 文件，点击右上角的“铅笔”图标进行编辑，修改名称、头像、透明度等。
*   **添加文章**：点击 `content/posts/` 目录，点击 **Add file** -> **Create new file**。文件名以 `.md` 结尾。
*   **多标签技巧**：在文章头部的 `tags` 字段中，使用类似 `["标签1", "标签2"]` 的格式即可添加多个标签。
*   **如何置顶文章**：在文章头部添加 `sticky: 1` 即可将文章置顶，数字越小越靠前。不写该行表示普通文章。
*   **关键点**：您在 GitHub 上执行的每一次改动，Cloudflare 都会自动帮你同步到线上网站！

---

### 💻 模式二：极客部署 (有电脑基础/本地调试)
**特点**：在本地进行复杂的排版与预览，通过命令行管理项目。

**1. 环境配置 (Windows 用户推荐 WSL)**
*   打开终端执行 `wsl --install` 安装 Ubuntu。
*   在 Ubuntu 中执行 `sudo apt update && sudo apt install nodejs npm` (推荐使用 Node 20+)。
*   **PS**: 若 WSL 密码丢失，请询问 [DeepSeek](https://chat.deepseek.com/) 寻找“WSL 重置密码方法”。

**2. 极客写作：自动更新日期 (New!)**
为了省去手动修改文章日期的烦恼，本项目内置了自动日期同步脚本：
*   **手动运行**: 在根目录执行 `node scripts/update-post-date.js content/posts/你的文章.md`。
*   **VS Code 自动化 (推荐)**: 
    *   按下 `Ctrl + Shift + B` (Windows) 或 `Cmd + Shift + B` (Mac)。
    *   选择 `cf-blog: 更新当前文章日期`。
    *   脚本会自动检测当前打开的文件，并将其 frontmatter 中的 `date` 字段更新为今天。

**3. 本地调试**
*   使用 **VSCode** 打开项目。
*   推荐安装 **Markdown All in One** 或 **Markdown Preview Enhanced** 插件以便实时预览。
*   在项目根目录运行 `npm install` 安装依赖。
*   运行 `npm run dev` 启动本地预览 (http://localhost:3000)。

**3. 同步到 GitHub**
*   本地修改完成后，使用 `git add .`、`git commit -m "update"`、`git push` 将改动推送到 GitHub，线上网站会自动刷新。

---

### 🛡️ 模式三：专业部署 (VPS 独立托管)
**特点**：完全掌控服务器环境，适合希望自行管理域名与 SSL 的用户。

**1. 准备工作**
*   拥有一个 Linux VPS (如 Ubuntu/Debian)。
*   安装 Node.js 和 Nginx。

**2. 构建项目**
*   在本地或 VPS 上执行 `npm run build`。
*   这会生成一个 `dist` 文件夹，里面包含了所有静态网页文件。

**3. 配置 Nginx**
*   将 `dist` 目录上传到服务器（如 `/var/www/blog`）。
*   修改 Nginx 配置文件：
    ```nginx
    server {
        listen 80;
        server_name yourdomain.com;
        location / {
            root /var/www/blog;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
    }
    ```
*   重启 Nginx (`sudo systemctl restart nginx`)。

---

## 🎨 快速自定义指引

本项目极其强调“配置与内容分离”，适合小白快速上手：
*   **基础设置**: 修改 `blog.config.ts`。您可以修改博主姓名、头像，或通过 `THEME_COLOR` 一键换色，还可以调整 `SITE_BG_OPACITY` 透明度。
*   **文章附加内容**: 在 `blog.config.ts` 中可以修改 `POST_BOTTOM_IMAGES` 来添加文章底部的一个或多个二维码（自动排版）。
*   **高级背景**: 
    *   **初始背景**: 网站自带了一个精致的默认背景图（内置于代码中，无需配置）。
    *   **手动覆盖**: 您可以在运行网站后，通过侧边栏左下角的“背景图片”输入框实时更换。您的修改会保存在浏览器本地。
*   **文章管理**: 在 `content/posts/` 使用 Markdown 格式编写。
*   **素材管理**: 推荐将本地图片放入 `public/images/`，引用的路径为 `/images/文件名.jpg`。

---

## 📈 进阶玩法：开启真实阅读量统计 (可选)

虽然是静态博客，但您可以利用 LeanCloud 实现无需服务器的阅读量统计：

1.  **注册 LeanCloud**: 访问 [LeanCloud 官网](https://leancloud.cn/) 并注册账号。
2.  **创建应用**: 创建一个“开发版”（免费）应用。建议应用名称设为 `cyber-log-stats`。
3.  **获取凭证**: 
    *   进入“设置” -> “应用凭证”，拷贝 **AppID** 和 **AppKey**。
    *   进入“设置” -> “域名绑定”，拷贝 **REST API 服务器地址**（如果没有，请按照提示绑定或使用其提供的 API 域名）。
4.  **填写配置**: 修改 `blog.config.ts` 中的 `LEANCLOUD_CONFIG`：
    *   `enabled`: 设为 `true`。
    *   `appId`, `appKey`, `serverURL`: 填入刚才获取的信息。
5.  **魔法开启**: 完成提交（Commit）后，每当有人访问您的文章，阅读量就会实时更新并展示在标题下方！

---

## 🛠️ 未来功能扩展建议 (给开发者的进阶指南)

如果您有一定代码基础，并希望为这个博客添加更多功能，以下是一些可行的技术路径：

*   **💬 评论系统 (Comment System)**:
    *   **建议**: 推荐使用 [Giscus](https://giscus.app/zh-CN) 或 [Waline](https://waline.js.org/)。Giscus 基于 GitHub Discussions，完全免费且契合本项目风格。
    *   **实现**: 在文章详情页组件底部引入相应的 JS 脚本即可。
*   **🌍 多语言支持 (i18n)**:
    *   **建议**: 使用 `react-i18next`。
    *   **实现**: 为 `blog.config.ts` 中的文本提供多语言版本，并添加一个切换语言的按钮。
*   **🔐 文章加密 (Post Encryption)**:
    *   **建议**: 使用 `crypto-js` 对 Markdown 内容进行 AES 加密。
    *   **实现**: 在预处理脚本中检测 `.md` 头部是否含有 `password` 字段，若有则加密内容。前端读取时提示用户输入密码解绑。

---

## ❤️ 联系与支持 (Support)

如果您在部署过程中遇到任何困难，或者有更好的创意，欢迎通过以下方式联系我：
- **Email**: [alivedou@outlook.com](mailto:alivedou@outlook.com)

让我们一起构建更美的数字世界！✨

---

## 🛠️ 常见问题排查 (Troubleshooting)

1.  **点击标签白屏？**
    *   通常是因为 Markdown 文件的 `tags` 列表中出现了空白项（例如 `- ` 后面没写字）。
    *   **已修复**: 核心代码已添加容错，但仍建议保持 Markdown 格式规范。
2.  **归档页面不显示文章？**
    *   请检查 `date` 字段格式是否为 `YYYY-MM-DD`。
3.  **自定义背景图不显示？**
    *   请确保链接是直链（以 `.jpg`, `.png` 等结尾），且支持跨域访问。
4.  **刷新文章页面回到主页？（404 错误或返回主页）**
    *   **已修复**: 已经通过添加 `_redirects` 配置和前端路由监听解决了此问题。如果您是已有部署，请确保重新构建并部署，通过链接分享将直接定位到具体文章！
5.  **部分国内手机浏览器（如百度、X浏览器）加载极其缓慢或白屏闪烁？**
    *   **已修复**: 这是因为以往使用了 Google Fonts，国内网络请求阻塞导致。应用已彻底移除所有外部字体依赖，并改用系统无级原生字体 (`system-ui`)，秒开率大幅提升！侧边栏的闪烁问题也通过转场动画的精准控制 (`transition-transform`) 和移动端 100dvh 高度适配得到了彻底解决。项目运行时也清理了不必要被 Git 记录的缓存衍生文件，运行更加轻量。
6.  **手机端点击侧边栏背景输入框时，侧边栏突然收缩消失？**
    *   **已修复**: 手机浏览器在调起虚拟键盘时会暂时改变网页的可视高度，从而触发原来的窗口大小监听机制导致面板被意外关闭。目前已修复了屏幕尺寸监听逻辑，侧边栏仅在屏幕宽度发生实质性改变时（如横竖屏切换）才会自动收缩，大大提升了手机端输入体验！
7.  **如何自定义首页描述文本和调整侧边栏的“联系我”按钮位置？**
    *   **已优化**: 现已将首页顶部显示的欢迎描述语抽离到了 `blog.config.ts` 中的 `HOME_PAGE_DESCRIPTION` 字段，实现自由配置。另外，侧边栏的“联系我”功能也从普通的外部链接列表中移出，配置为 `blog.config.ts` 中的 `AUTHOR_CONTACT` 变量，并以美观的按钮形态专门放置在博主头像下方，使得整体视觉和交互逻辑更加直观。
8.  **切换图片背景后在特定的黑夜/白天模式下文字看不清？**
    *   **已优化**: 项目引入了现代 Web 设计标准的毛玻璃 (frosted glass) `backdrop-blur` 视觉特效卡片系统。现在，不管将背景图设置得多复杂，系统都会智能地在文章主体、归档列表和页面标题周围渲染一层质感丝滑的半透明玻璃遮罩以承载文字，完美解决了背景图对比度影响阅读体验的核心痛点。
9.  **不知道该如何修改侧边栏里的社交和个人图标？**
    *   **已填坑**: 已经在项目根目录的配置中心 `blog.config.ts` 里，针对由于引入 React 组件带来的图标修改门槛过高的问题，专门补充了“一拖到底”的傻瓜式小白操作步骤指引，无需代码经验也能随意换图标。
10. **为什么在 Markdown 里写的图片，在网站文章里不显示/加载失败？**
    *   **可能原因 1**: 语法错误。Markdown 图片的语法是 `![描述](链接)`，**请千万不要在首尾加反引号（`` ` ``）**，加了反引号会变成“代码块”而不会被解析成图片。
    *   **可能原因 2**: 图床防盗链保护。**已优化**：系统底层已为解析出的图片标签默认加上 `referrerPolicy="no-referrer"` 属性，大幅提高外部图床链接的加载成功率。
11. **从 Github 下载到本地，编辑后 `npm run dev` 显示白屏？**
    *   **可能原因**: 如果您在依赖未完整安装好时就强制启动，或者遇到 Windows 端由于端口冲突（如端口 3000 被占用）等开发环境问题，可能会导致 React 初始化失败渲染白屏。
    *   **解决方法**: 建议彻底关闭命令行终端重新打开，确保执行了一遍 `npm install` 等待进度条完成后，再执行 `npm run dev`。若端口冲突问题依旧，可以尝试重启电脑。

## 📄 版权说明 / License
本项目基于 [MIT License](LICENSE) 开源。
**Copyright © 2026 cf-blog | Powered by adou**

如果您使用了本模板，欢迎保留页脚的版权归属来源。您可以自由进行定制化和二次创作！
