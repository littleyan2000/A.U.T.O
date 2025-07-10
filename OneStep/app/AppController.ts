import { CHARACTER_OPTIONS } from '../constants/character-options';
import { AESTHETIC_FILTER_HIERARCHY, CULTURAL_ARCHETYPE_HIERARCHY } from '../constants/culture-options';
import { NEEDS_OPTIONS } from '../constants/needs-options';
import { PRESET_TYPE_OPTIONS } from '../constants/preset-type-options';
import { createDefaultObject, RULES_SCHEMAS } from '../constants/rules-schema';
import { AVAILABLE_TAGS } from '../constants/tags';
import { WORLDVIEW_MODULES } from '../constants/world-options';
import { AppState, CompletionStatus, DpaItem, PageType } from '../types/AppTypes';
import { deepClone } from '../utils/deepClone';
import { generateUUID } from '../utils/generateUUID';
import { DataManager } from './DataManager';
import { Formatter } from './Formatter';
import { NavigationManager } from './NavigationManager';
import { RandomGenerator } from './RandomGenerator';
import { ValidationManager } from './ValidationManager';

export class AppController {
  private state: AppState;
  private initialFormData: AppState['formData'];
  public nav: NavigationManager;
  public data: DataManager;
  public formatter: Formatter;
  public validation: ValidationManager;
  public random: RandomGenerator;

  private subscribers: ((state: AppState) => void)[];

  constructor() {
    console.log('AppController: Constructor started');
    this.subscribers = [];
    this.state = this.getInitialState();
    this.initialFormData = deepClone(this.state.formData);
    this.nav = new NavigationManager(this);
    this.data = new DataManager();
    this.formatter = new Formatter();
    this.validation = new ValidationManager();
    this.random = new RandomGenerator();
    this.recomputeState();
  }

  private getInitialState(): AppState {
    // Pre-populate the world modules with default state
    const initialWorldModules: AppState['formData']['world']['modules'] = {};
    WORLDVIEW_MODULES.forEach(module => {
      initialWorldModules[module.id] = {
        status: 'editing',
        randomMode: 'auto',
        macro_selections: {},
        specific_items: [],
        expanded: false, // Set to collapsed by default
      };
      // Specifically initialize the aesthetics module for the DPA component
      if (module.id === 'aesthetics') {
        initialWorldModules[module.id].dpa_items = [];
        initialWorldModules[module.id].dpa_total_points = 0;
      }
    });

    return {
      navigation: {
        currentPage: 'needs',
        visitedPages: new Set(['needs']),
        pageHistory: [],
        canNavigateBack: false,
        canNavigateForward: true,
      },
      ui: {
        loading: false,
        error: null,
        showHelp: false,
        expandedSections: new Set(),
        showWordCountBreakdown: false,
        theme: 'dark',
        locale: 'en-US',
        isDirty: false,
        lastSaved: null,
      },
      formData: {
        needs: {
          emotion: {
            points: {
              '浪漫/亲密关系': 0,
              '情欲/性吸引力': 0,
              '成就/个人成长': 0,
              '慰藉/情感支持': 0,
              '惊险/紧张感': 0,
              负面情感宣泄: 0,
              '探索/揭示秘密': 0,
              '幽默/喜剧性': 0,
            },
            flavors: {},
            status: 'editing',
            randomMode: 'auto',
            expanded: false, // Set to collapsed by default
          },
          power: {
            // 全局关系设定
            objective_spectrum: '',
            dominant_party: '',
            dominant_power_sources_points: {
              物理力量: 0,
              社会地位: 0,
              资源控制: 0,
              知识信息: 0,
              情感勒索: 0,
              心理控制: 0,
              潜在威胁: 0,
              '合法性/正当性': 0,
            },
            expression_spectrum: '',
            importance_spectrum: '',
            // PC 动态
            pc_dynamics: {
              interaction_strategy: '',
              initial_subjective_state: '',
              target_subjective_state: '',
            },
            // NPC 动态
            npc_dynamics: {
              interaction_strategy: '',
              initial_subjective_state: '',
              target_subjective_state: '',
            },
            status: 'editing',
            randomMode: 'auto',
            expanded: false, // Set to collapsed by default
          },
          narrative: {
            world_harmony_spectrum: '',
            npc_compliance_spectrum: '',
            pace_spectrum: '',
            perspective_choice: '',
            perspective_switching_mode: '',
            status: 'editing',
            randomMode: 'auto',
            expanded: false, // Set to collapsed by default
          },
          boundaries: {
            consent_tolerance_level: '',
            erotic_level: '',
            erotic_focus: '',
            violence_level: '',
            violence_focus: '',
            description_intensity_spectrum: '',
            tags: {},
            consequence_severity_spectrum: '',
            status: 'editing',
            randomMode: 'auto',
            expanded: false, // Set to collapsed by default
          },
          custom_notes: {
            status: 'editing',
            content: '',
          },
          disabled: false,
          validation: [],
        },
        world: {
          modules: initialWorldModules,
          custom_input: {
            enabled: true,
            content: '',
          },
          disabled: false,
          validation: [],
        },
        character: {
          pc: {
            template_level: '',
            enable_nsfw_attributes: false,
            custom_concept: '',
            status: 'editing',
            randomMode: 'auto',
            expanded: false, // Set to collapsed by default
            // --- Add default values for migrated fields ---
            social_class: '',
            psychological_profile: {
              openness: '',
              conscientiousness: '',
              extraversion: '',
              agreeableness: '',
              neuroticism: '',
            },
            core_values: {
              care: '',
              fairness: '',
              loyalty: '',
              authority: '',
              sanctity: '',
              liberty: '',
            },
          },
          key_characters: {
            list: [],
            status: 'editing',
            randomMode: 'auto',
            expanded: false, // Set to collapsed by default
          },
          world_population: {
            supporting: {
              template_level: '',
              enable_nsfw_attributes: false,
              role_focus_counts: {
                任务发布人: 0,
                情报商人: 0,
                技术专家: 0,
                派系联络人: 0,
                地方恶霸: 0,
                世界解说员: 0,
              },
              custom_notes: '',
            },
            ambient: {
              template_level: '',
              enable_nsfw_attributes: false,
              group_counts: {
                平民百姓: 0,
                执法力量: 0,
                商业力量: 0,
                宗教力量: 0,
                地下社会: 0,
                旅行过客: 0,
              },
              custom_notes: '',
            },
            status: 'editing',
            randomMode: 'auto',
            expanded: false, // Set to collapsed by default
          },
          disabled: false,
          validation: [],
        },
        plot: new DataManager().getDefaultPlotData(),
        rules: {
          trackers: {
            status: 'editing',
            randomMode: 'auto',
            expanded: true,
            list: [],
          },
          descriptors: {
            status: 'editing',
            randomMode: 'auto',
            expanded: true,
            list: [],
          },
          causal_triggers: {
            status: 'editing',
            randomMode: 'auto',
            expanded: true,
            list: [],
          },
          disabled: false,
          validation: [],
        },
        style: {
          mode: {
            selection: '',
            status: 'editing',
            randomMode: 'auto',
            expanded: true,
          },
          adjustments: {
            narrator_stance_spectrum: '',
            linguistic_texture_spectrum: '',
            descriptive_focus_points: {
              '场景/氛围': 0,
              '角色外貌/神情': 0,
              '角色动作/行为': 0,
              '角色心理/内省': 0,
              '物品/细节': 0,
              '概念/信息': 0,
            },
            rhetorical_strategy_spectrum: '',
            syntactic_rhythm_spectrum: '',
            sensory_channels_points: {
              '视觉 (Vision)': 0,
              '听觉 (Hearing)': 0,
              '嗅觉/味觉 (Smell/Taste)': 0,
              '触觉/体感 (Touch/Kinaesthetics)': 0,
              '性器官/第二性征': 0,
              '内在感受/直觉': 0,
            },
            custom_notes: '',
            status: 'editing',
            randomMode: 'auto',
            expanded: true,
          },
          dynamic_rules: {
            list: [],
            status: 'editing',
            randomMode: 'auto',
            expanded: true,
          },
          disabled: false,
          validation: [],
        },
      },
      computed: {
        wordCounts: { needs: 0, world: 0, character: 0, plot: 0, rules: 0, style: 0 },
        totalWordCount: 0,
        validationErrors: [],
        completionStatus: {} as Record<PageType, CompletionStatus>,
        completionPercentage: 0,
        canGenerate: false,
      },
      settings: {
        autoSave: true,
        showValidationInRealTime: true,
        enableRandomGeneration: false,
        wordCountUpdateDelay: 500,
      },
    };
  }

