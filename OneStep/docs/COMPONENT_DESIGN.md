# A.U.TO OneStep: 组件与视觉设计规范

## 1. 设计哲学：盛世青绿 (Prosperous Azure & Gold)

本设计旨在将中国古典“青绿山水”的华贵、厚重美学，与现代UI设计的清晰、易用原则相结合，创造一种精致、沉浸且富有文化气息的配置体验。

*   **核心意象**: 以宋代王希孟《千里江山图》为灵感，提取其沉稳的石青、石绿色调，辅以泥金点缀，营造一种“盛世”的繁荣与自信。
*   **设计原则**:
    *   **清晰性优先**: 华丽的设计不能以牺牲信息传达的清晰度为代价。
    *   **空间感**: 给予元素充足的“呼吸空间”，避免拥挤，营造从容、大气的版面感。
    *   **质感**: 通过微妙的阴影、边框和色彩层次，赋予扁平化界面以精致的质感。
    *   **一致性**: 所有组件和布局遵循统一的设计语言，确保用户体验的连贯性。

## 2. 配色方案 (Color Palette)

| 角色 (Role) | HEX | 名称 (Name) | 描述 |
| :--- | :--- | :--- | :--- |
| **主背景 (Background)** | `#F7F5F1` | 淡宣纸色 (Parchment) | 温暖、有质感的米白色，为华丽的色彩提供一个内敛的基底。 |
| **主色调 (Primary)** | `#2A4073` | 靛蓝 (Indigo) | 取自“石青”，沉稳、厚重，用于标题、主按钮等关键元素。 |
| **辅助色 (Secondary)** | `#4A6C53` | 松绿 (Pine Green) | 取自“石绿”，与靛蓝形成经典的青绿搭配，用于次要信息、边框。 |
| **点缀色 (Accent)** | `#C0A062` | 鎏金 (Gilded Gold) | 取自“泥金”，用于图标、高亮边框和特殊按钮，体现华贵感而不刺眼。 |
| **文本 (Text)** | `#3D3D3D` | 墨色 (Ink) | 深灰色，确保在米白背景上的最佳可读性。 |
| **表面/卡片 (Surface)** | `#FFFFFF` | 纯白 (White) | 用于表单和卡片背景，与主背景形成微妙对比，突出内容区域。 |
| **禁用/占位符 (Disabled)** | `#B0B0B0` | 浅灰 (Light Grey) | 用于禁用状态和输入框的占位符文本。 |
| **成功 (Success)** | `#5E8C61` | 翠绿 (Jade Green) | 用于成功提示。 |
| **警告 (Warning)** | `#D9A556` | 琥珀 (Amber) | 用于警告信息。 |
| **危险/错误 (Error)** | `#B85C5C` | 胭脂 (Rouge Red) | 用于错误提示和危险操作。 |

## 3. 字体与排版 (Typography)

*   **主字体**: `sans-serif`。优先使用系统默认的无衬线字体，确保在所有平台上的最佳原生体验和可读性。
*   **字重 (Font Weight)**:
    *   `300` (Light): 用于说明性文本。
    *   `400` (Regular): 用于正文和大多数UI元素。
    *   `600` (Semi-bold): 用于标题和需要强调的文本。
*   **字号 (Font Size)**:
    *   **主标题 (h1)**: `28px`
    *   **页面标题 (h2)**: `22px`
    *   **模块标题 (h3)**: `18px`
    *   **正文 (Body)**: `16px`
    *   **辅助文本 (Small)**: `14px`
*   **行高 (Line Height)**: `1.6`，确保大段文本的可读性。

## 4. 布局与间距 (Layout & Spacing)

*   **基础单位**: `8px`。所有间距、边距、填充都应是`8px`的倍数。
*   **核心间距**:
    *   `xs`: `4px` (0.5x)
    *   `s`: `8px` (1x)
    *   `m`: `16px` (2x)
    *   `l`: `24px` (3x)
    *   `xl`: `32px` (4x)
*   **容器圆角 (Border Radius)**: `8px`，营造现代、柔和的视觉感受。
*   **边框 (Borders)**: `1px solid var(--color-secondary)`，使用辅助色松绿，清晰而不突兀。
*   **阴影 (Box Shadow)**:
    *   **标准**: `0 2px 8px rgba(0, 0, 0, 0.08)`，用于卡片和弹出元素，提供微妙的深度。
    *   **交互**: `0 4px 12px rgba(0, 0, 0, 0.12)`，用于鼠标悬浮或激活的元素，提供视觉反馈。

