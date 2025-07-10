# OneStep 项目资源索引

## 📋 项目概览

### 🎯 核心任务
- **项目名称**: A.U.TO OneStep 文本互动叙事游戏生成器
- **功能目标**: 创建六页面配置界面，收集玩家需求并生成规范化格式传输给LLM/SillyTavern
- **技术栈**: TypeScript + SCSS + HTML (内嵌在酒馆聊天界面)
- **全局库支持**: jquery, jquery-ui, lodash, toastr, yaml (无需导入，已全局支持)

### 🏗️ 界面布局结构
```
顶部: A.U.TO OneStep 标题 + 预计字数消耗统计
导航: 需求|世界|人物|剧情|规则|文风 六个按钮
内容区: 
  - 自定义说明模块 (右侧: 随机生成按钮 + 关闭模块按钮)
  - 配置表单区域
底部: 翻页按钮，翻到最后一页有生成角色卡按钮
```

---

## 📚 六大核心框架文档

| 页面 | 框架名称 | 文档位置 | 核心功能 | 预计字数消耗 |
|------|----------|----------|----------|-------------|
| 1 | 玩家需求分析 | [`参考资料/PlayerNeeds_Framework.md`](../../参考资料/PlayerNeeds_Framework.md) | 情感调色盘、权力定位、体验边界 | 固定 1200字 |
| 2 | 世界观设计 | [`参考资料/Worldview_Framework.md`](../../参考资料/Worldview_Framework.md) | 世界基础、属性轴、文化肌理 | 2000-3000字 (按规模) |
| 3 | 角色团队 | [`参考资料/Character_Framework.md`](../../参考资料/Character_Framework.md) | PC、重要角色、功能角色、背景组 | 按数量×模板等级 |
| 4 | 剧情设计 | [`参考资料/Plot_Framework.md`](../../参考资料/Plot_Framework.md) | 线性/分支 或 沙盒叙事结构 | 按模块类型统计 |
| 5 | 叙事规则书 | [`参考资料/Rulebook_Framework.md`](../../参考资料/Rulebook_Framework.md) | 状态追踪器、描述符、因果触发器 | 每个 500/100字 |
| 6 | 文风设计 | [`参考资料/WritingStyle_Framework.md`](../../参考资料/WritingStyle_Framework.md) | 叙事者姿态、语言质感、感官通道 | 固定 500字 |

---

## 🔧 技术接口文档

### 酒馆助手功能接口
- **主接口定义**: [`@types/function/index.d.ts`](../../@types/function/index.d.ts)
- **详细功能接口**: [`window.TavernHelper`](../../@types/function/) 各模块

#### 关键函数映射
```typescript
// 宏解析与消息处理
substitudeMacros(macro: string) // 解析酒馆宏，如 '{{char}}'
getCurrentMessageId() // 获取当前界面所在楼层号
getChatMessages(id: number) // 获取指定楼层的消息内容

// 指令触发
triggerSlash(command: string) // 发送斜杠指令到酒馆
```

### 项目配置文件
- **TypeScript配置**: [`tsconfig.json`](../../tsconfig.json) - 全局库类型支持
- **构建配置**: [`package.json`](../../package.json) - webpack构建工具链
- **斜杠指令参考**: [`slash_command.txt`](../../slash_command.txt) - 可用的酒馆指令

---

## 📊 输出格式分析文档

- **玩家需求**: [`player_needs_output_analysis.json`](./player_needs_output_analysis.json) - “玩家需求”页面输出示例与说明
- **世界观**: [`worldview_output_analysis.json`](./worldview_output_analysis.json) - “世界观”页面输出示例与说明
- **人物**: [`character_output_analysis.json`](./character_output_analysis.json) - “人物”页面输出示例与说明
- **剧情**: [`plot_output_analysis.json`](./plot_output_analysis.json) - “剧情”页面输出示例与说明

---

## 📐 界面设计规范

### 🚫 重要约束
- **禁用vh单位**: 界面高度不使用vh，避免在聊天界面中的显示问题
- **动态高度**: 使用 `width` + `aspect-ratio` 实现高度根据宽度动态调整
- **无导入需求**: 不在HTML中导入CSS/JS，由外部系统处理

