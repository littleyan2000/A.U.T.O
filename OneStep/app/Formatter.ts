import { CHARACTER_OPTIONS } from '../constants/character-options';
import { NEEDS_OPTIONS } from '../constants/needs-options';
import { PLOT_OPTIONS } from '../constants/plot-options';
import { STYLE_OPTIONS } from '../constants/style-options';
import { WORLDVIEW_MODULES } from '../constants/world-options';
import {
  AppState,
  CharacterFormData,
  CharacterProfile,
  DescriptiveProfileField,
  EnrichedPointsAllocationItem,
  FinalOutput,
  FormattedWorldviewMacro,
  FormattedWorldviewModule,
  GradientOption,
  NeedsFormData,
  PlayerNeedsProfile,
  PlotFormData,
  PlotProfile,
  RulebookProfile,
  RulesFormData,
  StyleFormData,
  TagPreferences,
  WorldFormData,
  WorldviewProfile,
  WritingStyleProfile,
} from '../types/AppTypes';
import { deepClone } from '../utils/deepClone';

export class Formatter {
  // ==================================================================
  // == 主入口 (Main Entry Points)
  // ==================================================================

  public formatForOutput(formData: AppState['formData']): FinalOutput {
    return {
      PlayerNeeds_Profile: this.formatNeeds(formData.needs),
      Worldview_Profile: this.formatWorld(formData.world),
      Character_Profile: this.formatCharacter(formData.character),
      Plot_Profile: this.formatPlot(formData.plot),
      Rulebook_Profile: this.formatRules(formData.rules),
      WritingStyle_Profile: this.formatStyle(formData.style),
    };
  }

  public formatAsPrompt(formData: AppState['formData']): string {
    const finalOutput = this.formatForOutput(formData);
    let prompt =
      '请根据以下要求，结合 Reference_Materials 中的参考资料（如有），和 WritingStyle_Reference 中的参考文风（如有），生成一个文本互动叙事游戏设定。设定详情如下：\n\n';

    if (!formData.needs.disabled) {
      prompt += this.formatNeedsProfileToText(finalOutput.PlayerNeeds_Profile);
    }
    if (!formData.world.disabled) {
      prompt += this.formatWorldviewProfileToText(finalOutput.Worldview_Profile);
    }
    if (!formData.character.disabled) {
      prompt += this.formatCharacterProfileToText(finalOutput.Character_Profile);
    }
    if (!formData.plot.disabled) {
      prompt += this.formatPlotProfileToText(finalOutput.Plot_Profile);
    }
    if (!formData.rules.disabled) {
      prompt += this.formatRulebookProfileToText(finalOutput.Rulebook_Profile);
    }
    if (!formData.style.disabled) {
      prompt += this.formatWritingStyleProfileToText(finalOutput.WritingStyle_Profile);
    }

    prompt += '\n--- 结束 ---\n';
    prompt +=
      '请基于以上所有信息，和对应的 *_Template 中的格式和说明要求，创造性地撰写设定；但以上信息中置空的部分请不要生成对应设定。';

    return prompt;
  }

  public formatAsReviewPrompt(formData: AppState['formData']): string {
    const finalOutput = this.formatForOutput(formData);
    let prompt =
      '结合下文要求，Reference_Materials 中的参考资料（如有），和 WritingStyle_Reference 中的参考文风（如有），检查和修改 Waiting_Modification 中的内容，要求详情如下，只有明确提出了修改要求的部分，才是需要修改的部分：\n\n';

    if (!formData.needs.disabled) {
      prompt += this.formatNeedsProfileToText(finalOutput.PlayerNeeds_Profile);
    }
    if (!formData.world.disabled) {
      prompt += this.formatWorldviewProfileToText(finalOutput.Worldview_Profile);
    }
    if (!formData.character.disabled) {
      prompt += this.formatCharacterProfileToText(finalOutput.Character_Profile);
    }
    if (!formData.plot.disabled) {
      prompt += this.formatPlotProfileToText(finalOutput.Plot_Profile);
    }
    if (!formData.rules.disabled) {
      prompt += this.formatRulebookProfileToText(finalOutput.Rulebook_Profile);
    }
    if (!formData.style.disabled) {
      prompt += this.formatWritingStyleProfileToText(finalOutput.WritingStyle_Profile);
    }

    prompt += '\n--- 结束 ---\n';
    prompt +=
      '请区分不需要修改的部分和需要修改的部分：需要修改的部分会明确提出要求，此外都是不需要修改的部分。只输出需要修改的部分，Waiting_Modification 设定的其他部分都不需要输出。';

    return prompt;
  }

  // ==================================================================
  // == 文本生成器 (Text Generators)
  // ==================================================================

