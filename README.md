# Agent 技术课

一个适合录屏讲解的课程网页。首页是课程目录，现有的 Agent 技术演进内容归入 **第一章：Agent 技术架构演进**。

## 第一章

从 2023 年春 Auto-GPT 热潮讲到 2025 年末的长任务实践，共 13 个小节：全局总览、ReAct / Auto-GPT、LangChain、Function Calling、LlamaIndex 数据 Agent、LangSmith 追踪评估、AutoGen 协作、LangGraph 状态与控制、检查点与恢复、MCP、Deep Agents、Skills、Harness。

每节包含问题、能力、边界、二维架构图、讲解提示和原始资料。时间点对应代表性论文、公告或版本，必要时回溯 2022 年的技术来源。原 3D 模型及依赖已移除。

- 课程目录：`/`
- 第一章：`/chapters/agent-history/`
- 点击时间轴或按 `←`、`→` 切换小节，`Home` 回总览，`End` 到最后一节。
- 自动播放默认每节 45 秒，可切换 30 / 45 / 60 秒；空格播放或暂停，不含配音。
- `F` 开关全屏；“讲解提示”显示当前小节的讲述思路。
- 点击“课程目录”返回首页；章节内手动切换、打开资料、切换浏览器标签页都会暂停播放。

## 本地开发

需要 Node.js 22.13 或更新版本，无需模型 API Key。

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 3000
```

原有 Vinext 开发与服务端构建流程保留：

```sh
npm run lint
npx tsc --noEmit
npm run build
```

## GitHub Pages

公开站点地址为 <https://ifzc.github.io/agent-atlas/>。

GitHub Pages 使用独立的 Vite 静态构建入口，复用相同的目录和讲解组件，不依赖运行中的服务器。目录页和第一章分别生成 HTML，直接访问和刷新章节地址均由 Pages 提供文件；链接使用仓库子路径。

```sh
PAGES_BASE_PATH=/agent-atlas npm run build:pages
PAGES_BASE_PATH=/agent-atlas npm run preview:pages
```

静态产物在 `dist/pages/`。构建结束后自动检查两个页面入口和引用的图标、脚本、样式是否完整。仅上传此目录，不上传服务端产物。

仓库 Pages 的发布来源设为 `gh-pages` 分支根目录。源码保存在 `codex/agent-history`，`gh-pages` 只存放生成的静态网页。当前登录凭据没有创建 GitHub Actions 工作流的权限，因此使用 Pages 自带的分支发布流程。

更新源码并提交推送后，用下面的命令构建和更新网站：

```sh
PAGES_BASE_PATH=/agent-atlas npm run deploy:pages
```

发布脚本在临时目录中更新 `gh-pages`，采用普通推送，不修改当前工作区或强制覆盖远程历史；GitHub 随后自动发布该分支的静态内容。

## 内容维护

- `lib/course.ts`：课程章节目录。
- `lib/agent-history.ts`：第一章的小节、流程图数据、提示与来源。
- `app/page.tsx`、`app/course.css`：课程目录。
- `components/agent-history.tsx`、`app/history.css`：第一章的页面、时间轴和播放控制。
- `static/`、`vite.pages.config.ts`：GitHub Pages 的 HTML 入口和静态导航适配。

增加新章时，将章节加入课程目录，同时添加对应页面和静态入口。
