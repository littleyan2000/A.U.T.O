# OneStep 输出格式规范 (v2.0 详细版)

本文档旨在详尽解释 A.U.T.O OneStep 配置器在用户点击“生成角色卡”后，所生成的最终文本（Prompt）中每一行内容的具体含义。这不仅是数据结构的说明，更是对每个配置项如何转化为给AI的具体叙事指令的深度解析。

## 1. 总体流程回顾

最终的文本是通过 `Formatter.ts` 中的 `formatAsPrompt` 方法生成的。它遵循一个核心逻辑：

1.  **数据转换**: 将应用内部的表单数据（`FormData`）转换为一个经过丰富和格式化的标准输出对象（`FinalOutput`）。
2.  **文本化**: 将 `FinalOutput` 对象逐层解析，转换成一个带有Markdown格式、人类可读的文本字符串。
3.  **过滤空值**: 在文本化过程中，任何未被用户配置的、无效的或空的内容都将被忽略，以确保最终输出的简洁和高效。

## 2. 输出文本结构

最终生成的文本由一个引导语、六个核心配置章节和一个结束语构成。结构如下：

```text
请根据以下要求，结合 Reference_Materials 中的参考资料（如有），和 WritingStyle_Reference 中的参考文风（如有），生成一个文本互动叙事游戏设定。设定详情如下：

--- 核心需求 (Player Needs) ---
(PlayerNeeds_Profile 的内容)

--- 世界观 (Worldview) ---
(Worldview_Profile 的内容)

--- 角色 (Characters) ---
(Character_Profile 的内容)

--- 剧情 (Plot) ---
(Plot_Profile 的内容)

--- 规则 (Rules) ---
(Rulebook_Profile 的内容)

--- 写作风格 (Writing Style) ---
(WritingStyle_Profile 的内容)

--- 结束 ---
请基于以上所有信息，和对应的 *_Template 中的格式和说明要求，创造性地撰写设定；但以上信息中置空的部分请不要生成对应设定。
```

## 3. 各章节内容详解

### 3.1 `--- 核心需求 (Player Needs) ---`

本章节定义了玩家希望在叙事中获得的核心情感体验和互动边界。所有内容均源自 `PlayerNeeds_Framework.md`。

-   **Emotion**:
    -   `Points`: 一个JSON对象，展示了玩家对不同情感（如“浪漫”、“惊险”）的权重分配。这直接告诉AI哪些情感元素应该在故事中更频繁或更强烈地出现。
    -   `Flavors`: 一个JSON对象，为上面分配了点数的情感提供更具体的“风味”。例如，`"浪漫/亲密关系": "4/7: 甜虐均衡: 甜蜜与痛苦深刻交织。"`，这指令AI在设计浪漫情节时，应采用甜虐交织的模式。
-   **Power**:
    -   `Interaction Mode`: 定义了玩家与AI的互动模式，是传统的玩家主导（AI不代写PC）还是AI主导（AI撰写完整故事）。
    -   `Objective Spectrum`: 定义了在私人关系中，玩家角色的客观权力地位（支配或顺从）。
    -   `Pc Subjective Arc` / `Npc Subjective Arc`: 定义了关系双方对上述权力关系的主观感受变化曲线（如从抗拒到享受），这是制造情感张力的核心指令。
    -   `Dominant Party`: 明确了关系中的主要支配方是PC、NPC、动态交换还是外部环境。
    -   `Dominant Power Sources Points`: 一个JSON对象，详细说明了支配方权力的具体来源（如物理力量、社会地位、情感勒索等），指导AI如何具体表现权力关系。
    -   `Expression Spectrum`: 定义了权力是被公开宣告还是秘而不宣。
    -   `Importance Spectrum`: 定义了玩家的行动对世界走向的影响力大小，从“历史尘埃”到“天选之子”。
-   **Narrative**:
    -   `World Harmony Spectrum`: 定义了世界规则本身是倾向于帮助玩家还是阻碍玩家。
    -   `Npc Compliance Spectrum`: 定义了关键NPC的自主意志强度，他们是倾向于配合还是对抗玩家。
    -   `Pace Spectrum`: 定义了故事关键事件的发生频率和整体节奏。
    -   `Perspective Choice` / `Perspective Switching Mode`: 定义了故事的叙事视角（第一/第二/第三人称）以及是否切换。
-   **Boundaries**:
    -   `Consent Tolerance Level`: 设定了故事中可发生的违背玩家角色意愿行为的程度。
    -   `Erotic Level` / `Violence Level`: 分别定义了亲密内容和冲突内容的**行为许可上限**。
    -   `Erotic Focus` / `Violence Focus`: 分别定义了亲密内容和冲突内容的**主题倾向性**，即故事对这类内容的热衷程度。
    -   `Description Intensity Spectrum`: **极为关键**，它控制了对上述许可行为的**文本描写直白程度**，从“拉灯”到“临床级详尽”。
    -   `Likes Tags` / `Dislikes Tags`: 两个JSON数组，明确列出了玩家喜爱和绝对禁忌的特定内容标签。`Dislikes`是AI绝不可逾越的红线。
    -   `Consequence Severity Spectrum`: 定义了玩家做出错误选择后，可能面临的负面后果的严重程度。
-   **Custom Notes**: 玩家填写的任何额外、自定义的需求。

### 3.2 `--- 世界观 (Worldview) ---`

本章节构建了故事发生的舞台。所有内容均源自 `Worldview_Framework.md`。

