import { v4 as uuidv4 } from 'uuid';
import { CHARACTER_OPTIONS } from '../constants/character-options';
import { NEEDS_OPTIONS } from '../constants/needs-options';
import { PLOT_OPTIONS } from '../constants/plot-options';
import { STYLE_OPTIONS } from '../constants/style-options';
import { WORLDVIEW_MODULES } from '../constants/world-options';
import {
  AppState,
  CharacterFormData,
  KeyCharacterData,
  NeedsFormData,
  PlotFormData,
  RulesFormData,
  StyleFormData,
  WorldFormData,
} from '../types/AppTypes';

export class DataManager {
  constructor() {}

  public getDeepValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : undefined), obj);
  }

  public getDefaultState(): AppState {
    return {
      navigation: {
        currentPage: 'needs',
        visitedPages: new Set(['needs']),
        pageHistory: ['needs'],
        canNavigateBack: false,
        canNavigateForward: true,
      },
      ui: {
        loading: false,
        error: null,
        showHelp: false,
        expandedSections: new Set(),
        showWordCountBreakdown: false,
        theme: 'light',
        locale: 'zh-CN',
        isDirty: false,
        lastSaved: null,
      },
      formData: {
        needs: this.getDefaultNeedsData(),
        world: this.getDefaultWorldData(),
        character: this.getDefaultCharacterData(),
        plot: this.getDefaultPlotData(),
        rules: this.getDefaultRulesData(),
        style: this.getDefaultStyleData(),
      },
      computed: {
        wordCounts: {
          needs: 0,
          world: 0,
          character: 0,
          plot: 0,
          rules: 0,
          style: 0,
        },
        totalWordCount: 0,
        validationErrors: [],
        completionStatus: {} as any,
        completionPercentage: 0,
        canGenerate: false,
      },
      settings: {
        autoSave: true,
        showValidationInRealTime: true,
        enableRandomGeneration: true,
        wordCountUpdateDelay: 500,
      },
    };
  }

  private getDefaultNeedsData(): NeedsFormData {
    return {
      emotion: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        points: NEEDS_OPTIONS.emotion.points.reduce((acc, p) => ({ ...acc, [p.label]: 0 }), {}),
        flavors: {},
      },
      power: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        objective_spectrum: '',
        dominant_party: '',
        dominant_power_sources_points: NEEDS_OPTIONS.power.dominant_power_sources_points.reduce(
          (acc, p) => ({ ...acc, [p.label]: 0 }),
          {},
        ),
        expression_spectrum: '',
        importance_spectrum: '',
        pc_dynamics: {
          interaction_strategy: '',
          initial_subjective_state: '',
          target_subjective_state: '',
        },
        npc_dynamics: {
          interaction_strategy: '',
          initial_subjective_state: '',
          target_subjective_state: '',
        },
      },
      narrative: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        world_harmony_spectrum: '',
        npc_compliance_spectrum: '',
        pace_spectrum: '',
        perspective_choice: '',
        perspective_switching_mode: '',
      },
      boundaries: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        consent_tolerance_level: '',
        erotic_level: '',
        erotic_focus: '',
        violence_level: '',
        violence_focus: '',
        description_intensity_spectrum: '',
        consequence_severity_spectrum: '',
        tags: {},
      },
      custom_notes: {
        status: 'editing',
        content: '',
        expanded: true,
      },
      disabled: false,
      validation: [],
    };
  }

  private getDefaultWorldData(): WorldFormData {
    const modules: Record<string, any> = {};
    WORLDVIEW_MODULES.forEach(module => {
      const macro_selections: Record<string, any> = {};
      if (module.macroOptions) {
        module.macroOptions.forEach(option => {
          if (option.type === 'points_allocator' && option.options) {
            macro_selections[option.id] = option.options.reduce((acc: any, cat: any) => {
              acc[cat.label] = 0;
              return acc;
            }, {});
          } else {
            macro_selections[option.id] = '';
          }
        });
      }
      modules[module.id] = {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        macro_selections,
        specific_items: [],
        dpa_items: [],
        dpa_total_points: 0,
      };
    });

    return {
      modules,
      custom_input: {
        enabled: true,
        content: '',
        expanded: true,
        status: 'editing',
      },
      disabled: false,
      validation: [],
    };
  }

  private getDefaultKeyCharacterData(): KeyCharacterData {
    return {
      id: uuidv4(),
      template_level: '中等',
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
      isCollapsed: false,
    };
  }

  private getDefaultCharacterData(): CharacterFormData {
    return {
      pc: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        template_level: '详细',
        enable_nsfw_attributes: false,
        custom_concept: '',
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
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        list: [this.getDefaultKeyCharacterData()],
      },
      world_population: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        supporting: {
          template_level: '中等',
          enable_nsfw_attributes: false,
          role_focus_counts: CHARACTER_OPTIONS.supporting.role_focus_counts.reduce(
            (acc, opt) => ({ ...acc, [opt.label]: 0 }),
            {},
          ),
          custom_notes: '',
        },
        ambient: {
          template_level: '极简',
          enable_nsfw_attributes: false,
          group_counts: CHARACTER_OPTIONS.ambient.group_counts.reduce((acc, opt) => ({ ...acc, [opt.label]: 0 }), {}),
          custom_notes: '',
        },
      },
      disabled: false,
      validation: [],
    };
  }

  public getDefaultPlotData(): PlotFormData {
    return {
      structure: {
        status: 'editing',
        randomMode: 'auto',
        expanded: false,
        mode: '',
        driver_points: PLOT_OPTIONS.narrative_driven.driver.reduce((acc, p) => ({ ...acc, [p.label]: 0 }), {}),
      },
      narrative_driven: {
        status: 'editing',
        randomMode: 'auto',
        expanded: false,
        focus: '',
        list: [],
      },
      sandbox: {
        status: 'editing',
        randomMode: 'auto',
        expanded: false,
        world_tension: '暗流涌动', // Default value
        elements: [],
      },
      custom_notes: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        content: '',
      },
      disabled: false,
      validation: [],
    };
  }

  private getDefaultRulesData(): RulesFormData {
    return {
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
    };
  }

  private getDefaultStyleData(): StyleFormData {
    return {
      mode: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        selection: '',
      },
      adjustments: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        narrator_stance_spectrum: '',
        linguistic_texture_spectrum: '',
        descriptive_focus_points: STYLE_OPTIONS.adjustments.descriptive_focus_points.reduce(
          (acc, p) => ({ ...acc, [p.label]: 0 }),
          {},
        ),
        rhetorical_strategy_spectrum: '',
        syntactic_rhythm_spectrum: '',
        sensory_channels_points: STYLE_OPTIONS.adjustments.sensory_channels_points.reduce(
          (acc, p) => ({ ...acc, [p.label]: 0 }),
          {},
        ),
        custom_notes: '',
      },
      dynamic_rules: {
        status: 'editing',
        randomMode: 'auto',
        expanded: true,
        list: [],
      },
      disabled: false,
      validation: [],
    };
  }
}
