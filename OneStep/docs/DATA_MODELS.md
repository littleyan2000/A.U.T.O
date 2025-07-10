# OneStep 数据模型文档

## 🎯 数据模型概览

### 数据流向图 (单向数据流)
```mermaid
graph TD
    subgraph "View Layer"
        UI_Events[🖱️ 用户事件 (e.g., input, click)]
    end
    
    subgraph "Controller Layer"
        AppController[⚙️ AppController]
    end

    subgraph "Model Layer"
        AppState[📊 AppState (Single Source of Truth)]
        Managers[🛠️ Managers (Data, Nav, WC)]
        FormattedOutput[📄 Formatted Output]
    end
    
    User[👤 用户] --> UI_Events
    UI_Events --triggers--> AppController
    AppController --updates state via--> Managers
    Managers --mutates--> AppState
    AppState --notifies--> AppController
    AppController --triggers render in--> View[🖥️ UI]
    View --is updated for--> User

    AppController --gets data for--> FormattedOutput
    FormattedOutput --> Tavern[🏰 酒馆/LLM]
```

### 数据层次结构
```
OneStep数据模型
├── 应用级数据 (AppState)
│   ├── 导航状态 (NavigationState)
│   ├── UI状态 (UIState)
│   └── 表单数据 (FormData)
├── 页面级数据 (PageData)
│   ├── 页面1: 玩家需求 (NeedsData)
│   ├── 页面2: 世界观 (WorldData)
│   ├── 页面3: 人物 (CharacterData)
│   ├── 页面4: 剧情 (PlotData)
│   ├── 页面5: 规则 (RulesData)
│   └── 页面6: 文风 (StyleData)
└── 输出数据 (OutputProfiles)
    ├── PlayerNeeds_Profile
    ├── Worldview_Profile
    ├── Character_Profile
    ├── Plot_Profile
    ├── Rulebook_Profile
    └── WritingStyle_Profile
```

---

## 🗂️ 核心数据类型定义

### 基础数据类型
```typescript
// 页面类型枚举
export type PageType = 'needs' | 'world' | 'character' | 'plot' | 'rules' | 'style';

// 梯度选项类型
export interface GradientOption {
  level: string;        // "1/7", "2/7", etc.
  label: string;        // 简短标题
  description: string;  // 详细描述
  value: string;        // 完整的选项文本
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
```

### 应用状态数据模型
```typescript
export interface AppState {
  // 导航状态
  navigation: {
    currentPage: PageType;
    visitedPages: Set<PageType>;
    pageHistory: PageType[];
    canNavigateBack: boolean;
    canNavigateForward: boolean;
  };
  
  // UI状态
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
  
  // 表单数据
  formData: {
    needs: NeedsFormData;
    world: WorldFormData;
    character: CharacterFormData;
    plot: PlotFormData;
    rules: RulesFormData;
    style: StyleFormData;
  };
  
  // 计算状态
  computed: {
    wordCounts: Record<PageType, number>;
    totalWordCount: number;
    validationErrors: ValidationError[];
    completionStatus: Record<PageType, CompletionStatus>;
    completionPercentage: number;
    canGenerate: boolean;
  };
  
  // 用户配置
  settings: {
    autoSave: boolean;
    showValidationInRealTime: boolean;
    enableRandomGeneration: boolean;
    wordCountUpdateDelay: number;
  };
}
```

---

## 📋 页面数据模型详解

### 页面1: 玩家需求数据 (NeedsFormData)
```typescript
export interface NeedsFormData {
  // Needs1: 核心情感调色盘
  emotion: {
    points: {
      '浪漫/亲密关系': number;
      '情欲/性吸引力': number;
      '成就/个人成长': number;
      '慰藉/情感支持': number;
      '惊险/紧张感': number;
      '负面情感宣泄': number;
      '探索/揭示秘密': number;
      '幽默/喜剧性': number;
    };
    flavors: Record<string, string>; // 已选择情感的风味设定
  };
  
  // Needs2: 玩家角色与权力定位
  power: {
    interaction_mode: string;
    objective_spectrum: string;
    pc_subjective_arc: string;
    npc_subjective_arc: string;
    dominant_party: string;
    dominant_power_sources_points: {
      '物理力量': number;
      '社会地位': number;
      '资源控制': number;
      '知识信息': number;
      '情感勒索': number;
      '心理控制': number;
      '潜在威胁': number;
    };
    expression_spectrum: string;
    importance_spectrum: string;
  };
  
  // Needs3: 叙事基调与世界张力
  narrative: {
    world_harmony_spectrum: string;
    npc_compliance_spectrum: string;
    pace_spectrum: string;
    perspective_choice: string;
    perspective_switching_mode: string;
  };
  
  // Needs4: 内容偏好与体验边界
  boundaries: {
    consent_tolerance_level: string;
    erotic_level: string;
    violence_level: string;
    description_intensity_spectrum: string;
    likes_tags: string[];
    dislikes_tags: string[];
    consequence_severity_spectrum: string;
  };
  
  // 自定义条目
  custom_notes: string;
  
  // 页面状态
  disabled: boolean;
  validation: ValidationError[];
}
```

