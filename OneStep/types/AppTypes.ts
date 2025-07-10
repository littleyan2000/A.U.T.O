/**
 * OneStep 应用类型定义
 * 根据 DATA_MODELS.md v1.2 生成
 */

// 页面类型枚举
export type PageType = 'needs' | 'world' | 'character' | 'plot' | 'rules' | 'style';

// 梯度选项类型
export interface GradientOption {
  level: string;
  label: string;
  description: string;
  value: string;
}

// 用于输出的、带有描述信息的字段类型
export interface DescriptiveProfileField {
  label: string;
  description: string;
  value: string;
}

// 分层选项类型，用于支持二级或多级菜单
export interface HierarchicalOption {
  label: string;
  value: string;
  children?: HierarchicalOption[];
}

// 新增一个可复用的类型
export interface EnrichedPointsAllocationItem {
  label: string;
  points: number;
  description: string;
}

// 点数分配类型
export type PointsAllocation = Record<string, number>;

// 标签选择类型
export type TagSelection = string[];

// 验证错误类型
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// 完成状态类型
export interface CompletionStatus {
  isComplete: boolean;
  completedFields: string[];
  requiredFields: string[];
  optionalFields: string[];
}

// --- UI Schema ---
export interface NestedObjectSchema {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'nested-list' | 'numeric' | 'range' | 'boolean' | 'condition';
  options?: (string | { label: string; value: string })[]; // For select type
  subSchema?: NestedObjectSchema[]; // For 'nested-list' type
  addButtonLabel?: string; // For 'nested-list' type
  helpText?: string;
  controlledBy?: string;
}

// --- 页面数据模型 ---

// 页面1: 玩家需求数据
export type TagPreferences = Record<string, 'like' | 'dislike' | 'neutral'>;

export interface NeedsFormData {
  emotion: BaseModuleState & {
    points: PointsAllocation;
    flavors: Record<string, string>;
  };
  power: BaseModuleState & {
    // 全局关系设定
    objective_spectrum: string;
    dominant_party: string;
    dominant_power_sources_points: PointsAllocation;
    expression_spectrum: string;
    importance_spectrum: string;

    // PC 动态
    pc_dynamics: {
      interaction_strategy: string;
      initial_subjective_state: string;
      target_subjective_state: string;
    };

    // NPC 动态
    npc_dynamics: {
      interaction_strategy: string;
      initial_subjective_state: string;
      target_subjective_state: string;
    };
  };
  narrative: BaseModuleState & {
    world_harmony_spectrum: string;
    npc_compliance_spectrum: string;
    pace_spectrum: string;
    perspective_choice: string;
    perspective_switching_mode: string;
  };
  boundaries: BaseModuleState & {
    consent_tolerance_level: string;
    erotic_level: string;
    erotic_focus: string;
    violence_level: string;
    violence_focus: string;
    description_intensity_spectrum: string;
    tags: TagPreferences;
    consequence_severity_spectrum: string;
  };
  custom_notes: {
    status: 'editing' | 'locked';
    content: string;
    expanded?: boolean;
  };
  disabled: boolean;
  validation: ValidationError[];
}

// 页面2: 世界观数据 (v2 - 模块化)

// A single user-added specific item (e.g., a specific location, event, etc.)
export interface WorldviewSpecificItem {
  id: string; // Unique ID for the item, e.g., uuid
  type: string; // e.g., 'location', 'event'
  name: string; // User-defined name for the item
  description: string; // User-defined description
  isCollapsed?: boolean; // UI state: whether the card is collapsed
  // Future-proofing for more complex fields
  [key: string]: any;
}

// Base state for a configurable module/card
export interface BaseModuleState {
  status: 'editing' | 'locked' | 'disabled';
  randomMode?: 'auto' | 'force' | 'forbid';
  expanded?: boolean;
}

// The state for a single worldview module/card
export interface DpaItem {
  id: string;
  label: string;
  description: string;
  points: number;
  source: 'culture' | 'filter'; // To distinguish between the two lists
}

export interface WorldviewModuleState {
  status: 'editing' | 'locked' | 'disabled';
  randomMode?: 'auto' | 'force' | 'forbid';
  expanded?: boolean;
  macro_selections: Record<string, any>;
  specific_items: WorldviewSpecificItem[];
  dpa_items?: DpaItem[];
  dpa_total_points?: number;
}

// The new state for the entire Worldview page
export interface WorldFormData {
  modules: Record<string, WorldviewModuleState>; // Keyed by module ID e.g., 'geography'
  custom_input: {
    enabled: boolean;
    content: string;
    expanded?: boolean;
    status?: 'editing' | 'locked'; // For consistency
  };
  disabled: boolean; // This is the global disable for the whole page
  validation: ValidationError[];
}

