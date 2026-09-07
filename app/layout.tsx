import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agent Atlas · 3D 智能体解剖室',
  description: '通过可交互的 3D 架构模型和 14 章逐步讲解，理解 AI Agent 的目标、模型、记忆、规划、工具与反馈闭环。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" className="dark"><body>{children}</body></html>;
}