## 5. 核心布局 (Core Layout)

在原子组件之上，应用的核心布局由以下几个主要 `class` 构成，它们定义了页面的宏观结构。

*   `.onestep-container`: 整个应用的根容器，负责设定最大宽度、内边距和整体布局（flex-direction: column）。
*   `.onestep-header`: 顶部区域，包含主标题和字数统计。使用flex布局将两者分布在两端。
*   `.onestep-nav`: 导航栏区域，用于容纳动态生成的页面导航按钮。
*   `.onestep-main`: 主内容区域，用于动态渲染当前子页面的所有表单元素。
*   `.onestep-footer`: 底部区域，用于容纳动态生成的“上一页”、“下一页”和“生成”按钮。

这种结构化的布局确保了各部分职责清晰，并为动态内容的注入提供了稳定的挂载点。

## 6. 组件规范 (Component Specification)

### 5.1 按钮 (Buttons)

*   **主按钮 (Primary)**:
    *   背景: `var(--color-primary)` (靛蓝)
    *   文字: `var(--color-surface)` (纯白)
    *   悬浮: 背景变亮 `10%`，应用交互阴影。
*   **次要按钮 (Secondary)**:
    *   背景: `transparent`
    *   文字: `var(--color-primary)` (靛蓝)
    *   边框: `1px solid var(--color-primary)`
    *   悬浮: 背景变为靛蓝的`10%`不透明度。
*   **特殊按钮 (Accent - 如“随机生成”)**:
    *   背景: `transparent`
    *   文字: `var(--color-accent)` (鎏金)
    *   边框: `1px solid var(--color-accent)`
    *   悬浮: 背景变为鎏金的`10%`不透明度。

### 5.2 输入框 (Inputs) & 文本域 (Textareas)

*   背景: `var(--color-surface)` (纯白)
*   边框: `1px solid var(--color-secondary)` (松绿)
*   文字: `var(--color-text)` (墨色)
*   占位符: `var(--color-disabled)` (浅灰)
*   聚焦 (Focus): 边框颜色变为 `var(--color-primary)` (靛蓝)，并应用 `0 0 0 3px` 的柔和阴影，以提供清晰的视觉反馈。

### 5.3 选择器 (Selects) & 滑块 (Sliders)

*   遵循输入框的基本样式。
*   滑块的轨道为`var(--color-secondary)`，填充部分为`var(--color-primary)`，滑块手柄为`var(--color-primary)`并带有交互阴影。

### 5.4 导航栏 (Navigation)

*   **容器**: 无背景，使用底部边框 `1px solid var(--color-secondary)` 与内容区分。
*   **导航按钮**:
    *   默认: 文字为 `var(--color-text)`。
    *   **当前页面 (Active)**: 文字变为 `var(--color-primary)` (靛蓝) 且字重增加。通过 `::after` 伪元素在底部生成一条占按钮宽度80%、高2px的 `var(--color-accent)` (鎏金) 下划线，提供动态且精致的高亮效果。
    *   悬浮: 文字颜色变为 `var(--color-primary)`。

### 5.5 卡片/模块 (Cards/Modules)

*   背景: `var(--color-surface)` (纯白)
*   圆角: `var(--border-radius)`
*   阴影: `var(--shadow-standard)`
*   内边距: `var(--spacing-l)` (24px)

---
## 7. 设计系统的可扩展性

本设计系统通过以下方式确保了未来的可扩展性：

*   **CSS变量**: 所有核心设计属性（颜色、间距、字体）都通过CSS变量定义。未来若需调整主题，只需修改 `:root` 中的变量值即可全局生效。
*   **BEM命名法**: 组件的CSS类名遵循BEM（Block, Element, Modifier）思想，如 `.btn--primary`。这使得组件样式独立、可复用，易于扩展新的变体而不会污染全局命名空间。
*   **原子化组件**: 组件被设计为可独立使用的“原子”，如按钮、输入框。`ComponentFactory` 可以轻松地组合这些原子组件，构建出更复杂的UI模块，而无需重写样式。

---
*上次更新: 2025-06-28*