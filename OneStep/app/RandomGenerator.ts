import { v4 as uuidv4 } from 'uuid';
import { BRANCH_ROUTE_TYPES, PLOT_OPTIONS } from '../constants/plot-options';
import { DYNAMIC_RULE_LIBRARY } from '../constants/scene-library';
import { STYLE_OPTIONS } from '../constants/style-options';
import {
  DynamicRule,
  GradientOption,
  LinearArcItem,
  PlotFormData,
  PointsAllocation,
  SandboxElementItem,
  StyleFormData,
} from '../types/AppTypes';

export class RandomGenerator {
  private getRandomElement<T>(arr: T[]): T {
    if (arr.length === 0) {
      throw new Error('Cannot get a random element from an empty array.');
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  public randomizePoints(
    categories: Array<string | { id?: string; label: string; description: string; value?: string }>,
    totalPoints: number,
    keyField: 'label' | 'value' | 'id' = 'label',
  ): PointsAllocation {
    const allocation: PointsAllocation = {};
    const keys = categories.map(c => {
      if (typeof c === 'string') return c;
      if (keyField === 'id' && c.id) return c.id;
      if (keyField === 'value' && c.value) return c.value;
      return c.label;
    });

    keys.forEach(key => (allocation[key] = 0));

    if (keys.length === 0) {
      return allocation;
    }

    for (let i = 0; i < totalPoints; i++) {
      const randomIndex = Math.floor(Math.random() * keys.length);
      allocation[keys[randomIndex]]++;
    }
    return allocation;
  }

  public randomizeDropdown(options: GradientOption[]): string {
    if (!options || options.length === 0) return '';
    return this.getRandomElement(options).value;
  }

  public randomizeSpectrum(options: GradientOption[]): string {
    // Filters out the "Not set" option to ensure a random value is always selected.
    const validOptions = options.filter(opt => !opt.value.startsWith('0/'));
    return this.randomizeDropdown(validOptions);
  }

  /**
   * 从选项列表中随机生成一对有效的 min 和 max 值。
   * @param options - 包含 value 和 label 的选项数组。
   * @returns 一个对象 { min: string, max: string }，确保 min <= max。
   */
  public randomizeMinMax(options: GradientOption[]): { min: string; max: string } {
    // 过滤掉空白选项
    const validOptions = options.filter(opt => opt.value && opt.value !== '0');
    if (validOptions.length < 2) {
      const val = validOptions[0]?.value || '1';
      return { min: val, max: val };
    }

    // 随机抽取两个不同的索引
    let index1 = Math.floor(Math.random() * validOptions.length);
    let index2 = Math.floor(Math.random() * validOptions.length);
    while (index1 === index2) {
      index2 = Math.floor(Math.random() * validOptions.length);
    }

    const val1 = parseInt(validOptions[index1].value, 10);
    const val2 = parseInt(validOptions[index2].value, 10);

    return {
      min: String(Math.min(val1, val2)),
      max: String(Math.max(val1, val2)),
    };
  }

  public randomizeTags(
    tagCategories: { name: string; tags: string[] }[],
  ): Record<string, 'like' | 'dislike' | 'neutral'> {
    const preferences: Record<string, 'like' | 'dislike' | 'neutral'> = {};
    const allTags = tagCategories.flatMap(cat => cat.tags);
    const states: Array<'like' | 'dislike' | 'neutral'> = ['like', 'dislike', 'neutral'];

    allTags.forEach(tag => {
      // Give a higher chance to 'neutral' to avoid too many likes/dislikes
      const randomState = Math.random() < 0.4 ? this.getRandomElement(states) : 'neutral';
      if (randomState !== 'neutral') {
        preferences[tag] = randomState;
      }
    });

    return preferences;
  }

  public randomizePlotPage(plotData: PlotFormData, initialPlotData: PlotFormData): void {
    const p = PLOT_OPTIONS;

    // 1. Randomize Structure (if not locked/forbidden)
    const structureModule = plotData.structure;
    if (structureModule.status !== 'locked' && structureModule.randomMode !== 'forbid') {
      structureModule.mode = this.randomizeDropdown(p.structure.mode) as '线性/分支叙事' | '沙盒叙事';
      structureModule.driver_points = this.randomizePoints(p.narrative_driven.driver, 10);
      structureModule.status = 'editing';
      structureModule.expanded = true;
    }

    // 2. Randomize based on the (potentially new) mode
    if (plotData.structure.mode === '线性/分支叙事') {
      const nd = plotData.narrative_driven;
      if (nd.status !== 'locked' && nd.randomMode !== 'forbid') {
        nd.status = 'editing';
        nd.expanded = true;
        nd.focus = this.randomizeDropdown(p.narrative_driven.focus.filter(o => o.value));

        // Randomize the list of linear arcs, respecting locks
        const existingArcs = nd.list.filter(arc => arc.isLocked);
        const arcsToRandomizeCount = nd.list.filter(arc => !arc.isLocked).length;
        const newArcsCount = nd.list.length === 0 ? Math.floor(Math.random() * 4) + 1 : arcsToRandomizeCount;

        const newRandomArcs = Array.from({ length: newArcsCount }, () => this.randomizeLinearArc());
        nd.list = [...existingArcs, ...newRandomArcs];
      }
      // Disable the other module if it's not locked
      if (plotData.sandbox.status !== 'locked') {
        plotData.sandbox.status = 'disabled';
        plotData.sandbox.expanded = false;
      }
    } else {
      // Mode is '沙盒叙事'
      const sb = plotData.sandbox;
      if (sb.status !== 'locked' && sb.randomMode !== 'forbid') {
        const sbo = p.sandbox;
        sb.status = 'editing';
        sb.expanded = true;
        sb.world_tension = this.randomizeDropdown(sbo.world_tension.filter(o => o.value));

        // Randomize the list of sandbox elements, respecting locks
        const existingElements = sb.elements.filter(el => el.isLocked);
        const elementsToRandomizeCount = sb.elements.filter(el => !el.isLocked).length;
        const newElementsCount =
          sb.elements.length === 0 ? Math.floor(Math.random() * 4) + 1 : elementsToRandomizeCount;

        const newRandomElements = Array.from({ length: newElementsCount }, () => this.randomizeSandboxElement());
        sb.elements = [...existingElements, ...newRandomElements];
      }
      // Disable the other module if it's not locked
      if (plotData.narrative_driven.status !== 'locked') {
        plotData.narrative_driven.status = 'disabled';
        plotData.narrative_driven.expanded = false;
      }
    }

    // 3. Handle Custom Notes (if not locked)
    if (plotData.custom_notes.status !== 'locked') {
      plotData.custom_notes.status = 'editing';
    }
  }

  public randomizeLinearArc(existingArc?: LinearArcItem): LinearArcItem {
    const ndo = PLOT_OPTIONS.narrative_driven;
    return {
      id: existingArc?.id || uuidv4(),
      branch_type: this.randomizeDropdown(
        BRANCH_ROUTE_TYPES.filter(o => o.value).map(opt => ({ ...opt, value: opt.label, level: '' })),
      ),
      pacing_arc: this.randomizeDropdown(ndo.pacing_arc.filter(o => o.value)),
      description: '', // Keep description empty for random generation
      isCollapsed: existingArc?.isCollapsed ?? false,
      isLocked: existingArc?.isLocked ?? false,
    };
  }

  public randomizeSandboxElement(existingElement?: SandboxElementItem): SandboxElementItem {
    const sbo = PLOT_OPTIONS.sandbox;
    return {
      id: existingElement?.id || uuidv4(),
      type: this.randomizeDropdown(sbo.element_types.filter(o => o.value)),
      description: '', // Keep description empty for random generation
      isCollapsed: existingElement?.isCollapsed ?? false,
      isLocked: existingElement?.isLocked ?? false,
    };
  }

  public randomizeStylePage(styleData: StyleFormData): void {
    const s = STYLE_OPTIONS;

    // 1. Randomize mode if not locked
    if (styleData.mode.status !== 'locked') {
      styleData.mode.selection = this.randomizeDropdown(s.mode.selection);
    }

    // 2. If mode allows adjustments, randomize them if not locked
    if (styleData.adjustments.status !== 'locked') {
      if (styleData.mode.selection === '参考文风融合' || styleData.mode.selection === '从零定制合成') {
        const adj = styleData.adjustments;
        adj.expanded = true; // Ensure the module expands when activated
        const adjo = s.adjustments;
        adj.narrator_stance_spectrum = this.randomizeSpectrum(adjo.narrator_stance_spectrum);
        adj.linguistic_texture_spectrum = this.randomizeSpectrum(adjo.linguistic_texture_spectrum);
        adj.descriptive_focus_points = this.randomizePoints(adjo.descriptive_focus_points, 10, 'id');
        adj.rhetorical_strategy_spectrum = this.randomizeSpectrum(adjo.rhetorical_strategy_spectrum);
        adj.syntactic_rhythm_spectrum = this.randomizeSpectrum(adjo.syntactic_rhythm_spectrum);
        adj.sensory_channels_points = this.randomizePoints(adjo.sensory_channels_points, 10);
        adj.custom_notes = ''; // Clear custom notes
      }
    }

    // 3. Randomize dynamic rules if not locked
    if (styleData.dynamic_rules.status !== 'locked') {
      const rulesModule = styleData.dynamic_rules;
      rulesModule.expanded = true; // Expand when randomized
      const newRules: DynamicRule[] = [];
      const numRules = 1 + Math.floor(Math.random() * 3); // 1 to 3 rules
      const parentCategories = Object.keys(DYNAMIC_RULE_LIBRARY);

      if (parentCategories.length > 0) {
        for (let i = 0; i < numRules; i++) {
          // 10% chance to have a null parent
          const parentCategory = Math.random() > 0.1 ? this.getRandomElement(parentCategories) : null;
          let childCategory: string | null = null;

          if (parentCategory) {
            const childOptions = DYNAMIC_RULE_LIBRARY[parentCategory];
            if (childOptions && childOptions.length > 0) {
              // 10% chance to have a null child
              childCategory = Math.random() > 0.1 ? this.getRandomElement(childOptions) : null;
            }
          }

          newRules.push({
            id: uuidv4(),
            parentCategory,
            childCategory,
            descriptive_focus_points: this.randomizePoints(
              STYLE_OPTIONS.adjustments.descriptive_focus_points,
              10,
              'id',
            ),
            sensory_channels_points: this.randomizePoints(STYLE_OPTIONS.adjustments.sensory_channels_points, 10),
            pacing_dial: this.randomizeDropdown(STYLE_OPTIONS.dynamic_rule_dials.pacing),
            syntax_dial: this.randomizeDropdown(STYLE_OPTIONS.dynamic_rule_dials.syntax),
            vocabulary_dial: this.randomizeDropdown(STYLE_OPTIONS.dynamic_rule_dials.vocabulary),
            emotion_dial: this.randomizeDropdown(STYLE_OPTIONS.dynamic_rule_dials.emotion),
            adjustments: '',
            isCollapsed: false,
          });
        }
      }
      rulesModule.list = newRules;
    }
  }
}