  private formatNeedsProfileToText(profile: PlayerNeedsProfile): string {
    let contentText = '';

    // Section 1: Emotion
    let emotionText = '';
    emotionText += this.formatPoints(
      '**核心情感调色盘 (定义核心情感权重, 共10点):**',
      profile.emotion.points as unknown as EnrichedPointsAllocationItem[],
    );
    emotionText += this.formatSimpleKVs('**情感风味微调:**', profile.emotion.flavors);
    if (emotionText) contentText += emotionText;

    // Section 2: Power Dynamics
    let powerText = '';
    let globalPowerText = '';
    globalPowerText += this.formatSimpleKV('    - 客观权力光谱', profile.power.objective_spectrum);
    globalPowerText += this.formatSimpleKV('    - 主要支配方', profile.power.dominant_party);
    globalPowerText += this.formatPoints(
      '    - 支配方权力来源构成 (共7点):',
      profile.power.dominant_power_sources_points as unknown as EnrichedPointsAllocationItem[],
      '',
      '      - ',
    );
    globalPowerText += this.formatSimpleKV('    - 权力表达方式', profile.power.expression_spectrum);
    globalPowerText += this.formatSimpleKV('    - 玩家世界重要性', profile.power.importance_spectrum);
    if (globalPowerText) {
      powerText += '  **全局关系设定:**\n' + globalPowerText;
    }

    let pcDynamicsText = '';
    pcDynamicsText += this.formatSimpleKV('    - 互动策略', profile.power.pc_dynamics.interaction_strategy);
    pcDynamicsText += this.formatSimpleKV('    - 初始主观状态', profile.power.pc_dynamics.initial_subjective_state);
    pcDynamicsText += this.formatSimpleKV('    - 目标主观状态', profile.power.pc_dynamics.target_subjective_state);
    if (pcDynamicsText) {
      powerText += '\n  **玩家角色(PC)动态:**\n' + pcDynamicsText;
    }

    let npcDynamicsText = '';
    npcDynamicsText += this.formatSimpleKV('    - 互动策略', profile.power.npc_dynamics.interaction_strategy);
    npcDynamicsText += this.formatSimpleKV('    - 初始主观状态', profile.power.npc_dynamics.initial_subjective_state);
    npcDynamicsText += this.formatSimpleKV('    - 目标主观状态', profile.power.npc_dynamics.target_subjective_state);
    if (npcDynamicsText) {
      powerText += '\n  **核心NPC动态:**\n' + npcDynamicsText;
    }

    if (powerText) {
      contentText += '\n**权力动态:**\n' + powerText;
    }

    // Section 3: Narrative Tone
    let narrativeText = '';
    narrativeText += this.formatSimpleKV('世界-玩家和谐度', profile.narrative.world_harmony_spectrum);
    narrativeText += this.formatSimpleKV('关键角色顺从度', profile.narrative.npc_compliance_spectrum);
    narrativeText += this.formatSimpleKV('叙事节奏', profile.narrative.pace_spectrum);
    narrativeText += this.formatSimpleKV('主要叙事视角', profile.narrative.perspective_choice);
    narrativeText += this.formatSimpleKV('视角切换策略', profile.narrative.perspective_switching_mode);
    if (narrativeText) {
      contentText += '\n**叙事基调与世界张力:**\n' + narrativeText;
    }

    // Section 4: Boundaries
    let boundariesText = '';
    boundariesText += this.formatSimpleKV('违反意愿容忍度', profile.boundaries.consent_tolerance_level);
    boundariesText += this.formatSimpleKV('亲密内容许可上限', profile.boundaries.erotic_level);
    boundariesText += this.formatSimpleKV('亲密内容主题倾向性', profile.boundaries.erotic_focus);
    boundariesText += this.formatSimpleKV('冲突内容许可上限', profile.boundaries.violence_level);
    boundariesText += this.formatSimpleKV('冲突内容主题倾向性', profile.boundaries.violence_focus);
    boundariesText += this.formatSimpleKV('描写强度', profile.boundaries.description_intensity_spectrum);
    boundariesText += this.formatTagsList('喜好标签 (Likes)', profile.boundaries.likes_tags);
    boundariesText += this.formatTagsList('禁忌标签 (Dislikes)', profile.boundaries.dislikes_tags);
    boundariesText += this.formatSimpleKV('后果严重性', profile.boundaries.consequence_severity_spectrum);
    if (boundariesText) {
      contentText += '\n**内容偏好与体验边界:**\n' + boundariesText;
    }

    // Section 5: Custom Notes
    const customNotesText = this.formatSimpleKV('自定义需求', profile.custom_notes);
    if (customNotesText) {
      contentText += '\n' + customNotesText;
    }

    if (contentText.trim()) {
      return '--- 核心需求 (Player Needs) ---\n' + contentText;
    }
    return '';
  }

  private formatWorldviewProfileToText(profile: WorldviewProfile): string {
    let contentText = '';

    for (const moduleId in profile.modules) {
      const moduleState = profile.modules[moduleId];
      if (moduleState.status === 'disabled') continue;

      const moduleInfo = WORLDVIEW_MODULES.find(m => m.id === moduleId);
      if (!moduleInfo) continue;

      let moduleContent = '';
      // Format macro selections
      for (const formattedMacro of moduleState.macro_selections) {
        if (!formattedMacro || !formattedMacro.value) continue;

        if (Array.isArray(formattedMacro.value)) {
          moduleContent += this.formatPoints(
            formattedMacro.label,
            formattedMacro.value as EnrichedPointsAllocationItem[],
            '  ',
            '    - ',
          );
        } else if (typeof formattedMacro.value === 'string') {
          moduleContent += this.formatSimpleKV(formattedMacro.label, formattedMacro.value, '  ');
        }
      }

      // Format specific items
      if (moduleState.specific_items.length > 0) {
        let itemsText = '';
        moduleState.specific_items.forEach(item => {
          const categoryText = item.category ? ` (${item.category})` : '';
          itemsText += `    - **${item.name || '未命名条目'}${categoryText}:** ${item.description || '无描述'}\n`;
        });
        if (itemsText) {
          moduleContent += '  **具体条目:**\n' + itemsText;
        }
      }
      if (moduleContent) {
        contentText += `\n**${moduleInfo.title}:**\n` + moduleContent;
      }
    }

    if (profile.custom_input.enabled && profile.custom_input.content) {
      contentText += '\n**自定义输入:**\n';
      contentText += `  ${profile.custom_input.content}\n`;
    }

    if (contentText.trim()) {
      return '\n--- 世界观 (Worldview) ---' + contentText;
    }
    return '';
  }