// 页面3: 人物数据 (Refactored)

// 重要角色子卡片数据
export interface KeyCharacterData {
  id: string; // UUID for unique identification
  template_level: string;
  enable_nsfw_attributes: boolean;
  relational_proximity: string;
  social_class: string;
  thematic_role_1: string;
  thematic_role_2: string;
  psychological_profile: {
    openness: string;
    conscientiousness: string;
    extraversion: string;
    agreeableness: string;
    neuroticism: string;
  };
  core_values: {
    care: string;
    fairness: string;
    loyalty: string;
    authority: string;
    sanctity: string;
    liberty: string;
  };
  custom_concept: string; // 自定义核心概念
  isLocked?: boolean; // 是否锁定，锁定后不参与全局随机
  isCollapsed?: boolean; // 是否折叠UI
}

export interface CharacterFormData {
  // 1. 主控角色卡片数据
  pc: BaseModuleState & {
    template_level: string;
    enable_nsfw_attributes: boolean;
    custom_concept: string;
    // --- Migrated from KeyCharacterData ---
    social_class: string;
    psychological_profile: {
      openness: string;
      conscientiousness: string;
      extraversion: string;
      agreeableness: string;
      neuroticism: string;
    };
    core_values: {
      care: string;
      fairness: string;
      loyalty: string;
      authority: string;
      sanctity: string;
      liberty: string;
    };
  };

  // 2. 重要角色管理器卡片数据
  key_characters: BaseModuleState & {
    // 子卡片列表
    list: KeyCharacterData[];
  };

  // 3. 世界人口管理器卡片数据
  world_population: BaseModuleState & {
    // 功能角色模块
    supporting: {
      template_level: string;
      enable_nsfw_attributes: boolean;
      role_focus_counts: PointsAllocation;
      custom_notes: string;
    };
    // 背景角色组模块
    ambient: {
      template_level: string;
      enable_nsfw_attributes: boolean;
      group_counts: PointsAllocation;
      custom_notes: string;
    };
  };

  // 保留顶层 disabled 字段
  disabled: boolean;
  validation: ValidationError[];
}

// 页面4: 剧情数据 (Refactored for dynamic, list-based UI)

// 1. 定义“线性/分支”故事线子卡片的数据结构
export interface LinearArcItem {
  id: string;
  branch_type: string; // 分支路线类型
  pacing_arc: string; // 叙事节奏
  description: string; // 故事线简介
  isCollapsed?: boolean;
  isLocked?: boolean; // 是否锁定，锁定后不参与全局随机
}

// 2. 定义“沙盒”故事线子卡片的数据结构 (v3 - 再次简化)
export interface SandboxElementItem {
  id: string;
  type: string; // 元素类型: '地区', '势力', '种族', '个人'
  description: string; // 自定义文本描述
  isCollapsed?: boolean;
  isLocked?: boolean;
}

// 3. 重构 PlotFormData
export interface PlotFormData {
  // 模块一：叙事基础设定 (保留，并包含模式选择)
  structure: BaseModuleState & {
    mode: '线性/分支叙事' | '沙盒叙事' | ''; // 模式二选一
    driver_points: PointsAllocation; // 全局驱动力
  };

  // 模块二：线性/分支叙事设计 (现在是一个列表管理器)
  narrative_driven: BaseModuleState & {
    focus: string; // 全局核心情节焦点
    list: LinearArcItem[]; // 线性故事线列表
  };

  // 模块三：沙盒叙事设计 (v3)
  sandbox: BaseModuleState & {
    world_tension: string; // 新增：世界张力
    elements: SandboxElementItem[]; // 沙盒元素列表
  };

  // 模块四：自定义条目 (保留)
  custom_notes: BaseModuleState & {
    content: string;
  };

  disabled: boolean;
  validation: ValidationError[];
}

// 页面5: 规则数据
export interface DifficultyOverride {
  target: string;
  difficulty: '容易' | '普通' | '困难' | '极难';
  isCollapsed?: boolean;
}

export interface InitialValueOverride {
  target: string;
  value: number;
  isCollapsed?: boolean;
}

export type ConditionOperator =
  | '>'
  | '<'
  | '>='
  | '<='
  | '=='
  | 'between_inclusive' // min <= value <= max
  | 'between_exclusive' // min <  value <  max
  | 'between_left_inclusive' // min <= value <  max
  | 'between_right_inclusive'; // min <  value <= max

