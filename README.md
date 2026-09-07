# Agent Atlas · 3D 智能体解剖室

本地交互式 Agent 架构课堂。通过 Three.js 3D 模型和 14 章、42 个知识点，逐步理解目标、上下文、模型、记忆、检索、规划、工具、执行、观察、校验、权限和交付。

## 本地运行

需要 Node.js 22.13 或更新版本。

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 3000
```

打开 <http://localhost:3000/>。关闭开发服务器后，重新执行上面的启动命令即可。无需配置模型 API Key。字体与 3D 资源均使用本地资源或程序生成。

```sh
npx tsc --noEmit  # 类型检查
npm run build    # 生产构建
```

## 操作

- 拖动旋转、滚轮缩放；触摸屏使用单指旋转和双指缩放。
- 点击 3D 部件或其标签，跳转至对应章节。
- 使用“整体视图 / 拆解视图”和右侧工具栏切换观察方式。
- 右侧有“逐步讲解 / 运行案例 / 深入理解”，每章包含三个知识点。
- 底部总进度条可以拖动，章节按钮可以直接跳转。
- 自动讲解为文字轮播，默认每个知识点 16 秒，可切换 0.5×、1×、1.5×。没有语音。
- `←`、`→` 切换知识点，空格播放或暂停。焦点在交互控件上时使用控件自身键盘操作。
- 最后一个知识点点击“完成学习”可结束课程；可以随时回到开头。
- 切换浏览器标签页会暂停自动讲解；系统开启“减少动态效果”时关闭场景持续运动。

模型是软件逻辑架构的教学隐喻，并非真实神经网络或硬件结构；并非每个 Agent 都需要所有组件。销售案例使用模拟数据，不调用真实模型、数据库或外部服务。

## 主要文件

- `components/agent-scene.tsx`：3D 部件、连线、流动光点、鼠标操作及资源释放。
- `components/agent-explorer.tsx`：讲解面板、章节、底部进度与播放控制。
- `lib/agent-content.ts`：课程内容与来源资料。
- `app/globals.css`：桌面与移动端样式。

## 参考资料

- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [ReAct 原始论文](https://arxiv.org/abs/2210.03629)
- [LangChain — Memory overview](https://docs.langchain.com/oss/python/concepts/memory)
- [Three.js — OrbitControls](https://threejs.org/docs/pages/OrbitControls.html)

课程中的案例、任务拆分和图形是围绕通用概念编写的教学示例。