### 页面2: 世界观数据 (WorldFormData)
```typescript
export interface WorldFormData {
  // Worldview1: 世界基础与格局
  basics: {
    scale_level: string;
    laws_choice: string;
    state_choice: string;
    connectivity_level: string;
    custom_notes: string;
  };
  
  // Worldview2: 世界核心属性轴
  axes: {
    technology_axis: {
      max_level: string;
      min_level: string;
      distribution: string;
    };
    supernatural_axis: {
      max_level: string;
      min_level: string;
      distribution: string;
      power_sources: string[];
    };
    order_axis: {
      max_level: string;
      min_level: string;
      distribution: string;
    };
    resource_axis: {
      max_level: string;
      min_level: string;
      distribution: string;
    };
    ethics_axis: {
      max_level: string;
      min_level: string;
      distribution: string;
    };
    mores_axis: {
      max_level: string;
      min_level: string;
      distribution: string;
    };
  };
  
  // Worldview3: 文化肌理与美学
  culture: {
    social_fabric_points: {
      '血缘制': number;
      '封建制': number;
      '神权制': number;
      '身份制': number;
      '公民制': number;
      '行会/辛迪加制': number;
      '公司制': number;
      '英才制': number;
    };
    philosophy_faith_points: {
      '泛神/万物有灵': number;
      '一神论': number;
      '二元论': number;
      '祖先崇拜': number;
      '无神/人本主义': number;
      '功利/实用主义': number;
      '超人类/飞升主义': number;
      '虚无/宿命论': number;
    };
    archetype_selection: string[];
    aesthetic_points: {
      '建筑形态': Record<string, number>;
      '核心材质': Record<string, number>;
      '装饰符号': Record<string, number>;
      '氛围色盘': Record<string, number>;
    };
  };
  
  // 页面状态
  disabled: boolean;
  validation: ValidationError[];
}
```

### 页面3: 人物数据 (CharacterFormData)
```typescript
export interface CharacterFormData {
  // 全局设定
  globals: {
    enable_nsfw_attributes: boolean;
  };
  
  // 主控角色 (PC)
  pc: {
    template_level: string;
    custom_concept: string;
  };
  
  // 重要角色
  key: {
    template_level: string;
    archetype_counts: {
      '情感伴侣/核心关系者': number;
      '宿敌/主要对手': number;
      '导师/引路人': number;
      '被保护者/关键任务物品的人格化': number;
      '神秘盟友/不可预测的变数': number;
    };
    custom_notes: string;
  };
  
  // 功能角色
  supporting: {
    template_level: string;
    role_focus_counts: {
      '任务发布/情节驱动者': number;
      '信息/知识来源': number;
      '派系/组织代表': number;
      '商人/服务提供者': number;
      '次要反派/障碍制造者': number;
    };
    custom_notes: string;
  };
  
  // 背景角色组
  ambient: {
    template_level: string;
    group_counts: {
      '信息提供者 (如：街头巷尾的流言蜚语者、酒馆的常客)': number;
      '服务提供者 (如：集市的摊贩、不同行业的工匠)': number;
      '氛围营造者 (如：吟游诗人、街头孩童、巡礼的信徒)': number;
      '秩序象征者 (如：城市卫兵、神殿守卫、贵族仆从)': number;
      '冲突体现者 (如：贫民窟的帮派、抗议的民众、秘密结社的成员)': number;
    };
    custom_notes: string;
  };
  
  // 页面状态
  disabled: boolean;
  validation: ValidationError[];
}
```