  public getState = (): AppState => {
    return deepClone(this.state);
  };

  public subscribe = (listener: (state: AppState) => void): (() => void) => {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== listener);
    };
  };

  private notify = (): void => {
    this.subscribers.forEach(sub => sub(this.getState()));
  };

  public setState = (updates: Partial<AppState>): void => {
    this.state = {
      ...this.state,
      ...updates,
      formData: { ...this.state.formData, ...updates.formData },
      navigation: { ...this.state.navigation, ...updates.navigation },
      ui: { ...this.state.ui, ...updates.ui },
      computed: { ...this.state.computed, ...updates.computed },
      settings: { ...this.state.settings, ...updates.settings },
    };
    this.recomputeState();
    this.notify();
  };

  public updateFormData = (page: PageType, fieldPath: string, value: any): void => {
    // Create a deep clone to avoid direct state mutation
    const newFormData = deepClone(this.state.formData);

    const pathParts = fieldPath.match(/[^.[\]]+/g) || [];
    let currentLevel: any = newFormData[page];

    for (let i = 0; i < pathParts.length - 1; i++) {
      const key = pathParts[i];
      if (currentLevel[key] === undefined || currentLevel[key] === null) {
        // If a path doesn't exist, create it. Check if next part is a number to decide between array/object
        const nextKeyIsNumber = /^\d+$/.test(pathParts[i + 1]);
        currentLevel[key] = nextKeyIsNumber ? [] : {};
      }
      currentLevel = currentLevel[key];
    }

    currentLevel[pathParts[pathParts.length - 1]] = value;

    // --- Type Coercion for specific fields ---
    if (page === 'character' && fieldPath.endsWith('enable_nsfw_attributes')) {
      currentLevel[pathParts[pathParts.length - 1]] = !!value;
    }

    // --- Worldview Min/Max Validation ---
    if (page === 'world' && fieldPath.includes('macro_selections')) {
      this.handleWorldviewRangeUpdate(newFormData, fieldPath, value);
    }

    // --- Rules State Tracker Min/Max Validation ---
    if (page === 'rules' && pathParts[0] === 'trackers' && pathParts[3] === 'initial_value') {
      const tracker = newFormData.rules.trackers.list[parseInt(pathParts[1], 10)];
      if (tracker && tracker.initial_value) {
        const { min, max } = tracker.initial_value;
        if (min > max) {
          if (pathParts[4] === 'max') {
            tracker.initial_value.min = max;
          } else {
            tracker.initial_value.max = min;
          }
        }
      }
    }

    // Set the new state with the modified formData
    this.setState({ formData: newFormData });
  };

  public updatePoints = (
    page: PageType,
    fieldPath: string,
    category: string,
    amount: number,
    maxPoints: number,
  ): void => {
    const pathParts = `${page}.${fieldPath}`.split('.');
    let currentLevel: any = this.state.formData;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (currentLevel[part] === undefined || currentLevel[part] === null) {
        currentLevel[part] = {};
      }
      currentLevel = currentLevel[part];
    }

    const finalKey = pathParts[pathParts.length - 1];
    if (currentLevel[finalKey] === undefined || currentLevel[finalKey] === null) {
      currentLevel[finalKey] = {};
    }
    const points = currentLevel[finalKey];

    const total = Object.values(points).reduce((s: number, v: any) => s + v, 0);

    if ((amount > 0 && total < maxPoints) || (amount < 0 && (points[category] || 0) > 0)) {
      points[category] = (points[category] || 0) + amount;
      this.recomputeState();
      this.notify();
    }
  };

  public updateTagPreference = (
    page: PageType,
    fieldPath: string,
    tag: string,
    preference: 'like' | 'dislike' | 'neutral',
  ): void => {
    const tags = this.data.getDeepValue(this.state.formData, `${page}.${fieldPath}`);
    if (preference === 'neutral') {
      delete tags[tag];
    } else {
      tags[tag] = preference;
    }
    this.recomputeState();
    this.notify();
  };

  public addAestheticsItem = (item: {
    id: string;
    label: string;
    description: string;
    source: 'culture' | 'filter';
  }): void => {
    const aestheticsModule = this.state.formData.world.modules['aesthetics'];

    if (aestheticsModule && aestheticsModule.dpa_items) {
      if (aestheticsModule.dpa_items.some(existingItem => existingItem.id === item.id)) {
        return;
      }

      const newItem: DpaItem = {
        ...item,
        points: 0,
      };
      aestheticsModule.dpa_items.push(newItem);
      this.recomputeState();
      this.notify();
    }
  };

  public removeAestheticsItem = (itemId: string): void => {
    const aestheticsModule = this.state.formData.world.modules['aesthetics'];

    if (aestheticsModule && aestheticsModule.dpa_items) {
      const itemIndex = aestheticsModule.dpa_items.findIndex(item => item.id === itemId);
      if (itemIndex > -1) {
        aestheticsModule.dpa_items.splice(itemIndex, 1);
        aestheticsModule.dpa_total_points = aestheticsModule.dpa_items.reduce((total, item) => total + item.points, 0);
        this.recomputeState();
        this.notify();
      }
    }
  };

  public updateAestheticsItemPoints = (itemId: string, amount: number): void => {
    const aestheticsModule = this.state.formData.world.modules['aesthetics'];

    if (aestheticsModule && aestheticsModule.dpa_items && aestheticsModule.dpa_total_points !== undefined) {
      const item = aestheticsModule.dpa_items.find(i => i.id === itemId);
      if (!item) return;

      const currentTotal = aestheticsModule.dpa_total_points;
      const canIncrease = amount > 0 && currentTotal < 10;
      const canDecrease = amount < 0 && item.points > 0;

      if (canIncrease || canDecrease) {
        item.points += amount;
        aestheticsModule.dpa_total_points += amount;
        this.recomputeState();
        this.notify();
      }
    }
  };

  public deleteWorldviewSpecificItem = (moduleId: string, index: number): void => {
    const moduleState = this.state.formData.world.modules[moduleId];
    if (moduleState && moduleState.specific_items[index]) {
      moduleState.specific_items.splice(index, 1);
      this.recomputeState();
      this.notify();
    }
  };

  public toggleWorldviewItemCollapse = (moduleId: string, index: number): void => {
    const item = this.state.formData.world.modules[moduleId]?.specific_items[index];
    if (item) {
      item.isCollapsed = !item.isCollapsed;
      this.notify();
    }
  };

  public dpaRemoveItem = (page: PageType, fieldPath: string, category: string): void => {
    const points = this.data.getDeepValue(this.state.formData, `${page}.${fieldPath}`);
    if (points.hasOwnProperty(category)) {
      delete points[category];
      this.recomputeState();
      this.notify();
    }
  };

  public addListItem = (page: PageType, fieldPath: string, options?: { [key: string]: any }): void => {
    const list = this.data.getDeepValue(this.state.formData, `${page}.${fieldPath}`) as any[];

    if (!Array.isArray(list)) {
      console.error(`Target for addListItem is not an array. Path: ${page}.${fieldPath}`);
      return;
    }

    let newItem: any = null;

    if (page === 'character' && fieldPath === 'key_characters.list') {
      // 从 CHARACTER_OPTIONS 获取默认值
      const defaultTemplateLevel = CHARACTER_OPTIONS.key.template_level[0]?.value || '基础骨架 (等级2)';
      newItem = {
        id: generateUUID(),
        template_level: defaultTemplateLevel,
        enable_nsfw_attributes: false,
        relational_proximity: '',
        social_class: '',
        thematic_role_1: '',
        thematic_role_2: '',
        psychological_profile: {
          openness: '',
          conscientiousness: '',
          extraversion: '',
          agreeableness: '',
          neuroticism: '',
        },
        core_values: {
          care: '',
          fairness: '',
          loyalty: '',
          authority: '',
          sanctity: '',
          liberty: '',
        },
        custom_concept: '',
        isLocked: false,
        isCollapsed: true, // Set to collapsed by default
      };
    } else if (page === 'world' && fieldPath.endsWith('.specific_items')) {
      if (!options?.itemType) {
        console.error('itemType is required to add a worldview specific item.');
        return;
      }
      newItem = {
        id: generateUUID(),
        type: options.itemType,
        name: '',
        description: '',
        category: '',
        isCollapsed: false, // Default to expanded
      };
    } else if (page === 'plot' && fieldPath === 'narrative_driven.list') {
      newItem = {
        id: generateUUID(),
        branch_type: '',
        pacing_arc: '',
        description: '',
        isCollapsed: false,
        isLocked: false,
      };
    } else if (page === 'plot' && fieldPath === 'sandbox.elements') {
      newItem = {
        id: generateUUID(),
        type: '地区', // Default type
        description: '',
        isCollapsed: false,
        isLocked: false,
      };
    } else {
      const schemaKey = fieldPath.replace(/\.\d+\./g, '.0.');
      const schema = RULES_SCHEMAS[schemaKey];

      if (schema) {
        newItem = createDefaultObject(schema);
      } else {
        console.error(`Could not find a creation schema for path: ${fieldPath} (resolved to ${schemaKey})`);
        return;
      }
    }

    if (newItem) {
      list.push(newItem);
      this.recomputeState();
      this.notify();
    }
  };

  public deleteListItem = (page: PageType, fieldPath: string, index: number): void => {
    const list = this.data.getDeepValue(this.state.formData, `${page}.${fieldPath}`) as any[];
    if (Array.isArray(list) && index >= 0 && index < list.length) {
      list.splice(index, 1);
      this.recomputeState();
      this.notify();
    }
  };

  public toggleKeyCharacterLock = (index: number): void => {
    const character = this.state.formData.character.key_characters.list[index];
    if (character) {
      character.isLocked = !character.isLocked;
      this.notify();
    }
  };

  public toggleKeyCharacterCollapse = (index: number): void => {
    const character = this.state.formData.character.key_characters.list[index];
    if (character) {
      character.isCollapsed = !character.isCollapsed;
      this.notify();
    }
  };

  public toggleLinearArcLock = (index: number): void => {
    const arc = this.state.formData.plot.narrative_driven.list[index];
    if (arc) {
      arc.isLocked = !arc.isLocked;
      this.notify();
    }
  };

  public toggleLinearArcCollapse = (index: number): void => {
    const arc = this.state.formData.plot.narrative_driven.list[index];
    if (arc) {
      arc.isCollapsed = !arc.isCollapsed;
      this.notify();
    }
  };

  public toggleSandboxElementCollapse = (index: number): void => {
    const element = this.state.formData.plot.sandbox.elements[index];
    if (element) {
      element.isCollapsed = !element.isCollapsed;
      this.notify();
    }
  };

  public toggleSandboxElementLock = (index: number): void => {
    const element = this.state.formData.plot.sandbox.elements[index];
    if (element) {
      element.isLocked = !element.isLocked;
      this.notify();
    }
  };

  public toggleRulesItemCollapse(page: PageType, fieldPath: string, index: number) {
    const list = this.data.getDeepValue(this.state.formData[page], fieldPath) as any[];

    if (list && list[index]) {
      const currentItem = list[index];
      currentItem.isCollapsed = !currentItem.isCollapsed;
      this.notify();
    } else {
      console.error(`Could not find item to toggle collapse at path: ${fieldPath}[${index}]`);
    }
  }

  // --- Style Page: Dynamic Rules ---

  public addStyleScene = (): void => {
    const list = this.state.formData.style.dynamic_rules.list;
    const newItem = {
      id: generateUUID(),
      parentCategory: null,
      childCategory: null,
      descriptive_focus_points: {},
      sensory_channels_points: {},
      pacing_dial: '',
      syntax_dial: '',
      vocabulary_dial: '',
      emotion_dial: '',
      adjustments: '',
      isCollapsed: false,
    };
    list.push(newItem);
    this.recomputeState();
    this.notify();
  };

  public deleteStyleScene = (index: number): void => {
    const list = this.state.formData.style.dynamic_rules.list;
    if (index >= 0 && index < list.length) {
      list.splice(index, 1);
      this.recomputeState();
      this.notify();
    }
  };

  public updateStyleScene = (index: number, field: string, value: any): void => {
    const item = this.state.formData.style.dynamic_rules.list[index];
    if (item) {
      (item as any)[field] = value;

      // If parent category changes, reset child category
      if (field === 'parentCategory') {
        item.childCategory = null;
      }

      this.recomputeState();
      this.notify();
    }
  };

  public randomizeSingleLinearArc = (index: number): void => {
    const arc = this.state.formData.plot.narrative_driven.list[index];
    if (arc && !arc.isLocked) {
      const newArc = this.random.randomizeLinearArc(arc);
      this.state.formData.plot.narrative_driven.list[index] = newArc;
      this.recomputeState();
      this.notify();
    }
  };

  public randomizeSingleKeyCharacter = (index: number): void => {
    const characterList = this.state.formData.character.key_characters.list;
    const character = characterList[index];
    if (character && !character.isLocked) {
      const c = CHARACTER_OPTIONS;
      const newCharData = {
        id: character.id, // Keep the same ID
        isLocked: character.isLocked,
        isCollapsed: character.isCollapsed,
        template_level: this.random.randomizeDropdown(c.key.template_level),
        enable_nsfw_attributes: Math.random() > 0.5,
        relational_proximity: this.random.randomizeDropdown(
          c.key.relational_proximity_options.map(o => ({ ...o, level: '' })),
        ),
        social_class: this.random.randomizeDropdown(c.key.social_class_options.map(o => ({ ...o, level: '' }))),
        thematic_role_1: this.random.randomizeDropdown(c.key.thematic_role_options.map(o => ({ ...o, level: '' }))),
        thematic_role_2: this.random.randomizeDropdown(c.key.thematic_role_options.map(o => ({ ...o, level: '' }))),
        psychological_profile: {
          openness: this.random.randomizeDropdown(
            c.key.psychological_profile.openness.map(o => ({ ...o, value: o.label })),
          ),
          conscientiousness: this.random.randomizeDropdown(
            c.key.psychological_profile.conscientiousness.map(o => ({ ...o, value: o.label })),
          ),
          extraversion: this.random.randomizeDropdown(
            c.key.psychological_profile.extraversion.map(o => ({ ...o, value: o.label })),
          ),
          agreeableness: this.random.randomizeDropdown(
            c.key.psychological_profile.agreeableness.map(o => ({ ...o, value: o.label })),
          ),
          neuroticism: this.random.randomizeDropdown(
            c.key.psychological_profile.neuroticism.map(o => ({ ...o, value: o.label })),
          ),
        },
        core_values: {
          care: this.random.randomizeDropdown(c.key.core_values.care.map(o => ({ ...o, level: '' }))),
          fairness: this.random.randomizeDropdown(c.key.core_values.fairness.map(o => ({ ...o, level: '' }))),
          loyalty: this.random.randomizeDropdown(c.key.core_values.loyalty.map(o => ({ ...o, level: '' }))),
          authority: this.random.randomizeDropdown(c.key.core_values.authority.map(o => ({ ...o, level: '' }))),
          sanctity: this.random.randomizeDropdown(c.key.core_values.sanctity.map(o => ({ ...o, level: '' }))),
          liberty: this.random.randomizeDropdown(c.key.core_values.liberty.map(o => ({ ...o, level: '' }))),
        },
        custom_concept: '', // Keep concept empty for user
      };
      characterList[index] = newCharData;
      this.recomputeState();
      this.notify();
    }
  };

  public togglePageModule = (page: PageType): void => {
    this.state.formData[page].disabled = !this.state.formData[page].disabled;
    this.recomputeState();
    this.notify();
  };

  public randomizeCurrentPage = (): void => {
    const page = this.state.navigation.currentPage;
    const newFormData = this.state.formData;

    if (page === 'needs') {
      const d = newFormData.needs;
      const n = NEEDS_OPTIONS;

      // --- Emotion ---
      const needsSections = ['emotion', 'power', 'narrative', 'boundaries'];
      needsSections.forEach(key => {
        const section = (d as any)[key];
        const randomMode = section.randomMode || 'auto';
        if (section.status === 'locked' || randomMode === 'forbid') return;

        if (randomMode === 'force') {
          section.status = 'editing';
          section.expanded = true; // 自动展开
        } else {
          // auto mode
          section.status = Math.random() > 0.5 ? 'editing' : 'disabled';
          section.expanded = section.status === 'editing'; // 启用的则展开
        }

        if (section.status === 'disabled') return;

        // Randomize based on key
        switch (key) {
          case 'emotion':
            section.points = this.random.randomizePoints(n.emotion.points, 10);
            Object.keys(n.emotion.flavors).forEach(flavorKey => {
              const options = (n.emotion.flavors as any)[flavorKey];
              if (options) {
                section.flavors[flavorKey] = this.random.randomizeDropdown(options);
              }
            });
            break;
          case 'power':
            // 全局
            section.objective_spectrum = this.random.randomizeSpectrum(n.power.objective_spectrum);
            section.dominant_party = this.random.randomizeDropdown(n.power.dominant_party);
            section.dominant_power_sources_points = this.random.randomizePoints(
              n.power.dominant_power_sources_points,
              7,
            );
            section.expression_spectrum = this.random.randomizeSpectrum(n.power.expression_spectrum);
            section.importance_spectrum = this.random.randomizeSpectrum(n.power.importance_spectrum);

            // PC 动态
            section.pc_dynamics.interaction_strategy = this.random.randomizeSpectrum(
              n.power.interaction_strategy_spectrum,
            );
            section.pc_dynamics.initial_subjective_state = this.random.randomizeDropdown(
              n.power.subjective_state_options,
            );
            section.pc_dynamics.target_subjective_state = this.random.randomizeDropdown(
              n.power.target_subjective_state_options,
            );

            // NPC 动态
            section.npc_dynamics.interaction_strategy = this.random.randomizeSpectrum(
              n.power.interaction_strategy_spectrum,
            );
            section.npc_dynamics.initial_subjective_state = this.random.randomizeDropdown(
              n.power.subjective_state_options,
            );
            section.npc_dynamics.target_subjective_state = this.random.randomizeDropdown(
              n.power.target_subjective_state_options,
            );
            break;
          case 'narrative':
            section.world_harmony_spectrum = this.random.randomizeSpectrum(n.narrative.world_harmony_spectrum);
            section.npc_compliance_spectrum = this.random.randomizeSpectrum(n.narrative.npc_compliance_spectrum);
            section.pace_spectrum = this.random.randomizeSpectrum(n.narrative.pace_spectrum);
            section.perspective_choice = this.random.randomizeDropdown(n.narrative.perspective_choice);
            section.perspective_switching_mode = this.random.randomizeDropdown(n.narrative.perspective_switching_mode);
            break;
          case 'boundaries':
            section.consent_tolerance_level = this.random.randomizeSpectrum(n.boundaries.consent_tolerance_level);
            section.erotic_level = this.random.randomizeSpectrum(n.boundaries.erotic_level);
            section.erotic_focus = this.random.randomizeSpectrum(n.boundaries.erotic_focus);
            section.violence_level = this.random.randomizeSpectrum(n.boundaries.violence_level);
            section.violence_focus = this.random.randomizeSpectrum(n.boundaries.violence_focus);
            section.description_intensity_spectrum = this.random.randomizeSpectrum(
              n.boundaries.description_intensity_spectrum,
            );
            section.consequence_severity_spectrum = this.random.randomizeSpectrum(
              n.boundaries.consequence_severity_spectrum,
            );
            section.tags = this.random.randomizeTags(AVAILABLE_TAGS);
            break;
        }
      });
    } else if (page === 'world') {
      const d = newFormData.world;
      const modules = d.modules;
      for (const mod of WORLDVIEW_MODULES) {
        const m = modules[mod.id];
        const randomMode = m.randomMode || 'auto';
        const status = m.status || 'editing';
        if (status === 'locked') continue; // 锁定保护最高优先级
        if (randomMode === 'forbid') continue;
        if (randomMode === 'force') {
          // 强制随机，无论原status为何，设为editing并清空内容
          m.status = 'editing';
          m.expanded = true; // 自动展开
          m.macro_selections = {};
          m.specific_items = [];
          if (m.dpa_items) m.dpa_items = [];
          if (m.dpa_total_points) m.dpa_total_points = 0;
        } else {
          // auto模式，随机切换editing/disabled
          m.status = Math.random() > 0.5 ? 'editing' : 'disabled';
          if (m.status === 'disabled') {
            m.expanded = false; // 禁用的则折叠
            m.macro_selections = {};
            m.specific_items = [];
            if (m.dpa_items) m.dpa_items = [];
            if (m.dpa_total_points) m.dpa_total_points = 0;
            continue;
          } else {
            m.expanded = true; // 启用的则展开
            m.macro_selections = {};
            m.specific_items = [];
            if (m.dpa_items) m.dpa_items = [];
            if (m.dpa_total_points) m.dpa_total_points = 0;
          }
        }
        // 2. 宏观选项随机化
        if (mod.macroOptions) {
          // 先处理所有 min/max 配对
          const rangePairs = new Map<string, any[]>();
          mod.macroOptions.forEach(opt => {
            if (opt.id.endsWith('_min') || opt.id.endsWith('_max')) {
              const baseKey = opt.id.replace(/_min$|_max$/, '');
              if (!rangePairs.has(baseKey) && Array.isArray(opt.options)) {
                rangePairs.set(baseKey, opt.options);
              }
            }
          });

          rangePairs.forEach((options, baseKey) => {
            const minKey = `${baseKey}_min`;
            const maxKey = `${baseKey}_max`;
            const { min, max } = this.random.randomizeMinMax(options);
            m.macro_selections[minKey] = min;
            m.macro_selections[maxKey] = max;
          });

          // 再处理其他类型的宏观选项
          for (const opt of mod.macroOptions) {
            // 跳过已经处理过的 min/max 字段
            if (opt.id.endsWith('_min') || opt.id.endsWith('_max')) {
              continue;
            }

            switch (opt.type) {
              case 'dropdown':
                if (Array.isArray(opt.options)) {
                  const validOpts = opt.options
                    .map((o: any) => {
                      if (o && typeof o === 'object' && o.value) {
                        return {
                          level: o.level || '',
                          label: o.label || '',
                          description: o.description || '',
                          value: o.value,
                        };
                      }
                      return null;
                    })
                    .filter(
                      (o): o is { level: string; label: string; description: string; value: string } => o !== null,
                    );

                  if (validOpts.length > 0) {
                    m.macro_selections[opt.id] = this.random.randomizeDropdown(validOpts);
                  } else {
                    m.macro_selections[opt.id] = '';
                  }
                }
                break;

              case 'points_allocator':
                if (Array.isArray(opt.options)) {
                  // 过滤掉分隔符等非选项对象，并确保结构正确
                  const validPointsOptions = opt.options
                    .map((o: any) => {
                      if (o && typeof o === 'object' && o.id && o.label) {
                        return {
                          label: o.label,
                          description: o.description || '',
                          value: o.id, // 使用 id 作为 value 给 randomizePoints
                        };
                      }
                      return null;
                    })
                    .filter((o): o is { label: string; description: string; value: string } => o !== null);

                  m.macro_selections[opt.id] = this.random.randomizePoints(
                    validPointsOptions,
                    opt.totalPoints || 10,
                    'value', // 告诉 randomizePoints 使用 'value' 字段作为 key
                  );
                }
                break;

              case 'dynamic_points_allocator':
                if (mod.id === 'aesthetics') {
                  const sources: { id: 'culture' | 'filter'; options: any[] }[] = [
                    { id: 'culture', options: CULTURAL_ARCHETYPE_HIERARCHY },
                    { id: 'filter', options: AESTHETIC_FILTER_HIERARCHY },
                  ];
                  const allOptions: { id: string; label: string; description: string; source: 'culture' | 'filter' }[] =
                    [];
                  sources.forEach(src => {
                    src.options.forEach((option: any) => {
                      if (option.id) {
                        allOptions.push({
                          id: option.id,
                          label: option.label,
                          description: option.description || '',
                          source: src.id,
                        });
                      }
                      if (Array.isArray(option.children)) {
                        option.children.forEach((child: any) => {
                          if (child.id) {
                            allOptions.push({
                              id: child.id,
                              label: child.label,
                              description: child.description || '',
                              source: src.id,
                            });
                          }
                        });
                      }
                    });
                  });

                  const itemCount = 2 + Math.floor(Math.random() * 3);
                  const shuffled = allOptions.sort(() => Math.random() - 0.5);
                  const selected = shuffled.slice(0, itemCount);

                  let pointsLeft = 10;
                  const pointsArr = Array(itemCount).fill(0);
                  for (let i = 0; i < itemCount && pointsLeft > 0; i++) {
                    const give = Math.random() > 0.5 ? 1 : 0;
                    pointsArr[i] += give;
                    pointsLeft -= give;
                  }
                  while (pointsLeft > 0) {
                    const idx = Math.floor(Math.random() * itemCount);
                    pointsArr[idx]++;
                    pointsLeft--;
                  }
                  m.dpa_items = selected.map((item, i) => ({ ...item, points: pointsArr[i] }));
                  m.dpa_total_points = 10;
                }
                break;
            }
          }
        }
        // 3. specific_items 随机生成0-2条，category字段随机有效类型
        m.specific_items = [];
        if (mod.specificItemTypes && mod.specificItemTypes.length > 0) {
          const count = Math.floor(Math.random() * 3); // 0-2
          for (let i = 0; i < count; i++) {
            const typeObj = mod.specificItemTypes[Math.floor(Math.random() * mod.specificItemTypes.length)];
            // 获取预设类型选项
            const presetOptions = PRESET_TYPE_OPTIONS[typeObj.id] || [];
            const validCategories = presetOptions.filter(opt => opt.value !== '' && opt.value !== undefined);
            const randomCategory =
              validCategories.length > 0
                ? validCategories[Math.floor(Math.random() * validCategories.length)].value
                : '';
            m.specific_items.push({
              id: generateUUID(),
              type: typeObj.id,
              name: '',
              category: randomCategory,
              description: '',
            });
          }
        }
      }
      this.recomputeState();
      this.notify();
    } else if (page === 'character') {
      const d = newFormData.character;
      const c = CHARACTER_OPTIONS;

      const randomizeCharacter = () => {
        const psychological_profile = {
          openness: this.random.randomizeDropdown(
            c.key.psychological_profile.openness.map(o => ({ ...o, value: o.label })),
          ),
          conscientiousness: this.random.randomizeDropdown(
            c.key.psychological_profile.conscientiousness.map(o => ({ ...o, value: o.label })),
          ),
          extraversion: this.random.randomizeDropdown(
            c.key.psychological_profile.extraversion.map(o => ({ ...o, value: o.label })),
          ),
          agreeableness: this.random.randomizeDropdown(
            c.key.psychological_profile.agreeableness.map(o => ({ ...o, value: o.label })),
          ),
          neuroticism: this.random.randomizeDropdown(
            c.key.psychological_profile.neuroticism.map(o => ({ ...o, value: o.label })),
          ),
        };
        const core_values = {
          care: this.random.randomizeDropdown(c.key.core_values.care.map(o => ({ ...o, level: '' }))),
          fairness: this.random.randomizeDropdown(c.key.core_values.fairness.map(o => ({ ...o, level: '' }))),
          loyalty: this.random.randomizeDropdown(c.key.core_values.loyalty.map(o => ({ ...o, level: '' }))),
          authority: this.random.randomizeDropdown(c.key.core_values.authority.map(o => ({ ...o, level: '' }))),
          sanctity: this.random.randomizeDropdown(c.key.core_values.sanctity.map(o => ({ ...o, level: '' }))),
          liberty: this.random.randomizeDropdown(c.key.core_values.liberty.map(o => ({ ...o, level: '' }))),
        };
        return {
          id: generateUUID(),
          template_level: this.random.randomizeDropdown(c.key.template_level),
          enable_nsfw_attributes: Math.random() > 0.5,
          relational_proximity: this.random.randomizeDropdown(
            c.key.relational_proximity_options.map(o => ({ ...o, level: '' })),
          ),
          social_class: this.random.randomizeDropdown(c.key.social_class_options.map(o => ({ ...o, level: '' }))),
          thematic_role_1: this.random.randomizeDropdown(c.key.thematic_role_options.map(o => ({ ...o, level: '' }))),
          thematic_role_2: this.random.randomizeDropdown(c.key.thematic_role_options.map(o => ({ ...o, level: '' }))),
          psychological_profile,
          core_values,
          custom_concept: '', // Keep concept empty for user
          isLocked: false,
          isCollapsed: false,
        };
      };

      // --- Module 1: PC ---
      const pcModule = d.pc;
      if (pcModule.status !== 'locked' && (pcModule.randomMode || 'auto') !== 'forbid') {
        let shouldRandomize = pcModule.randomMode === 'force';
        if (pcModule.randomMode === 'auto' || !pcModule.randomMode) {
          if (Math.random() > 0.5) {
            shouldRandomize = true;
            pcModule.status = 'editing';
            pcModule.expanded = true;
          } else {
            pcModule.status = 'disabled';
            pcModule.expanded = false;
          }
        }

        if (shouldRandomize) {
          pcModule.template_level = this.random.randomizeDropdown(c.pc.template_level);
          pcModule.enable_nsfw_attributes = Math.random() > 0.5;
          pcModule.social_class = this.random.randomizeDropdown(
            c.key.social_class_options.map(o => ({ ...o, level: '' })),
          );
          pcModule.psychological_profile = {
            openness: this.random.randomizeDropdown(
              c.key.psychological_profile.openness.map(o => ({ ...o, value: o.label })),
            ),
            conscientiousness: this.random.randomizeDropdown(
              c.key.psychological_profile.conscientiousness.map(o => ({ ...o, value: o.label })),
            ),
            extraversion: this.random.randomizeDropdown(
              c.key.psychological_profile.extraversion.map(o => ({ ...o, value: o.label })),
            ),
            agreeableness: this.random.randomizeDropdown(
              c.key.psychological_profile.agreeableness.map(o => ({ ...o, value: o.label })),
            ),
            neuroticism: this.random.randomizeDropdown(
              c.key.psychological_profile.neuroticism.map(o => ({ ...o, value: o.label })),
            ),
          };
          pcModule.core_values = {
            care: this.random.randomizeDropdown(c.key.core_values.care.map(o => ({ ...o, level: '' }))),
            fairness: this.random.randomizeDropdown(c.key.core_values.fairness.map(o => ({ ...o, level: '' }))),
            loyalty: this.random.randomizeDropdown(c.key.core_values.loyalty.map(o => ({ ...o, level: '' }))),
            authority: this.random.randomizeDropdown(c.key.core_values.authority.map(o => ({ ...o, level: '' }))),
            sanctity: this.random.randomizeDropdown(c.key.core_values.sanctity.map(o => ({ ...o, level: '' }))),
            liberty: this.random.randomizeDropdown(c.key.core_values.liberty.map(o => ({ ...o, level: '' }))),
          };
        }
      }

      // --- Module 2: Key Characters ---
      const keyCharsModule = d.key_characters;
      if (keyCharsModule.status !== 'locked' && (keyCharsModule.randomMode || 'auto') !== 'forbid') {
        let shouldRandomize = keyCharsModule.randomMode === 'force';
        if (keyCharsModule.randomMode === 'auto' || !keyCharsModule.randomMode) {
          if (Math.random() > 0.5) {
            shouldRandomize = true;
            keyCharsModule.status = 'editing';
            keyCharsModule.expanded = true;
          } else {
            keyCharsModule.status = 'disabled';
            keyCharsModule.expanded = false;
          }
        }

        if (shouldRandomize) {
          if (keyCharsModule.list.length === 0) {
            const numKeyChars = 2 + Math.floor(Math.random() * 2);
            for (let i = 0; i < numKeyChars; i++) {
              keyCharsModule.list.push(randomizeCharacter());
            }
          } else {
            keyCharsModule.list.forEach((char, index) => {
              if (!char.isLocked) {
                const newChar = randomizeCharacter();
                newChar.id = char.id;
                newChar.isLocked = !!char.isLocked;
                newChar.isCollapsed = !!char.isCollapsed;
                keyCharsModule.list[index] = newChar;
              }
            });
          }
        }
      }

      // --- Module 3: World Population ---
      const worldPopModule = d.world_population;
      if (worldPopModule.status !== 'locked' && (worldPopModule.randomMode || 'auto') !== 'forbid') {
        let shouldRandomize = worldPopModule.randomMode === 'force';
        if (worldPopModule.randomMode === 'auto' || !worldPopModule.randomMode) {
          if (Math.random() > 0.5) {
            shouldRandomize = true;
            worldPopModule.status = 'editing';
            worldPopModule.expanded = true;
          } else {
            worldPopModule.status = 'disabled';
            worldPopModule.expanded = false;
          }
        }

        if (shouldRandomize) {
          const wp = worldPopModule;
          wp.supporting.template_level = this.random.randomizeDropdown(c.supporting.template_level);
          wp.supporting.enable_nsfw_attributes = Math.random() > 0.5;
          wp.supporting.role_focus_counts = this.random.randomizePoints(c.supporting.role_focus_counts, 4);

          wp.ambient.template_level = this.random.randomizeDropdown(c.ambient.template_level);
          wp.ambient.enable_nsfw_attributes = Math.random() > 0.5;
          wp.ambient.group_counts = this.random.randomizePoints(c.ambient.group_counts, 8);
        }
      }
    } else if (page === 'plot') {
      // The logic is now self-contained within randomizePlotPage,
      // which correctly checks for locked modules and items.
      this.random.randomizePlotPage(newFormData.plot, this.initialFormData.plot);
    } else if (page === 'style') {
      this.random.randomizeStylePage(newFormData.style);
    }

    this.recomputeState();
    this.notify();
  };

  public resetCurrentPageToDefaults = (): void => {
    const page = this.state.navigation.currentPage;
    const newFormData = this.state.formData;
    if (page === 'world') {
      const modules = newFormData.world.modules;
      for (const modId in modules) {
        const m = modules[modId];
        if (m.status === 'locked') continue;
        m.status = 'editing';
        m.macro_selections = {};
        m.specific_items = [];
        if (m.dpa_items) m.dpa_items = [];
        if (m.dpa_total_points !== undefined) m.dpa_total_points = 0;
      }
      newFormData.world.custom_input = { enabled: false, content: '' };
      this.recomputeState();
      this.notify();
      return;
    }
    if (page === 'needs') {
      const d = newFormData.needs;
      const initial = this.initialFormData.needs;
      ['emotion', 'power', 'narrative', 'boundaries'].forEach(key => {
        const section = (d as any)[key];
        if (section.status !== 'locked') {
          (d as any)[key] = deepClone((initial as any)[key]);
        }
      });
      if (d.custom_notes.status !== 'locked') {
        d.custom_notes = deepClone(initial.custom_notes);
      }
      this.recomputeState();
      this.notify();
      return;
    }
    if (page === 'style') {
      const d = newFormData.style;
      const initial = this.initialFormData.style;
      if (d.mode.status !== 'locked') {
        d.mode = deepClone(initial.mode);
      }
      if (d.adjustments.status !== 'locked') {
        d.adjustments = deepClone(initial.adjustments);
      }
      if (d.dynamic_rules.status !== 'locked') {
        d.dynamic_rules = deepClone(initial.dynamic_rules);
      }
      this.recomputeState();
      this.notify();
      return;
    }

    // Handle other pages explicitly
    if (page === 'character') {
      newFormData.character = deepClone(this.initialFormData.character);
    } else if (page === 'plot') {
      newFormData.plot = deepClone(this.initialFormData.plot);
    } else if (page === 'rules') {
      newFormData.rules = deepClone(this.initialFormData.rules);
    }

    this.recomputeState();
    this.notify();
  };

  /**
   * Finds the correct `triggerSlash` function, searching both the parent and current window.
   * This ensures compatibility when running inside an iframe.
   * @returns The `triggerSlash` function or `null` if not found.
   */
  private _getSlashExecutor(): ((command: string) => any) | null {
    try {
      // 1. Prioritize parent window, common for iframe integrations.
      if (window.parent && typeof (window.parent as any).triggerSlash === 'function') {
        return (window.parent as any).triggerSlash;
      }
    } catch (e) {
      // This can happen due to cross-origin restrictions. It's expected.
      console.warn('OneStep: Could not access parent window, falling back to current window.', e);
    }

    // 2. Fallback to the current window.
    if (typeof (window as any).triggerSlash === 'function') {
      return (window as any).triggerSlash;
    }

    // 3. If not found in either, return null.
    return null;
  }

  public sendCharacterCard = (): void => {
    const prompt = this.formatter.formatAsPrompt(this.state.formData);
    const triggerSlash = this._getSlashExecutor();

    if (triggerSlash) {
      const messageToSend = JSON.stringify(prompt);
      const command = `/send ${messageToSend} || /trigger`;
      try {
        triggerSlash(command);
        console.log('OneStep: Successfully executed command via triggerSlash:', command);
      } catch (error) {
        console.error('OneStep: Failed to execute triggerSlash command:', error);
        alert('执行 triggerSlash 失败。请检查控制台获取详细信息。');
        console.log('--- COMMAND TO EXECUTE ---');
        console.log(command);
      }
    } else {
      console.error('OneStep: triggerSlash() function not found. Cannot send character card.');
      alert('未找到 triggerSlash()。请检查控制台以查看生成的提示和命令。');
      console.log('--- GENERATED PROMPT ---');
      console.log(prompt);
      const messageToSend = JSON.stringify(prompt);
      const command = `/send ${messageToSend} || /trigger`;
      console.log('--- COMMAND TO EXECUTE ---');
      console.log(command);
    }
  };

  public sendReviewableCharacterCard = (): void => {
    const prompt = this.formatter.formatAsReviewPrompt(this.state.formData);
    const triggerSlash = this._getSlashExecutor();

    if (triggerSlash) {
      const messageToSend = JSON.stringify(prompt);
      const command = `/send ${messageToSend} || /trigger`;
      try {
        triggerSlash(command);
        console.log('OneStep: Successfully executed command for review via triggerSlash:', command);
      } catch (error) {
        console.error('OneStep: Failed to execute triggerSlash command for review:', error);
        alert('执行 triggerSlash 失败。请检查控制台获取详细信息。');
        console.log('--- COMMAND TO EXECUTE (REVIEW) ---');
        console.log(command);
      }
    } else {
      console.error('OneStep: triggerSlash() function not found. Cannot send reviewable character card.');
      alert('未找到 triggerSlash()。请检查控制台以查看生成的提示和命令。');
      console.log('--- GENERATED REVIEW PROMPT ---');
      console.log(prompt);
      const messageToSend = JSON.stringify(prompt);
      const command = `/send ${messageToSend} || /trigger`;
      console.log('--- COMMAND TO EXECUTE (REVIEW) ---');
      console.log(command);
    }
  };

  /**
   * Saves the current formData state to a specific lorebook entry as a JSON string.
   */
  public saveStateToLorebook = (): void => {
    try {
      const stateToSave = this.state.formData;
      const jsonString = JSON.stringify(stateToSave);
      const commandArgument = JSON.stringify(jsonString);
      const command = `/setentryfield file="A.U.T.O OneStep" uid=63 field=content ${commandArgument}`;
      const triggerSlash = this._getSlashExecutor();

      if (triggerSlash) {
        triggerSlash(command);
        console.log('OneStep: Successfully executed command to save state.');
        alert('配置已保存到A.U.T.O OneStep世界书的🚫存档⚠️条目');
      } else {
        console.error('OneStep: triggerSlash() function not found. Cannot save state.');
        alert('保存失败：未找到 triggerSlash() 函数。');
        console.log('--- COMMAND TO EXECUTE ---');
        console.log(command);
      }
    } catch (error) {
      console.error('OneStep: Failed to save state to lorebook:', error);
      alert(`保存配置时发生错误: ${error}`);
    }
  };

  /**
   * Loads the state from a specific lorebook entry by emitting an event.
   * The actual data loading and state update is handled by an event listener
   * which should be set up in the main UI script (index.ts).
   */
  public loadStateFromLorebook = async (): Promise<void> => {
    try {
      const triggerSlash = this._getSlashExecutor();
      if (!triggerSlash) {
        console.error('OneStep: triggerSlash() function not found. Cannot load state.');
        alert('读取失败：未找到 triggerSlash() 函数。');
        return;
      }

      alert('正在从世界书读取配置...');
      const command = `/getentryfield file="A.U.T.O OneStep" 63`;
      console.log('OneStep: Executing command to get state:', command);

      const result = await triggerSlash(command);
      let loadedFormData: any = null;

      if (!result) {
        throw new Error('从世界书获取的内容为空。');
      }

      if (typeof result === 'object') {
        console.log('OneStep [Info]: Lorebook content was pre-parsed by the system.');
        loadedFormData = result;
      } else if (typeof result === 'string') {
        console.log('OneStep [Info]: Lorebook content is a string. Attempting to parse.');
        try {
          let parsed = JSON.parse(result);
          if (typeof parsed === 'string') {
            console.log('OneStep [Info]: Detected double-stringified JSON. Parsing again.');
            parsed = JSON.parse(parsed);
          }
          loadedFormData = parsed;
        } catch (e) {
          console.error('OneStep [Error]: Failed to parse string from lorebook.', e);
          throw new Error('从世界书获取的内容不是有效的JSON格式。');
        }
      }

      if (loadedFormData && typeof loadedFormData === 'object') {
        const defaultState = this.getInitialState().formData;
        const mergedFormData = { ...defaultState, ...loadedFormData };
        this.setState({ formData: mergedFormData });
        alert('配置已成功从世界书加载！');
        console.log('OneStep: State successfully loaded and applied from lorebook.');
      } else {
        throw new Error('处理后的世界书内容无效或类型不正确。');
      }
    } catch (error) {
      console.error('OneStep: Failed to load state from lorebook:', error);
      alert(`读取配置时发生错误: ${error}`);
    }
  };

  public getDpaOptions = () => {
    // This component is no longer used in the new worldview page.
    // This can be removed or adapted if DPA is used elsewhere.
    return [];
  };

  private _calculateWordCounts = (): {
    wordCounts: Record<PageType, number>;
    totalWordCount: number;
  } => {
    const { formData } = this.state;
    const formatter = this.formatter; // Use the existing formatter instance

    const countWords = (str: string) => {
      if (!str) return 0;
      return str.split(/\s+/).filter(Boolean).length;
    };

    const needsText = formatter['formatNeedsProfileToText'](formatter['formatNeeds'](formData.needs));
    const worldText = formatter['formatWorldviewProfileToText'](formatter['formatWorld'](formData.world));
    const characterText = formatter['formatCharacterProfileToText'](formatter['formatCharacter'](formData.character));
    const plotText = formatter['formatPlotProfileToText'](formatter['formatPlot'](formData.plot));
    const rulesText = formatter['formatRulebookProfileToText'](formatter['formatRules'](formData.rules));
    const styleText = formatter['formatWritingStyleProfileToText'](formatter['formatStyle'](formData.style));

    const wordCounts: Record<PageType, number> = {
      needs: countWords(needsText),
      world: countWords(worldText),
      character: countWords(characterText),
      plot: countWords(plotText),
      rules: countWords(rulesText),
      style: countWords(styleText),
    };

    const totalWordCount = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);

    return { wordCounts, totalWordCount };
  };

  private recomputeState = (): void => {
    const validationErrors = this.validation.validateAll();
    const { wordCounts, totalWordCount } = this._calculateWordCounts();

    this.state.computed = {
      ...this.state.computed,
      wordCounts,
      totalWordCount,
      validationErrors,
      canGenerate: validationErrors.length === 0,
    };
  };

  public toggleNeedsSectionLock = (sectionKey: string): void => {
    const section = (this.state.formData.needs as any)[sectionKey];
    if (section) {
      section.status = section.status === 'locked' ? 'editing' : 'locked';
      this.recomputeState();
      this.notify();
    }
  };

  private handleWorldviewRangeUpdate(formData: AppState['formData'], field: string, value: any): void {
    const parts = field.split('.');
    // field 格式: modules.magic.macro_selections.supernatural_axis_max
    if (parts.length !== 4 || parts[2] !== 'macro_selections') return;

    const moduleId = parts[1];
    const fieldKey = parts[3];

    let minKey: string | null = null;
    let maxKey: string | null = null;

    if (fieldKey.endsWith('_min')) {
      minKey = fieldKey;
      maxKey = fieldKey.replace('_min', '_max');
    } else if (fieldKey.endsWith('_max')) {
      maxKey = fieldKey;
      minKey = fieldKey.replace('_max', '_min');
    } else {
      return; // 不是 min/max 字段
    }

    const moduleState = formData.world.modules[moduleId];
    if (!moduleState || !moduleState.macro_selections.hasOwnProperty(minKey)) {
      return; // 另一个字段不存在
    }

    const currentMinStr = fieldKey.endsWith('_min') ? value : moduleState.macro_selections[minKey];
    const currentMaxStr = fieldKey.endsWith('_max') ? value : moduleState.macro_selections[maxKey];

    // Handle cases where one of the values might be empty/null
    if (!currentMinStr || !currentMaxStr) return;

    const currentMin = parseInt(currentMinStr, 10);
    const currentMax = parseInt(currentMaxStr, 10);

    if (currentMin > currentMax) {
      // 如果更新的是 min 且大于 max，则将 max 设为 min
      if (fieldKey.endsWith('_min')) {
        moduleState.macro_selections[maxKey] = String(currentMin);
      }
      // 如果更新的是 max 且小于 min，则将 min 设为 max
      else {
        moduleState.macro_selections[minKey] = String(currentMax);
      }
    }
  }
}
