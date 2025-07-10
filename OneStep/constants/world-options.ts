import { BLANK_GRADIENT_OPTION } from './needs-options';

// 定义可复用的选项列表

export const SCALE_OPTIONS = [
  BLANK_GRADIENT_OPTION,
  { value: 'micro', label: '微型世界', description: '单一封闭环境，如飞船、学院、山谷。' },
  { value: 'small', label: '小型世界', description: '一座城市及其周边区域。' },
  { value: 'medium', label: '中型世界', description: '一个完整的国家或广阔地区。' },
  { value: 'large', label: '大型世界', description: '横跨整片大陆或一个星球。' },
  { value: 'mega', label: '巨型世界', description: '延伸至星系、多重宇宙或不同维度。' },
];

const CONNECTIVITY_OPTIONS = [
  BLANK_GRADIENT_OPTION,
  { value: 'isolated', label: '完全孤立', description: '不存在与外界的已知联系。' },
  { value: 'occasional', label: '偶发连接', description: '罕见、不稳定的连接，如随机传送门。' },
  { value: 'stable', label: '稳定互通', description: '有固定的商路、航线，常规交流。' },
  { value: 'invaded', label: '被入侵/殖民', description: '被更强大的外部势力渗透或控制。' },
];

const HISTORY_STATE_OPTIONS = [
  BLANK_GRADIENT_OPTION,
  { value: 'savage', label: '蛮荒纪元', description: '文明处于萌芽或原始状态。' },
  { value: 'expansion', label: '扩张纪元', description: '文明蓬勃发展，充满探索与机遇。' },
  { value: 'golden', label: '黄金纪元', description: '文明达到巅峰，社会稳定繁荣。' },
  { value: 'conflict', label: '纷争纪元', description: '战争、内乱或政治动荡是常态。' },
  { value: 'decay', label: '衰败纪元', description: '昔日辉煌已逝，世界在缓慢倒退。' },
  { value: 'cataclysm', label: '灾变纪元', description: '巨大的灾难正在发生，秩序崩溃。' },
  { value: 'post-apocalypse', label: '末日之后', description: '旧世界已被毁灭，幸存者挣扎求生。' },
  { value: 'reconstruction', label: '重建纪元', description: '在废墟上艰难地重建文明。' },
];

const SPECIES_COMPOSITION_OPTIONS = [
  BLANK_GRADIENT_OPTION,
  { value: 'single', label: '单一智慧种族', description: '世界上只有一种主导的智慧生命。' },
  { value: 'multiple', label: '多种族共存', description: '多个智慧种族并存，关系多样。' },
  { value: 'non-human', label: '非人智慧生命主导', description: '如龙、元素、AI等主导世界。' },
  { value: 'none', label: '无智慧生命', description: '只有野兽、怪物或自然本身。' },
];

const SPECIES_DYNAMICS_OPTIONS = [
  BLANK_GRADIENT_OPTION,
  { value: 'peaceful', label: '和平共处', description: '各种族和谐生活，文化交融。' },
  { value: 'cold-war', label: '冷战对峙', description: '种族间互相猜忌，处于紧张的对峙状态。' },
  { value: 'slavery', label: '奴役与压迫', description: '一个或多个种族奴役其他种族。' },
  { value: 'competition', label: '生存竞争', description: '为资源、空间等进行残酷的竞争。' },
  { value: 'alliance', label: '联盟合作', description: '为对抗共同的威胁而结成联盟。' },
];

// 支持label和description的等级选项生成器
const LEVEL_OPTIONS_7 = (labels: string[], descriptions: string[]) =>
  labels.map((label, index) => ({
    value: `${index + 1}`,
    label: `等级 ${index + 1}: ${label}`,
    description: descriptions?.[index] || '',
  }));

// 超自然等级
const SUPERNATURAL_LEVELS = [
  BLANK_GRADIENT_OPTION,
  ...LEVEL_OPTIONS_7(
    ['不存在', '罕见奇迹', '个人异能', '系统化魔法', '影响环境', '扭曲现实', '神级力量'],
    [
      '世界中完全没有超自然现象，一切遵循自然法则。',
      '偶尔出现不可解释的奇迹或异象，但极为罕见。',
      '个别人物拥有超自然能力，但未形成体系。',
      '超自然力量被系统化、普及化，存在魔法、修炼等体系。',
      '超自然现象可大范围影响环境、社会或历史进程。',
      '超自然力量可扭曲现实、改变物理法则，影响极大。',
      '存在如神明般的存在，拥有创造、毁灭世界的能力。',
    ],
  ),
];