  private formatCharacterProfileToText(profile: CharacterProfile): string {
    let mainText = '';

    // Section 1: PC Card
    let pcText = '';
    pcText += this.formatSimpleKV('模板等级', profile.pc.template_level, '  ');
    if (profile.pc.enable_nsfw_attributes) {
      pcText += this.formatSimpleKV('生成NSFW属性', '是', '  ');
    }
    pcText += this.formatSimpleKV('自定义核心概念', profile.pc.custom_concept, '  ');
    if (pcText) {
      mainText += '\n**主控角色 (PC):**\n' + pcText;
    }

    // Section 2: Key Characters
    let keyCharsText = '';
    if (profile.key_characters.list && profile.key_characters.list.length > 0) {
      profile.key_characters.list.forEach((char, index) => {
        let charText = '';
        charText += this.formatSimpleKV('    模板等级', char.template_level, '');
        if (char.enable_nsfw_attributes) {
          charText += this.formatSimpleKV('    生成NSFW属性', '是', '');
        }
        charText += this.formatSimpleKV('    关系定位', char.relational_proximity, '');
        charText += this.formatSimpleKV('    社会阶层', char.social_class, '');
        charText += this.formatSimpleKV('    主题作用1', char.thematic_role_1, '');
        charText += this.formatSimpleKV('    主题作用2', char.thematic_role_2, '');

        let psychoText = '';
        if (char.psychological_profile) {
          psychoText += this.formatSimpleKV('      开放性', char.psychological_profile.openness, '');
          psychoText += this.formatSimpleKV('      尽责性', char.psychological_profile.conscientiousness, '');
          psychoText += this.formatSimpleKV('      外倾性', char.psychological_profile.extraversion, '');
          psychoText += this.formatSimpleKV('      宜人性', char.psychological_profile.agreeableness, '');
          psychoText += this.formatSimpleKV('      神经质', char.psychological_profile.neuroticism, '');
        }
        if (psychoText) {
          charText += '    心理画像:\n' + psychoText;
        }

        let valuesText = '';
        if (char.core_values) {
          valuesText += this.formatSimpleKV('      关爱/伤害', char.core_values.care, '');
          valuesText += this.formatSimpleKV('      公平/欺骗', char.core_values.fairness, '');
          valuesText += this.formatSimpleKV('      忠诚/背叛', char.core_values.loyalty, '');
          valuesText += this.formatSimpleKV('      权威/颠覆', char.core_values.authority, '');
          valuesText += this.formatSimpleKV('      圣洁/堕落', char.core_values.sanctity, '');
          valuesText += this.formatSimpleKV('      自由/压迫', char.core_values.liberty, '');
        }
        if (valuesText) {
          charText += '    核心价值观:\n' + valuesText;
        }

        charText += this.formatSimpleKV('    自定义文本', char.custom_concept, '');

        if (charText) {
          keyCharsText += `  **角色 ${index + 1}:**\n` + charText;
        }
      });
    }
    if (keyCharsText) {
      mainText += '\n**重要角色 (Key Characters):**\n' + keyCharsText;
    }

    // Section 3: World Population
    let worldPopText = '';
    const wp = profile.world_population;

    let supportingText = '';
    supportingText += this.formatSimpleKV('模板等级', wp.supporting.template_level, '    ');
    if (wp.supporting.enable_nsfw_attributes) {
      supportingText += this.formatSimpleKV('生成NSFW属性', '是', '    ');
    }
    supportingText += this.formatCounts('主要职能分配:', wp.supporting.role_focus_counts, '    ');
    supportingText += this.formatSimpleKV('自定义说明', wp.supporting.custom_notes, '    ');
    if (supportingText) {
      worldPopText += '  **功能角色设定:**\n' + supportingText;
    }

    let ambientText = '';
    ambientText += this.formatSimpleKV('模板等级', wp.ambient.template_level, '    ');
    if (wp.ambient.enable_nsfw_attributes) {
      ambientText += this.formatSimpleKV('生成NSFW属性', '是', '    ');
    }
    ambientText += this.formatCounts('功能群体分配:', wp.ambient.group_counts, '    ');
    ambientText += this.formatSimpleKV('自定义说明', wp.ambient.custom_notes, '    ');
    if (ambientText) {
      worldPopText += '\n  **背景角色组设定:**\n' + ambientText;
    }

    if (worldPopText) {
      mainText += '\n**世界人口 (World Population):**\n' + worldPopText;
    }

    // Only return the main section if it has content
    if (mainText) {
      return '\n--- 角色 (Characters) ---' + mainText;
    }
    return '';
  }

  private formatPlotProfileToText(profile: PlotProfile): string {
    let contentText = '';
    contentText += this.formatSimpleKV('**叙事模式**', profile.structure.mode);
    contentText += this.formatPoints('\n**主要剧情驱动力 (权重):**', profile.driver_points);

    if (profile.structure.mode === '线性/分支叙事' && profile.narrative_driven) {
      let narrativeDrivenText = '';
      narrativeDrivenText += this.formatSimpleKV('核心情节焦点', profile.narrative_driven.focus, '  ');
      if (profile.narrative_driven.arcs.length > 0) {
        let arcsText = '';
        profile.narrative_driven.arcs.forEach((arc, index) => {
          arcsText += `    - **故事线 #${index + 1}:**\n`;
          arcsText += this.formatSimpleKV('      分支类型', arc.branch_type);
          arcsText += this.formatSimpleKV('      叙事节奏', arc.pacing_arc);
          arcsText += this.formatSimpleKV('      简介', arc.description);
        });
        if (arcsText) {
          narrativeDrivenText += '  **故事线列表:**\n' + arcsText;
        }
      }
      if (narrativeDrivenText) {
        contentText += '\n**线性/分支叙事设计:**\n' + narrativeDrivenText;
      }
    } else if (profile.structure.mode === '沙盒叙事' && profile.sandbox) {
      let sandboxText = '';
      sandboxText += this.formatSimpleKV('世界张力', profile.sandbox.world_tension, '  ');
      if (profile.sandbox.elements.length > 0) {
        let elementsText = '';
        profile.sandbox.elements.forEach(arc => {
          elementsText += `    - **${arc.type}:** ${arc.description}\n`;
        });
        if (elementsText) {
          sandboxText += '  **沙盒元素列表:**\n' + elementsText;
        }
      }
      if (sandboxText) {
        contentText += '\n**沙盒叙事设计:**\n' + sandboxText;
      }
    }
    contentText += this.formatSimpleKV('\n**自定义剧情要求**', profile.custom_notes);

    // Trim leading/trailing whitespace and check if there's content
    if (contentText.trim()) {
      return '\n--- 剧情 (Plot) ---\n' + contentText;
    }
    return '';
  }

