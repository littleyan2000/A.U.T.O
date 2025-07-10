/**
 * WritingStyle_Framework.md (v2.0) 的选项常量
 */

export const STYLE_OPTIONS = {
  mode: {
    selection: [
      { level: '', label: '---', description: '请选择生成模式。', value: '' },
      {
        level: '',
        label: '参考文风解析',
        description: '在世界书的"参考文风-内容"中手动粘贴参考语料，AI将分析其特征。',
        value: '参考文风解析',
      },
      {
        level: '',
        label: '参考文风融合',
        description: '粘贴参考文风，并手动微调下方项目，AI将融合两者生成新风格。',
        value: '参考文风融合',
      },
      {
        level: '',
        label: '从零定制合成',
        description: '不提供参考文风，完全通过手动调整下方项目来创造一个新风格。',
        value: '从零定制合成',
      },
    ],
  },
  adjustments: {
    narrator_stance_spectrum: [
      { level: '', label: '---', description: '让AI根据上下文自行判断最合适的叙事者姿态。', value: '' },
      {
        level: '1/5',
        label: '客观疏离的记录者',
        description: '像纪录片一样，只记录事实，不带感情色彩。',
        value: '1/5: 客观疏离的记录者',
      },
      {
        level: '2/5',
        label: '略带讽刺的观察者',
        description: '叙事者带有上帝视角的嘲讽或批判，如《世界奇妙物语》。',
        value: '2/5: 略带讽刺的观察者',
      },
      {
        level: '3/5',
        label: '中立的说书人',
        description: '传统的说书先生，讲述故事但不深入角色内心。',
        value: '3/5: 中立的说书人',
      },
      {
        level: '4/5',
        label: '富有感染力的讲述者',
        description: '叙事者会渲染情绪，引导读者感受，但保持一定距离。',
        value: '4/5: 富有感染力的讲述者',
      },
      {
        level: '5/5',
        label: '主观共情的参与者',
        description: '叙事者完全代入角色内心，体验其喜怒哀乐。',
        value: '5/5: 主观共情的参与者',
      },
    ],
    linguistic_texture_spectrum: [
      { level: '', label: '---', description: '让AI自行决定语言的华丽或朴素程度。', value: '' },
      {
        level: '1/5',
        label: '精炼/文学化',
        description: '用词考究，充满巧思，具有高度的美学价值。',
        value: '1/5: 精炼/文学化',
      },
      {
        level: '2/5',
        label: '标准书面语',
        description: '遵循标准的语法和词汇，清晰、规范。',
        value: '2/5: 标准书面语',
      },
      {
        level: '3/5',
        label: '清晰/功能性',
        description: '语言的主要目的是清晰地传递信息，不追求文采。',
        value: '3/5: 清晰/功能性',
      },
      {
        level: '4/5',
        label: '质朴/生活化',
        description: '使用日常、朴实的语言，贴近生活。',
        value: '4/5: 质朴/生活化',
      },
      {
        level: '5/5',
        label: '粗粝/口语化',
        description: '充满俚语、脏话或不规范语法，真实但粗糙。',
        value: '5/5: 粗粝/口语化',
      },
    ],
    descriptive_focus_points: [
      { id: 'wide_shot', label: '电影式广角/航拍', description: '聚焦于宏大的场景、世界观和整体氛围的构建。' },
      { id: 'environment', label: '环境聚焦', description: '关注角色所处的直接环境、天气、建筑和物品。' },
      { id: 'action', label: '动作/行为导向', description: '镜头紧跟角色的身体，详细描述其一举一动，充满动感。' },
      { id: 'sensory', label: '感官导向', description: '深入角色的五感，详细描写他看到、听到、闻到、尝到、摸到什么。' },
      {
        id: 'monologue',
        label: '内心独白/心理活动',
        description: '深入角色的思想和情绪，展现其内在的思考、感受和挣扎。',
      },
      {
        id: 'close_up',
        label: '细节特写',
        description: '聚焦于物体、角色表情或身体部位的微小细节，既可用于客观展示，也可用于主观表达情感。',
      },
    ],
    rhetorical_strategy_spectrum: [
      { level: '', label: '---', description: '让AI自行决定修辞手法的运用。', value: '' },
      {
        level: '1/5',
        label: '极度克制/白描',
        description: '几乎不使用修辞，语言像一杯白水。',
        value: '1/5: 极度克制/白描',
      },
      {
        level: '2/5',
        label: '功能性修辞',
        description: '只在必要时使用简单的比喻等来帮助读者理解。',
        value: '2/5: 功能性修辞',
      },
      {
        level: '3/5',
        label: '点缀性修辞',
        description: '适度使用修辞来增加文采，但不会喧宾夺主。',
        value: '3/5: 点缀性修辞',
      },
      {
        level: '4/5',
        label: '风格化修辞',
        description: '大量使用某种特定的修辞手法，形成鲜明的个人风格。',
        value: '4/5: 风格化修辞',
      },
      {
        level: '5/5',
        label: '极度华丽/象征主义',
        description: '语言充满复杂的比喻、象征和意象，晦涩但富有诗意。',
        value: '5/5: 极度华丽/象征主义',
      },
    ],
    syntactic_rhythm_spectrum: [
      { level: '', label: '---', description: '让AI自行决定句子的节奏。', value: '' },
      {
        level: '1/5',
        label: '稀疏/快节奏',
        description: '多用短句、断句，营造紧张、急促的阅读感。',
        value: '1/5: 稀疏/快节奏',
      },
      {
        level: '2/5',
        label: '流畅/叙事性',
        description: '句子长度适中，结构清晰，适合平稳地讲述故事。',
        value: '2/5: 流畅/叙事性',
      },
      { level: '3/5', label: '张弛有度', description: '长短句结合，根据情节需要变换节奏。', value: '3/5: 张弛有度' },
      {
        level: '4/5',
        label: '绵密/描写性',
        description: '多用长句和复杂的从句，适合进行细腻的描写。',
        value: '4/5: 绵密/描写性',
      },
      {
        level: '5/5',
        label: '密集/思辨性',
        description: '句子结构复杂，信息密度高，适合进行哲学思辨或心理分析。',
        value: '5/5: 密集/思辨性',
      },
    ],
    sensory_channels_points: [
      { label: '视觉 (Vision)', description: '角色所看到的画面、色彩、光影。' },
      { label: '听觉 (Hearing)', description: '角色所听到的声音、噪音、音乐、对话。' },
      { label: '嗅觉/味觉 (Smell/Taste)', description: '角色闻到的气味和尝到的味道。' },
      { label: '触觉/体感 (Touch/Kinaesthetics)', description: '角色皮肤的触感、温度、身体的动态感受。' },
      { label: '性器官/第二性征', description: '与性相关的身体部位的感受和特征。' },
      { label: '内在感受/直觉', description: '角色的情绪、直觉、生理反应（如心跳、胃痛）。' },
    ],
  },
  dynamic_rule_dials: {
    pacing: [
      { value: '', label: '[ 0] 标准节奏', description: '(默认) 节奏平稳，与故事基调一致。', level: '0' },
      { value: '-1', label: '[-1] 慢速缓行', description: '显著慢于正常节奏，用于营造悬念或沉思氛围。', level: '-1' },
      { value: '-2', label: '[-2] 时间凝滞', description: '极端慢动作，细节被无限放大，时间感近乎停止。', level: '-2' },
      { value: '+1', label: '[+1] 加速推进', description: '节奏明显加快，事件接连发生，紧张感提升。', level: '+1' },
      { value: '+2', label: '[+2] 狂乱冲刺', description: '极度快速，信息量爆炸，时间感被高度压缩。', level: '+2' },
    ],
    syntax: [
      { value: '', label: '[ 0] 标准句式', description: '(默认) 句式多样，长短结合，符合常规叙事。', level: '0' },
      {
        value: '-1',
        label: '[-1] 结构化句式',
        description: '句子结构较完整，逻辑清晰，多使用并列或复合句。',
        level: '-1',
      },
      { value: '-2', label: '[-2] 绵长复句', description: '使用大量从句、修饰语，形成复杂、连贯的长句。', level: '-2' },
      { value: '+1', label: '[+1] 短句为主', description: '多使用简单句和短句，营造利落、干脆的感觉。', level: '+1' },
      {
        value: '+2',
        label: '[+2] 破碎单句',
        description: '大量使用片段、单一名词或动词短语，模拟急促呼吸或混乱思绪。',
        level: '+2',
      },
    ],
    vocabulary: [
      { value: '', label: '[ 0] 标准叙事', description: '(默认) 词汇中性、准确，符合常规叙事。', level: '0' },
      { value: '-1', label: '[-1] 文学/诗意', description: '词汇经过精心雕琢，富有文学性和比喻性。', level: '-1' },
      { value: '-2', label: '[-2] 抽象/哲思', description: '使用高度抽象、概念化、书面化的词汇。', level: '-2' },
      { value: '+1', label: '[+1] 具象/直白', description: '词汇具体、直接，减少修饰，强调事实。', level: '+1' },
      { value: '+2', label: '[+2] 感官/冲击', description: '使用极具冲击力、调动原始感官的词汇。', level: '+2' },
    ],
    emotion: [
      { value: '', label: '[ 0] 标准表达', description: '(默认) 情感表达符合情境和角色性格。', level: '0' },
      { value: '-1', label: '[-1] 克制/压抑', description: '情感被有意识地压制，通过细节间接体现。', level: '-1' },
      {
        value: '-2',
        label: '[-2] 极度内敛',
        description: '情感几乎不通过语言或行为直接流露，完全依赖暗示。',
        level: '-2',
      },
      { value: '+1', label: '[+1] 外放/鲜明', description: '情感通过语言和行为被清晰地表达出来。', level: '+1' },
      { value: '+2', label: '[+2] 极度外放', description: '情感表达夸张、强烈，甚至失去控制。', level: '+2' },
    ],
  },
};