### ✅ 推荐样式方案
参考 [`COMPONENT_DESIGN.md`](./COMPONENT_DESIGN.md) 的 "盛世青绿" 主题：
```scss
// 设计令牌
:root {
  --color-background: #F7F5F1;
  --color-primary: #2A4073;
  --color-secondary: #4A6C53;
  --color-accent: #C0A062;
}

// 核心容器
.onestep-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-l);
}
```

### 生命周期处理
参考 [`src/脚本示例/加载和卸载时执行函数.ts`](../脚本示例/加载和卸载时执行函数.ts)：
```typescript
// 加载时执行
$(() => {
  // 初始化逻辑
});

// 卸载时执行
$(window).on('unload', () => {
  // 清理逻辑
});
```

---

## 📊 字数消耗计算逻辑

### 详细计算规则
```typescript
const wordCountCalculator = {
  // 页面1: 固定消耗
  page1: 1200,
  
  // 页面2: 按世界规模
  page2: {
    '微型世界': 2000, '小型世界': 2200, '中型世界': 2500,
    '大型世界': 2800, '巨型世界': 3000
  },
  
  // 页面3: 按角色数量和模板等级
  page3: {
    templateLevels: { L1: 100, L2: 200, L3: 400, L4: 800, L5: 1000 }
  },
  
  // 页面4: 按叙事模式分类
  page4: {
    narrative: {
      mainRoute: 600, // L1主线固定
      branchRoute: 500, // L2每条分支 + (分支数>0时额外500字网络图)
    },
    sandbox: {
      initialDriver: 100, // M1固定
      personalRoute: 500, // M2个人路线每条
      factionRoute: 300, // M2势力/区域/种族每条
    }
  },
  
  // 页面5: 按规则类型
  page5: {
    stateTracker: 500,    // 状态追踪器/因果触发器 每个
    descriptor: 100,      // 叙事描述符 每个
  },
  
  // 页面6: 固定消耗
  page6: 500
};
```

---

## 📤 数据输出格式

### 标准输出结构
参考 [`参考资料/data_transfer_format.json`](../../参考资料/data_transfer_format.json)

六个Profile对象，依次包裹在对应尖括号中：
1. `<PlayerNeeds_Profile>` - 玩家需求配置
2. `<Worldview_Profile>` - 世界观配置  
3. `<Character_Profile>` - 角色团队配置
4. `<Plot_Profile>` - 剧情设计配置
5. `<Rulebook_Profile>` - 叙事规则配置
6. `<WritingStyle_Profile>` - 文风设计配置

### 数据类型转换规则
- **梯度选项** → 包含完整描述的字符串
- **点数分配** → JSON对象 (键为中文选项，值为数量)
- **标签选择** → JSON数组
- **自定义文本** → 字符串

---

## 🛠️ 开发模板参考

### 现有模板结构
- **HTML基础**: [`src/界面示例/index.html`](../界面示例/index.html) - 简洁的容器结构
- **样式参考**: [`src/界面示例/index.scss`](../界面示例/index.scss) - 响应式毛玻璃效果
- **功能模板**: [`src/界面示例/index.ts`](../界面示例/index.ts) - 事件绑定和数据处理

### 推荐目录结构
```
src/OneStep/
├── app/                # 控制器与核心逻辑
├── components/         # (未来)可复用业务组件
├── constants/          # 全局常量
├── docs/               # 项目文档
├── pages/              # (未来)各页面独立模块
├── types/              # TypeScript类型定义
├── utils/              # (未来)通用工具函数
├── view/               # 视图层 (PageBuilder, ComponentFactory)
├── index.html          # 主界面
├── index.scss          # 主样式
└── index.ts            # 主入口
```

---

## 📋 任务清单

### 当前阶段：准备资料索引 ✅
- [x] 读取并分析所有框架文档
- [x] 整理技术接口和约束条件  
- [x] 建立字数统计计算逻辑
- [x] 创建资源索引文档

### 下一阶段：文档同步与审查
- [x] 更新所有文档以匹配当前代码。
- [ ] 对所有功能进行回归测试。
- [ ] 准备项目交付。

---

*文档更新时间: 2025-06-28*
*项目版本: OneStep v1.1 文档同步阶段*