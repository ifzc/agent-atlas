export type PartId = 'all' | 'goal' | 'context' | 'core' | 'memory' | 'retrieval' | 'planner' | 'tools' | 'reflection' | 'guardrails' | 'output';
export type Lesson = {
  title: string; short: string; en: string; part: PartId; color: string;
  description: string; analogy: string;
  steps: { title: string; text: string }[];
  input: string; output: string;
  example: { title: string; lines: string[]; result: string };
  details: { title: string; text: string }[];
  code: string; takeaway: string;
};

export const parts: { id: PartId; label: string; en: string; color: string; lesson: number; position: [number, number, number] }[] = [
  { id: 'goal', label: '目标与输入', en: 'GOAL', color: '#8caeff', lesson: 1, position: [-3.8, 1.9, 0.2] },
  { id: 'context', label: '上下文', en: 'CONTEXT', color: '#8b91ff', lesson: 2, position: [-2, 3.0, -1.5] },
  { id: 'memory', label: '记忆系统', en: 'MEMORY', color: '#b69bff', lesson: 4, position: [1.65, 2.9, -1.5] },
  { id: 'retrieval', label: '知识检索', en: 'RETRIEVAL', color: '#e499dc', lesson: 5, position: [3.85, 1.45, 0] },
  { id: 'planner', label: '任务规划', en: 'PLANNING', color: '#f7c67d', lesson: 6, position: [3.6, -0.95, 0.65] },
  { id: 'tools', label: '工具与执行', en: 'TOOLS', color: '#7dd7b4', lesson: 7, position: [1.5, -2.1, 1.45] },
  { id: 'reflection', label: '观察与反馈', en: 'FEEDBACK', color: '#6ec9e7', lesson: 9, position: [-1.6, -2.05, 1.35] },
  { id: 'output', label: '结果交付', en: 'OUTPUT', color: '#acbed6', lesson: 12, position: [-3.65, -0.9, 0.5] },
];

