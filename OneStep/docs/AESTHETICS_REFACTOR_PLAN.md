# “美学与基调”模块重构计划

## 1. 任务概述

根据用户反馈，需要将“美学与基调”卡片中的“基石文化”和“美学/类型滤镜”从简单的下拉菜单重构为一个复杂的、动态的、可分配点数的列表组件。

### **核心需求：**

1.  **层级选择**：每个选项（基石文化、美学滤镜）都包含父菜单和子菜单。
2.  **动态添加**：用户选择父/子菜单后，点击“添加”按钮，将一个新条目加入列表。
3.  **点数分配**：所有从“基石文化”和“美学滤镜”添加的条目，共享一个10点的点数池。用户可以在每个条目上独立分配点数。
4.  **数据驱动**：组件需要由一个详细的、包含描述信息的层级化数据结构来驱动。

---

## 2. 任务分析与评估

这是一个**高复杂度**的任务，主要挑战在于：

*   **组件复杂性**：新组件涉及多种UI元素和交互，状态管理复杂。
*   **状态同步**：需要确保UI与应用内部数据状态的实时、精确同步。
*   **代码增量**：需要编写大量新的 TS 逻辑、HTML 渲染代码和 SCSS 样式。

---

## 3. 执行计划

将任务分为四个主要阶段：

### **第一阶段：数据结构化**

**目标**：将用户提供的文本内容转换为程序可用的数据结构。

1.  **创建新数据文件**：在 `src/OneStep/constants/` 目录下创建 `culture-options.ts` 文件。
2.  **定义数据格式**：将“基石文化”数据整理成层级化的 TypeScript 结构。

    ```typescript
    // src/OneStep/constants/culture-options.ts
    export interface CultureChild {
      id: string;
      label: string;
      description: string;
    }

    export interface CultureParent {
      id: string;
      label: string;
      description: string;
      children: CultureChild[];
    }

    export const CULTURAL_ARCHETYPE_HIERARCHY: CultureParent[] = [
      // ... 填充所有“基石文化”数据
    ];
    ```
3.  **美学滤镜占位**：在同一文件中为“美学/类型滤镜”创建类似的空数据结构，以便后续填充。

### **第二阶段：核心逻辑与状态管理重构**

**目标**：调整应用核心数据模型和控制器以支持新功能。

1.  **更新类型定义** (在 `src/OneStep/types/AppTypes.ts`):
    *   修改 `WorldviewFormData` 接口，移除旧的 `cultural_archetype` 和 `aesthetic_filter` 字段。
    *   添加新字段：`dpa_items: { id: string; label: string; description: string; points: number }[]`。

2.  **更新控制器** (在 `src/OneStep/app/AppController.ts`):
    *   实现新的方法来管理 `dpa_items` 数组：
        *   `addDpaItem(item)`: 添加新条目。
        *   `removeDpaItem(itemId)`: 移除条目。
        *   `updateDpaItemPoints(itemId, amount)`: 更新点数，并校验总点数上限（10点）。

### **第三阶段：开发新的UI组件**

**目标**：构建“动态点数分配器” (Dynamic Points Allocator) UI组件。

1.  **组件设计 (Mermaid 图)**:

    ```mermaid
    graph TD
        subgraph Dynamic Points Allocator
            A[Header: "基石文化与美学滤镜 (已用 X / 10 点)"]
            subgraph Controls
                B(父菜单: 基石文化/美学滤镜) --> C{子菜单: 具体时代/类型};
                C --> D[添加按钮];
            end
            subgraph Item List
                E[条目1: 秦汉帝国]
                F[条目2: 维多利亚时代]
                G[...]
            end
        end

        subgraph Item Card
            H[标签: 秦汉帝国]
            I[描述: 一个建立了中央集权...]
            J(点数控制器: [-] [2] [+])
            K(删除按钮: [x])
        end

        A --> Controls;
        A --> Item List;
        Item List --> E;
        Item List --> F;
        E --> Item Card;
    ```

2.  **创建渲染逻辑** (在 `src/OneStep/view/PageBuilder.ts`):
    *   创建新函数 `buildDynamicPointsAllocator()`，根据数据和状态动态生成HTML。
    *   实现父/子菜单的联动逻辑。

3.  **添加样式** (在 `src/OneStep/index.scss`):
    *   为新组件（如 `.dynamic-points-allocator`, `.dpa-item` 等）添加 SCSS 样式。

4.  **绑定事件** (在 `src/OneStep/index.ts`):
    *   在 `bindEventListeners` 中为新组件的所有交互元素（菜单、按钮）添加事件监听器。

### **第四阶段：集成与替换**

**目标**：将旧组件替换为新组件。

1.  **修改模块定义** (在 `src/OneStep/constants/world-options.ts`):
    *   在 `WORLDVIEW_MODULES` 数组中，找到 `id: 'aesthetics'` 的模块。
    *   将其 `macroOptions` 替换为一个新的对象，类型设置为 `'dynamic_points_allocator'`，并传入所需的数据源。