// 技术等级
const TECH_LEVELS = [
  BLANK_GRADIENT_OPTION,
  ...LEVEL_OPTIONS_7(
    ['石器', '青铜/铁器', '前工业', '工业革命', '信息/原子', '近未来/赛博', '超光速/后奇点'],
    [
      '以打制石器为主，尚未掌握金属冶炼与复杂工具。',
      '掌握金属冶炼与工具制造，出现青铜器和铁器。',
      '农业、手工业和简单机械，尚未实现大规模工业化。',
      '蒸汽机、电力、机械化生产，工业体系初步建立。',
      '电子计算机、原子能、全球通信与信息化。',
      '高度发达的科技社会，普及人工智能、赛博义体等。',
      '实现超光速航行、时空穿梭或奇点科技。',
    ],
  ),
];

// 秩序等级
const ORDER_LEVELS = [
  BLANK_GRADIENT_OPTION,
  ...LEVEL_OPTIONS_7(
    ['绝对无序', '部落/帮派', '封建/军阀', '弱中央集权', '法制健全', '全景监视', '蜂巢思想'],
    [
      '社会完全无序，无任何组织和规则。',
      '以部落、帮派为单位，规则松散，靠个人或小团体维系秩序。',
      '封建领主或军阀割据，权力分散，秩序不稳。',
      '存在中央政权，但权力有限，地方势力较强。',
      '法制健全，社会秩序良好，权力结构稳定。',
      '全社会被严密监控，个人隐私极度受限。',
      '全体成员思想高度统一，几乎没有个体差异。',
    ],
  ),
];

// 资源等级
const RESOURCE_LEVELS = [
  BLANK_GRADIENT_OPTION,
  ...LEVEL_OPTIONS_7(
    ['寸草不生', '极度贫瘠', '资源稀缺', '自给自足', '物产丰富', '资源充沛', '后稀缺时代'],
    [
      '环境极端恶劣，几乎没有可用资源。',
      '资源极度匮乏，生存极为艰难。',
      '资源有限，需精打细算才能维持生活。',
      '资源基本满足需求，可自给自足。',
      '资源丰富，生活质量较高。',
      '资源极为充沛，几乎没有短缺问题。',
      '资源极大丰富，已超出现实需求，进入后稀缺社会。',
    ],
  ),
];

// 伦理等级
const ETHICS_LEVELS = [
  BLANK_GRADIENT_OPTION,
  ...LEVEL_OPTIONS_7(
    ['极致利己', '荣誉/功利', '契约/律法', '社群/家庭', '人本主义', '绝对集体', '神圣/理念至上'],
    [
      '每个人只为自身利益行事，缺乏道德约束。',
      '以荣誉、功利为核心，道德观念较为功利化。',
      '重视契约和法律，社会以规则为基础。',
      '以社群、家庭为核心，道德强调责任与关爱。',
      '以人为本，强调平等、尊重和同理心。',
      '集体利益高于一切，个人完全服从集体。',
      '以神圣信仰或理念为最高道德准则。',
    ],
  ),
];

// 风俗等级
const MORES_LEVELS = [
  BLANK_GRADIENT_OPTION,
  ...LEVEL_OPTIONS_7(
    ['禁欲/无性', '严格压抑', '保守主义', '有条件接受', '自由主义', '公开表达/常态化', '公共化/景观化'],
    [
      '社会普遍禁欲或无性，性行为被视为禁忌。',
      '性观念极为保守，公开表达受到严格限制。',
      '性观念较为保守，但有一定包容度。',
      '在特定条件下可接受性表达，如婚姻、仪式等。',
      '性观念开放，个人可自由表达性取向和行为。',
      '性表达成为常态，公开讨论和展示被广泛接受。',
      '性成为公共景观或社会活动的一部分。',
    ],
  ),
];

const DISTRIBUTION_OPTIONS = [
  BLANK_GRADIENT_OPTION,
  { value: 'geography', label: '地缘对立', description: '高低水平分布在不同地理区域。' },
  { value: 'class', label: '阶级垄断', description: '高水平被上层阶级垄断。' },
  { value: 'center', label: '中心辐射', description: '从中心点向外围逐渐减弱。' },
  { value: 'race', label: '种族/血脉绑定', description: '特定种族或血脉才能使用。' },
  { value: 'faith', label: '信仰/组织限定', description: '特定宗教或组织才能掌握。' },
  { value: 'anomaly', label: '点状奇点', description: '绝大部分地区水平低，个别地方极高。' },
  { value: 'remnants', label: '散在遗落', description: '来自逝去黄金时代的遗物或失落知识。' },
  { value: 'cyclical', label: '周期潮汐', description: '强度随时间周期性涨落。' },
];

