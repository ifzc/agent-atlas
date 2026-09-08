import type { Metadata } from 'next';
import './globals.css';
import './history.css';

export const metadata: Metadata = {
  title: { default: 'Agent 技术课 · 课程目录', template: '%s · Agent 技术课' },
  description:
    '按章节学习 Agent 技术。第一章从 Auto-GPT 热潮出发，结合 LangChain、LangGraph、AutoGen 与 MCP，讲清推理、工具、状态、协作与持久执行。',
  icons: { icon: `${process.env.PAGES_BASE_PATH ?? ''}/favicon.svg` },
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
