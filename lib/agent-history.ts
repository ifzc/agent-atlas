export type HistoryChapter = {
  id: string;
  year: string;
  period: string;
  label: string;
  category: string;
  title: [string, string];
  description: string;
  milestone: string;
  problem: string;
  advance: string;
  boundary: string;
  takeaway: string;
  diagram: {
    kind: 'flow' | 'loop' | 'branch' | 'parallel';
    title: string;
    nodes: [string, string][];
    support?: string;
    returnLabel?: string;
    branchLabel?: string;
    caption: string;
  };
  note: string;
  sources: { title: string; url: string }[];
};

export const historyChapters: HistoryChapter[] = [
  {
    id: 'overview',
    year: '总览',
    period: '2023 — 2025',
    label: '演进主线',
    category: '先看全局',
    title: ['从一个循环，', '到可控的执行系统'],
    description:
      '从 Auto-GPT 走红开始，看模型周围的软件架构如何演进：接工具、管状态、组织协作，再让长任务持续推进。',
    milestone:
      '范围说明：聚焦 ChatGPT 之后的技术演进；必要时回溯 2022 年的技术来源。',
    problem: '模型能给出回答，却不能独自完成有外部操作的长任务。',
    advance: '用框架、状态和运行机制，把一次回答组织成一段工作。',
    boundary: '这些能力逐步叠加、并行发展，并非后一种架构取代前一种。',
    takeaway: 'Agent 的演进，不只发生在模型里，也发生在模型周围。',
    diagram: {
      kind: 'flow',
      title: '接下来要讲的三层变化',
      nodes: [
        ['能行动', '推理循环 · 工具接口'],
        ['可控制', '共享状态 · 路由 · 协作'],
        ['能持续', '检查点 · 上下文 · 验证'],
      ],
      caption: '从早期演示到长任务工程：能力叠加，不是严格的代际替换。',
    },
    note: '整段讲解可以沿用“查资料并生成报告”这个任务。先问：模型怎样查？再问：查得不好怎么办？最后问：中断一天之后，怎样接着查？这三个问题分别引出工具、状态和持久执行。',
    sources: [
      { title: 'ReAct：推理与行动', url: 'https://arxiv.org/abs/2210.03629' },
      {
        title: 'LangGraph：可控的循环与状态',
        url: 'https://www.langchain.com/blog/langgraph',
      },
      {
        title: '长时间运行 Agent 的工程实践',
        url: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents',
      },
    ],
  },
  {
    id: 'react',
    year: '2023 春',
    period: '2023 年春 · Auto-GPT 热潮',
    label: '推理循环',
    category: '01 / 行动',
    title: ['回答一次，', '变成行动多次'],
    description:
      'ReAct 把推理、行动、观察连成循环。Auto-GPT 把“给一个目标，自己连续调用工具”的体验带入大众视野。',
    milestone:
      'ReAct 论文发表于 2022.10；Auto-GPT 在 2023 年春走红，是早期热门项目之一。',
    problem: '一次文本输出之后，任务就停了；外部结果无法进入下一步。',
    advance: '执行工具，把观察结果送回模型，再决定继续还是结束。',
    boundary: '有循环不等于可靠：可能重复尝试、偏离目标或一直不结束。',
    takeaway: '关键变化：从“生成答案”变成“根据结果决定下一步”。',
    diagram: {
      kind: 'loop',
      title: '最小 Agent 循环',
      nodes: [
        ['推理 / 决策', '下一步查什么？'],
        ['工具执行', '搜索、读文件'],
        ['观察结果', '把结果放回上下文'],
      ],
      returnLabel: '观察结果 → 下一次决策，直到满足结束条件',
      caption: 'ReAct 是交互模式；Auto-GPT 是采用自主循环的早期热门实践。',
    },
    note: '指着图顺着走一圈：先决定搜索关键词，再实际搜索，最后读搜索结果。读完以后，可能继续查，也可能回答。这里讲的是可观察的执行结构，并不是在展示模型内部真实思维。不要把 Auto-GPT 说成历史上第一个 Agent。',
    sources: [
      {
        title: 'ReAct 原始论文（2022.10）',
        url: 'https://arxiv.org/abs/2210.03629',
      },
      {
        title: 'Auto-GPT v0.2.0 早期项目说明（2023）',
        url: 'https://github.com/Significant-Gravitas/AutoGPT/tree/v0.2.0',
      },
    ],
  },
  {
    id: 'langchain',
    year: '2023.04',
    period: '2023 年 · 组件生态扩展',
    label: 'LangChain',
    category: '02 / 组件',
    title: ['从手写脚本，', '到可复用的组件'],
    description:
      'LangChain 把模型、提示词、检索器和工具统一封装。开发者可以组合固定流程，也可以用 AgentExecutor 驱动工具循环。',
    milestone:
      '首个 Python 包发布于 2022.10.24；这里选取 2023.04 的生态发展节点。',
    problem: '换一个模型、数据源或工具，往往要重复编写连接代码。',
    advance: '统一接口与可组合组件，让 Chain 和 Agent 更容易搭建。',
    boundary: '组件复用解决了“怎么接”；复杂循环的控制与状态仍需设计。',
    takeaway: 'LangChain 让“搭一个 Agent”成为组件组合问题。',
    diagram: {
      kind: 'loop',
      title: 'AgentExecutor 组织一次工具循环',
      nodes: [
        ['模型 + 提示词', '决定工具与参数'],
        ['工具适配层', '统一调用接口'],
        ['返回结果', '交给下一轮模型'],
      ],
      support: 'LangChain 提供可复用组件；固定 Chain 与 Agent 循环并存',
      returnLabel: 'AgentExecutor 继续调度，直到得到最终回答',
      caption:
        'LangChain 早已有循环；LangGraph 后续增强的是显式状态与流程控制。',
    },
    note: '先解释“框架把胶水代码做掉了”。然后铺垫：有了工具循环，业务仍会问“这一步必须先查库怎么办”“失败三次怎么转人工”。LangGraph 将针对这类控制需求展开，而不是第一次为 LangChain 引入循环。',
    sources: [
      {
        title: 'LangChain 2023.04 公告：首个版本与生态',
        url: 'https://www.langchain.com/blog/announcing-our-10m-seed-round-led-by-benchmark',
      },
      {
        title: 'LangGraph 公告：Chain、AgentExecutor 与图的区别',
        url: 'https://www.langchain.com/blog/langgraph',
      },
    ],
  },
  {
    id: 'tool-calling',
    year: '2023.06',
    period: '2023.06.13 · Function Calling',
    label: '工具接口',
    category: '03 / 接口',
    title: ['让模型提议，', '让程序执行'],
    description:
      'Function Calling 把工具名和参数变成结构化输出。应用校验这些参数、调用函数，再把结果交还给模型。',
    milestone: 'OpenAI 于 2023.06.13 发布支持函数调用的模型与接口。',
    problem: '从自由文本中解析工具名和参数，容易出错且难以维护。',
    advance: '用工具定义与结构化参数，建立模型和程序之间的调用契约。',
    boundary: '结构化输出仍需校验；执行权限和操作成败由应用负责。',
    takeaway: '工具调用是一份执行请求，真正运行代码的是应用。',
    diagram: {
      kind: 'flow',
      title: '一次结构化工具调用',
      nodes: [
        ['模型', 'search({ query })'],
        ['应用程序', '校验 → 调用工具'],
        ['工具结果', '返回给模型继续处理'],
      ],
      support: '工具定义：名称、描述、参数 Schema',
      caption: '这张图展开一次调用；外层仍可放进 Agent 循环。',
    },
    note: '沿用查资料的例子：模型输出 search 以及 query，应用检查参数并执行搜索。Function Calling 不代表模型直接获得机器权限，也不代表所有参数永远正确。这一层把文本猜测变成较明确的程序接口。',
    sources: [
      {
        title: 'Function calling and other API updates',
        url: 'https://openai.com/index/function-calling-and-other-api-updates/',
      },
    ],
  },
  {
    id: 'data-agents',
    year: '2023.07',
    period: '2023.07.12 · LlamaIndex Data Agents',
    label: '数据与检索',
    category: '04 / 知识',
    title: ['不只查一次，', '还能决定怎样查'],
    description:
      'LlamaIndex 将查询引擎封装为工具。Agent 可以选择数据源、组合查询，再根据返回结果补查资料。',
    milestone:
      'LlamaIndex 发布 Data Agents；这是检索与 Agent 的结合节点，并非 RAG 的诞生。',
    problem: '模型缺少私有和实时资料，单次固定检索也不一定找得到答案。',
    advance: '把文档检索和结构化查询变成工具，由 Agent 决定如何使用。',
    boundary: '检索结果可能不完整；知识索引也不等于会话记忆或执行状态。',
    takeaway: 'RAG 提供知识入口；Agent 决定何时查、查哪里、是否再查。',
    diagram: {
      kind: 'loop',
      title: '把检索放进决策循环',
      nodes: [
        ['选择查询', '根据问题选数据源'],
        ['查询引擎', '文档索引 / 数据库'],
        ['返回证据', '判断是否需要补查'],
      ],
      returnLabel: '证据不足 → 改写问题或更换数据源',
      caption: '简单问题可用固定 RAG；多步查询才需要更复杂的调度。',
    },
    note: '用“比较三家公司的公开资料”举例：固定 RAG 常常先检索再回答；数据 Agent 可以分开查询、比较空缺、再查缺失项。强调这是查询过程的动态决策，不是把向量数据库称为万能记忆。',
    sources: [
      {
        title: 'LlamaIndex：Introducing Data Agents',
        url: 'https://www.llamaindex.ai/blog/data-agents-eed797d7972f',
      },
    ],
  },
  {
    id: 'langsmith',
    year: '2023.07',
    period: '2023.07.18 · LangSmith 公测',
    label: '追踪与评估',
    category: '05 / 观测',
    title: ['看见过程，', '才能定位失败'],
    description:
      'LangSmith 把模型调用、工具结果和执行路径串成 trace，再用测试数据和评估结果比较改动前后的表现。',
    milestone: 'LangSmith 公测将调试、测试、评估与监控纳入 LLM 应用开发流程。',
    problem: '最终答案错了，却不知道是提示词、检索还是工具执行出了问题。',
    advance: '记录每一步输入输出，让问题可复现、修改效果可比较。',
    boundary: 'Trace 负责观察，不能代替调度；评估也依赖样本和评分标准。',
    takeaway: '从“看起来能跑”，走向“知道哪里错、改完是否更好”。',
    diagram: {
      kind: 'flow',
      title: '执行之外，增加一条观察链路',
      nodes: [
        ['一次执行', '模型、工具、结果'],
        ['Trace 记录', '路径、耗时、错误'],
        ['评估与比较', '样本测试、质量反馈'],
      ],
      caption: '这里的箭头表示记录与分析，不是 Agent 的业务控制流。',
    },
    note: '报告编造了一个事实，单看成品无法定位问题。打开 trace，可以区分“资料没有检索到”和“资料有但模型没采用”。再把这个案例放进评估集，避免下一次改提示词时回归。',
    sources: [
      {
        title: 'Announcing LangSmith',
        url: 'https://www.langchain.com/blog/announcing-langsmith',
      },
    ],
  },
  {
    id: 'autogen',
    year: '2023.08',
    period: '2023.08.16 · AutoGen 论文',
    label: '多 Agent 协作',
    category: '06 / 协作',
    title: ['一个执行者，', '变成角色间协作'],
    description:
      'AutoGen 用可对话的 Agent 组织模型、工具与人。不同角色通过消息交换，完成分工、反馈和交接。',
    milestone: 'AutoGen 论文提出以多 Agent 对话构建复杂 LLM 应用的框架。',
    problem: '一个上下文塞入所有职责，提示词与任务处理容易互相干扰。',
    advance: '拆分角色，让执行、审阅与人工参与有明确的消息边界。',
    boundary: '更多 Agent 带来通信成本，也可能互相放大错误；不保证更好。',
    takeaway: '多 Agent 的价值来自有效分工，数量本身不是能力。',
    diagram: {
      kind: 'parallel',
      title: '以报告任务为例：一种协作组织方式',
      nodes: [
        ['协调者', '分派任务、汇总反馈'],
        ['研究角色', '查资料、整理证据'],
        ['审阅角色', '检查引用、提出修订'],
      ],
      caption: '角色以消息交接；这是协作示例，不代表 AutoGen 只有这一种拓扑。',
    },
    note: '先展示研究和审阅两个角色，再讲协调者怎样收回结果。真正收益往往来自角色职责清楚、上下文隔离和独立检查；如果任务很简单，单 Agent 反而更省成本、更容易调试。',
    sources: [
      { title: 'AutoGen 原始论文', url: 'https://arxiv.org/abs/2308.08155' },
    ],
  },
  {
    id: 'langgraph',
    year: '2024.01',
    period: '2024.01.17 · LangGraph 发布',
    label: 'LangGraph',
    category: '07 / 状态与控制',
    title: ['把隐含的循环，', '画成显式的图'],
    description:
      'LangGraph 用节点、边与共享 State 描述执行。哪些步骤必须执行、何时循环、何时退出，都成为可编排的控制逻辑。',
    milestone: 'LangGraph 首次公告重点介绍循环图、StateGraph 和条件边。',
    problem: '通用工具循环难以表达业务约束，也不易控制复杂分支。',
    advance: '节点更新共享状态；条件边根据结果选择工具、重试或结束。',
    boundary: '图只把控制显式化；状态设计、退出条件与工具正确性仍需负责。',
    takeaway: 'LangGraph 的转折：把“下一步怎么办”变成可检查的程序结构。',
    diagram: {
      kind: 'branch',
      title: '一个最小的 LangGraph 工具循环',
      nodes: [
        ['模型节点', '读取状态，生成响应'],
        ['条件路由', '是否包含工具调用？'],
        ['工具节点', '执行并写回结果'],
      ],
      support: '共享 State：消息、工具结果、任务进度',
      returnLabel: '工具结果写回 State → 返回模型节点',
      branchLabel: '无工具调用 → END',
      caption: '到工具节点的边表示“有工具调用”；节点与条件边共同定义控制流。',
    },
    note: '这一章可以多停留。先指 State：它装的是这次执行的消息和进度。模型节点写入响应，条件边检查有没有工具调用；有就执行工具并回到模型，没有就结束。强调 LangChain 以前也能循环，LangGraph 的重点是将状态与控制流显式化。',
    sources: [
      {
        title: 'LangGraph 官方发布文章',
        url: 'https://www.langchain.com/blog/langgraph',
      },
    ],
  },
  {
    id: 'persistence',
    year: '2024.08',
    period: '2024.08.07 · LangGraph v0.2',
    label: '检查点与恢复',
    category: '08 / 持久执行',
    title: ['任务暂停了，', '进度还能接得上'],
    description:
      'Checkpointer 保存执行状态，支持恢复、人工介入和回看。v0.2 将检查点实现拆成专门的库，扩展持久化选项。',
    milestone: 'v0.2 强化检查点生态；持久化与人工介入并非从这一版本才出现。',
    problem: '进程重启、工具失败或等待人工确认，可能让执行上下文丢失。',
    advance: '把状态写入持久存储，暂停后从保存的执行进度继续。',
    boundary: '内存检查点不抗重启；恢复可能重跑步骤，外部操作仍需幂等。',
    takeaway: '持久执行保存的是“做到哪了”，不只是“聊过什么”。',
    diagram: {
      kind: 'flow',
      title: '以持久存储和人工审核为例',
      nodes: [
        ['保存检查点', '执行状态写入数据库'],
        ['暂停 / 中断', '等待确认或处理故障'],
        ['恢复执行', '读取进度，继续节点'],
      ],
      support: '以 thread 标识一次持续执行；状态快照落入持久存储',
      caption:
        '检查点不自动保证外部副作用只执行一次；它也不同于跨任务的长期记忆。',
    },
    note: '报告写好后要等人确认，可能等待一天。把状态保存在数据库，第二天才能接着做。需要补充两点：内存保存器不等于持久存储；恢复时可能重新进入节点，发消息、扣款这类副作用要单独防重复。',
    sources: [
      {
        title: 'LangGraph v0.2：检查点库与持久化',
        url: 'https://www.langchain.com/blog/langgraph-v0-2',
      },
      {
        title: 'LangGraph 持久化文档：检查点、线程与存储',
        url: 'https://docs.langchain.com/oss/python/langgraph/persistence',
      },
    ],
  },
  {
    id: 'mcp',
    year: '2024.11',
    period: '2024.11.25 · MCP 发布',
    label: 'MCP',
    category: '09 / 连接协议',
    title: ['每家单独接，', '变成协议化连接'],
    description:
      'MCP 定义客户端与服务端之间的连接方式，让不同 AI 应用以共同协议访问工具、资源和提示模板。',
    milestone:
      'Anthropic 开源 Model Context Protocol，推动数据与工具连接的标准化。',
    problem: '每个应用都单独对接每个工具，集成代码重复且难复用。',
    advance: '服务端暴露能力，客户端按协议发现与调用，复用连接层。',
    boundary: 'MCP 不负责规划与状态调度，也不会自动解决权限和信任。',
    takeaway: 'Function Calling 描述调用请求；MCP 标准化应用与工具服务的连接。',
    diagram: {
      kind: 'flow',
      title: 'MCP 在架构中的位置',
      nodes: [
        ['AI 应用', 'Host + MCP Client'],
        ['MCP Server', '发现能力、接收请求'],
        ['外部能力', '工具、数据源、资源'],
      ],
      support: 'LangGraph 等执行框架可以在上层编排这些能力',
      caption:
        'MCP 属于连接层，可以与 Function Calling 和 Agent 运行框架组合使用。',
    },
    note: '把工具调用和 MCP 分开讲：模型生成“调用哪个工具”的请求，是一件事；应用怎样和提供工具的服务器交流，是另一件事。MCP 不会因为被接入就让一个聊天应用自动拥有任务规划与持久执行。',
    sources: [
      {
        title: 'Introducing the Model Context Protocol',
        url: 'https://www.anthropic.com/news/model-context-protocol',
      },
    ],
  },
  {
    id: 'deep-agents',
    year: '2025.07',
    period: '2025.07.30 · Deep Agents',
    label: '长任务与上下文',
    category: '10 / 任务组织',
    title: ['任务越来越长，', '上下文需要组织'],
    description:
      'Deep Agents 在工具循环之外组合规划工具、文件系统、子 Agent 和详细指令，让复杂任务有任务清单、工作产物与职责边界。',
    milestone:
      'LangChain 发布 Deep Agents 文章与开源包，总结长任务的组合模式。',
    problem: '长对话越积越多，目标、证据和中间结果挤在一个上下文里。',
    advance: '用计划跟踪进度，用文件保存产物，用子 Agent 隔离子任务。',
    boundary: '任务清单不保证真的推进；文件、子任务结果仍需校验和管理。',
    takeaway: '长任务的关键之一，是决定信息放在哪里、何时进入上下文。',
    diagram: {
      kind: 'parallel',
      title: '围绕主循环组织任务与上下文',
      nodes: [
        ['主 Agent', '计划、委派、整合结果'],
        ['子 Agent', '独立上下文处理子任务'],
        ['文件工作区', '存放证据和中间产物'],
      ],
      support: '详细指令 + 规划工具：持续提示目标、步骤和约束',
      caption:
        '文件用于存取产物，子 Agent 用于委派；二者围绕主 Agent 协同工作。',
    },
    note: '资料一多，不应全部永久塞在消息列表里。把原文和中间报告放到文件，主 Agent 只拿必要摘要；把独立的公司调研委派出去，返回关键证据。这些机制并没有替换最初的工具循环，而是在周围补齐组织能力。',
    sources: [
      {
        title: 'LangChain：Deep Agents',
        url: 'https://www.langchain.com/blog/deep-agents',
      },
    ],
  },
  {
    id: 'skills',
    year: '2025.10',
    period: '2025.10.16 · Agent Skills',
    label: 'Skills',
    category: '11 / 过程知识',
    title: ['所有知识常驻，', '变成按需加载'],
    description:
      'Skills 将操作指令、脚本和资源打包成目录。Agent 先看到简短描述，任务匹配时再读详细步骤和相关文件。',
    milestone:
      'Anthropic 发布 Agent Skills，采用逐层加载的方式组织可复用的专业流程。',
    problem: '把所有专业流程塞进系统提示词，会占用上下文且难以维护。',
    advance: '将过程知识模块化，按任务需要加载指令、脚本与资源。',
    boundary: 'Skill 不是模型微调；内容与脚本仍需可信，执行结果仍要验证。',
    takeaway: '工具告诉 Agent“能做什么”，Skill 补充“这类事该怎样做”。',
    diagram: {
      kind: 'flow',
      title: '渐进式加载：用到哪一层，才展开哪一层',
      nodes: [
        ['名称与描述', '判断是否匹配任务'],
        ['详细指令', '加载具体操作流程'],
        ['脚本与资源', '按需读取或执行'],
      ],
      caption: '图表示信息加载顺序，不是新的模型训练流程。',
    },
    note: '同样能读写文件的 Agent，有没有“如何按公司规范做报告”的操作知识，效果会不同。Skill 把这类步骤装成可维护的包。但不能因为脚本来自 Skill 就跳过权限判断或结果检查。',
    sources: [
      {
        title: 'Equipping agents for the real world with Agent Skills',
        url: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
      },
    ],
  },
  {
    id: 'harness',
    year: '2025.11',
    period: '2025.11.26 · 长任务 Harness 实践',
    label: '运行系统',
    category: '12 / 工程闭环',
    title: ['一次运行成功，', '到持续推进并验证'],
    description:
      'Harness 是围绕模型的执行支撑系统。它组织环境、上下文、进度与验证，让任务跨多个会话继续，留下可检查的工作产物。',
    milestone:
      'Anthropic 分享长时间运行 Agent 的工程实践；Harness 并非此时才被发明。',
    problem: '上下文用尽后，新一轮 Agent 不知道此前做了什么、还差什么。',
    advance: '初始化工作环境，记录明确进度，每轮只推进一部分并验证结果。',
    boundary:
      '稳定性来自执行、状态与评估的共同设计，仍不能保证任意长任务成功。',
    takeaway: '主线落点：让 Agent 能行动、可控制、可恢复，并且可验证。',
    diagram: {
      kind: 'loop',
      title: '跨会话推进任务的一种工程实践',
      nodes: [
        ['读取工作记录', '恢复目标与当前进度'],
        ['增量执行', '完成一个明确步骤'],
        ['验证并记录', '检查产物，保存进度'],
      ],
      support: 'Harness：环境准备、工具、状态、上下文与执行约束',
      returnLabel: '下一会话读取进度 → 继续未完成工作',
      caption: '检查点帮助恢复运行状态；工作记录与产物帮助跨上下文理解任务。',
    },
    note: '最后回到第一章。工具循环让 Agent 能行动，LangGraph 让过程可控制，检查点让执行可恢复，上下文组织与验证让长任务有机会持续推进。架构选择取决于任务复杂度，不需要把每个框架和协议都装进去。',
    sources: [
      {
        title: 'Effective harnesses for long-running agents',
        url: 'https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents',
      },
    ],
  },
];