### 页面4: 剧情数据 (PlotFormData)
```typescript
export interface PlotFormData {
  // 叙事结构
  structure: {
    mode: '线性/分支叙事' | '沙盒叙事';
  };
  
  // 线性/分支叙事设计 (当mode为线性时使用)
  narrative_driven: {
    driver: string;
    focus: string;
    branch_route_count: number;
    pacing_arc: string;
    custom_notes: string;
  };
  
  // 沙盒叙事设计 (当mode为沙盒时使用)
  sandbox: {
    driver: string;
    story_arc_counts: {
      '个人路线': number;
      '势力剧情': number;
      '区域剧情': number;
      '种族剧情': number;
    };
    opening_state: string;
    custom_notes: string;
  };
  
  // 页面状态
  disabled: boolean;
  validation: ValidationError[];
}
```

### 页面5: 规则数据 (RulesFormData)
```typescript
export interface RulesFormData {
  // 状态追踪器
  trackers: {
    list: StateTracker[];
  };
  
  // 叙事描述符
  descriptors: {
    list: NarrativeDescriptor[];
  };
  
  // 因果触发器
  causal_triggers: {
    list: CausalTrigger[];
  };
  
  // 页面状态
  disabled: boolean;
  validation: ValidationError[];
}

// 状态追踪器类型
export interface StateTracker {
  name: string;
  type: string;
  scope: string;
  default_difficulty: string;
  description: string;
  thresholds: Array<{
    condition: string;
    effect: string;
  }>;
  difficulty_overrides: Array<{
    target: string;
    difficulty: string;
  }>;
}

// 叙事描述符类型
export interface NarrativeDescriptor {
  name: string;
  type: string;
  scope: string;
  narrative_effect: string;
}

// 因果触发器类型
export interface CausalTrigger {
  system_name: string;
  scope: string;
  core_concept: string;
  states: Array<{
    state_name: string;
    description: string;
  }>;
  rules: Array<{
    trigger_condition: string;
    consequence: string;
  }>;
}
```

### 页面6: 文风数据 (StyleFormData)
```typescript
export interface StyleFormData {
  // 模式选择
  mode: {
    selection: string;
    reference_material: string;
  };
  
  // 核心调整
  adjustments: {
    narrator_stance_spectrum: string;
    linguistic_texture_spectrum: string;
    descriptive_focus_spectrum: string;
    rhetorical_strategy_spectrum: string;
    syntactic_rhythm_spectrum: string;
    sensory_channels_points: {
      '视觉 (Vision)': number;
      '听觉 (Hearing)': number;
      '嗅觉/味觉 (Smell/Taste)': number;
      '触觉/体感 (Touch/Kinaesthetics)': number;
      '性器官/第二性征 (Sex organs/secondary sex characteristics)': number;
      '内在感受/直觉 (Internal Sensation/Intuition)': number;
    };
    custom_notes: string;
  };
  
  // 页面状态
  disabled: boolean;
  validation: ValidationError[];
}
```

---

## 📤 输出数据模型

### 标准输出格式
基于 `参考资料/data_transfer_format.json` 的规范结构：

```typescript
export interface FinalOutput {
  PlayerNeeds_Profile: PlayerNeedsProfile;
  Worldview_Profile: WorldviewProfile;
  Character_Profile: CharacterProfile;
  Plot_Profile: PlotProfile;
  Rulebook_Profile: RulebookProfile;
  WritingStyle_Profile: WritingStyleProfile;
}

// 各Profile类型与FormData对应，但格式化为输出标准
export interface PlayerNeedsProfile {
  needs: {
    emotion: {
      points: Record<string, number>;
      flavors: Record<string, string>;
    };
    power: {
      interaction_mode: string;
      objective_spectrum: string;
      pc_subjective_arc: string;
      npc_subjective_arc: string;
      dominant_party: string;
      dominant_power_sources_points: Record<string, number>;
      expression_spectrum: string;
      importance_spectrum: string;
    };
    narrative: {
      world_harmony_spectrum: string;
      npc_compliance_spectrum: string;
      pace_spectrum: string;
      perspective_choice: string;
      perspective_switching_mode: string;
    };
    boundaries: {
      consent_tolerance_level: string;
      erotic_level: string;
      violence_level: string;
      description_intensity_spectrum: string;
      likes_tags: string[];
      dislikes_tags: string[];
      consequence_severity_spectrum: string;
    };
    custom_notes: string;
  };
}

// 其他Profile类型类似定义...
```

