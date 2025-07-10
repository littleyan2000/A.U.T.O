/**
 * Plot_Framework.md (v2.1) 的选项常量
 */

export const PLOT_OPTIONS = {
  structure: {
    mode: [
      { level: '', label: '---', description: '请选择叙事模式。', value: '' },
      {
        level: '1/2',
        label: '线性/分支叙事',
        description: '故事有明确的开端、发展和结局，玩家将体验一条或多条精心设计的剧情路线。',
        value: '线性/分支叙事',
      },
      {
        level: '2/2',
        label: '沙盒叙事',
        description: '故事没有固定的主线，剧情由玩家在一个充满活力的世界中自由探索、与各种系统互动而涌现。',
        value: '沙盒叙事',
      },
    ],
  },
  narrative_driven: {
    driver: [
      {
        level: '',
        label: '情感与关系',
        description: '故事由角色间的情感联系（爱情、友情、亲情、背叛）驱动。',
        value: '情感与关系',
      },
      {
        level: '',
        label: '秩序与纷争',
        description: '故事由角色与社会规则、组织派系或权力阶层的冲突驱动。',
        value: '秩序与纷争',
      },
      {
        level: '',
        label: '内心与成长',
        description: '故事由角色的内在矛盾、创伤、欲望或自我超越的追求驱动。',
        value: '内心与成长',
      },
      {
        level: '',
        label: '探索与生存',
        description: '故事由角色在未知、危险或严酷的环境中探索奥秘、挣扎求生的行为驱动。',
        value: '探索与生存',
      },
    ],
    focus: [
      { level: '', label: '---', description: '不指定核心情节的宏观焦点。', value: '' },
      {
        level: '',
        label: '世界级矛盾',
        description: '故事围绕影响整个世界的宏大冲突展开，如神魔大战、末日危机。',
        value: '世界级矛盾',
      },
      {
        level: '',
        label: '派系斗争',
        description: '故事聚焦于几个主要组织、国家或家族之间的权力斗争和阴谋。',
        value: '派系斗争',
      },
      {
        level: '',
        label: '重要角色史诗',
        description: '故事是关于一个或多个重要NPC的个人史诗，PC是参与者或见证者。',
        value: '重要角色史诗',
      },
      {
        level: '',
        label: '主控角色目标',
        description: '故事完全围绕PC的个人目标展开，如复仇、寻亲、自我救赎等。',
        value: '主控角色目标',
      },
    ],
    pacing_arc: [
      { level: '', label: '---', description: '不指定叙事节奏，由AI根据上下文决定。', value: '' },
      { level: '', label: '平稳展开', description: '标准三幕剧', value: '平稳展开 (标准三幕剧)' },
      { level: '', label: '高举轻放', description: '悲剧/反思', value: '高举轻放 (悲剧/反思)' },
      { level: '', label: '慢热爆发', description: '史诗感', value: '慢热爆发 (史诗感)' },
      { level: '', label: '持续高能', description: '强刺激', value: '持续高能 (强刺激)' },
    ],
  },
  sandbox: {
    world_tension: [
      { level: '', label: '---', description: '不指定世界张力，由AI根据上下文决定。', value: '' },
      { level: '', label: '平静探索', description: '世界相对和平，鼓励玩家自由探索和发现。', value: '平静探索' },
      {
        level: '',
        label: '暗流涌动',
        description: '表面平静，但各大势力和危机正在酝酿，冲突一触即发。',
        value: '暗流涌动',
      },
      {
        level: '',
        label: '危机四伏',
        description: '世界处于公开的冲突或灾难中，生存和对抗是主题。',
        value: '危机四伏',
      },
      {
        level: '',
        label: '战后余生',
        description: '世界刚经历过一场大灾难，秩序正在重建，机遇与危险并存。',
        value: '战后余生',
      },
    ],
    element_types: [
      { level: '', label: '---', description: '不指定元素类型。', value: '' },
      { level: '', label: '地区', description: '一个具体的地理位置，如城市、森林、废墟等。', value: '地区' },
      { level: '', label: '势力', description: '一个有特定目标的组织，如公会、王国、公司等。', value: '势力' },
      { level: '', label: '种族', description: '一个具有共同生理和文化特征的群体。', value: '种族' },
      { level: '', label: '个人', description: '一个独特的非玩家角色 (NPC)。', value: '个人' },
    ],
  },
};

export const BRANCH_ROUTE_TYPES = [
  { label: '---', description: '不指定故事线类型。', value: '' },
  { label: '角色背景故事线', description: '深入探索某个角色（PC或NPC）的过去。' },
  { label: '特定关系发展线', description: '聚焦于两个或多个角色之间特定关系的发展或破裂。' },
  { label: '秘密/阴谋揭示线', description: '围绕一个秘密、谎言或阴谋的调查与揭露展开。' },
  { label: '世界观/传说探索线', description: '探索世界的某个区域、历史、神话或传说。' },
  { label: '道德困境/抉择线', description: '迫使角色在一个没有完美答案的复杂道德困境中做出选择。' },
  { label: '特殊能力/物品获取线', description: '角色通过一系列挑战，最终获得一项关键能力或一件重要物品。' },
];