export interface ThresholdCondition {
  operator: ConditionOperator;
  value?: number; // For simple comparisons
  min?: number; // For range comparisons
  max?: number; // For range comparisons
}

export interface ThresholdItem {
  condition: ThresholdCondition;
  effect: string;
  isCollapsed?: boolean;
}

export interface StateTracker {
  name: string;
  scope: string;
  initial_value: { min: number; max: number };
  has_min_value: boolean;
  min_value?: number;
  has_max_value: boolean;
  max_value?: number;
  description: string;
  thresholds: ThresholdItem[];
  difficulty_overrides?: DifficultyOverride[];
  initial_value_overrides?: InitialValueOverride[];
  isCollapsed?: boolean;
}

export interface NarrativeDescriptor {
  name: string;
  type: string;
  scope: string;
  narrative_effect: string;
  isCollapsed?: boolean;
}

export interface CausalTriggerState {
  state_name: string;
  description: string;
  isCollapsed?: boolean;
}

export interface CausalTriggerRule {
  trigger_condition: string;
  consequence: string;
  isCollapsed?: boolean;
}

export interface CausalTrigger {
  system_name: string;
  scope: string;
  core_concept: string;
  states: CausalTriggerState[];
  rules: CausalTriggerRule[];
  isCollapsed?: boolean;
}
export interface RulesFormData {
  trackers: BaseModuleState & { list: StateTracker[] };
  descriptors: BaseModuleState & { list: NarrativeDescriptor[] };
  causal_triggers: BaseModuleState & { list: CausalTrigger[] };
  disabled: boolean;
  validation: ValidationError[];
}

// 新增：用于文风页面的动态场景规则
export interface DynamicRule {
  id: string; // 用于UI渲染的唯一标识
  parentCategory: string | null; // 父菜单选项
  childCategory: string | null; // 子菜单选项
  descriptive_focus_points: PointsAllocation;
  sensory_channels_points: PointsAllocation;
  pacing_dial: string;
  syntax_dial: string;
  vocabulary_dial: string;
  emotion_dial: string;
  adjustments: string; // 自定义输入文本
  isCollapsed: boolean; // 卡片折叠状态
}

// 页面6: 文风数据 (Refactored for Module Cards)
export interface StyleFormData {
  // 模块一: 模式选择
  mode: BaseModuleState & {
    selection: string;
  };
  // 模块二: 核心调整
  adjustments: BaseModuleState & {
    narrator_stance_spectrum: string;
    linguistic_texture_spectrum: string;
    descriptive_focus_points: PointsAllocation;
    rhetorical_strategy_spectrum: string;
    syntactic_rhythm_spectrum: string;
    sensory_channels_points: PointsAllocation;
    custom_notes: string;
  };
  // 模块三: 动态应用规则
  dynamic_rules: BaseModuleState & {
    list: DynamicRule[];
  };
  disabled: boolean; // Top-level disable for the whole page
  validation: ValidationError[];
}

// --- 应用状态数据模型 ---

export interface AppState {
  navigation: {
    currentPage: PageType;
    visitedPages: Set<PageType>;
    pageHistory: PageType[];
    canNavigateBack: boolean;
    canNavigateForward: boolean;
  };
  ui: {
    loading: boolean;
    error: string | null;
    showHelp: boolean;
    expandedSections: Set<string>;
    showWordCountBreakdown: boolean;
    theme: 'light' | 'dark';
    locale: string;
    isDirty: boolean;
    lastSaved: Date | null;
  };
  formData: {
    needs: NeedsFormData;
    world: WorldFormData;
    character: CharacterFormData;
    plot: PlotFormData;
    rules: RulesFormData;
    style: StyleFormData;
  };
  computed: {
    wordCounts: Record<PageType, number>;
    totalWordCount: number;
    validationErrors: ValidationError[];
    completionStatus: Record<PageType, CompletionStatus>;
    completionPercentage: number;
    canGenerate: boolean;
  };
  settings: {
    autoSave: boolean;
    showValidationInRealTime: boolean;
    enableRandomGeneration: boolean;
    wordCountUpdateDelay: number;
  };
}