export const lessons: Lesson[] = [
  {
    title: '一个 Agent，是如何组成的？', short: '整体架构', en: 'THE BIG PICTURE', part: 'all', color: '#b6a0ff',
    description: '把一个复杂任务交给 AI，接下来会发生什么？从中央的模型出发，认识让它能够持续行动的整个系统。',
    analogy: '把 Agent 想象成一位有工作台、笔记本和工具箱的数字协作者。',
    steps: [
      { title: '模型，是决策的核心', text: '大语言模型（LLM）理解任务和当前信息，决定是直接回答、继续查证，还是请求调用工具。模型本身不等于整个 Agent。' },
      { title: '组件，让决策变成行动', text: '上下文提供当下信息，记忆保存有用经验，检索补充知识，工具连接外部环境，运行程序负责真正执行。' },
      { title: '循环，让行动持续推进', text: 'Agent 反复观察结果、更新状态、选择下一步，直到满足目标或触发停止条件。外圈代表始终生效的权限与运行边界。' },
    ], input: '用户目标 + 可用信息 + 执行权限', output: '经过验证的结果或明确的停止原因',
    example: { title: '贯穿全程的例子', lines: ['用户：分析 8 月销售额为什么下降，生成报告草稿。', '约束：只读销售数据，使用已批准的指标口径。', '交付：带数据依据的结论、图表与待确认问题。'], result: '后面的每个章节，都将跟随这个任务走过一个组件。所有数字均为教学示例。' },
    details: [
      { title: 'Agent 与固定工作流', text: '工作流主要由预先编写的路径安排步骤；Agent 将部分下一步决策交给模型。真实系统常混合两种方式，在确定的边界内允许动态决策。' },
      { title: '逻辑架构，不是硬件结构', text: '球体、模块和连线是软件职责的空间隐喻，不表示实际神经网络结构，也不是唯一标准。简单 Agent 可能不需要长期记忆、独立规划器或检索库。' },
      { title: '图中的连接代表什么', text: '连线表示信息可以在组件之间流动，光点帮助理解传递。真实顺序取决于观察结果，并不必然依次经过每个组件。' },
    ], code: 'Agent = 模型 + 上下文 + 工具 + 运行循环\n\n按需扩展：记忆、检索、规划、评估\n贯穿全程：权限、预算、日志、人工介入', takeaway: 'Agent 的关键，是让决策、行动与反馈形成闭环。',
  },
  {
    title: '先把目标说清楚', short: '目标输入', en: 'GOAL & INPUT', part: 'goal', color: '#8caeff',
    description: '输入模块将自然语言需求转成一个可以执行、也可以验收的任务。', analogy: '像接到一份工作简报，先确认要做什么、做到什么程度。',
    steps: [
      { title: '识别任务与交付物', text: '区分“回答一个问题”和“完成一件事”。抽取分析对象、时间范围、输出格式和用户真正关心的问题。' },
      { title: '明确约束和成功标准', text: '识别数据访问范围、只读要求和报告口径。将“分析得好”转为“比较两个月、定位变化来源、列出证据”等可核验条件。' },
      { title: '处理关键缺失信息', text: '如果“销售额”有多个定义，应查已批准的口径或向用户确认。不影响执行的细节可使用明确说明的默认值。' },
    ], input: '自然语言请求、附件、时间范围', output: '结构化目标、约束、验收标准',
    example: { title: '把一句话变成任务约定', lines: ['目标：解释 8 月相对 7 月的销售额变化。', '指标：已支付订单金额，退款按业务口径处理。', '约束：只读数据；生成报告草稿，不自动发送。'], result: '验收标准：差异可以复算，结论附来源，假设与事实分开。' },
    details: [ { title: '输入可以是多模态', text: '除文字外，输入可包括图像、语音、文件和事件。解析后的内容与元数据进入任务状态；多模态模型也可能直接接收图像等内容。' }, { title: '目标不是无限授权', text: '“帮我分析”不自动包含修改数据库、联系客户或发送报告。任务目标与允许执行的动作应分别记录。' } ],
    code: 'task = {\n  goal: "解释 8 月销售额下降",\n  compare: ["7 月", "8 月"],\n  access: "read_only",\n  deliverable: "report_draft"\n}', takeaway: '清晰目标，决定 Agent 是否在解决正确的问题。',
  },
  {
    title: '搭好这一次思考的工作台', short: '上下文', en: 'CONTEXT ASSEMBLY', part: 'context', color: '#8b91ff',
    description: '上下文是模型在一次调用中能看到的信息集合。信息的选择与组织，会直接影响下一步决策。', analogy: '像把需要的文件摊在桌面上，而不是搬来整间档案室。',
    steps: [ { title: '组合指令与任务状态', text: '组合角色规则、用户任务、相关历史和当前进展。不同来源应有清楚的边界，外部文档不能冒充高优先级指令。' }, { title: '加入工具定义和证据', text: '提供可用工具的名称、用途、参数格式和必要的检索结果。尽量去除过时、不相关或重复的信息。' }, { title: '控制上下文预算', text: '上下文窗口有限，必须为输出留空间。可压缩旧对话、保留证据索引，并在需要时重新读取原文。' } ],
    input: '指令、消息历史、证据、工具描述', output: '一次模型调用的有效上下文',
    example: { title: '这一次模型能看到什么', lines: ['工作规则：只允许读取，不修改源数据。', '当前任务：比较 7 月和 8 月的销售额。', '工具说明：query_sales(month, group_by)。', '已有证据：指标定义文档第 3 节。'], result: '模型有了足够的信息，可以判断首先要查询哪些数据。' },
    details: [ { title: '上下文与记忆的区别', text: '记忆是可以保留和检索的信息；上下文是本次实际送入模型的信息。信息存在数据库中，并不表示模型这一次就看到了它。' }, { title: '摘要也可能丢失信息', text: '压缩应保留任务约束、关键决定、未完成事项和来源引用。精确数值不适合仅依靠模糊的文字摘要。' } ],
    code: 'context = [\n  policy, task,\n  relevant_history,\n  retrieved_evidence,\n  available_tools,\n  current_state\n]', takeaway: '模型的决策，依赖这一次真正进入上下文的信息。',
  },
  {
    title: '进入 Agent 的决策核心', short: '模型核心', en: 'LANGUAGE MODEL', part: 'core', color: '#b6a0ff',
    description: '大语言模型将上下文转化为响应或结构化的行动请求。它负责选择，运行程序负责落实。', analogy: '像一位分析师，读完材料后提出下一步行动。',
    steps: [ { title: '理解任务与当前证据', text: '模型根据指令、上下文和训练中学到的模式生成响应。它可以辅助分解问题和比较信息，但不天然掌握实时事实。' }, { title: '选择回答或调用工具', text: '证据足够时生成答案；缺少数据时产生工具调用请求，包含工具名、参数和用于匹配结果的调用标识。' }, { title: '让输出可被系统接收', text: '运行程序解析输出并验证结构。合法 JSON 只是格式正确，不代表参数合理、事实正确或动作已获授权。' } ],
    input: '经过组织的上下文', output: '自然语言响应 / 结构化工具请求',
    example: { title: '核心做出的行动选择', lines: ['当前缺口：还没有两个月的实际销售额。', '选择：请求 query_sales，而不是猜测下降原因。', '参数：7 月与 8 月，按渠道分组。'], result: '这里只展示教学用决策摘要，不代表或读取模型内部的推理过程。' },
    details: [ { title: '模型不是事实数据库', text: '训练知识可能过时，也可能生成看似合理但错误的内容。数字计算、实时查询和关键事实核实通常需要工具与证据。' }, { title: '模型能力与系统能力', text: '更强的模型不能替代错误处理和权限检查。效果还依赖工具质量、上下文组织、验收标准以及运行环境。' } ],
    code: '{\n  "tool": "query_sales",\n  "arguments": {\n    "months": ["07", "08"],\n    "group_by": "channel"\n  }\n}', takeaway: 'LLM 负责生成决策；代码负责验证并执行动作。',
  },
  {
    title: '让有用的信息被记住', short: '记忆系统', en: 'MEMORY SYSTEM', part: 'memory', color: '#b69bff',
    description: '记忆把单次调用连接成持续任务，也能在需要时跨会话保留经确认的信息。', analogy: '短期记忆像工作便签，长期记忆像经过整理的笔记本。',
    steps: [ { title: '短期：保持任务连续', text: '保存消息、已做步骤、工具结果和待办状态。持久化检查点还能帮助系统在中断后恢复。' }, { title: '长期：保留可复用信息', text: '按需保存用户偏好、已确认事实和经验，标记来源、更新时间与作用范围。长期记忆是可选能力。' }, { title: '读取、更新，也要遗忘', text: '记忆需要筛选、去重、纠错与过期处理。过时口径和未证实的推测，不应无限期当作事实使用。' } ],
    input: '任务状态、已确认偏好、有效经验', output: '可恢复状态与相关记忆片段',
    example: { title: '分析任务中的两种记忆', lines: ['短期：已读取 7 月数据，还需查询 8 月。', '长期：用户偏好“先结论、后图表”的报告结构。', '更新：新的指标定义生效后，使旧版本失效。'], result: '记住任务进展不等于模型参数已经被重新训练。' },
    details: [ { title: '记忆的存储形式', text: '可以使用数据库、文件、键值存储或向量索引。选择取决于访问模式；精确状态与权限不宜只靠语义相似检索。' }, { title: '隔离与删除', text: '用户与项目之间需要隔离边界；隐私信息应有保留期限和删除机制。记忆是否可用也取决于访问权限。' } ],
    code: 'state = {\n  completed: ["读取 7 月数据"],\n  next: "读取 8 月数据",\n  evidence_ids: ["sales-jul"]\n}\npreferences.report = "先结论，后图表"', takeaway: '记忆维护连续性，检索让相关记忆进入当前上下文。',
  },
  {
    title: '从知识库中找到证据', short: '知识检索', en: 'RETRIEVAL & RAG', part: 'retrieval', color: '#e499dc',
    description: '检索让 Agent 在回答之前查阅资料。RAG 将检索到的证据放入上下文，再交给模型生成。', analogy: '像回答专业问题前，先打开正确版本的业务手册。',
    steps: [ { title: '把资料变成检索单元', text: '文档可切分为片段，附带标题、来源、日期和权限元数据。向量索引只是检索的一种实现方式。' }, { title: '查找、筛选与排序', text: '根据问题使用关键词、向量或混合搜索；按权限和时效过滤，筛选最相关的证据。' }, { title: '带着来源交给模型', text: '将片段与来源标识一起加入上下文。证据冲突时继续核实；没有证据时，应明确说明缺口。' } ],
    input: '问题 + 获准访问的知识库', output: '相关片段、来源、版本',
    example: { title: '为什么需要先查指标口径', lines: ['查询：销售额指标、退款处理、渠道归属规则。', '命中：《销售指标说明》v3，退款从支付额中扣除。', '引用：metric-v3 / 第 3 节 / 生效月份 7 月。'], result: '统一口径，避免把指标定义变化误认为业务下滑。' },
    details: [ { title: 'RAG 与长期记忆', text: '两者都可能用到检索。RAG 常面向外部知识文档，长期记忆常面向会话经验与用户信息，但它们并非互斥类别。' }, { title: '相似不代表真实', text: '高相似度不保证内容正确、最新或适用于当前问题。还要核对版本、来源与适用范围。' } ],
    code: '查询 → 检索 → 权限过滤 → 重排\n                         ↓\ncontext += {\n  excerpt: "销售额需扣除退款",\n  source: "metric-v3#section-3"\n}', takeaway: '检索提供证据；证据仍需核实并正确引用。',
  },
];

