# OneStep 记忆银行 (快速开发参考)

## 🚀 快速启动代码片段

### 基础页面结构模板
```html
<!-- src/OneStep/index.html -->
<div id="onestep-container" class="onestep-container">
    <!-- 1. 公共头部 -->
    <header class="onestep-header">
        <h1 class="onestep-header__title">A.U.TO OneStep</h1>
        <div id="word-count-display" class="onestep-header__word-count">
            <!-- 预计字数消耗将在这里动态更新 -->
        </div>
    </header>

    <!-- 2. 页面导航 -->
    <nav id="main-nav" class="onestep-nav">
        <!-- 导航按钮将在这里动态生成 -->
    </nav>

    <!-- 3. 主内容区域 -->
    <main id="page-content" class="onestep-main">
        <!-- 当前子页面的内容将在这里动态渲染 -->
    </main>

    <!-- 4. 翻页与提交控件 -->
    <footer id="page-controls" class="onestep-footer">
        <!-- 翻页按钮和最终提交按钮将在这里动态生成 -->
    </footer>
</div>
```

### TypeScript 主入口模板 (View Layer)
```typescript
// src/OneStep/index.ts (OneStepUI Class)

// 核心渲染逻辑
private render = (state: AppState): void => {
    this.renderHeader(state);
    this.renderNavigation(state);
    this.renderPageContent(state);
    this.renderFooter(state);
};

// 导航渲染
private renderNavigation(state: AppState): void {
    const navContainer = this.elements.mainNav;
    if (!navContainer) return;

    const { currentPage } = state.navigation;
    const pageOrder: PageType[] = ['needs', 'world', 'character', 'plot', 'rules', 'style'];

    navContainer.innerHTML = ''; // 清空旧导航
    
    pageOrder.forEach(page => {
        const button = document.createElement('button');
        button.className = 'nav-btn';
        button.textContent = PAGE_METADATA[page].title;
        button.setAttribute('data-page', page);
        if (page === currentPage) {
            button.classList.add('active');
        }
        navContainer.appendChild(button);
    });
}

// 页面内容渲染
private renderPageContent(state: AppState): void {
    const contentContainer = this.elements.pageContent;
    if (!contentContainer) return;

    const { currentPage } = state.navigation;
    const pageData = state.formData[currentPage];

    // 每次都完全重绘当前页面，保证UI和状态的绝对同步
    contentContainer.innerHTML = '';
    const pageFragment = this.pageBuilder.buildPage(currentPage, pageData);
    contentContainer.appendChild(pageFragment);
}
```

### SCSS 样式核心片段
```scss
// src/OneStep/index.scss

// 1. 设计令牌 (Design Tokens)
:root {
  --color-background: #F7F5F1;
  --color-primary: #2A4073;
  --color-secondary: #4A6C53;
  --color-accent: #C0A062;
  --color-text: #3D3D3D;
  --color-surface: #FFFFFF;
  // ... 其他变量
}

// 2. 核心布局结构
.onestep-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-l);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-l);
}

// 3. 通用组件样式 - 按钮
.btn {
  padding: var(--spacing-s) var(--spacing-m);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-surface);
  &:hover:not(:disabled) {
    background-color: color.adjust(#2A4073, $lightness: 10%);
    box-shadow: var(--shadow-interactive);
    transform: translateY(-2px);
  }
}

// 4. 导航按钮
.nav-btn {
    background: none;
    border: none;
    // ...
    position: relative;

    &.active {
        color: var(--color-primary);
        font-weight: var(--font-weight-semibold);
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%; // 激活状态的下划线
            height: 2px;
            background-color: var(--color-accent);
            transition: width 0.3s ease;
        }
    }
}
```

---

## 🎯 关键API速查

### 酒馆助手核心函数
```typescript
// 宏解析 - 获取角色信息
const charName = substitudeMacros('{{char}}');
const userName = substitudeMacros('{{user}}');

// 消息处理 - 获取当前上下文
const messageId = getCurrentMessageId();
const messages = getChatMessages(messageId);

// 指令发送 - 与酒馆交互
triggerSlash('/send <UpdateVariable>\n@变量名=值@\n</UpdateVariable>');

// 变量处理 - 使用酒馆助手变量系统
const variables = getVariables();
insertOrAssignVariables({ '变量名': '值' });
```

### DOM 事件绑定模式 (Vanilla JS)
```typescript
// 页面加载完成时执行
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

// 页面卸载时清理
window.addEventListener('unload', () => {
  cleanup();
});

// 动态元素事件委托
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.matches('.dynamic-button')) {
    const value = target.dataset.value;
    handleClick(value);
  }
});
```

---

## 📊 字数统计计算器 (Model/Service Layer)
```typescript
// src/OneStep/app/WordCountManager.ts
export class WordCountManager {
  // 页面1: 固定消耗
  public calculatePage1(): number {
    return 1200;
  }
  
  // 页面2: 世界观规模
  public calculatePage2(scaleLevel: string): number {
    const scales = {
      '微型世界': 2000, '小型世界': 2200, '中型世界': 2500,
      '大型世界': 2800, '巨型世界': 3000
    };
    return scales[scaleLevel] || 2000;
  }
  
  // ... other page calculation methods
  
  public calculateAllPages(formData: AppState['formData']): Record<PageType, number> {
    return {
      needs: this.calculatePage1(),
      world: this.calculatePage2(formData.world.basics.scale_level),
      // ... and so on
    };
  }
}
```