---

## 🔄 数据转换和处理

### 数据验证器
```typescript
export interface DataValidator {
  // 单字段验证
  validateField(field: string, value: any, rules: ValidationRules): ValidationError[];
  
  // 页面级验证
  validatePage(pageType: PageType, data: any): ValidationResult;
  
  // 跨页面验证
  validateCrossDependencies(formData: AppState['formData']): ValidationError[];
  
  // 完整性验证
  validateCompleteness(formData: AppState['formData']): CompletionStatus;
}

export interface ValidationRules {
  required?: boolean;
  type?: 'string' | 'number' | 'array' | 'object';
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
```

### 数据格式化器
```typescript
export interface DataFormatter {
  // 表单数据转换为输出格式
  formatForOutput(formData: AppState['formData']): FinalOutput;
  
  // 输出格式转换为表单数据
  parseFromOutput(output: FinalOutput): AppState['formData'];
  
  // 导出为JSON字符串
  exportToJSON(output: FinalOutput): string;
  
  // 从JSON字符串导入
  importFromJSON(json: string): FinalOutput;
}
```

### 字数计算器
```typescript
export interface WordCountCalculator {
  // 单页面字数计算
  calculatePageWordCount(pageType: PageType, data: any): number;
  
  // 总字数计算
  calculateTotalWordCount(formData: AppState['formData']): number;
  
  // 字数明细
  getWordCountBreakdown(formData: AppState['formData']): WordCountBreakdown;
}

export interface WordCountBreakdown {
  byPage: Record<PageType, number>;
  byCategory: Record<string, number>;
  total: number;
  details: Array<{
    category: string;
    description: string;
    count: number;
    calculation: string;
  }>;
}
```

---

## 💾 数据持久化

### 本地存储策略
```typescript
export interface DataStorage {
  // 保存配置到本地
  saveToLocal(key: string, data: any): Promise<void>;
  
  // 从本地加载配置
  loadFromLocal(key: string): Promise<any | null>;
  
  // 清除本地数据
  clearLocal(key: string): Promise<void>;
  
  // 获取存储大小
  getStorageSize(): Promise<number>;
}

// 存储键名规范
export const STORAGE_KEYS = {
  APP_STATE: 'onestep.app_state',
  FORM_DATA: 'onestep.form_data',
  USER_SETTINGS: 'onestep.user_settings',
  LAST_EXPORT: 'onestep.last_export',
  AUTOSAVE: 'onestep.autosave'
} as const;
```

### 酒馆助手集成
```typescript
export interface TavernIntegration {
  // 保存到酒馆变量
  saveToTavern(data: FinalOutput): Promise<void>;
  
  // 从酒馆变量加载
  loadFromTavern(): Promise<FinalOutput | null>;
  
  // 发送角色卡到酒馆
  sendCharacterCard(output: FinalOutput): Promise<void>;
  
  // 获取酒馆上下文
  getTavernContext(): Promise<TavernContext>;
}

export interface TavernContext {
  characterName: string;
  chatId: string;
  messageId: number;
  userVariables: Record<string, any>;
}
```

---

## 🧪 数据测试和模拟

### 测试数据生成器
```typescript
export interface TestDataGenerator {
  // 生成随机表单数据
  generateRandomFormData(): AppState['formData'];
  
  // 生成特定场景的测试数据
  generateScenarioData(scenario: TestScenario): AppState['formData'];
  
  // 生成边界测试数据
  generateBoundaryTestData(): Array<{
    description: string;
    data: any;
    expectedErrors: string[];
  }>;
}

export type TestScenario = 
  | 'romantic_fantasy'      // 浪漫奇幻
  | 'dark_horror'          // 黑暗恐怖
  | 'epic_adventure'       // 史诗冒险
  | 'slice_of_life'        // 日常生活
  | 'political_intrigue'   // 政治阴谋
  | 'cyberpunk_noir';      // 赛博朋克黑色电影
```