const POWER_SOURCE_OPTIONS = [
  { id: 'internal', label: '内生/修炼', description: '通过自身修炼、内在潜能获得力量。' },
  { id: 'external', label: '外部/环境', description: '依赖外部环境、自然能量或特殊地点。' },
  { id: 'pact', label: '契约/信仰', description: '通过与神明、灵体等签订契约或信仰获得力量。' },
  { id: 'bloodline', label: '血脉/遗传', description: '源自家族、种族、血统的天赋能力。' },
  { id: 'item', label: '物品/圣物', description: '依靠神器、圣物、魔法物品等外物获得力量。' },
  { id: 'knowledge', label: '知识/仪式', description: '通过学习知识、掌握仪式、咒语等获得力量。' },
];

const POWER_STRUCTURE_OPTIONS = [
  BLANK_GRADIENT_OPTION,
  { value: 'empires', label: '强国林立', description: '多个强大国家或势力并存，争霸天下。' },
  { value: 'city-states', label: '城邦联盟', description: '由众多自治城邦组成的联盟。' },
  { value: 'corporations', label: '公司寡头', description: '由大型企业或财阀掌控世界。' },
  { value: 'secret-societies', label: '秘密结社操纵', description: '幕后组织、秘密结社主导权力分配。' },
  { value: 'anarchy', label: '无政府', description: '缺乏统一政权，权力极度分散或混乱。' },
];

const PHILOSOPHY_POINTS_OPTIONS = [
  { id: 'animism', label: '泛神/万物有灵', description: '相信一切事物皆有灵性或神性。' },
  { id: 'monotheism', label: '一神论', description: '信仰唯一的至高神明。' },
  { id: 'dualism', label: '二元论', description: '世界由两种对立力量主宰（如善恶、光暗）。' },
  { id: 'ancestor-worship', label: '祖先崇拜', description: '尊崇祖先灵魂，认为祖先影响现世。' },
  { id: 'humanism', label: '无神/人本主义', description: '否认神明存在，强调人类自身价值。' },
  { id: 'utilitarianism', label: '功利/实用主义', description: '以实际利益和效果为最高准则。' },
  { id: 'transhumanism', label: '超人类/飞升主义', description: '追求进化、超越人类极限或升华。' },
  { id: 'nihilism', label: '虚无/宿命论', description: '认为世界无意义，一切皆为命运安排。' },
];

const SOCIAL_FABRIC_POINTS_OPTIONS = [
  { id: 'kinship', label: '血缘制', description: '以家族、血缘关系为社会核心。' },
  { id: 'feudalism', label: '封建制', description: '以领主、封臣、土地分封为基础的社会结构。' },
  { id: 'theocracy', label: '神权制', description: '宗教领袖或神明意志主导社会。' },
  { id: 'caste', label: '身份制', description: '社会成员按出生、种姓等身份严格分层。' },
  { id: 'citizenship', label: '公民制', description: '以公民权利和义务为基础的社会结构。' },
  { id: 'guild', label: '行会/辛迪加制', description: '由行业、工会、辛迪加等组织主导社会。' },
  { id: 'corporatism', label: '公司制', description: '由企业、公司掌控社会资源与权力。' },
  { id: 'meritocracy', label: '英才制', description: '以能力、才华、成就为社会晋升标准。' },
];


