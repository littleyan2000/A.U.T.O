import { NestedObjectSchema } from '../types/AppTypes';

const thresholdSchema: NestedObjectSchema = {
  key: 'thresholds',
  label: '阈值效果',
  type: 'nested-list',
  addButtonLabel: '添加阈值',
  helpText: '当数值达到特定条件时，会自动触发的叙事效果。',
  subSchema: [
    { key: 'condition', label: '条件', type: 'condition', helpText: '定义触发效果的条件。' },
    { key: 'effect', label: '效果', type: 'textarea', helpText: '条件满足时，在故事中发生的具体事情。' },
  ],
};

const difficultyOverridesSchema: NestedObjectSchema = {
  key: 'difficulty_overrides',
  label: '难度覆写',
  type: 'nested-list',
  addButtonLabel: '添加难度覆写',
  helpText: '为特定角色或物品设置例外的变化难度。',
  subSchema: [
    { key: 'target', label: '目标', type: 'text', helpText: '需要设置例外规则的具体角色或物品的名称。' },
    {
      key: 'difficulty',
      label: '难度',
      type: 'select',
      options: ['容易', '普通', '困难', '极难'],
      helpText: '这个特定目标的专属变化难度。',
    },
  ],
};

const initialValueOverridesSchema: NestedObjectSchema = {
  key: 'initial_value_overrides',
  label: '初始值覆写',
  type: 'nested-list',
  addButtonLabel: '覆写初始值',
  helpText: '为特定角色或物品设置专属的初始值。',
  subSchema: [
    { key: 'target', label: '目标', type: 'text', helpText: '需要覆写初始值的特定对象名称。' },
    { key: 'value', label: '初始值', type: 'numeric', helpText: '该目标的专属初始值。' },
  ],
};

export const trackerSchema: NestedObjectSchema[] = [
  { key: 'name', label: '名称', type: 'text', helpText: '这个追踪器的名字。示例：“好感度”或“金币”。' },
  {
    key: 'scope',
    label: '适用范围',
    type: 'text',
    helpText: '它适用于哪些角色或事物？示例：“所有重要角色”或“主控角色”。',
  },
  {
    key: 'initial_value',
    label: '初始值范围',
    type: 'range',
    helpText: '设定一个范围[Min, Max]。若Min=Max，则为定值；若Min<Max，则为该范围内的随机值。',
  },
  { key: 'has_min_value', label: '设置下限', type: 'boolean' },
  {
    key: 'min_value',
    label: '下限值',
    type: 'numeric',
    controlledBy: 'has_min_value',
    helpText: '追踪器的最小值。仅在“设置下限”开启时生效。',
  },
  { key: 'has_max_value', label: '设置上限', type: 'boolean' },
  {
    key: 'max_value',
    label: '上限值',
    type: 'numeric',
    controlledBy: 'has_max_value',
    helpText: '追踪器的最大值。仅在“设置上限”开启时生效。',
  },
  { key: 'description', label: '描述', type: 'textarea', helpText: '简要说明这个数值代表什么，以及它通常如何变化。' },
  { ...thresholdSchema },
  { ...difficultyOverridesSchema },
  { ...initialValueOverridesSchema },
];

export const descriptorSchema: NestedObjectSchema[] = [
  { key: 'name', label: '名称', type: 'text', helpText: '这个标签的名字。示例：“过目不忘”或“中毒”。' },
  {
    key: 'type',
    label: '类型',
    type: 'select',
    options: ['能力', '技能', '知识', '特性', '弱点', '身份', '物品特性'],
    helpText: '这个标签属于哪一类？这有助于AI更好地理解其性质。',
  },
  {
    key: 'scope',
    label: '适用范围',
    type: 'text',
    helpText: '哪些角色或事物可以拥有这个标签？示例：“所有矮人”或“圣骑士”。',
  },
  {
    key: 'narrative_effect',
    label: '叙事效果',
    type: 'textarea',
    helpText: '详细描述拥有此标签意味着什么，AI会如何据此推动故事。',
  },
];

export const causalTriggerSchema: NestedObjectSchema[] = [
  { key: 'system_name', label: '系统名称', type: 'text', helpText: '这个微型规则系统的名字。示例：“城市警戒等级”。' },
  {
    key: 'scope',
    label: '适用范围',
    type: 'text',
    helpText: '这个系统具体影响哪个地点或组织？示例：“王都”或“盗贼公会”。',
  },
  { key: 'core_concept', label: '核心概念', type: 'textarea', helpText: '用一句话概括这个系统的作用。' },
  {
    key: 'states',
    label: '状态或阶段',
    type: 'nested-list',
    addButtonLabel: '添加状态',
    helpText: '定义这个系统可能存在的几种不同状态。',
    subSchema: [
      { key: 'state_name', label: '状态名称', type: 'text', helpText: '示例：“等级1: 平静”。' },
      { key: 'description', label: '描述', type: 'textarea', helpText: '当系统处于这个状态时，世界有什么具体表现？' },
    ],
  },
  {
    key: 'rules',
    label: '规则列表',
    type: 'nested-list',
    addButtonLabel: '添加规则',
    helpText: '定义状态之间如何转换的“如果…那么…”规则。',
    subSchema: [
      {
        key: 'trigger_condition',
        label: '触发条件',
        type: 'textarea',
        helpText: '一个具体的事件。示例：“在公共场所发生了谋杀案”。',
      },
      { key: 'consequence', label: '后果', type: 'textarea', helpText: '事件发生后，系统状态如何变化或触发什么效果。' },
    ],
  },
];

export const RULES_SCHEMAS: Record<string, NestedObjectSchema[]> = {
  'trackers.list': trackerSchema,
  'descriptors.list': descriptorSchema,
  'causal_triggers.list': causalTriggerSchema,
  'trackers.list.0.thresholds': thresholdSchema.subSchema!,
  'trackers.list.0.difficulty_overrides': difficultyOverridesSchema.subSchema!,
  'trackers.list.0.initial_value_overrides': initialValueOverridesSchema.subSchema!,
  'causal_triggers.list.0.states': causalTriggerSchema.find(s => s.key === 'states')?.subSchema!,
  'causal_triggers.list.0.rules': causalTriggerSchema.find(s => s.key === 'rules')?.subSchema!,
};

/**
 * Creates a default object based on a given schema.
 * This is recursive and will create nested default objects and empty arrays.
 * @param schema The schema to follow.
 * @returns A new object with default values.
 */
export function createDefaultObject(schema: NestedObjectSchema[]): any {
  const newObject: any = {};
  for (const item of schema) {
    if (item.type === 'nested-list') {
      newObject[item.key] = [];
    } else if (item.type === 'select') {
      const firstOption = item.options?.[0];
      const valueStr = typeof firstOption === 'object' && firstOption !== null ? firstOption.value : firstOption || '';
      if (item.key.startsWith('has_') && ['是', '否'].includes(valueStr)) {
        newObject[item.key] = valueStr === '是';
      } else {
        newObject[item.key] = valueStr;
      }
    } else if (item.type === 'condition') {
      newObject[item.key] = { operator: '>', value: 0 }; // Default condition
    } else if (item.type === 'boolean') {
      newObject[item.key] = false;
    } else if (item.type === 'range') {
      newObject[item.key] = { min: 0, max: 0 };
    } else if (item.type === 'numeric') {
      newObject[item.key] = 0;
    } else {
      newObject[item.key] = ''; // Default for text/textarea
    }
  }
  // Ensure all created objects that can be collapsed are expanded by default.
  newObject.isCollapsed = false;
  return newObject;
}