  private formatRulebookProfileToText(profile: RulebookProfile): string {
    let contentText = '';
    if (profile.trackers.list.length > 0) {
      let trackersText = '';
      profile.trackers.list.forEach(tracker => {
        trackersText += `  - **${tracker.name}:**\n`;
        trackersText += `    - **适用范围:** ${tracker.scope}\n`;
        trackersText += `    - **说明:** ${tracker.description}\n`;
        trackersText += `    - **规则:** ${tracker.type}\n`;
        if (tracker.thresholds.length > 0) {
          trackersText += '    - **阈值效果:**\n';
          tracker.thresholds.forEach(t => {
            trackersText += `      - ${t.condition}: ${t.effect}\n`;
          });
        }
      });
      if (trackersText) {
        contentText += '**状态追踪器 (State Trackers):**\n' + trackersText;
      }
    }
    if (profile.descriptors.list.length > 0) {
      let descriptorsText = '';
      profile.descriptors.list.forEach(desc => {
        descriptorsText += `  - **${desc.name} (${desc.type}):** ${desc.narrative_effect}\n`;
      });
      if (descriptorsText) {
        contentText += '\n**叙事描述符 (Narrative Descriptors):**\n' + descriptorsText;
      }
    }
    if (profile.causal_triggers.list.length > 0) {
      let triggersText = '';
      profile.causal_triggers.list.forEach(trigger => {
        triggersText += `  - **系统: ${trigger.system_name}**\n`;
        triggersText += `    - **适用范围:** ${trigger.scope}\n`;
        triggersText += `    - **核心概念:** ${trigger.core_concept}\n`;
        if (trigger.states.length > 0) {
          triggersText += '    - **状态或阶段:**\n';
          trigger.states.forEach(s => {
            triggersText += `      - **${s.state_name}:** ${s.description}\n`;
          });
        }
        if (trigger.rules.length > 0) {
          triggersText += '    - **规则列表:**\n';
          trigger.rules.forEach(r => {
            triggersText += `      - **当:** ${r.trigger_condition} **则:** ${r.consequence}\n`;
          });
        }
      });
      if (triggersText) {
        contentText += '\n**因果触发器 (Causal Triggers):**\n' + triggersText;
      }
    }

    if (contentText) {
      return '\n--- 规则 (Rules) ---\n' + contentText;
    }
    return '';
  }

  private formatWritingStyleProfileToText(profile: WritingStyleProfile): string {
    let contentText = '';
    contentText += this.formatSimpleKV('**生成模式**', profile.mode.selection);

    if (profile.adjustments.status !== 'disabled') {
      let adjustmentsText = '';
      adjustmentsText += this.formatSimpleKV('叙事者姿态', profile.adjustments.narrator_stance_spectrum, '  ');
      adjustmentsText += this.formatSimpleKV('语言质感与词汇', profile.adjustments.linguistic_texture_spectrum, '  ');
      adjustmentsText += this.formatPoints(
        '描写重心 (权重):',
        profile.adjustments.descriptive_focus_points as unknown as EnrichedPointsAllocationItem[],
        '  ',
      );
      adjustmentsText += this.formatSimpleKV('修辞策略', profile.adjustments.rhetorical_strategy_spectrum, '  ');
      adjustmentsText += this.formatSimpleKV('信息密度与句法节奏', profile.adjustments.syntactic_rhythm_spectrum, '  ');
      adjustmentsText += this.formatPoints(
        '感官通道优先级 (权重):',
        profile.adjustments.sensory_channels_points as unknown as EnrichedPointsAllocationItem[],
        '  ',
      );
      if (adjustmentsText) {
        contentText += '\n**核心调整模块:**\n' + adjustmentsText;
      }
      contentText += this.formatSimpleKV('自定义文风要求', profile.adjustments.custom_notes, '  ');
    }

    if (profile.dynamic_rules.status !== 'disabled' && profile.dynamic_rules.list.length > 0) {
      let dynamicRulesText = '';
      profile.dynamic_rules.list.forEach(rule => {
        const parentLabel = rule.parentCategory || '';
        const childLabel = rule.childCategory || '';
        const sceneType = `${parentLabel}${childLabel ? ` -> ${childLabel}` : ''}`;

        if (!sceneType) return;

        let ruleText = `  - **场景: ${sceneType}**\n`;
        let hasContent = false;

        const focusPoints = this.enrichPointsAllocation(
          rule.descriptive_focus_points,
          STYLE_OPTIONS.adjustments.descriptive_focus_points,
          'id',
        );
        if (focusPoints.length > 0) {
          ruleText += this.formatPoints('描写重心 (场景专用):', focusPoints, '    ', '      - ');
          hasContent = true;
        }

        const sensoryPoints = this.enrichPointsAllocation(
          rule.sensory_channels_points,
          STYLE_OPTIONS.adjustments.sensory_channels_points,
        );
        if (sensoryPoints.length > 0) {
          ruleText += this.formatPoints('感官通道 (场景专用):', sensoryPoints, '    ', '      - ');
          hasContent = true;
        }

        if (rule.adjustments) {
          ruleText += `    - **自定义调整:** ${rule.adjustments}\n`;
          hasContent = true;
        }

        const dialsText = [
          { label: '叙事节奏', value: rule.pacing_dial },
          { label: '句法结构', value: rule.syntax_dial },
          { label: '词汇剖面', value: rule.vocabulary_dial },
          { label: '情感表达', value: rule.emotion_dial },
        ]
          .map(dial => (dial.value ? `${dial.label}: ${dial.value}` : ''))
          .filter(Boolean)
          .join('; ');

        if (dialsText) {
          ruleText += `    - **风格调节器:** ${dialsText}\n`;
          hasContent = true;
        }

        if (hasContent) {
          dynamicRulesText += ruleText;
        }
      });
      if (dynamicRulesText) {
        contentText += '\n**动态应用规则:**\n' + dynamicRulesText;
      }
    }

    if (contentText.trim()) {
      return '\n--- 写作风格 (Writing Style) ---\n' + contentText;
    }
    return '';
  }