-   **Basics**:
    -   `Scale Level`: 定义故事舞台的物理范围（如城市、国家、星系）。
    -   `Laws Choice`: 定义世界运转的根本法则（如唯物主义、神意论）。
    -   `State Choice`: 定义世界所处的宏观历史阶段（如黄金纪元、末日之后）。
    -   `Connectivity Level`: 定义世界与“外界”的联系程度。
-   **Axes**: 定义了世界的六大核心属性，每个属性都由最高、最低水平和分布状态构成，以此制造内部张力。
    -   `Technology Axis` / `Supernatural Axis` / `Order Axis` / `Resource Axis` / `Ethics Axis` / `Mores Axis`: 每个轴的 `max_level` 和 `min_level` 都被转换为完整的描述性字符串，`distribution` 则说明了这种高低差异是如何在社会中体现的（如按阶级分布、按地域分布）。
    -   `Power Sources Points`: 对于超自然力量轴，这里会有一个JSON对象说明其力量的具体来源构成。
-   **Culture**:
    -   `Social Fabric Points` / `Philosophy Faith Points` / `Aesthetic Points`: 这些字段都被转换为**JSON对象数组**，每个对象都包含了选项的标签、分配的点数和详细描述，清晰地展示了社会结构、主流思想和美学构成的权重。
    -   `Archetype Selection`: 一个JSON数组，列出了作为世界文化基石的现实世界参照蓝本（如“华夏文明 - 隋唐”）和对其进行改造的美学/类型滤镜（如“赛博朋克”）。
-   **Custom Notes**: 玩家对世界观的自定义要求。

### 3.3 `--- 角色 (Characters) ---`

本章节定义了故事中出场的角色类型和复杂度。所有内容均源自 `Character_Framework.md`。

-   **Globals**:
    -   `Enable Nsfw Attributes`: 一个布尔值，决定是否为所有角色生成详细的NSFW（成人内容）设定模块。
-   **Pc (主控角色)** / **Key (重要角色)** / **Supporting (功能角色)** / **Ambient (背景角色组)**:
    -   `Template Level`: 每个角色层级的该字段都定义了其背景设定的初始深度和复杂度，从“核心概念”到“完整卷宗”。
    -   `Archetype Counts` / `Role Focus Counts` / `Group Counts`: 这些JSON对象展示了需要生成的各类角色的具体数量。
    -   `Custom Notes`: 玩家对该层级角色的自定义要求。

### 3.4 `--- 剧情 (Plot) ---`

本章节定义了故事的叙事结构。所有内容均源自 `Plot_Framework.md`。

-   **Structure**:
    -   `Mode`: 关键选项，决定了故事是“线性/分支叙事”还是“沙盒叙事”。
-   **Driver Points**: 一个JSON对象数组，展示了故事核心驱动力的权重分配（如情感、纷争、成长、探索）。
-   **Narrative Driven** (若模式为线性/分支):
    -   `Focus`: 定义主线剧情的核心焦点。
    -   `Branch Route Counts`: JSON对象数组，说明需要生成的各类分支剧情线的数量。
    -   `Pacing Arc`: 定义故事整体的节奏变化曲线。
-   **Sandbox** (若模式为沙盒):
    -   `Story Arc Counts`: JSON对象数组，说明沙盒世界中蕴含的各类故事线资源数量。
    -   `Opening State`: 定义玩家进入沙盒世界时的初始环境是“相对平静”还是“已然危机”。
-   **Custom Notes**: 玩家对剧情的自定义要求。

### 3.5 `--- 规则 (Rules) ---`

本章节定义了世界的“物理法则”和“因果逻辑”。所有内容均源自 `Rulebook_Framework.md`。

-   **Trackers**: 一个对象数组，每个对象是一个“状态追踪器”（如好感度、生命值）。
    -   `Type`: 一个描述性字符串，由UI中的多个选项（初始值、有无上限等）合并而成，清晰说明了该追踪器的性质。
    -   `Thresholds`: 一个对象数组，其中的 `condition` 字段被格式化为人类可读的字符串（如 `"值 >= 70"`），并与 `effect`（效果）配对，构成完整的阈值规则。
-   **Descriptors**: 一个对象数组，定义了赋予角色或物品的非数值化“标签”（如“过目不忘”），这些是AI进行逻辑判断的锚点。
-   **Causal Triggers**: 一个对象数组，定义了更复杂的、拥有独立状态和规则的“微型系统”（如“瘟疫蔓延系统”）。

### 3.6 `--- 写作风格 (Writing Style) ---`

本章节定义了AI在叙事时应采用的文风。所有内容均源自 `WritingStyle_Framework.md`。

-   **Mode**:
    -   `Selection`: 定义了文风的生成模式（解析、融合或从零合成）。
    -   `Reference Material`: 玩家粘贴的参考文风文本。
-   **Adjustments**:
    -   `Narrator Stance Spectrum` / `Linguistic Texture Spectrum` / etc.: 这一系列光谱选项，其值都被转换为完整的描述性字符串，用于微调叙事者的情感距离、用词的华丽或朴素程度、描写的宏观或微观、修辞手法的运用程度以及句法节奏。
    -   `Sensory Channels Points`: 一个JSON对象，展示了叙事中最常被调用的感官通道的权重，决定了AI在描写时更侧重于视觉、听觉还是其他感受。
-   **Custom Notes**: 玩家对文风的自定义要求。

---
*文档版本: v2.0*
*更新时间: 2025-07-02*