const AESTHETIC_ELEMENT_OPTIONS = [
  { type: 'separator', label: '建筑形态' },
  { id: 'monumental', label: '雄伟/纪念碑式', description: '强调巨大、对称和永恒感，如金字塔、巨神像、纪念碑。' },
  {
    id: 'caveDwellings',
    label: '洞穴/巢居式',
    description: '通过挖掘、雕刻或利用天然洞穴形成，与环境融为一体，如地底城市、悬崖神殿、蚁穴。',
  },
  {
    id: 'geometric',
    label: '几何/秩序',
    description: '由清晰的几何形状构成，强调理性和秩序，如包豪斯风格、水晶尖塔。',
  },
  { id: 'organic', label: '有机/仿生', description: '模仿自然形态，充满曲线和不规则性，如高迪的建筑、虫巢、树屋。' },
  { id: 'intricate', label: '精巧/繁复', description: '充满复杂的细节、雕刻和装饰，如巴洛克或哥特式建筑。' },
  { id: 'utilitarian', label: '实用/工业', description: '功能至上，暴露结构和管道，充满金属和混凝土的粗犷感。' },
  { id: 'chaotic', label: '混沌/拼凑', description: '由不同风格和材料随意拼接而成，常见于废土或贫民窟。' },
  {
    id: 'floating',
    label: '浮空/灵体式',
    description: '反重力、无固定形态或由非物质构成的建筑，如浮空城、云中殿、幻影塔。',
  },
  { type: 'separator', label: '核心材质' },
  { id: 'naturalMaterials', label: '自然造物', description: '木材、石头、粘土、皮革等未经或粗略加工的天然材料。' },
  {
    id: 'processedMaterials',
    label: '精加工造物',
    description: '经过精细打磨和加工的材料，如抛光石材、丝绸织物、陶瓷、漆器，象征财富、技艺与阶级。',
  },
  { id: 'manMadeMetals', label: '人造金属/混凝土', description: '钢铁、青铜、玻璃和混凝土，工业文明的标志。' },
  { id: 'syntheticPolymers', label: '合成聚合物', description: '塑料、树脂、碳纤维，未来主义和赛博朋克的常见元素。' },
  { id: 'biological', label: '生物/活体', description: '由活体组织、骨骼、甲壳构成的建筑或物品。' },
  { id: 'crystal', label: '晶体/宝石', description: '由巨大的水晶、宝石或类似的矿物构成，常与魔法关联。' },
  { id: 'energy', label: '能量/以太', description: '由纯能量、力场或神秘的以太物质构成。' },
  { id: 'lightAndShadow', label: '光影/虚空', description: '由纯粹的光、影、不稳定空间或虚空本身构成的非物质形态。' },
  { type: 'separator', label: '装饰符号' },
  { id: 'totem', label: '图腾/神话', description: '充满动物、神祇和传说的图腾符号，代表部落或信仰。' },
  {
    id: 'heraldry',
    label: '纹章/徽记',
    description: '使用盾形、旗帜和标准符号体系来代表家族、国家或组织的身份与传承。',
  },
  { id: 'mechanical', label: '机械/齿轮', description: '以齿轮、活塞、蒸汽管道、铆钉等工业机械元素为核心的装饰。' },
  {
    id: 'graffiti',
    label: '个人/涂鸦式',
    description: '非官方、个人化、即兴的符号，如个人签名、街头涂鸦、反叛标记，强调个性和亚文化。',
  },
  { id: 'abstract', label: '抽象/几何', description: '使用点、线、面等纯粹的几何图形作为装饰。' },
  {
    id: 'anatomical',
    label: '骸骨/解剖',
    description: '使用骨骼、头骨、眼球、内脏等人体或生物解剖结构作为主要装饰元素。',
  },
  { id: 'floral', label: '自然/花叶', description: '以花卉、藤蔓、叶片等植物形态为主要装饰图案。' },
  { id: 'technological', label: '科技/电路', description: '电路板纹样、二进制代码、全息投影等科技符号。' },
  { id: 'calligraphy', label: '书法/符文', description: '将文字、书法或神秘的符文作为核心装饰元素。' },
  { id: 'celestial', label: '星辰/天体', description: '以星空、星座、行星轨迹等天体为主题的符号。' },
  { type: 'separator', label: '氛围色盘' },
  { id: 'neon', label: '霓虹/高对比度', description: '明亮的霓虹灯与黑暗的背景形成强烈对比，如赛博朋克。' },
  { id: 'wasteland', label: '废土/褪色', description: '饱和度低，以棕、灰、黄为主，充满尘土和锈迹感。' },
  {
    id: 'vibrant',
    label: '鲜活/自然',
    description: '以明亮、高饱和的自然色（翠绿、天蓝、鲜红）为主，充满生命力与和谐感。',
  },
  {
    id: 'ornate',
    label: '华丽/油画感',
    description: '使用丰富、深邃、高饱和的色彩组合，如宝石红、天鹅绒蓝和金色，营造奢华、古典和戏剧感。',
  },
  { id: 'sacred', label: '神圣/辉光', description: '以金色、白色为主，常伴有柔和的光晕和神圣感。' },
  { id: 'gothic', label: '阴郁/哥特', description: '以黑、紫、深红为主，色调阴暗，强调神秘与衰败。' },
  { id: 'elegant', label: '典雅/和谐', description: '色彩柔和、协调，饱和度适中，给人以宁静、平衡感。' },
  {
    id: 'monochrome',
    label: '单色/功利性',
    description: '以有限的、无色彩或低饱和度的颜色（如黑、白、灰、军绿）为主，强调功能、严肃性或压迫感。',
  },
  {
    id: 'psychedelic',
    label: '迷幻/故障艺术',
    description: '高饱和度、异常的色彩组合、渐变、扭曲和数字故障效果，产生眩目和不稳定感。',
  },
  {
    id: 'candy',
    label: '糖果/超现实',
    description: '以粉彩、马卡龙色等高明度低饱和色彩为主，营造可爱、甜美、梦幻甚至怪诞的氛围。',
  },
];

