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
  {
    id: 'chinese_civilization',
    label: '华夏文明 (Chinese Civilization)',
    description:
      '一个拥有悠久历史与强大文化向心力的农耕文明。其特征在于循环往复的王朝更替、精妙复杂的官僚体系、以儒家为主干的社会伦理，以及在不同时代呈现出的或雄浑、或风雅、或精致的独特美学。',
    children: [
      {
        id: 'ancient_mythology',
        label: '上古神话时代',
        description:
          '一个神人杂居、充满洪水、巨兽与部落英雄的时代。世界的规则尚在形成，祭祀与占卜是与天地沟通的唯一方式，一切都笼罩在神秘的传说之中。',
      },
      {
        id: 'shang_zhou_bronze',
        label: '商周青铜王朝',
        description:
          '一个神权与王权交织的时代，以森严的等级、繁复的青铜礼器和甲骨文占卜为标志。社会围绕着祭祀祖先与神灵展开，充满了庄严肃穆的仪式感。',
      },
      {
        id: 'spring_autumn_warring_states',
        label: '春秋战国',
        description:
          '一个礼崩乐坏、诸侯争霸的变革时代，也是百家争鸣、思想空前活跃的黄金时期。士人阶层崛起，在血与火的兼并战争中，智慧与计谋的光芒无比璀璨。',
      },
      {
        id: 'three_kingdoms',
        label: '三国时代',
        description:
          '一个英雄辈出、充满权谋与背叛的乱世。汉室倾颓，曹、刘、孙三家分立，无数谋臣勇将围绕着忠义、理想和野心，上演了一幕幕波澜壮阔的史诗悲喜剧。',
      },
      {
        id: 'qin_han_empire',
        label: '秦汉帝国',
        description:
          '一个建立了中央集权大一统帝国的强大时代，以郡县制、长城、兵马俑和强有力的律法为标志。充满了开疆拓土的雄浑豪情与奠定后世两千年格局的制度自信。',
      },
      {
        id: 'wei_jin_southern_northern_dynasties',
        label: '魏晋南北朝',
        description:
          '一个政治混乱、战乱频仍，但思想奔放、个性张扬的时代。名士们以玄学清谈、饮酒服药来追求精神解放，门阀士族掌握着权力，佛道思想在此扎根。',
      },
      {
        id: 'sui_tang_dynasties',
        label: '隋唐盛世',
        description:
          '一个雍容大度、兼容并包的世界帝国。长安城是真正的国际都会，通过丝绸之路连接东西，胡人、神佛与诗人共同谱写了文明自信开放的黄金乐章。',
      },
      {
        id: 'song_yuan_dynasties',
        label: '宋元风雅',
        description:
          '一个市民文化和商业空前发达，文人审美达到顶峰的时代。艺术趋于内敛雅致，理学思想深入社会，同时面临着强大的外部军事压力与文明冲突。',
      },
      {
        id: 'ming_qing_empire',
        label: '明清帝国',
        description:
          '一个皇权高度集中、社会趋于稳定保守的后期帝国。以精巧的园林工艺、森严的宫廷礼仪和暗流涌动的厂卫政治为特征，是传统中华文明的集大成者。',
      },
      {
        id: 'republican_era',
        label: '民国乱世 (1912-1949)',
        description:
          '一个传统与现代、东方与西方激烈碰撞的动荡年代。军阀混战、革命思潮、租界浮华与家国情怀交织，充满了挣扎、迷惘与希望。',
      },
      {
        id: 'red_era',
        label: '红色年代 (1949-1978)',
        description:
          '一个在革命理想主义与集体主义旗帜下进行剧烈社会实验的时期。充满了标语、群众运动和朴素的禁欲主义美学，个人命运与国家意志紧密相连。',
      },
      {
        id: 'modern_china',
        label: '现代图景 (1979至今)',
        description:
          '一个在高速经济发展中融合了社会主义底色与消费主义逻辑的现代混合体。摩天楼森林、数字生活与无处不在的监控系统共同定义了这个充满机遇与矛盾的时代。',
      },
    ],
  },
  {
    id: 'japanese_civilization',
    label: '日本文明 (Japanese Civilization)',
    description:
      '一个在孤立与开放之间摇摆的岛国文明，以其独特的等级制度、对自然与无常之美的敏感，以及将外来文化进行本地化改造的强大能力为特征。',
    children: [
      {
        id: 'ancient_japan',
        label: '古代 (古坟-平安)',
        description:
          '一个由风雅的宫廷贵族主导的古典时代，充满了和歌、复杂的礼仪、阴阳师的传说以及对鬼神与“物哀”之美的迷恋。',
      },
      {
        id: 'medieval_japan',
        label: '中世 (镰仓-战国)',
        description:
          '一个由武士阶级通过幕府统治的漫长时代。以下克上、地方割据为常态，催生了坚忍克己的武士道精神与崇尚不完美的侘寂美学。',
      },
      {
        id: 'early_modern_japan',
        label: '近世/近代 (江户-明治)',
        description:
          '一个和平安定、市民文化繁荣的封建晚期，在外部压力下又经历着剧烈的西化改革与传统存续的激烈矛盾，充满了菊与刀的张力。',
      },
      {
        id: 'modern_contemporary_japan',
        label: '现当代',
        description:
          '一个财阀企业文化与流行亚文化并存的战后经济奇迹。都市的极致秩序与压抑之下，潜藏着光怪陆离的都市传说和对“空气”的无形遵循。',
      },
    ],
  },
  {
    id: 'korean_civilization',
    label: '朝鲜文明 (Korean Civilization)',
    description:
      '一个地处半岛、深受其强大邻国影响，却又顽强保持着独特身份认同的文明。其核心特征是森严的儒家社会等级、坚韧的民族精神和典雅精致的艺术传统。',
    children: [
      {
        id: 'ancient_goryeo',
        label: '古代/高丽',
        description:
          '一个以佛教为国教的王国，因其闻名于世的青瓷艺术而备受赞誉。其文化在吸收中华唐宋风韵的同时，也保留了自身独特的贵族传统。',
      },
      {
        id: 'joseon_dynasty',
        label: '朝鲜王朝',
        description:
          '一个以新儒家理学为立国之本的长期王朝。社会在“两班”文人贵族的统治下高度分层，充满了激烈的宫廷党争和对建立独立文化认同的追求。',
      },
    ],
  },
  {
    id: 'classical_medieval_europe',
    label: '欧洲古典与中世纪 (Classical & Medieval Europe)',
    description:
      '奠定西方文明根基的漫长时期，经历了从城邦哲学到帝国法律，再到神权笼罩下的封建秩序。其核心是理性、法律、信仰与蛮力的不断冲突与融合。',
    children: [
      {
        id: 'ancient_greece',
        label: '古希腊/城邦',
        description:
          '一个由众多独立城邦组成的文明，在公共广场上诞生了哲学与民主，在露天剧场上演着神话与悲剧，公民兵是城邦的基石。',
      },
      {
        id: 'roman_republic',
        label: '罗马共和国',
        description:
          '一个依靠公民、元老院和法律，通过强大的军团不断扩张的共和国。充满了贵族与平民的斗争、对荣誉的追求和务实的精神。',
      },
      {
        id: 'roman_empire',
        label: '罗马帝国',
        description:
          '一个横跨欧亚非的庞大帝国，以其宏伟的道路、水道桥、格斗士竞技和统一的法律体系，在辽阔的疆域上维持着几个世纪的“罗马和平”。',
      },

      {
        id: 'byzantine_empire',
        label: '拜占庭帝国',
        description:
          '作为东罗马帝国的延续，一个融合了希腊文化、罗马法律与东正教信仰的千年帝国。以其金碧辉煌的马赛克艺术、复杂的宫廷阴谋和作为东西方桥梁的角色而闻名。',
      },
      {
        id: 'dark_ages',
        label: '欧洲黑暗时代',
        description:
          '罗马崩溃后，古典知识在修道院中艰难保存的混乱时期。蛮族入侵与王国建立是常态，人们在失落的文明废墟上挣扎求存，信仰是唯一的慰藉。',
      },
      {
        id: 'high_middle_ages',
        label: '盛期中世纪/哥特',
        description:
          '一个以宏伟的哥特式大教堂、理想化的骑士精神和教皇的巨大权力为特征的时代。封建领主统治着乡村，新兴的城市则成为商人和工匠的家园。',
      },
      {
        id: 'viking_age',
        label: '北欧/维京时代',
        description:
          '一个由北欧航海家主导的时代。他们乘坐长船，既是进行探险与劫掠的勇士，也是沟通各地的商人，萨迦史诗与北欧众神是其精神核心。',
      },
    ],
  },
  {
    id: 'renaissance_modern_europe',
    label: '欧洲文艺复兴与近代 (Renaissance & Modern Europe)',
    description:
      '一个“人”被重新发现，世界被重新丈量的变革时代。从人文主义的复兴到大航海的探索，再到工业革命的轰鸣，世界在此刻被彻底重塑。',
    children: [
      {
        id: 'italian_renaissance',
        label: '意大利文艺复兴',
        description:
          '一个在意大利富裕的商业城邦中爆发的文化运动。在美第奇等家族的赞助下，艺术家与思想家重新发现了古典的价值，极大地推动了艺术和科学。',
      },
      {
        id: 'thirty_years_war',
        label: '三十年战争时期的德意志',
        description:
          '一个因宗教冲突而陷入长期毁灭性战争的时代。佣兵团横行，饥荒与瘟疫肆虐，信仰沦为野心的借口。这是最适合冷硬、低魔、现实主义奇幻的土壤。',
      },
      {
        id: 'age_of_discovery',
        label: '大航海时代/殖民帝国',
        description:
          '一个欧洲航海家驾驶着帆船，为了黄金、香料和信仰，探索并连接起整个世界的时代。充满了地理大发现的机遇，也伴随着残酷的征服与奴役。',
      },
      {
        id: 'napoleonic_era',
        label: '拿破仑时代',
        description:
          '一个在法国大革命的余波中崛起的军事强人，通过其大军团和法典，将革命的理念（以及战火）传播到整个欧洲的时代。充满了宏伟的会战、民族主义的觉醒与旧贵族秩序的崩塌。',
      },
      {
        id: 'victorian_era',
        label: '维多利亚时代/工业革命',
        description:
          '一个科技飞速发展、社会剧烈变革的时代。蒸汽与煤烟笼罩着城市，巨大的财富与赤贫并存，科学理性与神秘主义在矛盾中交织。',
      },
      {
        id: 'belle_epoque',
        label: '美好年代/昨日的世界 (世纪末欧洲)',
        description:
          '表面上，这是一个个人自由、文化艺术空前繁荣的黄金年代，充满了对安全、理性和持续进步的坚定信仰。优雅的表象下，是多民族帝国摇摇欲坠的结构和潜藏的极端民族主义暗流。',
      },
    ],
  },
  {
    id: 'near_middle_eastern_civilization',
    label: '近东与中东文明 (Near & Middle Eastern Civilization)',
    description:
      '人类文明最早的摇篮之一，也是各大宗教的诞生地。从古老的帝国到沙漠中的一神教信仰，这片土地始终是连接东西方的十字路口，充满了神圣与纷争。',
    children: [
      {
        id: 'mesopotamia',
        label: '美索不达米亚/两河',
        description:
          '两河之间的文明摇篮，诞生了最早的城市、楔形文字和法典。生活由强大的城邦、宏伟的阶梯式庙塔和变幻莫测的河神所主宰。',
      },
      {
        id: 'ancient_egypt',
        label: '古埃及',
        description: '一个沿尼罗河发展的古老神权文明，以其不朽的金字塔、复杂的来世信仰和被视为神明的法老而著称。',
      },
      {
        id: 'ancient_israel',
        label: '古以色列/犹太王国',
        description:
          '一个“上帝选民”的国度，一神论信仰在此诞生。其历史是在与上帝的契约、先知的警示以及夹在埃及与亚述/巴比伦两大帝国间的挣扎中展开的。',
      },
      {
        id: 'ancient_persia',
        label: '古波斯/阿契美尼德',
        description:
          '一个通过行省制度和皇家大道管理着广阔疆域的多元文化帝国。以其宏伟的皇都、相对宽容的统治政策以及祆教的二元论思想为特征。',
      },
      {
        id: 'islamic_golden_age',
        label: '伊斯兰黄金时代/阿拉伯',
        description:
          '一个在阿拉伯帝国统治下，以巴格达的“智慧宫”为代表的学术繁荣期。炼金术、数学、天文学和医学在此达到顶峰，保存并发展了古典知识。',
      },
      {
        id: 'ottoman_empire',
        label: '奥斯曼帝国',
        description:
          '一个横跨欧亚非的强大伊斯兰军事帝国，以其骁勇的禁卫军、雄伟的清真寺和对辽阔疆域内多民族的统治而闻名。',
      },
    ],
  },
  {
    id: 'indian_southeast_asian_civilization',
    label: '印度与东南亚文明 (Indian & Southeast Asian Civilization)',
    description:
      '一片深受季风影响，充满了浓郁精神氛围和鲜活色彩的土地。其特征在于轮回转世的世界观、复杂的社会结构以及本土文化与外来信仰的深度融合。',
    children: [
      {
        id: 'ancient_india',
        label: '古印度/孔雀王朝',
        description:
          '一个在阿育王治下，通过宣扬佛法与和平主义实现了统一的古帝国。其社会由复杂的种姓制度所构成，是多种宗教与哲学的发源地。',
      },
      {
        id: 'mughal_empire',
        label: '莫卧儿帝国',
        description:
          '一个由信奉伊斯兰教的征服者在印度次大陆建立的帝国，创造了融合波斯、印度教元素的壮丽建筑（如泰姬陵）与精致的细密画艺术。',
      },
      {
        id: 'khmer_empire',
        label: '高棉帝国/吴哥',
        description:
          '一个在热带雨林中建立了巨石神殿（如吴哥窟）和复杂水利系统的东南亚强权。其文化以印度教和佛教的神王崇拜为核心。',
      },
      {
        id: 'majapahit_empire',
        label: '满者伯夷/海洋王国',
        description:
          '一个依靠制海权和香料贸易，将广阔的东南亚群岛连接起来的海洋帝国。其文化因贸易而多元，充满了活力与冒险精神。',
      },
    ],
  },
  {
    id: 'steppe_nomadic_civilization',
    label: '草原与游牧文明 (Steppe & Nomadic Civilization)',
    description:
      '一个属于骏马与苍穹的文明，由移动、凶猛的独立性和围绕部落联盟构建的社会所定义。他们的世界是无垠的草原、季节性的迁徙，以及与定居帝国之间贸易和战争的永恒循环。',
    children: [
      {
        id: 'early_steppe_empires',
        label: '早期草原帝国 (匈奴/鲜卑)',
        description:
          '由强大的部落联盟组成的早期游牧帝国，他们的生活逐水草而居。作为农耕文明永恒的威胁与贸易伙伴，他们的骑射技术令人闻风丧胆。',
      },
      {
        id: 'turkic_khaganate',
        label: '突厥/回鹘汗国',
        description:
          '主宰丝绸之路的强大突厥语族汗国，是东西方之间重要的文化与商业中介。他们军事实力强大，文化兼容并蓄，在广阔的草原上留下了自己的如尼文碑刻。',
      },
      {
        id: 'mongol_empire',
        label: '蒙古帝国',
        description:
          '一个史无前例的陆上大帝国，以其势不可挡的征服、连接东西方的驿站系统和相对的宗教宽容政策而闻名于世。',
      },
    ],
  },
  {
    id: 'american_civilization',
    label: '美洲文明 (American Civilization)',
    description:
      '与旧大陆隔绝发展的多元文明，创造了独特的农业、数学和天文学体系。其遗产镌刻在雨林与高原的宏伟石质纪念碑、复杂的历法和独特的社会结构之中。',
    children: [
      {
        id: 'pre_columbian_civilizations',
        label: '前哥伦布文明 (玛雅/阿兹特克/印加)',
        description: '独立于旧大陆发展的多样文明，以其独特的天文学、金字塔神庙、血祭仪式和复杂的社会组织而闻名于世。',
      },
      {
        id: 'north_american_colonial_period',
        label: '北美殖民时期',
        description:
          '一个欧洲殖民者、原住民和非洲奴隶在“新世界”的土地上发生激烈冲突与初步融合的时期。充满了对宗教自由的追求、土地的争夺和新身份的形成。',
      },
      {
        id: 'american_frontier',
        label: '美国西部拓荒',
        description:
          '一个充满了机遇、暴力和个人主义精神的时代，牛仔、淘金者、枪手和拓荒者在广袤的西部边疆追求财富和自由。',
      },
    ],
  },
  {
    id: 'african_oceanian_civilization',
    label: '非洲与大洋洲文明 (African & Oceanian Civilization)',
    description:
      '一片广袤而极度多样化的大陆，从强大的内陆贸易帝国到融入全球网络的沿海城邦。其历史以丰富的口述传统、复杂的亲属制度，以及奴隶贸易和欧洲殖民主义所带来的深远创伤为特征。',
    children: [
      {
        id: 'west_african_empires',
        label: '西非/马里-桑海帝国',
        description:
          '因跨撒哈拉黄金与盐贸易而极其富庶的西非帝国。以其传说中的黄金之城廷巴克图为中心，曾是重要的伊斯兰学术与文化中心。',
      },
      {
        id: 'swahili_coast',
        label: '东非/斯瓦希里海岸',
        description:
          '一系列受阿拉伯、波斯和印度文化影响的繁荣商业城邦。他们是印度洋贸易网络的重要枢纽，形成了独特的斯瓦希里混合文化。',
      },
      {
        id: 'polynesian_navigation',
        label: '大洋洲/波利尼西亚',
        description:
          '依靠对星辰与洋流的深刻理解，驾驶着舷外浮杆独木舟，在浩瀚的太平洋上进行勇敢迁徙的海洋文明。其文化以纹身艺术、复杂的社会等级和丰富的神话体系为特征。',
      },
    ],
  },
  {
    id: 'general_modern_contemporary_settings',
    label: '现当代通用背景 (General Modern & Contemporary Settings)',
    description: '脱离了具体国别，以某个标志性的时代精神和全球性事件为核心的背景板。',
    children: [
      {
        id: 'roaring_twenties',
        label: '咆哮的二十年代',
        description:
          '一战结束后，一个经济空前繁荣、社会观念解放的短暂黄金时代。装饰艺术、爵士乐、摩天楼、禁酒令下的黑帮共同定义了这份浮华与躁动。',
      },
      {
        id: 'weimar_republic',
        label: '德国魏玛共和国',
        description:
          '一个充满了绝望创造力的战败国。恶性通货膨胀、政治极端主义与卡巴莱的颓废歌舞、包豪斯的新锐设计和表现主义电影的怪诞光影交织，社会在崩溃的边缘狂欢。',
      },
      {
        id: 'wwii_atomic_age',
        label: '二战与原子时代 (1930s-1950s)',
        description:
          '一个被世界大战的阴云和核武器的蘑菇云所笼罩的时代。充满了意识形态的对抗、工业化的战争机器以及对科技力量的敬畏与恐惧。',
      },
      {
        id: 'cold_war_era',
        label: '冷战时代 (1950s-1980s)',
        description:
          '一个由两大超级大国对峙，世界分为两大阵营的时代。充满了间谍战、太空竞赛、代理人战争和对随时可能爆发的核末日的焦虑。',
      },
      {
        id: 'post_cold_war_globalization',
        label: '后冷战/全球化时代 (1990s-2010s)',
        description:
          '一个意识形态冲突趋缓，互联网开始连接全球的时代。充满了对“历史终结”的乐观主义、消费文化的扩张和潜藏的文明冲突。',
      },
    ],
  },
];

