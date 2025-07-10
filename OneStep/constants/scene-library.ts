/**
 * 动态场景规则的分类库
 * 用于文风页面的第三个卡片
 */

// 为五个情色父分类共享的子分类库
const EROTIC_STAGES = [
  '启动/酝酿阶段 (Initiation/Buildup)',
  '核心/执行阶段 (Core Act/Execution)',
  '高潮/释放阶段 (Climax/Release)',
  '余韵/事后阶段 (Aftermath/Afterglow)',
];

export const DYNAMIC_RULE_LIBRARY: Record<string, string[]> = {
  '行动 (Action)': [
    '冲突/对抗 (Conflict/Confrontation)',
    '作业/执行 (Task/Execution)',
    '移动/过渡 (Movement/Transition)',
  ],
  '互动 (Interaction)': [
    '合作/协同 (Cooperation/Alliance)',
    '说服/协商 (Persuasion/Negotiation)',
    '冲突/争论 (Conflict/Argument)',
  ],
  '内省 (Introspection)': [
    'C1: 思考/分析 (Reflection/Analysis)',
    '感受/体验 (Sensation/Emotion)',
    '回忆/想象 (Memory/Imagination)',
  ],
  '阐述 (Exposition)': ['环境/人物描述 (Description)', '叙事/总结 (Narration/Summary)'],
  '浪漫亲密型情色 (Romantic Intimacy)': EROTIC_STAGES,
  '纯粹肉欲型情色 (Carnal Lust)': EROTIC_STAGES,
  '权力交换型情色 (Power Exchange)': EROTIC_STAGES,
  '强制征服型情色 (Coercive Conquest)': EROTIC_STAGES,
  '禁忌探索型情色 (Taboo Exploration)': EROTIC_STAGES,
};