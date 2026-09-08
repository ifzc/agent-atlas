import { historyChapters } from './agent-history';

export const courseChapters = [
  {
    id: 'agent-history',
    sections: historyChapters,
    number: '01',
    label: '第一章',
    title: 'Agent 技术架构演进',
    description:
      '从 Auto-GPT 走红开始，结合 LangChain、LangGraph 等技术，理解 Agent 如何从工具循环发展为可控制、可恢复、可验证的执行系统。',
    href: '/chapters/agent-history/',
    topics: ['推理与工具', '状态与协作', '持久执行与上下文'],
  },
] as const;
