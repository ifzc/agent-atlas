import type { Metadata } from 'next';
import AgentHistory from '@/components/agent-history';

export const metadata: Metadata = {
  title: '第一章 · Agent 技术架构演进',
  description:
    '从 Auto-GPT 热潮到 LangChain、LangGraph、MCP 与长任务架构，以 13 个小节讲清推理、工具、状态、协作和持久执行。',
};

export default function AgentHistoryChapter() {
  return <AgentHistory />;
}