  // ==================================================================
  // == 格式化辅助函数 (Formatting Helpers)
  // ==================================================================

  private formatKey(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  private formatSimpleKV(
    label: string,
    value: string | number | boolean | undefined | { value: any; description?: string },
    indent = '',
  ): string {
    if (value === undefined || value === null || value === '') return '';

    if (typeof value === 'object' && value !== null && 'value' in value) {
      if (!value.value) return ''; // Don't print if the inner value is empty
      return `${indent}**${label}:** ${value.value}\n`;
    }

    return `${indent}**${label}:** ${value}\n`;
  }

  private formatSimpleKVs(label: string, data: Record<string, any>, indent = ''): string {
    if (!data || Object.keys(data).length === 0) return '';

    let contentText = '';
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        let displayValue = value;
        if (typeof value === 'object' && value !== null && 'value' in value) {
          // If the value is an object with a 'value' property, use that.
          displayValue = value.value;
        }
        // Only add to content if the final display value is not empty
        if (displayValue) {
          contentText += `${indent}  - **${this.formatKey(key)}:** ${displayValue}\n`;
        }
      }
    }

    if (contentText) {
      return `${indent}${label}\n` + contentText;
    }
    return '';
  }

  private formatPoints(label: string, items: EnrichedPointsAllocationItem[], indent = '', itemIndent = '  - '): string {
    if (!items || items.length === 0) return '';
    let text = `${indent}${label}\n`;
    items.forEach(item => {
      if (item.points > 0) {
        text += `${indent}${itemIndent}${item.label} (${item.points}点): ${item.description || '无详细描述'}\n`;
      }
    });
    return text;
  }

  private formatCounts(label: string, data: Record<string, number>, indent = ''): string {
    if (!data || Object.keys(data).filter(k => data[k] > 0).length === 0) return '';
    let text = `${indent}${label}\n`;
    for (const [key, value] of Object.entries(data)) {
      if (value > 0) {
        text += `${indent}  - ${key}: ${value}个\n`;
      }
    }
    return text;
  }

  private formatTagsList(label: string, tags: string[]): string {
    if (!tags || tags.length === 0) return '';
    return `**${label}:** ${tags.join(', ')}\n`;
  }

  // ==================================================================
  // == 数据转换器 (Data Transformers)
  // ==================================================================

  private formatTags(tags: TagPreferences): { likes_tags: string[]; dislikes_tags: string[] } {
    const likes_tags: string[] = [];
    const dislikes_tags: string[] = [];

    for (const tag in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, tag)) {
        const preference = tags[tag];
        if (preference === 'like') {
          likes_tags.push(tag);
        } else if (preference === 'dislike') {
          dislikes_tags.push(tag);
        }
      }
    }
    return { likes_tags, dislikes_tags };
  }

  private formatNeeds(data: NeedsFormData): PlayerNeedsProfile {
    const { disabled, validation, ...rawProfileData } = deepClone(data);
    const profileData = rawProfileData;

    // --- Metadata Map ---
    // This map connects the data field path to its UI label and help text.
    // This is a bit manual but is the most reliable way to get the descriptions.
    const metadataMap: Record<string, { label: string; description: string }> = {
      'power.objective_spectrum': { label: '客观权力光谱', description: '定义PC与核心NPC之间的客观权力高低关系。' },
      'power.dominant_party': { label: '主要支配方', description: '明确关系中的主要支配力量来源。' },
      'power.expression_spectrum': { label: '权力表达方式光谱', description: '权力是公开宣告还是秘而不宣。' },
      'power.importance_spectrum': { label: '玩家世界重要性光谱', description: '玩家行动对世界宏观走向的影响力。' },
      'power.pc_dynamics.interaction_strategy': {
        label: '互动策略',
        description: 'PC为达成自身目的所采取的行为策略。',
      },
      'power.pc_dynamics.initial_subjective_state': {
        label: '初始主观状态',
        description: 'PC在故事开始时对权力关系的内心感受。',
      },
      'power.pc_dynamics.target_subjective_state': {
        label: '目标主观状态',
        description: 'PC内心感受将倾向于变化成的目标状态。',
      },
      'power.npc_dynamics.interaction_strategy': {
        label: '互动策略',
        description: '核心NPC为达成自身目的所采取的行为策略原型。',
      },
      'power.npc_dynamics.initial_subjective_state': {
        label: '初始主观状态',
        description: '核心NPC在故事开始时对权力关系的内心感受原型。',
      },
      'power.npc_dynamics.target_subjective_state': {
        label: '目标主观状态',
        description: '核心NPC内心感受将倾向于变化成的目标状态原型。',
      },
      'narrative.world_harmony_spectrum': { label: '世界和谐度光谱', description: '世界整体的和谐/冲突程度。' },
      'narrative.npc_compliance_spectrum': { label: 'NPC顺从度光谱', description: 'NPC对玩家行动的顺从/抗拒程度。' },
      'narrative.pace_spectrum': { label: '故事节奏光谱', description: '故事推进的快慢、紧张/舒缓程度。' },
      'narrative.perspective_choice': { label: '叙事视角选择', description: '故事采用哪种叙事视角。' },
      'narrative.perspective_switching_mode': { label: '视角切换方式', description: '叙事过程中视角如何切换。' },
      'boundaries.consent_tolerance_level': { label: '同意容忍度光谱', description: '对角色行为边界的容忍度。' },
      'boundaries.erotic_level': { label: '色情程度光谱', description: '故事中允许出现的色情内容程度。' },
      'boundaries.erotic_focus': { label: '色情内容聚焦', description: '色情内容主要聚焦于哪些方面。' },
      'boundaries.violence_level': { label: '暴力程度光谱', description: '故事中允许出现的暴力内容程度。' },
      'boundaries.violence_focus': { label: '暴力内容聚焦', description: '暴力内容主要聚焦于哪些方面。' },
      'boundaries.description_intensity_spectrum': {
        label: '描述强度光谱',
        description: '故事中对敏感内容的描述强度。',
      },
      'boundaries.consequence_severity_spectrum': {
        label: '后果严重性光谱',
        description: '角色行为带来的后果严重性。',
      },
    };

    // --- Helper Functions ---
    const enrichField = (fieldPath: string, value: string, options: GradientOption[]): DescriptiveProfileField => {
      const meta = metadataMap[fieldPath] || { label: fieldPath, description: '' };
      const selectedOption = options.find(opt => opt.value === value);
      return {
        label: meta.label,
        description: meta.description,
        value: selectedOption ? selectedOption.value : '', // Use full value string
      };
    };

    const enrichPoints = (
      pointsData: Record<string, number>,
      options: { label: string; description: string }[],
    ): EnrichedPointsAllocationItem[] => {
      return Object.entries(pointsData)
        .filter(([, points]) => points > 0)
        .map(([label, points]) => {
          const optionData = options.find(opt => opt.label === label);
          return { label, points, description: optionData?.description || '' };
        });
    };

    // --- Data Transformation ---

    const finalProfile: PlayerNeedsProfile = {
      emotion: {
        points: enrichPoints(profileData.emotion.points, NEEDS_OPTIONS.emotion.points),
        flavors: {},
      },
      power: {
        objective_spectrum: enrichField(
          'power.objective_spectrum',
          profileData.power.objective_spectrum,
          NEEDS_OPTIONS.power.objective_spectrum,
        ),
        dominant_party: enrichField(
          'power.dominant_party',
          profileData.power.dominant_party,
          NEEDS_OPTIONS.power.dominant_party,
        ),
        dominant_power_sources_points: enrichPoints(
          profileData.power.dominant_power_sources_points,
          NEEDS_OPTIONS.power.dominant_power_sources_points,
        ),
        expression_spectrum: enrichField(
          'power.expression_spectrum',
          profileData.power.expression_spectrum,
          NEEDS_OPTIONS.power.expression_spectrum,
        ),
        importance_spectrum: enrichField(
          'power.importance_spectrum',
          profileData.power.importance_spectrum,
          NEEDS_OPTIONS.power.importance_spectrum,
        ),
        pc_dynamics: {
          interaction_strategy: enrichField(
            'power.pc_dynamics.interaction_strategy',
            profileData.power.pc_dynamics.interaction_strategy,
            NEEDS_OPTIONS.power.interaction_strategy_spectrum,
          ),
          initial_subjective_state: enrichField(
            'power.pc_dynamics.initial_subjective_state',
            profileData.power.pc_dynamics.initial_subjective_state,
            NEEDS_OPTIONS.power.subjective_state_options,
          ),
          target_subjective_state: enrichField(
            'power.pc_dynamics.target_subjective_state',
            profileData.power.pc_dynamics.target_subjective_state,
            NEEDS_OPTIONS.power.target_subjective_state_options,
          ),
        },
        npc_dynamics: {
          interaction_strategy: enrichField(
            'power.npc_dynamics.interaction_strategy',
            profileData.power.npc_dynamics.interaction_strategy,
            NEEDS_OPTIONS.power.interaction_strategy_spectrum,
          ),
          initial_subjective_state: enrichField(
            'power.npc_dynamics.initial_subjective_state',
            profileData.power.npc_dynamics.initial_subjective_state,
            NEEDS_OPTIONS.power.subjective_state_options,
          ),
          target_subjective_state: enrichField(
            'power.npc_dynamics.target_subjective_state',
            profileData.power.npc_dynamics.target_subjective_state,
            NEEDS_OPTIONS.power.target_subjective_state_options,
          ),
        },
      },
      narrative: {
        world_harmony_spectrum: enrichField(
          'narrative.world_harmony_spectrum',
          profileData.narrative.world_harmony_spectrum,
          NEEDS_OPTIONS.narrative.world_harmony_spectrum,
        ),
        npc_compliance_spectrum: enrichField(
          'narrative.npc_compliance_spectrum',
          profileData.narrative.npc_compliance_spectrum,
          NEEDS_OPTIONS.narrative.npc_compliance_spectrum,
        ),
        pace_spectrum: enrichField(
          'narrative.pace_spectrum',
          profileData.narrative.pace_spectrum,
          NEEDS_OPTIONS.narrative.pace_spectrum,
        ),
        perspective_choice: enrichField(
          'narrative.perspective_choice',
          profileData.narrative.perspective_choice,
          NEEDS_OPTIONS.narrative.perspective_choice,
        ),
        perspective_switching_mode: enrichField(
          'narrative.perspective_switching_mode',
          profileData.narrative.perspective_switching_mode,
          NEEDS_OPTIONS.narrative.perspective_switching_mode,
        ),
      },
      boundaries: {
        consent_tolerance_level: enrichField(
          'boundaries.consent_tolerance_level',
          profileData.boundaries.consent_tolerance_level,
          NEEDS_OPTIONS.boundaries.consent_tolerance_level,
        ),
        erotic_level: enrichField(
          'boundaries.erotic_level',
          profileData.boundaries.erotic_level,
          NEEDS_OPTIONS.boundaries.erotic_level,
        ),
        erotic_focus: enrichField(
          'boundaries.erotic_focus',
          profileData.boundaries.erotic_focus,
          NEEDS_OPTIONS.boundaries.erotic_focus,
        ),
        violence_level: enrichField(
          'boundaries.violence_level',
          profileData.boundaries.violence_level,
          NEEDS_OPTIONS.boundaries.violence_level,
        ),
        violence_focus: enrichField(
          'boundaries.violence_focus',
          profileData.boundaries.violence_focus,
          NEEDS_OPTIONS.boundaries.violence_focus,
        ),
        description_intensity_spectrum: enrichField(
          'boundaries.description_intensity_spectrum',
          profileData.boundaries.description_intensity_spectrum,
          NEEDS_OPTIONS.boundaries.description_intensity_spectrum,
        ),
        consequence_severity_spectrum: enrichField(
          'boundaries.consequence_severity_spectrum',
          profileData.boundaries.consequence_severity_spectrum,
          NEEDS_OPTIONS.boundaries.consequence_severity_spectrum,
        ),
        likes_tags: [],
        dislikes_tags: [],
      },
      custom_notes: profileData.custom_notes.content || '',
    };

    // Handle emotion flavors separately
    for (const key in profileData.emotion.flavors) {
      const flavorKey = key as keyof typeof NEEDS_OPTIONS.emotion.flavors;
      const selectedValue = profileData.emotion.flavors[flavorKey];
      const options = NEEDS_OPTIONS.emotion.flavors[flavorKey];
      if (options && selectedValue) {
        finalProfile.emotion.flavors[flavorKey] = enrichField(`emotion.flavors.${key}`, selectedValue, options);
      }
    }

    // Handle tags
    const { likes_tags, dislikes_tags } = this.formatTags(profileData.boundaries.tags);
    finalProfile.boundaries.likes_tags = likes_tags;
    finalProfile.boundaries.dislikes_tags = dislikes_tags;

    return finalProfile;
  }

  private formatWorld(data: WorldFormData): WorldviewProfile {
    const profile: WorldviewProfile = {
      modules: {},
      custom_input: deepClone(data.custom_input),
    };

    // Iterate over the module definitions to maintain order and get metadata
    for (const moduleInfo of WORLDVIEW_MODULES) {
      const moduleId = moduleInfo.id;
      const moduleState = data.modules[moduleId];

      // Skip disabled modules
      if (!moduleState || moduleState.status === 'disabled') {
        continue;
      }

      const formattedModule: FormattedWorldviewModule = {
        id: moduleId,
        title: moduleInfo.title,
        status: moduleState.status,
        macro_selections: [],
        specific_items: deepClone(moduleState.specific_items || []),
      };

      // Process macro options
      if (moduleInfo.macroOptions) {
        for (const macroOpt of moduleInfo.macroOptions) {
          const rawValue = moduleState.macro_selections?.[macroOpt.id];
          if (
            rawValue === undefined ||
            rawValue === null ||
            rawValue === '' ||
            (typeof rawValue === 'object' && Object.keys(rawValue).length === 0)
          ) {
            continue;
          }

          let formattedMacro: FormattedWorldviewMacro | null = null;

          switch (macroOpt.type) {
            case 'dropdown':
              const selectedOption = (macroOpt.options as GradientOption[]).find(o => o.value === rawValue);
              if (selectedOption && selectedOption.value) {
                formattedMacro = {
                  label: macroOpt.label,
                  type: macroOpt.type,
                  value: selectedOption.label,
                  description: selectedOption.description,
                };
              }
              break;

            case 'points_allocator':
              const pointsOptions = (macroOpt.options as any[]).filter(o => o.type !== 'separator');
              const enrichedPoints = this.enrichPointsAllocation(rawValue, pointsOptions, 'id');
              if (enrichedPoints.length > 0) {
                formattedMacro = {
                  label: macroOpt.label,
                  type: macroOpt.type,
                  value: enrichedPoints,
                };
              }
              break;

            case 'dynamic_points_allocator':
              if (moduleState.dpa_items && moduleState.dpa_items.length > 0) {
                const itemsWithValue = moduleState.dpa_items.filter(item => item.points > 0);
                if (itemsWithValue.length > 0) {
                  formattedMacro = {
                    label: macroOpt.label,
                    type: macroOpt.type,
                    value: itemsWithValue,
                  };
                }
              }
              break;

            // Defensive coding: Warn about unhandled macro types to prevent silent data loss.
            default:
              console.warn(
                `[Formatter] Unhandled worldview macro type: "${macroOpt.type}" for option "${macroOpt.id}". Data for this option will be ignored.`,
              );
              break;
          }

          if (formattedMacro) {
            formattedModule.macro_selections.push(formattedMacro);
          }
        }
      }

      // Add the formatted module to the profile if it has content
      if (formattedModule.macro_selections.length > 0 || formattedModule.specific_items.length > 0) {
        profile.modules[moduleId] = formattedModule;
      }
    }

    return profile;
  }

  private formatCharacter(data: CharacterFormData): CharacterProfile {
    const { disabled, validation, ...profileData } = deepClone(data);

    const findDescription = (value: string, options: GradientOption[]): string => {
      const found = options.find(opt => opt.value === value);
      return found ? found.value : value;
    };

    // Format PC
    profileData.pc.template_level = findDescription(profileData.pc.template_level, CHARACTER_OPTIONS.pc.template_level);

    // Format Key Characters Manager
    profileData.key_characters.list.forEach(char => {
      char.template_level = findDescription(char.template_level, CHARACTER_OPTIONS.key.template_level);
    });

    // Format World Population
    const wp = profileData.world_population;
    wp.supporting.template_level = findDescription(
      wp.supporting.template_level,
      CHARACTER_OPTIONS.supporting.template_level,
    );
    wp.ambient.template_level = findDescription(wp.ambient.template_level, CHARACTER_OPTIONS.ambient.template_level);

    return profileData;
  }

  private enrichPointsAllocation(
    pointsData: Record<string, number>,
    options: { label: string; description: string; [key: string]: any }[],
    keyField = 'label', // 'label' or 'id'
  ): EnrichedPointsAllocationItem[] {
    return Object.entries(pointsData)
      .filter(([, points]) => points > 0)
      .map(([key, points]) => {
        const optionData = options.find(opt => opt[keyField] === key);
        return {
          label: optionData?.label || key,
          points,
          description: optionData?.description || '',
        };
      });
  }

  private formatPlot(data: PlotFormData): PlotProfile {
    const { disabled, validation, ...profileData } = deepClone(data);

    const enrichedDriverPoints = this.enrichPointsAllocation(
      profileData.structure.driver_points,
      PLOT_OPTIONS.narrative_driven.driver,
    );

    const plotProfile: PlotProfile = {
      structure: {
        mode: profileData.structure.mode,
      },
      driver_points: enrichedDriverPoints,
      custom_notes: profileData.custom_notes.content,
      modules_status: {
        structure: profileData.structure.status,
        narrative_driven: profileData.narrative_driven.status,
        sandbox: profileData.sandbox.status,
        custom_notes: profileData.custom_notes.status,
      },
    };

    if (profileData.structure.mode === '线性/分支叙事') {
      plotProfile.narrative_driven = {
        focus: profileData.narrative_driven.focus,
        arcs: profileData.narrative_driven.list.map(arc => ({
          id: arc.id,
          branch_type: arc.branch_type,
          pacing_arc: arc.pacing_arc,
          description: arc.description,
        })),
      };
    } else {
      plotProfile.sandbox = {
        world_tension: profileData.sandbox.world_tension,
        elements: profileData.sandbox.elements.map(el => ({
          id: el.id,
          type: el.type,
          description: el.description,
        })),
      };
    }

    return plotProfile;
  }

  private formatCondition(condition: any): string {
    const { operator, value, min, max } = condition;
    const val = value ?? 0;
    const minVal = min ?? 0;
    const maxVal = max ?? 0;
    switch (operator) {
      case '>':
        return `值 > ${val}`;
      case '<':
        return `值 < ${val}`;
      case '>=':
        return `值 >= ${val}`;
      case '<=':
        return `值 <= ${val}`;
      case '==':
        return `值 == ${val}`;
      case 'between_inclusive':
        return `${minVal} <= 值 <= ${maxVal}`;
      case 'between_exclusive':
        return `${minVal} < 值 < ${maxVal}`;
      case 'between_left_inclusive':
        return `${minVal} <= 值 < ${maxVal}`;
      case 'between_right_inclusive':
        return `${minVal} < 值 <= ${maxVal}`;
      default:
        return '';
    }
  }

  private formatRules(data: RulesFormData): RulebookProfile {
    const { disabled, validation, ...profileData } = deepClone(data);
    const formattedTrackers = profileData.trackers.list.map(tracker => {
      const formattedThresholds = tracker.thresholds.map(t => ({
        effect: t.effect,
        condition: this.formatCondition(t.condition),
      }));
      let type = `初始值: ${tracker.initial_value.min}`;
      if (tracker.initial_value.min !== tracker.initial_value.max) {
        type = `初始值范围: [${tracker.initial_value.min}, ${tracker.initial_value.max}]`;
      }
      const bounds: string[] = [];
      if (tracker.has_min_value) bounds.push(`最小 ${tracker.min_value}`);
      if (tracker.has_max_value) bounds.push(`最大 ${tracker.max_value}`);
      if (bounds.length > 0) {
        type += ` (${bounds.join(', ')})`;
      }
      const { initial_value, has_min_value, min_value, has_max_value, max_value, ...rest } = tracker;
      return { ...rest, type, thresholds: formattedThresholds };
    });

    const formattedCausalTriggers = profileData.causal_triggers.list.map(trigger => {
      // No special formatting needed for sub-lists here as they are simple key-value pairs
      return trigger;
    });

    return {
      trackers: { list: formattedTrackers },
      descriptors: { list: profileData.descriptors.list },
      causal_triggers: { list: formattedCausalTriggers },
    };
  }

  private formatStyle(data: StyleFormData): WritingStyleProfile {
    const { disabled, validation, ...rawProfileData } = data;
    const profileData = deepClone(rawProfileData);
    const findStyleDescription = (value: string, options: { value: string }[]): string => {
      const exactMatch = options.find(opt => opt.value === value);
      if (exactMatch) return exactMatch.value;
      const keyMatch = options.find(opt => opt.value.startsWith(value.split(':')[0]));
      return keyMatch ? keyMatch.value : value;
    };
    profileData.mode.selection = findStyleDescription(profileData.mode.selection, STYLE_OPTIONS.mode.selection as any);
    for (const key in profileData.adjustments) {
      if (key.endsWith('_spectrum')) {
        const spectrumKey = key as keyof typeof STYLE_OPTIONS.adjustments;
        const options = STYLE_OPTIONS.adjustments[spectrumKey] as { value: string }[];
        if (options) {
          (profileData.adjustments as any)[key] = findStyleDescription((profileData.adjustments as any)[key], options);
        }
      }
    }
    (profileData.adjustments.descriptive_focus_points as any) = this.enrichPointsAllocation(
      profileData.adjustments.descriptive_focus_points,
      STYLE_OPTIONS.adjustments.descriptive_focus_points,
    );
    (profileData.adjustments.sensory_channels_points as any) = this.enrichPointsAllocation(
      profileData.adjustments.sensory_channels_points,
      STYLE_OPTIONS.adjustments.sensory_channels_points,
    );
    return profileData;
  }
}
