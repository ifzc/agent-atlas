# Agent 技术演进

一个适合录屏讲解的简洁网页。以 2023 年春 Auto-GPT 热潮为叙事起点，用 13 个章节讲清模型周围的技术架构如何发展，覆盖到 2025 年末的长任务实践。

内容依次为：全局总览、ReAct / Auto-GPT、LangChain、Function Calling、LlamaIndex 数据 Agent、LangSmith 追踪评估、AutoGen 协作、LangGraph 状态与控制、检查点与恢复、MCP、Deep Agents、Skills、Harness。时间点对应代表性论文、公告或版本；必要时回溯 2022 年的来源，不将框架发布等同于概念诞生。

每章包含问题、能力、边界、简洁二维流程图和官方来源。原 3D 模型、解剖室页面及 Three.js 依赖已移除。

## 讲解操作

- 点击底部时间轴或按 `←`、`→` 切换章节，`Home` 回到总览，`End` 跳到最后一章。
- 自动播放默认每章 45 秒，可切换为 30 / 45 / 60 秒；空格播放或暂停。不含配音。
- `F` 开关全屏；“讲解提示”展示当前章的讲述思路。
- “参考资料”可查看原论文、官方公告和技术文档。
- 手动切换章节、打开资料或切换到其他标签页会暂停自动播放。
- 时间轴按章节等距排列，不按实际时间间隔缩放；流程图是教学示意，不执行真实 Agent 任务。
- 系统开启“减少动态效果”时，关闭章节淡入和时间轴平滑滚动。

## 本地运行

需要 Node.js 22.13 或更新版本。无需配置模型 API Key。

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 3000
```

启动后访问 `http://localhost:3000/`。本次修改已按要求停止开发实例，没有重新启动。

```sh
npx tsc --noEmit
npm run build
npm run lint
```

## 主要文件

- `lib/agent-history.ts`：技术章节、流程图数据、讲解提示与原始资料。
- `components/agent-history.tsx`：页面、二维示意图、时间轴和播放控制。
- `app/history.css`：页面布局、桌面与移动端适配。
- `app/globals.css`：基础主题与全局样式。
