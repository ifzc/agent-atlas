import type { Metadata } from 'next';
import './globals.css';
import './history.css';

export const metadata: Metadata = {
  title: 'Agent 技术演进 · 从 Auto-GPT 到长任务架构',
  description:
    '从 Auto-GPT 热潮出发，结合 LangChain、LangGraph、AutoGen 与 MCP，讲清推理循环、工具接口、共享状态、协作、持久执行与上下文工程。简洁流程图与底部时间轴，适合全屏录制讲解。',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