// --- 输出数据模型 ---
export interface PlayerNeedsProfile {
  emotion: {
    points: EnrichedPointsAllocationItem[];
    flavors: Record<string, DescriptiveProfileField | string>; // 允许旧格式兼容
  };
  power: {
    objective_spectrum: DescriptiveProfileField;
    dominant_party: DescriptiveProfileField;
    dominant_power_sources_points: EnrichedPointsAllocationItem[];
    expression_spectrum: DescriptiveProfileField;
    importance_spectrum: DescriptiveProfileField;
    pc_dynamics: {
      interaction_strategy: DescriptiveProfileField;
      initial_subjective_state: DescriptiveProfileField;
      target_subjective_state: DescriptiveProfileField;
    };
    npc_dynamics: {
      interaction_strategy: DescriptiveProfileField;
      initial_subjective_state: DescriptiveProfileField;
      target_subjective_state: DescriptiveProfileField;
    };
  };
  narrative: {
    world_harmony_spectrum: DescriptiveProfileField;
    npc_compliance_spectrum: DescriptiveProfileField;
    pace_spectrum: DescriptiveProfileField;
    perspective_choice: DescriptiveProfileField;
    perspective_switching_mode: DescriptiveProfileField;
  };
  boundaries: {
    consent_tolerance_level: DescriptiveProfileField;
    erotic_level: DescriptiveProfileField;
    erotic_focus: DescriptiveProfileField;
    violence_level: DescriptiveProfileField;
    violence_focus: DescriptiveProfileField;
    description_intensity_spectrum: DescriptiveProfileField;
    consequence_severity_spectrum: DescriptiveProfileField;
    likes_tags: string[];
    dislikes_tags: string[];
  };
  custom_notes: string;
}
// This type will likely need more refinement in the Formatter stage.
// For now, it reflects the new data structure.
export interface FormattedWorldviewMacro {
  label: string;
  type: string;
  value: string | EnrichedPointsAllocationItem[] | DpaItem[];
  description?: string;
}

export interface FormattedWorldviewModule {
  id: string;
  title: string;
  status: 'editing' | 'locked' | 'disabled';
  macro_selections: FormattedWorldviewMacro[];
  specific_items: WorldviewSpecificItem[];
}

export interface WorldviewProfile {
  modules: Record<string, FormattedWorldviewModule>;
  custom_input: {
    enabled: boolean;
    content: string;
  };
}
export type CharacterProfile = Omit<CharacterFormData, 'disabled' | 'validation'>;
// --- 剧情输出类型 ---

// 格式化后的线性故事线
export interface FormattedLinearArc {
  id: string;
  branch_type: string;
  pacing_arc: string;
  description: string;
}

// 格式化后的沙盒元素
export interface FormattedSandboxElement {
  id: string;
  type: string;
  description: string;
}

export interface PlotProfile {
  structure: {
    mode: '线性/分支叙事' | '沙盒叙事' | '';
  };
  driver_points: EnrichedPointsAllocationItem[];

  // Conditional fields based on mode
  narrative_driven?: {
    focus: string;
    arcs: FormattedLinearArc[];
  };
  sandbox?: {
    world_tension: string;
    elements: FormattedSandboxElement[];
  };

  custom_notes: string;
  modules_status: {
    structure: 'editing' | 'locked' | 'disabled';
    narrative_driven: 'editing' | 'locked' | 'disabled';
    sandbox: 'editing' | 'locked' | 'disabled';
    custom_notes: 'editing' | 'locked' | 'disabled';
  };
}
// --- 新增：用于最终输出的、已格式化的规则书子类型 ---
export interface FormattedStateTracker {
  name: string;
  scope: string;
  type: string; // 替换了 initial_value, has_min_value 等字段
  description: string;
  thresholds: Array<{ condition: string; effect: string }>; // condition 是格式化后的字符串
  difficulty_overrides?: DifficultyOverride[];
  initial_value_overrides?: InitialValueOverride[];
}

export interface RulebookProfile {
  trackers: { list: FormattedStateTracker[] };
  descriptors: { list: NarrativeDescriptor[] };
  causal_triggers: { list: CausalTrigger[] };
}
export interface WritingStyleProfile {
  mode: Omit<StyleFormData['mode'], 'reference_material'>;
  adjustments: StyleFormData['adjustments'];
  dynamic_rules: StyleFormData['dynamic_rules'];
}
export interface FinalOutput {
  PlayerNeeds_Profile: PlayerNeedsProfile;
  Worldview_Profile: WorldviewProfile;
  Character_Profile: CharacterProfile;
  Plot_Profile: PlotProfile;
  Rulebook_Profile: RulebookProfile;
  WritingStyle_Profile: WritingStyleProfile;
}

// --- 数据处理接口 ---
export interface TavernHelperAPI {
  saveVariable(key: string, value: string): Promise<void>;
  loadVariable(key: string): Promise<string | null>;
}
export const STORAGE_KEYS = {
  APP_STATE: 'onestep.app_state',
} as const;