// 主定义
export const WORLDVIEW_MODULES = [
  {
    id: 'aesthetics',
    title: '1. 美学与基调',
    macroOptions: [
      {
        id: 'dpa_container',
        type: 'dynamic_points_allocator',
        label: '基石文化与美学滤镜',
        helpText: '选择一个或多个文化原型/滤镜，总共可分配10点影响力。',
        totalPoints: 10,
      },
      {
        id: 'aesthetic_elements',
        label: '美学要素权重 (10点影响力)',
        type: 'points_allocator',
        helpText: '分配10个点数来定义世界在视觉、材质、符号和色彩上的具体倾向。',
        options: AESTHETIC_ELEMENT_OPTIONS,
        totalPoints: 10,
      },
    ],
    specificItemTypes: [], // No specific items for this module
  },
  {
    id: 'geography',
    title: '2. 空间与边界',
    macroOptions: [
      { id: 'scale', label: '世界尺度', type: 'dropdown', options: SCALE_OPTIONS },
      { id: 'connectivity', label: '外部关联性', type: 'dropdown', options: CONNECTIVITY_OPTIONS },
    ],
    specificItemTypes: [{ id: 'location', label: '添加地点', template: 'world_specific_location' }],
  },
  {
    id: 'history',
    title: '3. 历史与时代',
    macroOptions: [{ id: 'currentState', label: '当前历史状态', type: 'dropdown', options: HISTORY_STATE_OPTIONS }],
    specificItemTypes: [
      { id: 'event', label: '添加历史事件', template: 'world_specific_event' },
      { id: 'era', label: '添加时代', template: 'world_specific_era' },
    ],
  },
  {
    id: 'species',
    title: '4. 居民与种族',
    macroOptions: [
      { id: 'composition', label: '种族构成', type: 'dropdown', options: SPECIES_COMPOSITION_OPTIONS },
      { id: 'dynamics', label: '核心关系', type: 'dropdown', options: SPECIES_DYNAMICS_OPTIONS },
    ],
    specificItemTypes: [{ id: 'species', label: '添加种族', template: 'world_specific_species' }],
  },
  {
    id: 'magic',
    title: '5. 力量与超凡',
    macroOptions: [
      { id: 'supernatural_axis_max', label: '最高水平', type: 'dropdown', options: SUPERNATURAL_LEVELS },
      { id: 'supernatural_axis_min', label: '最低水平', type: 'dropdown', options: SUPERNATURAL_LEVELS },
      { id: 'distribution', label: '分布模式', type: 'dropdown', options: DISTRIBUTION_OPTIONS },
      {
        id: 'power_sources',
        label: '力量来源 (10点影响力)',
        type: 'points_allocator',
        options: POWER_SOURCE_OPTIONS,
        totalPoints: 10,
      },
    ],
    specificItemTypes: [
      { id: 'powersystem', label: '添加力量体系', template: 'world_specific_powersystem' },
      { id: 'item', label: '添加超凡物品', template: 'world_specific_item' },
    ],
  },
  {
    id: 'technology',
    title: '6. 技术与造物',
    macroOptions: [
      { id: 'tech_axis_max', label: '最高水平', type: 'dropdown', options: TECH_LEVELS },
      { id: 'tech_axis_min', label: '最低水平', type: 'dropdown', options: TECH_LEVELS },
      { id: 'distribution', label: '分布模式', type: 'dropdown', options: DISTRIBUTION_OPTIONS },
    ],
    specificItemTypes: [{ id: 'tech', label: '添加技术/造物', template: 'world_specific_tech' }],
  },
  {
    id: 'factions',
    title: '7. 势力与组织',
    macroOptions: [
      { id: 'power_structure', label: '权力结构', type: 'dropdown', options: POWER_STRUCTURE_OPTIONS },
      { id: 'order_axis_max', label: '最高秩序水平', type: 'dropdown', options: ORDER_LEVELS },
      { id: 'order_axis_min', label: '最低秩序水平', type: 'dropdown', options: ORDER_LEVELS },
      { id: 'distribution', label: '分布模式', type: 'dropdown', options: DISTRIBUTION_OPTIONS },
    ],
    specificItemTypes: [{ id: 'faction', label: '添加势力/组织', template: 'world_specific_faction' }],
  },
  {
    id: 'economy',
    title: '8. 经济与资源',
    macroOptions: [
      { id: 'resource_axis_max', label: '最高资源丰裕度', type: 'dropdown', options: RESOURCE_LEVELS },
      { id: 'resource_axis_min', label: '最低资源丰裕度', type: 'dropdown', options: RESOURCE_LEVELS },
      { id: 'distribution', label: '分布模式', type: 'dropdown', options: DISTRIBUTION_OPTIONS },
    ],
    specificItemTypes: [{ id: 'resource', label: '添加关键资源', template: 'world_specific_resource' }],
  },
  {
    id: 'faith',
    title: '9. 信仰与哲学',
    macroOptions: [
      {
        id: 'philosophy_points',
        label: '哲学与信仰构成 (10点影响力)',
        type: 'points_allocator',
        options: PHILOSOPHY_POINTS_OPTIONS,
        totalPoints: 10,
      },
    ],
    specificItemTypes: [{ id: 'belief', label: '添加信仰/哲学', template: 'world_specific_belief' }],
  },
  {
    id: 'culture',
    title: '10. 文化与习俗',
    macroOptions: [
      {
        id: 'social_fabric_points',
        label: '社会结构组成 (10点影响力)',
        type: 'points_allocator',
        options: SOCIAL_FABRIC_POINTS_OPTIONS,
        totalPoints: 10,
      },
      { id: 'ethics_axis_max', label: '最高道德/伦理观念', type: 'dropdown', options: ETHICS_LEVELS },
      { id: 'ethics_axis_min', label: '最低道德/伦理观念', type: 'dropdown', options: ETHICS_LEVELS },
      { id: 'distribution', label: '分布模式', type: 'dropdown', options: DISTRIBUTION_OPTIONS },
    ],
    specificItemTypes: [
      { id: 'custom', label: '添加习俗/仪式', template: 'world_specific_custom' },
      { id: 'class', label: '添加社会阶层', template: 'world_specific_class' },
    ],
  },
  {
    id: 'desire',
    title: '11. 性爱与情欲',
    macroOptions: [
      { id: 'mores_axis_max', label: '最高开放度', type: 'dropdown', options: MORES_LEVELS },
      { id: 'mores_axis_min', label: '最低开放度', type: 'dropdown', options: MORES_LEVELS },
      { id: 'distribution', label: '分布模式', type: 'dropdown', options: DISTRIBUTION_OPTIONS },
      {
        id: 'cultural_lens_points',
        label: '主流文化视角（10点分配）',
        type: 'points_allocator',
        helpText: '为下列文化视角分配10点，表达其在本世界的主流程度。',
        totalPoints: 10,
        options: [
          { id: 'reproduction', label: '繁衍/生殖', description: '以生育、种族延续为核心' },
          { id: 'power', label: '权力/统治', description: '作为权力、支配、控制的工具' },
          { id: 'violence', label: '暴力/征服', description: '与暴力、征服、羞辱、惩罚等相关' },
          { id: 'transaction', label: '交易/功利', description: '作为交换、利益、资源分配的手段' },
          { id: 'sacred', label: '神圣/仪式', description: '与宗教、仪式、神秘信仰相关' },
          { id: 'pleasure', label: '娱乐/享乐', description: '追求感官、快乐、放纵、享乐主义' },
          { id: 'romance', label: '浪漫/情感', description: '表达爱、情感、亲密、温情' },
          { id: 'art', label: '艺术/美学', description: '作为艺术、审美、创造、表现的载体' },
          { id: 'taboo', label: '禁忌/压抑', description: '被视为禁忌、罪恶、压抑、羞耻' },
          { id: 'alienation', label: '异化/超越', description: '异化、超越常规，或与非人/超自然结合' },
        ],
      },
    ],
    specificItemTypes: [{ id: 'desire_element', label: '添加情欲要素', template: 'world_specific_desire' }],
  },
];
