# “世界观”页面重构计划

## 任务概述

重构“世界观”页面，以支持更动态、更模块化的配置体验。新页面将包含12个可启用/禁用的卡片，每个卡片都包含宏观设定和可动态添加的具体条目。

## 任务难度评估

中等偏上。涉及动态UI、组件化开发、数据结构设计和多文件协作。

## 工作规划

### 第一阶段：数据模型与常量定义 (Data Modeling & Constants)

-   **目标**: 定义“世界观”模块的数据结构和常量。
-   **操作文件**:
    -   `src/OneStep/constants/world-options.ts`
    -   `src/OneStep/types/AppTypes.ts`
-   **步骤**:
    1.  在 `world-options.ts` 中创建 `WORLDVIEW_MODULES` 常量数组，定义11个模块的静态数据。
    2.  在 `AppTypes.ts` 中定义 `WorldviewState` 类型，并将其集成到 `AppState` 中。

### 第二阶段：UI组件开发 (UI Component Development)

-   **目标**: 创建渲染页面所需的新UI组件。
-   **操作文件**:
    -   `src/OneStep/view/ComponentFactory.ts`
    -   `src/OneStep/index.scss`
-   **步骤**:
    1.  创建主卡片容器 `createWorldviewCard`。
    2.  创建具体条目卡片 `createSpecificItemCard`。
    3.  在 `index.scss` 中添加必要的组件样式。

### 第三阶段：页面构建 (Page Construction)

-   **目标**: 组装数据和UI组件，形成完整的“世界观”页面。
-   **操作文件**:
    -   `src/OneStep/view/PageBuilder.ts`
-   **步骤**:
    1.  创建 `buildWorldviewPage` 方法。
    2.  遍历 `WORLDVIEW_MODULES`，使用 `ComponentFactory` 创建卡片。
    3.  根据状态渲染卡片内容和已添加的条目。
    4.  创建第12个“自定义输入”卡片。
    5.  在 `buildPage` 方法中集成新页面。

### 第四阶段：状态管理与交互逻辑 (State Management & Interaction Logic)

-   **目标**: 实现用户交互逻辑。
-   **操作文件**:
    -   `src/OneStep/app/AppController.ts`
    -   `src/OneStep/index.ts`
-   **步骤**:
    1.  在 `AppController.ts` 中添加处理世界观页面交互的新方法。
    2.  在 `index.ts` 的 `bindEventListeners` 中为新元素添加事件监听。

### 第五阶段：最终整合与审查 (Final Integration & Review)

-   **目标**: 确保新页面无缝集成到应用中。
-   **操作文件**:
    -   `src/OneStep/app/NavigationManager.ts` (或相关配置)
    -   `src/OneStep/app/Formatter.ts`
-   **步骤**:
    1.  将“世界观”页面加入正确的导航顺序。
    2.  修改 `Formatter.ts` 以支持新的数据结构。
    3.  进行完整的代码审查和功能测试。

### 架构与数据流示意图

```mermaid
graph TD
    subgraph "用户界面 (View)"
        A[用户操作: 点击/输入] --> B{事件监听器<br>(index.ts)};
    end

    subgraph "应用逻辑 (Controller)"
        B --> C[AppController 方法<br>(e.g., addWorldviewSpecificItem)];
    end

    subgraph "数据模型 (Model)"
        C --> D[更新 AppState];
        D -- 触发 --> E[UI 重新渲染];
    end

    subgraph "渲染流程"
        E --> F[PageBuilder.buildWorldviewPage];
        F --> G[ComponentFactory.createWorldviewCard];
        G --> H[渲染到页面];
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#ccf,stroke:#333,stroke-width:2px