---

## 🎨 常用UI组件模板

### 页面说明模块
```html
<div class="page-intro">
  <div class="intro-content">
    <h3>页面标题</h3>
    <p>页面说明文本...</p>
  </div>
  <div class="intro-actions">
    <button class="btn-random">随机生成</button>
    <button class="btn-disable">关闭模块</button>
  </div>
</div>
```

### 梯度选择组件
```html
<div class="gradient-selector" data-field="fieldName">
  <label>选项标题</label>
  <div class="gradient-options">
    <button class="gradient-option" data-value="1/7: 选项1">
      <span class="level">1/7</span>
      <span class="label">选项1</span>
      <span class="desc">详细描述</span>
    </button>
    <!-- 更多选项... -->
  </div>
</div>
```

### 点数分配组件
```html
<div class="points-allocator" data-field="fieldName" data-total="10">
  <label>分配10个点数</label>
  <div class="point-items">
    <div class="point-item">
      <span class="point-label">选项1</span>
      <div class="point-controls">
        <button class="point-btn minus">-</button>
        <span class="point-value">0</span>
        <button class="point-btn plus">+</button>
      </div>
    </div>
    <!-- 更多选项... -->
  </div>
  <div class="points-remaining">剩余点数: <span>10</span></div>
</div>
```

---

## 🔧 实用工具函数 (Controller Layer)
```typescript
// src/OneStep/app/AppController.ts

export class AppController {
    // ... constructor, state, subscribers

    // Centralized state update method
    public setState = (updates: Partial<AppState>, fromHistory: boolean = false): void => {
        Object.assign(this.state, updates);
        this.state.ui.isDirty = true;
        this.recomputeState(); // Re-calculate computed values like word counts
        if (!fromHistory) {
            this.data.recordHistory(this.state);
        }
        this.notify(); // Notify UI to re-render
    };

    // Example of a business logic method
    public navigateTo = (page: PageType): void => {
        const navUpdates = this.navigation.getPage(page);
        this.setState({ navigation: { ...this.state.navigation, ...navUpdates } });
    };

    // Example of handling form updates from the View
    public handleFormUpdate = (formDataUpdate: Partial<NeedsFormData | WorldFormData /* etc. */>): void => {
        const currentPage = this.state.navigation.currentPage;
        const updatedPageData = { 
            ...this.state.formData[currentPage], 
            ...formDataUpdate 
        };
        this.setState({
            formData: {
                ...this.state.formData,
                [currentPage]: updatedPageData,
            },
        });
    };

    // Re-calculates all derived data
    private recomputeState = (): void => {
        const newWordCounts = this.wordCount.calculateAllPages(this.state.formData);
        const totalWordCount = Object.values(newWordCounts).reduce((sum, count) => sum + count, 0);
        
        this.state.computed.wordCounts = newWordCounts;
        this.state.computed.totalWordCount = totalWordCount;
        // ... other computed properties
    };
}
```

### 随机生成器
```typescript
// 随机选择梯度选项
function randomGradientChoice(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

// 随机分配点数
function randomPointsAllocation(categories: string[], total: number): Record<string, number> {
  const result = {};
  let remaining = total;
  
  categories.forEach((category, index) => {
    if (index === categories.length - 1) {
      result[category] = remaining;
    } else {
      const max = Math.min(remaining, Math.floor(total / categories.length) + 2);
      const value = Math.floor(Math.random() * (max + 1));
      result[category] = value;
      remaining -= value;
    }
  });
  
  return result;
}
```

---

## 🚨 常见问题解决方案

### 高度布局问题
```scss
// ❌ 错误做法
.container {
  height: 100vh; // 在聊天界面中会出问题
}

// ✅ 正确做法
.container {
  width: 100%;
  aspect-ratio: 16/10; // 或其他合适比例
  max-height: 600px; // 可选的最大高度限制
}
```

### 数据持久化 (Model/Service Layer)
```typescript
// src/OneStep/app/DataManager.ts
export class DataManager {
    // ...
    public save(state: AppState): void {
        try {
            const stateToSave = JSON.stringify(state);
            localStorage.setItem(STORAGE_KEYS.APP_STATE, stateToSave);
        } catch (error) {
            console.error("Failed to save state:", error);
        }
    }

    public load(): AppState | null {
        try {
            const savedState = localStorage.getItem(STORAGE_KEYS.APP_STATE);
            return savedState ? JSON.parse(savedState) : null;
        } catch (error) {
            console.error("Failed to load state:", error);
            return null;
        }
    }
}
```

### 组件动态加载
```typescript
// src/OneStep/index.ts (in OneStepUI class)
private renderPageContent(state: AppState) {
    const pageContainer = this.root.querySelector(`#page-${state.navigation.currentPage}`);
    if (pageContainer && !pageContainer.hasChildNodes()) {
        // Dynamically generate and append page content elements
        const content = this.createPageElements(state.navigation.currentPage, state.formData);
        pageContainer.appendChild(content);
    }
}
```

---

## 📚 快速参考链接

- **框架文档**: [`../../../参考资料/`](../../参考资料/)
- **技术接口**: [`../../../@types/function/`](../../@types/function/)
- **界面示例**: [`../../界面示例/`](../界面示例/)
- **项目配置**: [`../../../tsconfig.json`](../../tsconfig.json)

---

*记忆银行更新时间: 2025-06-28*
*版本: v1.2 盛世青绿重构后*