// Placeholder for aesthetic filters
export const AESTHETIC_FILTER_HIERARCHY: CultureParent[] = [
  {
    id: 'sci_fi_punk_variants',
    label: '1. 科幻与朋克变体 (Sci-Fi & Punk Variants)',
    description:
      '以某种超前或架空的“科技”为核心，探讨其对社会、文化和人性的冲击与重塑。它们通常带有一种批判性、反思性或类型化的强烈风格。',
    children: [
      {
        id: 'cyberpunk',
        label: '赛博朋克',
        description:
          '高科技，低生活。一个由巨型企业、网络空间和神经接口主宰的世界。义体改造司空见惯，霓虹灯下的冰冷雨夜冲刷着阶级固化的都市，人性在技术洪流中廉价而脆弱。',
      },
      {
        id: 'steampunk',
        label: '蒸汽朋克',
        description:
          '以维多利亚时代的优雅与第一次工业革命的粗粝为基底的幻想。世界由黄铜、齿轮和精密复杂的钟表机械驱动，巨大的飞空艇划过煤烟笼罩的天空，科学怪人与绅士探险家并存。',
      },
      {
        id: 'dieselpunk',
        label: '柴油朋克',
        description:
          '植根于两次世界大战之间（1920s-1950s）的美学，比蒸汽朋克更肮脏、更沉重。世界充满了内燃机的轰鸣、铆接的厚重装甲和装饰艺术风格的战争机器，弥漫着爵士乐与硝烟混合的味道。',
      },
      {
        id: 'atompunk',
        label: '原子朋克',
        description:
          '五十年代对原子能未来的乐观幻想。世界充满了流线型汽车、真空管设备、射线枪和身着紧身宇航服的英雄。其背后是对核能乌托邦的信仰，以及对共产主义渗透的偏执恐惧。',
      },
      {
        id: 'biopunk_nanopunk',
        label: '生物朋克/纳米朋克',
        description:
          '科技的核心是基因剪刀、活体组织或纳米机器人。世界充满了怪诞的生物改造、有生命的建筑、人工合成的瘟疫和对“人类”定义的根本性挑战。',
      },
      {
        id: 'solarpunk',
        label: '太阳朋克',
        description:
          '一个乐观、环保的未来。科技不再是自然的对立面，而是与之和谐共生。世界以新艺术风格的建筑、繁茂的社区花园和清洁的可再生能源为标志，强调社群、合作与创造力。',
      },
      {
        id: 'space_opera',
        label: '太空歌剧',
        description:
          '将家族恩怨、帝国兴衰、史诗战争与浪漫冒险放大到整个银河系。其重点不在科学的严谨性，而在宏大的叙事、鲜明的角色和跨越星辰的戏剧冲突。',
      },
      {
        id: 'hard_sci_fi',
        label: '硬科幻',
        description:
          '科学法则至上。故事严格遵循已知的物理、化学和生物学原理，严谨地推演技术细节及其对社会的逻辑影响，强调理性探索和面临的真实困境。',
      },
      {
        id: 'post_apocalyptic_wasteland',
        label: '后启示录/废土',
        description:
          '文明已逝，拾荒求生。旧世界的废墟上，幸存者们组成小团体，为了稀缺的资源（水、汽油、弹药）而战。变异的生物和严酷的环境是永恒的威胁，道德已成为奢侈品。',
      },
    ],
  },
  {
    id: 'fantasy_magic_genres',
    label: '2. 奇幻与魔法类型 (Fantasy & Magic Genres)',
    description:
      '以超自然力量（魔法、神力、气）的存在为基础，构建世界的规则与冲突。其光谱从光明史诗到黑暗个人，从东方仙侠到西方魔幻，各有不同。',
    children: [
      {
        id: 'epic_fantasy_high_magic',
        label: '史诗奇幻/高魔',
        description:
          '魔法是一种强大而普遍的力量，世界面临着被黑暗魔君或古老邪恶毁灭的危机。故事往往围绕着被古老预言选中的英雄、拯救世界的宏大任务和泾渭分明的正邪对抗展开。',
      },
      {
        id: 'sword_and_sorcery_low_magic',
        label: '剑与魔法/低魔',
        description:
          '魔法是稀有、危险、难以理解且往往与堕落和腐败相关联的力量。故事聚焦于狡诈、务实的英雄（或反英雄）为了财富、复仇或生存而进行的个人冒险。',
      },
      {
        id: 'dark_fantasy',
        label: '黑暗幻想',
        description:
          '一个绝望、残酷且道德模糊的世界。超自然恐怖元素与奇幻设定深度融合，英雄往往是堕落或有缺陷的，胜利的代价极其高昂，甚至胜利本身就是一种幻觉。',
      },
      {
        id: 'urban_fantasy',
        label: '都市奇幻',
        description:
          '魔法、吸血鬼、狼人和其他超自然存在隐藏在现代都市的表面之下，进行着一场不为凡人所知的秘密战争。故事往往围绕着维持“帷幕”或在两个世界间斡旋的主角展开。',
      },
      {
        id: 'wuxia',
        label: '武侠',
        description:
          '一个存在“气”或“内力”的世界，人们通过修炼获得超凡武艺。故事发生在名为“江湖”的法外社会，围绕着门派恩怨、神功秘籍、侠义精神和个人道义的抉择展开。',
      },
      {
        id: 'xianxia',
        label: '仙侠',
        description:
          '将东亚哲学与奇幻相结合，讲述追求个人超脱与宇宙法则的史诗。故事的核心是修仙炼道、积攒功德、渡过天劫，最终跳出轮回、羽化飞升。',
      },
      {
        id: 'magicpunk',
        label: '魔法朋克',
        description:
          '魔法不再是神秘的艺术，而是被当作一种能源或技术，被系统化地研究、工业化地生产和商品化地应用。魔法学院如同麻省理工，魔力水晶驱动着城市，引发了剧烈的社会变革与阶级冲突。',
      },
    ],
  },
  {
    id: 'horror_thriller_atmospheres',
    label: '3. 恐怖与悬疑氛围 (Horror & Thriller Atmospheres)',
    description:
      '将世界笼罩在特定的恐惧或紧张氛围之下，其核心冲突来源于心理的压抑、未知的威胁、肉体的失控或社会的偏执。',
    children: [
      {
        id: 'cosmic_horror_cthulhu',
        label: '宇宙恐怖/克苏鲁',
        description:
          '人类的知识和理性在浩瀚、冷漠的宇宙真相面前一文不值。恐惧来源于对未知的探求，以及在接触到非欧几里得几何、不可名状的古神后，心智崩溃、人类渺小如尘埃的恐怖。',
      },
      {
        id: 'gothic_horror',
        label: '哥特式恐怖',
        description:
          '恐惧来源于压抑的氛围、衰败的贵族、古老的城堡和无法摆脱的家族诅咒。故事充满了超自然现象、心理的折磨和对过去罪恶的宿命式偿还。',
      },
      {
        id: 'body_horror',
        label: '肉体恐怖',
        description:
          '最根源的恐惧来源于对自身肉体完整性的侵犯和失控。世界充满了寄生、变异、畸变和血肉融合的元素，挑战着观众对“正常”身体的认知底线。',
      },
      {
        id: 'folk_horror',
        label: '民间恐怖',
        description:
          '恐惧植根于偏远乡村、古老的民间传说、被遗忘的异教仪式和看似淳朴的社群所隐藏的黑暗秘密。外来者会发现，这里的规则远比他们想象的更古老和致命。',
      },
      {
        id: 'political_thriller_intrigue',
        label: '政治惊悚/权谋',
        description:
          '将焦点集中在基石文化的权力结构上，营造出人人自危、无处可逃的偏执氛围。故事充满了阴谋、背叛、监视、暗杀和为争夺控制权而展开的无声战争。',
      },
    ],
  },
  {
    id: 'societal_philosophical_concepts',
    label: '4. 社会与哲学概念 (Societal & Philosophical Concepts)',
    description: '以一种强烈的社会或哲学理念为核心，构建整个世界的运作逻辑。它通常是对现实某种思潮的极端化推演。',
    children: [
      {
        id: 'utopia',
        label: '乌托邦',
        description:
          '一个没有冲突、疾病或贫困的完美社会。公民和谐、富足、心智健全。然而，故事的张力往往来源于对这种完美社会背后代价的探寻，或是外部世界对这份宁静的打破。',
      },
      {
        id: 'dystopia',
        label: '敌托邦/反乌托邦',
        description:
          '一个表面上稳定、有序甚至完美的社会，其根基却是思想控制、情感压抑、个体自由的丧失和无处不在的监视。故事通常讲述主角的觉醒与反抗。',
      },
      {
        id: 'absurdism_surrealism',
        label: '荒诞主义/超现实',
        description:
          '世界的运作不遵循物理或逻辑法则，而是遵循梦境和潜意识的象征逻辑。角色身处一个看似毫无意义的世界，努力寻找或创造自己的意义，充满了怪诞的意象和黑色幽默。',
      },
      {
        id: 'counter_culture_psychedelic',
        label: '反文化/迷幻',
        description:
          '植根于20世纪60年代的嬉皮士运动，强调对主流价值观的反叛。世界充满了精神探索、迷幻摇滚、东方神秘主义、性和平与爱的社群，以及与保守当权派的冲突。',
      },
      {
        id: 'nihilism_existentialism',
        label: '虚无主义/存在主义',
        description:
          '世界本身没有内在的意义、目的或价值。角色在这样一个冷漠的宇宙中，必须直面自由选择的重负，并为自己的行为承担全部责任，从而创造属于自己的存在意义。',
      },
    ],
  },
  {
    id: 'narrative_modes_art_styles',
    label: '5. 叙事模式与艺术风格 (Narrative Modes & Art Styles)',
    description:
      '直接套用一种强大的叙事传统或视觉艺术风格，使其成为世界的主导基调，决定了故事的讲述方式和给人的整体观感。',
    children: [
      {
        id: 'film_noir',
        label: '黑色电影',
        description:
          '一个犬儒、悲观的都市世界。故事由一个玩世不恭的硬汉主角、一位神秘致命的蛇蝎美人和一宗棘手的案件构成。城市永远在下雨，光影对比强烈，道德界限模糊，宿命感挥之不去。',
      },
      {
        id: 'tragedy_classical_shakespearean',
        label: '悲剧 (古典/莎翁式)',
        description:
          '故事遵循经典的悲剧结构。一个高贵或伟大的主角，因其自身的性格缺陷（如傲慢、多疑）或无法抗拒的命运，不可避免地走向毁灭，从而引发观众的怜悯与恐惧。',
      },
      {
        id: 'satire_parody',
        label: '讽刺/戏仿',
        description:
          '通过夸张、反讽和模仿，对基石文化或其他类型作品进行系统性的批判或嘲弄。世界的逻辑看似荒谬，却精准地击中了现实的痛点。',
      },
      {
        id: 'baroque_rococo',
        label: '巴洛克/洛可可',
        description:
          '一种极尽繁复、奢华和戏剧性的美学。世界充满了华丽的卷草纹、动感的人物雕塑、强烈的光影对比和奔放的宗教或世俗情感，追求宏大而震撼的感官体验。',
      },
      {
        id: 'art_deco_art_nouveau',
        label: '装饰艺术/新艺术运动',
        description:
          '一种强调优雅、有机的曲线或简洁的几何线条的装饰风格。世界充满了从自然（花卉、昆虫）中汲取灵感的图案、奢华的材质（乌木、象牙）和强烈的现代感。',
      },
      {
        id: 'minimalism_brutalism',
        label: '极简主义/粗野主义',
        description:
          '一种功能至上、摒弃一切不必要装饰的美学。世界由未经修饰的材料（如清水混凝土）、暴露的结构和巨大的几何体块构成，营造出一种冷峻、肃穆甚至压抑的氛围。',
      },
    ],
  },
];
