# “人物”页面重构计划 (Character Page Refactor Plan)

**版本:** 1.0
**日期:** 2025-07-05

## 1. 目标 (Goal)

将当前“人物”页面固定的、基于表单的结构，重构为更灵活、可扩展的卡片式结构。此举旨在提升用户体验，允许用户动态创建和管理重要角色（Key Characters），同时统一项目的设计模式，使其与“世界观”和“玩家需求”页面的卡片式设计保持一致。

## 2. 核心设计 (Core Design)

重构后的“人物”页面将由 **3张顶级卡片** 构成，取代原有的四个固定表单区域。

```mermaid
graph TD
    A[人物页面] --> B[主控角色 (PC) 卡片];
    A --> C[重要角色 (Key Characters) 管理器卡片];
    A --> D[世界人口 (World Population) 管理器卡片];

    C --> C1[子卡片: 重要角色1];
    C --> C2[子卡片: 重要角色2];
    C --> C3[...];
    C --> C4[+ 添加重要角色 按钮];

    subgraph "世界人口管理器内部"
        D1[功能角色设定区]
        D2[背景角色组设定区]
    end
    D --> D1 & D2;

    style B fill:#e6f2ff,stroke:#b8d8f8,stroke-width:2px
    style C fill:#e6f2ff,stroke:#b8d8f8,stroke-width:2px
    style D fill:#e6f2ff,stroke:#b8d8f8,stroke-width:2px
    style C1 fill:#f0f8ff,stroke:#d6e8fa,stroke-width:1px
    style C2 fill:#f0f8ff,stroke:#d6e8fa,stroke-width:1px
    style C3 fill:#f0f8ff,stroke:#d6e8fa,stroke-width:1px
```

### 2.1. 主控角色 (PC) 卡片
- **类型**: 具名角色卡 (Named Character Card)。
- **功能**: 定义玩家扮演的唯一角色。
- **内容**: 模板等级、NSFW属性生成、自定义核心概念。
- **实现**: 这将是一张独立的、始终存在的卡片。

### 2.2. 重要角色 (Key Characters) 管理器卡片
- **类型**: 管理器卡片 (Manager Card)。
- **功能**: 统一管理所有与主线剧情紧密相关的非玩家角色 (NPC)。
- **宏观控制**:
    - **默认模板等级**: 为所有新创建的重要角色设定一个默认的复杂等级。
    - **全局NSFW开关**: 控制所有重要角色的NSFW内容生成。
    - **总体关系说明**: 一个文本区域，用于描述这些角色之间的共性或宏观关系。
- **子卡片系统**:
    - 内部包含一个列表，用于动态添加、删除和编辑具体的“重要角色子卡片”。
    - 每个子卡片包含独立的**核心概念**和**原型**（如：爱人、宿敌）设定。

### 2.3. 世界人口 (World Population) 管理器卡片
- **类型**: 管理器卡片 (Manager Card)。
- **功能**: 合并并管理原有的“功能角色”和“背景角色组”，用于批量定义匿名的、按类型和功能划分的角色群体。
- **内部模块**:
    - **功能角色设定区**: 包含模板等级、NSFW开关、以及“主要职能分配”的点数分配器。
    - **背景角色组设定区**: 包含模板等级、NSFW开关、以及“功能群体分配”的点数分配器。
- **注意**: 此卡片内部不包含子卡片系统。

## 3. 数据结构变更 (`AppTypes.ts`)

`CharacterFormData` 接口将被彻底重构，以支持新的卡片式结构。

```typescript
// --- 新的子接口定义 ---

// 重要角色子卡片数据
export interface KeyCharacterData {
  id: string; // UUID for unique identification
  archetype: string; // 原型，如 '宿敌', '爱人'
  custom_concept: string; // 自定义核心概念
  // 其他未来可能需要的独立字段...
}

// --- 新的顶级表单数据接口 ---

export interface CharacterFormData {
  // 1. 主控角色卡片数据
  pc: {
    template_level: string;
    enable_nsfw_attributes: boolean;
    custom_concept: string;
  };

  // 2. 重要角色管理器卡片数据
  key_characters: {
    // 宏观控制
    template_level: string;
    enable_nsfw_attributes: boolean;
    custom_notes: string; // 总体关系说明
    // 子卡片列表
    list: KeyCharacterData[];
  };

  // 3. 世界人口管理器卡片数据
  world_population: {
    // 功能角色模块
    supporting: {
      template_level: string;
      enable_nsfw_attributes: boolean;
      role_focus_counts: Record<string, number>;
      custom_notes: string;
    };
    // 背景角色组模块
    ambient: {
      template_level: string;
      enable_nsfw_attributes: boolean;
      group_counts: Record<string, number>;
      custom_notes: string;
    };
  };

  // 保留顶层 disabled 字段
  disabled: boolean;
}
```

## 4. 实现步骤 (Implementation Steps)

1.  **更新类型定义 (`src/OneStep/types/AppTypes.ts`)**:
    -   用新的 `CharacterFormData` 结构替换旧的定义。
    -   添加 `KeyCharacterData` 接口。

2.  **更新数据管理器 (`src/OneStep/app/DataManager.ts`)**:
    -   修改 `initialState` 中的 `character` 部分，使其符合新的数据结构。

3.  **更新UI构建器 (`src/OneStep/view/PageBuilder.ts`)**:
    -   重写 `buildCharacterPage` 函数。移除旧的 `formSection` 调用。
    -   创建三个新的顶级卡片。可以复用 `buildWorldviewCard` 的逻辑来创建管理器卡片。
    -   为“重要角色”的子卡片创建一个 `buildKeyCharacterCard` 函数，可以大量借鉴 `buildSpecificItemCard` 的实现。

4.  **更新控制器 (`src/OneStep/app/AppController.ts`)**:
    -   添加管理“重要角色”子卡片的方法：`addKeyCharacter`, `deleteKeyCharacter`, `updateKeyCharacter`。
    -   修改 `updateFormData` 以正确处理新数据结构下的路径。
    -   重构 `resetCurrentPageToDefaults` 和 `randomizeCurrentPage` 以适应新结构。

5.  **重构核心逻辑 (Core Logic)**:
    -   **`Formatter.ts` (高优先级)**: 完全重写 `formatCharacterPage` 函数。这是最关键的一步，需要确保新的动态数据结构能被正确地转换成最终的角色卡文本。
    -   **`WordCountManager.ts`**: 更新 `calculateCharacterWordCount` 函数，使其能遍历新的数据结构（特别是 `key_characters.list` 数组）来计算总Token。
    -   **`RandomGenerator.ts`**: 重写 `randomizeCharacterPage`，使其能够随机化PC卡、单个重要角色子卡片以及世界人口卡片中的设置。

6.  **更新选项常量 (`src/OneStep/constants/character-options.ts`)**:
    -   检查并可能重组 `CHARACTER_OPTIONS` 对象，使其逻辑更贴合新的卡片结构。例如，重要角色的原型选项将用于子卡片的下拉菜单。

## 5. 潜在风险与注意事项 (Risks & Considerations)

-   **数据迁移**: 当前项目似乎没有持久化用户数据，但如果未来有，则需要考虑从旧结构到新结构的迁移路径。
-   **格式化逻辑复杂性**: `Formatter.ts` 的重构是整个任务中最复杂且最容易出错的部分，需要投入足够的时间进行设计和测试。
-   **引用一致性**: 必须全局搜索旧的 `character` 数据字段（如 `data.key.archetype_counts`），并将其全部更新为新的访问路径，避免出现运行时错误。