### 数据迁移和版本管理
```typescript
export interface DataMigration {
  // 获取数据版本
  getDataVersion(data: any): string;
  
  // 迁移数据到最新版本
  migrateToLatest(data: any): any;
  
  // 特定版本间迁移
  migrateBetweenVersions(data: any, fromVersion: string, toVersion: string): any;
  
  // 验证迁移结果
  validateMigration(originalData: any, migratedData: any): boolean;
}

export interface DataVersion {
  version: string;
  releaseDate: string;
  changes: string[];
  migrationRequired: boolean;
}
```

---

## 📋 数据模型检查清单

### 设计验证
- [ ] **类型安全**: 所有数据都有明确的TypeScript类型定义
- [ ] **结构一致**: 内部数据模型与输出格式对应关系清晰
- [ ] **验证完整**: 每个字段都有相应的验证规则
- [ ] **扩展性**: 支持未来新增字段和页面
- [ ] **性能考虑**: 大数据对象的处理效率

### 功能验证
- [ ] **数据流畅通**: 从输入到输出的完整数据流
- [ ] **转换准确**: 格式转换不丢失信息
- [ ] **持久化可靠**: 数据保存和加载机制稳定
- [ ] **错误处理**: 异常数据的妥善处理
- [ ] **版本兼容**: 数据格式的向前和向后兼容性

### 用户体验
- [ ] **实时反馈**: 数据变化的即时UI更新
- [ ] **验证提示**: 友好的错误信息展示
- [ ] **自动保存**: 防止数据丢失的机制
- [ ] **导入导出**: 便捷的数据迁移功能
- [ ] **性能优化**: 大表单的流畅操作体验

---

## ✨ 数据模型的可扩展性

本数据模型在设计上具有良好的可扩展性，能够轻松应对未来的功能增加。其核心优势体现在以下几个方面：

*   **接口组合 (Composition over Inheritance)**: `AppState` 的核心 `formData` 是由各个页面的数据接口（如 `NeedsFormData`, `WorldFormData`）组合而成的。这种设计避免了复杂的继承关系，使得每个页面的数据模型都是一个独立的、可管理的单元。当需要添加新页面时，只需定义一个新的数据接口，并将其添加到 `FormData` 类型中即可，完全不会影响现有数据结构。

*   **类型安全 (Type Safety)**: 所有数据模型都使用TypeScript的 `interface` 定义。这为整个应用提供了一个坚实的数据契约。在开发过程中，任何对数据结构的访问或修改都会受到编译器的严格检查，从而在编码阶段就能发现潜在的类型不匹配问题，有效防止了因数据结构变更导致的运行时错误。

*   **数据驱动 (Data-Driven Design)**: 应用的许多部分（如验证、字数统计、UI渲染）都是数据驱动的。这意味着当数据模型扩展后，相关的功能模块只需增加对新数据类型的处理逻辑，而无需重构整个流程。例如，为新页面增加验证规则，只需在 `ValidationManager` 中添加一个新的验证函数即可。

### 范例：如何添加一个新页面

假设我们需要在“文风”之后添加一个新的页面——“环境设定 (Environment)”。通过以下步骤即可在数据层面完成扩展：

1.  **定义新页面的数据接口**:
    在 `AppTypes.ts` 或相关类型文件中，创建一个新的接口 `EnvironmentFormData`。
    ```typescript
    export interface EnvironmentFormData {
      climate_type: string;
      geography_tags: string[];
      flora_fauna_notes: string;
      // ... 其他环境相关字段
    }
    ```

2.  **扩展核心表单数据类型**:
    将新接口添加到 `FormData` 类型中。
    ```typescript
    export interface FormData {
      needs: NeedsFormData;
      world: WorldFormData;
      character: CharacterFormData;
      plot: PlotFormData;
      rules: RulesFormData;
      style: StyleFormData;
      environment: EnvironmentFormData; // 新增页面数据
    }
    ```

3.  **更新页面枚举类型**:
    在 `PageType` 枚举中加入新页面标识。
    ```typescript
    export type PageType = 'needs' | 'world' | 'character' | 'plot' | 'rules' | 'style' | 'environment';
    ```

完成以上三步后，数据模型就已经完全支持新页面了。其他模块（如 `PageBuilder`, `NavigationManager`）可以立即识别并处理 `environment` 页面的数据，这充分展示了该架构的灵活性和可维护性。

这种设计使得数据模型成为一个稳定且可预测的核心，为应用的长期迭代和维护奠定了坚实的基础。

---

*数据模型文档版本: v1.2*
*最后更新: 2025-06-28*