lessons.push(
  {
    title: '把大目标拆成可执行步骤', short: '任务规划', en: 'PLANNING', part: 'planner', color: '#f7c67d',
    description: '规划决定先做什么、依赖什么，以及遇到新信息时如何改变路径。', analogy: '像安排一项项目：先备齐材料，再分析，最后验收。',
    steps: [ { title: '分解目标与依赖', text: '将任务拆成口径确认、数据获取、差异计算、原因核查和报告整理。后一步所需的输入必须先准备好。' }, { title: '选择执行方式', text: '互不依赖的只读查询可并行；依赖前一步结果的动作需顺序执行。简单任务可能一次决策即可完成，无需独立规划器。' }, { title: '根据观察调整计划', text: '某渠道变化异常时，可以增加细分查询。计划要受预算和验收标准限制，不能无限增加任务。' } ],
    input: '目标、可用工具、当前状态', output: '子任务、依赖关系、下一步动作',
    example: { title: '一份可以随证据调整的计划', lines: ['① 确认口径 → ② 查询两个月的渠道销售额。', '③ 计算变化贡献 → ④ 核查异常渠道。', '⑤ 生成图表与报告 → ⑥ 对照来源验收。'], result: '计划只是初始路径，数据返回后可以调整后续查询。' },
    details: [ { title: '规划不等于执行', text: '“计划查询数据库”只是一项意图。必须看到工具调用与成功结果，才能将相应任务标为完成。' }, { title: '多 Agent 是可选拓展', text: '复杂任务可分给不同专长的 Agent，但会增加协调、上下文同步和结果合并成本。应先判断单 Agent 是否足够。' } ],
    code: 'plan = [\n  "确认指标口径",\n  "获取两个月的渠道数据",\n  "计算变化贡献",\n  "核查异常渠道",\n  "生成并验收报告"\n]', takeaway: '好的计划既有依赖顺序，也能根据证据调整。',
  },
  {
    title: '给 Agent 一套明确的工具', short: '工具接口', en: 'TOOL INTERFACE', part: 'tools', color: '#7dd7b4',
    description: '工具把模型的文字世界与数据库、文件、搜索和计算环境连接起来。', analogy: '工具箱中的每件工具，都需要标签、使用方法和边界。',
    steps: [ { title: '描述工具能做什么', text: '定义清晰的名称、用途、参数和结果格式。说明何时适用，以及是否会产生外部副作用。' }, { title: '生成结构化调用', text: '模型选择工具并填写参数，例如月份和分组维度。生成调用不表示模型直接获得了数据库连接或执行权限。' }, { title: '由运行程序核对接口', text: '检查工具是否注册、参数类型和范围是否合法。MCP 等协议可标准化工具连接，但不会自动保证正确性与安全性。' } ],
    input: '工具名称 + 参数', output: '可以交给执行器的调用请求',
    example: { title: 'query_sales 的接口约定', lines: ['用途：读取已批准口径的销售汇总。', '输入：months、group_by；禁止任意写入语句。', '输出：数据、单位、口径版本、来源标识。'], result: '工具提供窄而明确的能力，减少模糊参数和错误操作。' },
    details: [ { title: '工具、技能与协议', text: '工具执行能力；技能或操作指引说明如何组织工作；协议规定客户端与服务端如何交换定义和结果。这些职责可以协作，但并不相同。' }, { title: '返回值也需要设计', text: '除数据外，还要返回失败类型、可否重试和来源标识。超长结果可以提供摘要及可继续读取的分页或文件引用。' } ],
    code: 'query_sales({\n  months: ["07", "08"],\n  group_by: "channel"\n})\n\n→ { rows, unit, metric_version, source_id }', takeaway: '明确的工具接口，帮助 Agent 正确地选择和调用。',
  },
  {
    title: '从请求，到真正执行', short: '动作执行', en: 'ACTION RUNTIME', part: 'tools', color: '#7dd7b4',
    description: '运行程序接管工具请求，在权限范围内执行，处理失败、超时与重复调用。', analogy: '模型提出工单，执行器检查并完成工单。',
    steps: [ { title: '执行前检查', text: '先验证参数与授权，再交给对应工具。代码工具可在受限环境运行，数据库工具应使用适当的访问范围。' }, { title: '管理执行过程', text: '设置超时、并发限制和预算。可安全重试的临时故障，与参数错误、权限不足应采取不同处理方式。' }, { title: '收集真实结果', text: '将数据或错误返回给 Agent。写入动作需考虑幂等性：网络超时不代表动作没有发生，不能盲目重复执行。' } ],
    input: '验证后的工具请求与权限', output: '执行状态、数据或明确错误',
    example: { title: '一次只读查询的执行过程', lines: ['检查：query_sales 已注册，月份和维度有效。', '执行：以只读权限查询销售汇总。', '返回：7 月 100 万元，8 月 88 万元。'], result: '此处为教学模拟，不会连接真实数据库或调用真实模型。' },
    details: [ { title: '错误需要分类', text: '临时网络错误可有限重试；输入错误需修正参数；权限错误需停止或寻求授权；部分成功需记录已经完成的动作。' }, { title: '中断与恢复', text: '保存动作标识、结果和检查点，恢复时避免重复执行。高影响操作还可增加人工确认节点。' } ],
    code: 'validate(call)\nauthorize(call)\nresult = execute(call, timeout=10s)\ncheckpoint(result)\n\n// 仅对可安全重试的临时错误重试', takeaway: '执行的是运行程序，行动意图不等于执行结果。',
  },
  {
    title: '把环境的回应带回来', short: '结果观察', en: 'OBSERVATION', part: 'reflection', color: '#6ec9e7',
    description: '观察模块将工具的返回值整理成下一轮决策可以使用的事实。', analogy: '做完实验后，先看仪器读数，再决定下一步。',
    steps: [ { title: '读取状态与原始结果', text: '确认工具是否成功，检查空结果、分页、截断和部分失败。HTTP 成功并不必然代表业务操作成功。' }, { title: '保留单位与来源', text: '为数值保留币种、时间范围、指标定义与来源。不同口径的数字不能直接相加或比较。' }, { title: '更新任务状态', text: '把观察写回上下文和状态。记录哪些事实已确认、哪些任务完成、哪些问题仍然未知。' } ],
    input: '工具响应、执行日志、环境变化', output: '有来源的观察与更新后的状态',
    example: { title: '先观察，再解释原因', lines: ['总额：100 → 88 万元，变化 −12%。', '线上：60 → 45 万元，变化 −15 万元。', '线下：40 → 43 万元，变化 +3 万元。'], result: '已确认：线上贡献主要降幅。尚未确认：为什么线上下降。' },
    details: [ { title: '观察与推断分开', text: '“线上销售额减少”是数据观察；“因为投放减少”是待证实的解释。系统应保留这两类信息的区别。' }, { title: '外部内容的信任边界', text: '工具结果和网页可能包含恶意指令。它们应作为待处理数据，不应覆盖用户目标或运行权限。' } ],
    code: 'observation = {\n  change: -0.12,\n  online_delta: -15,\n  offline_delta: 3,\n  unit: "万元",\n  cause: "待核实"\n}', takeaway: '观察建立事实，为下一轮决策提供依据。',
  },
  {
    title: '检查结果，再决定下一步', short: '反思校验', en: 'REFLECTION & EVALUATION', part: 'reflection', color: '#6ec9e7',
    description: '校验把当前结果与目标对照，决定继续调查、修正错误，还是完成任务。', analogy: '像交稿前复核数字、证据和题目要求。',
    steps: [ { title: '对照验收标准', text: '检查数据是否覆盖目标范围，计算能否复现，结论是否有证据，报告是否包含所需的交付物。' }, { title: '用外部验证修正错误', text: '用确定性计算复核数值，用原始来源核对事实。模型自评可以辅助发现问题，但不能保证发现所有错误。' }, { title: '继续、修正或停止', text: '缺证据时有针对性地查询；错误时修正；预算耗尽或数据不可得时交付已验证部分，并说明局限。' } ],
    input: '当前结果、证据、验收标准', output: '通过 / 修正 / 继续查询 / 停止',
    example: { title: '不把相关性写成确定因果', lines: ['复算：(88 − 100) ÷ 100 = −12%。', '对账：−15 + 3 = −12 万元。', '证据检查：“广告投放减少”尚无来源支持。'], result: '删除未经证实的因果断言，将其列为待核查假设。' },
    details: [ { title: '评估的两个层次', text: '任务内检查当前结果；系统级评估用代表性任务测量正确性、成本、耗时和失败模式。' }, { title: '反思不是无限循环', text: '设定最大轮数、连续无进展次数和成本上限。追加步骤不能带来实质证据时，应停止并报告限制。' } ],
    code: 'checks = [\n  totals_reconcile,\n  arithmetic_verified,\n  claims_have_sources,\n  deliverable_matches_goal\n]\nif missing_evidence: request_more()', takeaway: '可靠结果来自可核验的证据，而不只是模型自信。',
  },
  {
    title: '让整个循环始终有边界', short: '安全边界', en: 'GUARDRAILS & CONTROL', part: 'guardrails', color: '#94b6cf',
    description: '权限、预算和可观测性贯穿整个过程，决定 Agent 可以做到哪里、何时需要停下。', analogy: '像实验室的门禁、操作规程与记录仪，持续生效。',
    steps: [ { title: '限制允许执行的动作', text: '使用最小必要权限，区分读取与修改；对高影响操作设人工确认。边界应由执行层强制，而不能只写在提示词里。' }, { title: '设定停止与恢复机制', text: '限制调用次数、时长和成本；允许用户取消；中断时保存已完成工作，并报告明确状态。' }, { title: '记录可追溯轨迹', text: '记录动作、参数摘要、结果、错误和证据引用，并注意脱敏。日志帮助定位失败，也支持评估与改进。' } ],
    input: '权限策略、资源预算、任务约束', output: '允许 / 拒绝 / 人工确认 / 停止',
    example: { title: '销售分析的运行边界', lines: ['允许：读取汇总、计算、生成报告草稿。', '未授权：修改订单、自动向客户发送报告。', '达到调用上限：保存结果，说明缺少的证据。'], result: '模型外圈一直存在：这些控制并非最后一步才启用。' },
    details: [ { title: '提示注入防御', text: '隔离可信指令与外部内容、限制工具权限、验证参数，在敏感动作前检查。任何单一措施都不能保证完全消除风险。' }, { title: '可观测不等于暴露一切', text: '记录供审计的决策摘要与实际动作，无需依赖内部推理文本。敏感内容应脱敏或保存在受控位置。' } ],
    code: 'limits = {\n  access: "read_only",\n  max_tool_calls: 12,\n  timeout_seconds: 120,\n  allow_external_send: false\n}\ncheck_before_every_action(limits)', takeaway: '系统边界要由运行程序持续落实。',
  },
  {
    title: '把结果变成可用的交付物', short: '结果交付', en: 'FINAL OUTPUT', part: 'output', color: '#acbed6',
    description: '完成任务不只是生成文本，而是把可用结果、证据与限制交给用户。', analogy: '像交付一份能被复核、继续使用的工作成果。',
    steps: [ { title: '回到原始目标', text: '按要求组织结论、图表、文件或结构化结果。区分已完成、部分完成与条件不足而无法完成的内容。' }, { title: '让结论可追溯', text: '关键数字附来源和口径；区分观察、推断与待确认问题，不把任务过程中的假设包装成事实。' }, { title: '保存成果并结束', text: '确认输出确实生成，保存必要状态。需要外部发布或发送时，必须依据相应授权另行执行。' } ],
    input: '通过校验的事实、计算与分析', output: '报告草稿、来源、局限与建议',
    example: { title: '最终报告草稿 · 教学示例', lines: ['8 月销售额 88 万元，较 7 月下降 12%。', '线上减少 15 万元，线下增长 3 万元。', '线上贡献主要降幅，业务原因尚待核实。', '建议补充流量、转化率、客单价及投放记录。'], result: '可以解释“降在哪里”，证据还不足以断言“为什么下降”。' },
    details: [ { title: '成功状态应当真实', text: '草稿生成不等于已发送；查询成功不等于分析完成。交付状态要与实际执行记录一致。' }, { title: '表达不确定性', text: '说明已验证事实、缺少的证据，以及补充什么信息能进一步回答问题，不编造精确的置信百分比。' } ],
    code: 'deliverable = {\n  status: "draft_ready",\n  verified_change: "-12%",\n  main_contributor: "线上渠道",\n  business_cause: "证据不足",\n  sent: false\n}', takeaway: '高质量交付同时说明结果、依据与未知部分。',
  },
  {
    title: '把所有部件连成一个闭环', short: '完整闭环', en: 'THE AGENT LOOP', part: 'all', color: '#b6a0ff',
    description: '现在回到全景：Agent 的能力，来自这些组件在约束下反复协作。', analogy: '认识了每一个器官，现在观察整个系统如何运转。',
    steps: [ { title: '观察 → 决策 → 行动', text: '读取状态与证据，模型选择下一步，程序验证并执行工具。新的结果变成下一轮观察。' }, { title: '按需调用组件', text: '有时检索，有时计算；有时继续计划，有时调整。记忆与上下文维持连续性，权限与预算始终约束执行。' }, { title: '停止并交付', text: '目标满足、用户取消、权限不足或预算耗尽都可能结束循环。交付实际完成的结果，并说明尚未完成的内容。' } ],
    input: '目标、初始状态、可用能力与边界', output: '可解释的过程和可验证的成果',
    example: { title: '把销售分析走完一遍', lines: ['理解目标 → 查口径 → 获取数据 → 计算差异。', '发现线上异常 → 核查证据 → 修正因果解释。', '整理报告 → 验证来源与数字 → 交付草稿。'], result: '你已认识 14 个关键环节。点击任意模型部件可以回顾。' },
    details: [ { title: 'ReAct 的核心思路', text: 'ReAct 将推理与行动交替组织，利用外部反馈更新后续行动。本动画是这种循环的概念教学，并非某个模型的真实执行轨迹。' }, { title: '从最小系统开始', text: '最小实现可只有模型、少量工具与一个受控循环。任务需要时，再增加长期记忆、复杂规划和多 Agent 协作。' } ],
    code: 'while within_limits():\n  context = assemble(state)\n  decision = model(context)\n  if decision.is_final:\n    return verify_and_deliver(decision)\n  result = authorized_execute(decision.tool)\n  state = update(state, result)', takeaway: '目标驱动，工具行动，证据反馈，边界控制。',
  },
);

export const sources = [
  { label: 'Building Effective Agents', author: 'Anthropic', href: 'https://www.anthropic.com/engineering/building-effective-agents' },
  { label: 'ReAct 原始论文', author: 'Yao et al.', href: 'https://arxiv.org/abs/2210.03629' },
  { label: 'Memory overview', author: 'LangChain', href: 'https://docs.langchain.com/oss/python/concepts/memory' },
];

export const TOTAL_STEPS = lessons.length * 3;
export function clampStep(step: number) { return Math.max(0, Math.min(TOTAL_STEPS - 1, Math.round(step))); }
export function stepPosition(step: number) { const safe = clampStep(step); return { chapter: Math.floor(safe / 3), point: safe % 3 }; }
