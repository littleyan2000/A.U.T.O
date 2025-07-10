import { PageType } from '../types/AppTypes';

export const PAGE_METADATA: Record<PageType, { title: string; description: string }> = {
  needs: {
    title: '玩家需求',
    description: '本页用于定义您在叙事体验中核心的情感、权力和边界需求。您的选择将直接影响AI生成故事的风格和倾向。',
  },
  world: {
    title: '世界观',
    description:
      '本页用于构建故事发生的世界。请定义其基础法则、核心属性、文化风貌，为您的冒险搭建一个生动可信的舞台。',
  },
  character: {
    title: '人物',
    description: '本页用于设计故事中的角色阵容，包括您扮演的主控角色(PC)、核心的NPC以及构成世界背景的群体。',
  },
  plot: {
    title: '剧情',
    description: '本页用于设定故事的宏观结构。您可以选择一个有明确主线的分支叙事，或是一个可供自由探索的沙盒世界。',
  },
  rules: {
    title: '规则',
    description:
      '本页用于定义世界运转的“因果定律”。您可以创建追踪器、描述符和触发器，让AI的叙事遵循一套明确、一致的逻辑。',
  },
  style: {
    title: '文风',
    description: '本页用于定制AI生成文本的语言风格。您可以从零开始微调，或让AI通过分析参考文本来模仿其风格。',
  },
};