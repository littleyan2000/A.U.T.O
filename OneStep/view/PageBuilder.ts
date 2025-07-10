import { AppController } from '../app/AppController';
import { CHARACTER_OPTIONS } from '../constants/character-options';
import { AESTHETIC_FILTER_HIERARCHY, CULTURAL_ARCHETYPE_HIERARCHY } from '../constants/culture-options';
import { PAGE_METADATA } from '../constants/metadata';
import { NEEDS_OPTIONS } from '../constants/needs-options';
import { BRANCH_ROUTE_TYPES, PLOT_OPTIONS } from '../constants/plot-options';
import { PRESET_TYPE_OPTIONS } from '../constants/preset-type-options';
import { causalTriggerSchema, descriptorSchema, trackerSchema } from '../constants/rules-schema';
import { DYNAMIC_RULE_LIBRARY } from '../constants/scene-library';
import { STYLE_OPTIONS } from '../constants/style-options';
import { AVAILABLE_TAGS } from '../constants/tags';
import { WORLDVIEW_MODULES } from '../constants/world-options';
import {
  CharacterFormData,
  NeedsFormData,
  PageType,
  PlotFormData,
  RulesFormData,
  StyleFormData,
  WorldFormData,
  WorldviewModuleState,
  WorldviewSpecificItem,
} from '../types/AppTypes';
import { componentFactory } from './ComponentFactory';

export class PageBuilder {
  private app: AppController;

  constructor(app: AppController) {
    this.app = app;
  }

  public buildPage(page: PageType, data: any): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-container';

    pageContainer.appendChild(this.buildPageHeader(page, data.disabled));

    if (!data.disabled) {
      switch (page) {
        case 'needs':
          this.buildNeedsPage(pageContainer, data as NeedsFormData);
          break;
        case 'world':
          this.buildWorldviewPage(pageContainer, data as WorldFormData);
          break;
        case 'character':
          this.buildCharacterPage(pageContainer, data as CharacterFormData);
          break;
        case 'plot':
          this.buildPlotPage(pageContainer, data as PlotFormData);
          break;
        case 'rules':
          this.buildRulesPage(pageContainer, data as RulesFormData);
          break;
        case 'style':
          this.buildStylePage(pageContainer, data as StyleFormData);
          break;
        default:
          pageContainer.appendChild(document.createTextNode(`Content for ${page} coming soon.`));
      }
    }

    fragment.appendChild(pageContainer);
    return fragment;
  }

  private buildPageHeader(page: PageType, isDisabled: boolean): HTMLElement {
    const header = document.createElement('header');
    header.className = 'page-header';
    let description = PAGE_METADATA[page].description;

    // Add special note for the 'style' page
    if (page === 'style') {
      description += `<br><small><b>参考文风说明:</b> 在世界书的"参考文风-内容"中手动粘贴参考语料，AI将分析其特征。</small>`;
    }

    header.innerHTML = `
        <div class="page-header__info">
            <p class="page-header__description">${description}</p>
        </div>
        <div class="page-header__actions"></div>`;

    // Actions are now rendered in a separate toolbar, so this is no longer needed here.
    const actionsDiv = header.querySelector('.page-header__actions') as HTMLElement;
    if (actionsDiv) {
      actionsDiv.remove(); // Clean up the old container
    }
    return header;
  }

  private buildNeedsPage(container: HTMLElement, data: NeedsFormData) {
    const modulesContainer = document.createElement('div');
    modulesContainer.className = 'worldview-modules-grid'; // Re-use the grid layout from worldview

    // Define sections
    const sections = [
      {
        key: 'emotion',
        title: '核心情感调色盘',
        builder: this.buildNeedsEmotionSection.bind(this),
      },
      {
        key: 'power',
        title: '玩家角色与权力定位',
        builder: this.buildNeedsPowerSection.bind(this),
      },
      {
        key: 'narrative',
        title: '叙事偏好',
        builder: this.buildNeedsNarrativeSection.bind(this),
      },
      {
        key: 'boundaries',
        title: '边界设定',
        builder: this.buildNeedsBoundariesSection.bind(this),
      },
    ];

    // Build a card for each section
    sections.forEach(sectionInfo => {
      const sectionData = (data as any)[sectionInfo.key];
      const card = this.buildNeedsCard(sectionInfo, sectionData, data);
      modulesContainer.appendChild(card);
    });

    // Build a separate card for custom notes
    const customInputCard = this.buildNeedsCustomInputCard(data);
    modulesContainer.appendChild(customInputCard);

    container.appendChild(modulesContainer);
  }

  private buildNeedsCard(sectionInfo: any, sectionData: any, fullData: NeedsFormData): HTMLElement {
    const card = document.createElement('div');
    card.className = 'worldview-card'; // Re-use worldview card styles
    if (sectionData.status === 'disabled') {
      card.classList.add('worldview-card--disabled');
    }
    if (!sectionData.expanded) {
      card.classList.add('collapsed');
    }

    // Header
    const header = document.createElement('div');
    header.className = 'worldview-card__header';

    // Expansion Arrow Button
    const canExpand = sectionData.status === 'editing' || sectionData.status === 'locked';
    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'card-expand-btn';
    arrowBtn.style.border = 'none';
    arrowBtn.style.background = 'none';
    arrowBtn.style.cursor = canExpand ? 'pointer' : 'default';
    arrowBtn.style.fontSize = '18px';
    arrowBtn.style.marginRight = '8px';
    arrowBtn.textContent = sectionData.expanded ? '▼' : '▶';
    arrowBtn.onclick = () => {
      if (canExpand) {
        this.app.updateFormData('needs', `${sectionInfo.key}.expanded`, !sectionData.expanded);
      }
    };
    header.appendChild(arrowBtn);

    const title = document.createElement('h4');
    title.className = 'worldview-card__title';
    title.textContent = sectionInfo.title;
    header.appendChild(title);

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'card-header-controls';
    controlsDiv.style.display = 'flex';
    controlsDiv.style.alignItems = 'center';
    controlsDiv.style.gap = '16px';
    controlsDiv.style.marginLeft = 'auto';

    // Status Selector
    const statusOptions = [
      { value: 'editing', label: '编辑中', level: '1', description: '' },
      { value: 'locked', label: '锁定中', level: '1', description: '' },
      { value: 'disabled', label: '禁用中', level: '1', description: '' },
    ];
    const statusSelector = componentFactory.dropdownSelector({
      page: 'needs',
      field: `${sectionInfo.key}.status`,
      label: '',
      value: sectionData.status || 'editing',
      options: statusOptions,
    });
    statusSelector.classList.add('dropdown-primary');
    controlsDiv.appendChild(statusSelector);

    // Random Mode Selector
    const isLocked = sectionData.status === 'locked';
    const randomModeOptions = [
      { value: 'auto', label: '可随机', level: '1', description: '' },
      { value: 'force', label: '必随机', level: '1', description: '' },
      { value: 'forbid', label: '禁随机', level: '1', description: '' },
    ];
    const randomModeSelector = componentFactory.dropdownSelector({
      page: 'needs',
      field: `${sectionInfo.key}.randomMode`,
      label: '',
      value: isLocked ? 'auto' : sectionData.randomMode || 'auto',
      options: randomModeOptions,
      disabled: isLocked,
    });
    randomModeSelector.classList.add('dropdown-secondary');
    controlsDiv.appendChild(randomModeSelector);

    header.appendChild(controlsDiv);
    card.appendChild(header);

    // Body (conditionally rendered)
    if (sectionData.expanded) {
      const body = document.createElement('div');
      body.className = 'worldview-card__body';

      if (sectionData.status !== 'disabled') {
        const contentDiv = sectionInfo.builder(sectionData, fullData);
        body.appendChild(contentDiv);

        if (sectionData.status === 'locked') {
          body.style.opacity = '0.6';
          body.style.pointerEvents = 'none';
        }
      }
      card.appendChild(body);
      if (sectionData.expanded) {
        body.appendChild(componentFactory.createFooterCollapseButton());
      }
    }

    return card;
  }

  private buildNeedsCustomInputCard(data: NeedsFormData): HTMLElement {
    const card = document.createElement('div');
    card.className = 'worldview-card';
    const customNotesState = data.custom_notes || { status: 'editing', content: '', expanded: true };
    const isLocked = customNotesState.status === 'locked';
    const isExpanded = customNotesState.expanded !== false;

    if (isLocked) card.classList.add('worldview-card--locked');
    if (!isExpanded) card.classList.add('collapsed');

    // Header
    const header = document.createElement('div');
    header.className = 'worldview-card__header';

    // Expansion Arrow Button
    const canExpand = customNotesState.status === 'editing' || customNotesState.status === 'locked';
    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'card-expand-btn';
    arrowBtn.style.border = 'none';
    arrowBtn.style.background = 'none';
    arrowBtn.style.cursor = canExpand ? 'pointer' : 'default';
    arrowBtn.style.fontSize = '18px';
    arrowBtn.style.marginRight = '8px';
    arrowBtn.textContent = isExpanded ? '▼' : '▶';
    arrowBtn.onclick = () => {
      if (canExpand) {
        this.app.updateFormData('needs', `custom_notes.expanded`, !isExpanded);
      }
    };
    header.appendChild(arrowBtn);

    const title = document.createElement('h4');
    title.className = 'worldview-card__title';
    title.textContent = '补充说明/自定义需求';
    header.appendChild(title);

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'card-header-controls';
    controlsDiv.style.marginLeft = 'auto';

    const statusOptions = [
      { value: 'editing', label: '编辑中', level: '1', description: '' },
      { value: 'locked', label: '锁定中', level: '1', description: '' },
    ];
    const statusSelector = componentFactory.dropdownSelector({
      page: 'needs',
      field: 'custom_notes.status',
      label: '',
      value: customNotesState.status,
      options: statusOptions,
    });
    statusSelector.classList.add('dropdown-primary');
    controlsDiv.appendChild(statusSelector);
    header.appendChild(controlsDiv);
    card.appendChild(header);

    // Body (conditionally rendered)
    if (isExpanded) {
      const body = document.createElement('div');
      body.className = 'worldview-card__body';
      if (isLocked) {
        body.style.opacity = '0.6';
        body.style.pointerEvents = 'none';
      }
      body.appendChild(
        componentFactory.customTextInput({
          page: 'needs',
          field: 'custom_notes.content',
          label: '', // Label is in the card header now
          helpText: '可填写任何额外的玩家需求、特殊说明或补充内容。',
          value: customNotesState.content || '',
          multiline: true,
          placeholder: '如有特殊需求、补充说明等请填写在此处',
          hideLabel: true,
        }),
      );
      body.appendChild(componentFactory.createFooterCollapseButton());
      card.appendChild(body);
    }
    return card;
  }

  private buildWorldviewPage(container: HTMLElement, data: WorldFormData) {
    const modulesContainer = document.createElement('div');
    modulesContainer.className = 'worldview-modules-grid';

    WORLDVIEW_MODULES.forEach(moduleInfo => {
      // 兼容老数据，补全新字段
      const raw = data.modules[moduleInfo.id] || {};
      const moduleState = {
        status: raw.status || 'editing',
        randomMode: raw.randomMode || 'auto',
        expanded: raw.expanded !== false, // 默认true
        macro_selections: raw.macro_selections || {},
        specific_items: raw.specific_items || [],
        dpa_items: raw.dpa_items,
        dpa_total_points: raw.dpa_total_points,
      };
      const card = this.buildWorldviewCard(moduleInfo, moduleState);
      modulesContainer.appendChild(card);
    });

    // Card 12: Custom Input
    const customInputCard = this.buildCustomInputCard(data.custom_input);
    modulesContainer.appendChild(customInputCard);

    container.appendChild(modulesContainer);
  }

  private buildWorldviewCard(moduleInfo: any, moduleState: WorldviewModuleState): HTMLElement {
    const card = document.createElement('div');
    card.className = 'worldview-card';
    card.dataset.moduleId = moduleInfo.id; // Add this line
    if (!moduleState.expanded) {
      card.classList.add('collapsed');
    }

    // 状态选择器
    const statusOptions = [
      { value: 'editing', label: '编辑中', level: '1', description: '' },
      { value: 'locked', label: '锁定中', level: '1', description: '' },
      { value: 'disabled', label: '禁用中', level: '1', description: '' },
    ];
    const statusSelector = componentFactory.dropdownSelector({
      page: 'world',
      field: `modules.${moduleInfo.id}.status`,
      label: '',
      value: moduleState.status || 'editing',
      options: statusOptions,
    });
    statusSelector.classList.add('dropdown-primary');
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'card-header-controls';
    controlsDiv.style.display = 'flex';
    controlsDiv.style.alignItems = 'center';
    controlsDiv.style.gap = '16px';
    controlsDiv.style.marginLeft = 'auto';
    controlsDiv.appendChild(statusSelector);

    // 随机策略选择器
    const isLocked = moduleState.status === 'locked';
    const randomModeOptions = [
      { value: 'auto', label: '可随机', level: '1', description: '' },
      { value: 'force', label: '必随机', level: '1', description: '' },
      { value: 'forbid', label: '禁随机', level: '1', description: '' },
    ];
    const randomModeSelector = componentFactory.dropdownSelector({
      page: 'world',
      field: `modules.${moduleInfo.id}.randomMode`,
      label: '',
      value: isLocked ? 'auto' : moduleState.randomMode || 'auto',
      options: randomModeOptions,
      disabled: isLocked,
    });
    randomModeSelector.classList.add('dropdown-secondary');
    controlsDiv.appendChild(randomModeSelector);

    // 折叠/展开按钮（仅editing/locked状态下显示）
    let expanded = moduleState.expanded !== false; // 默认展开
    const canExpand = moduleState.status === 'editing' || moduleState.status === 'locked';
    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'card-expand-btn';
    arrowBtn.style.border = 'none';
    arrowBtn.style.background = 'none';
    arrowBtn.style.cursor = 'pointer';
    arrowBtn.style.fontSize = '18px';
    arrowBtn.style.marginRight = '8px';
    arrowBtn.textContent = expanded ? '▼' : '▶';
    arrowBtn.onclick = () => {
      if (canExpand) {
        moduleState.expanded = !moduleState.expanded;
        if (this.app.updateFormData) {
          this.app.updateFormData('world', `modules.${moduleInfo.id}.expanded`, moduleState.expanded);
        } else {
          location.reload();
        }
      }
    };
    arrowBtn.style.visibility = canExpand ? 'visible' : 'hidden';
    arrowBtn.style.cursor = canExpand ? 'pointer' : 'default';
    // 创建header和标题
    const header = document.createElement('div');
    header.className = 'worldview-card__header';
    header.innerHTML = `
      <h4 class="worldview-card__title">${moduleInfo.title}</h4>
    `;
    // 折叠按钮插入到标题前
    const titleRow = header.querySelector('.worldview-card__title');
    if (titleRow) {
      titleRow.parentElement?.insertBefore(arrowBtn, titleRow);
    }
    // 再插入controlsDiv
    header.appendChild(controlsDiv);
    card.appendChild(header);

    // 内容区根据expanded决定是否渲染
    if (expanded) {
      const body = document.createElement('div');
      body.className = 'worldview-card__body';
      if (moduleState.status === 'locked') {
        body.style.opacity = '0.6';
        body.style.pointerEvents = 'none';
      }
      if (moduleState.status === 'editing' || moduleState.status === 'locked') {
        if (moduleInfo.macroOptions && moduleInfo.macroOptions.length > 0) {
          const macroContainer = document.createElement('div');
          macroContainer.className = 'worldview-card__macro-options';
          moduleInfo.macroOptions.forEach((option: any) => {
            const fieldPath = `modules.${moduleInfo.id}.macro_selections.${option.id}`;
            const value = moduleState.macro_selections[option.id];
            switch (option.type) {
              case 'dynamic_points_allocator':
                macroContainer.appendChild(this.buildAestheticsDpa(moduleState, option));
                break;
              case 'dropdown': {
                let filteredOptions = option.options;
                const fieldKey = option.id;

                // 检查是否是 min/max 字段
                if (fieldKey.endsWith('_min') || fieldKey.endsWith('_max')) {
                  const isMin = fieldKey.endsWith('_min');
                  const pairKey = isMin ? fieldKey.replace('_min', '_max') : fieldKey.replace('_max', '_min');
                  const pairValue = moduleState.macro_selections[pairKey];

                  if (pairValue) {
                    const boundary = parseInt(pairValue, 10);
                    filteredOptions = option.options.filter((opt: any) => {
                      if (!opt.value || opt.value === '0') return true; // 保留空白选项
                      const optValue = parseInt(opt.value, 10);
                      return isMin ? optValue <= boundary : optValue >= boundary;
                    });
                  }
                }

                macroContainer.appendChild(
                  componentFactory.dropdownSelector({
                    page: 'world',
                    field: fieldPath,
                    label: option.label,
                    value: value,
                    options: filteredOptions.map((o: any) => ({
                      ...o,
                      value: o.value,
                      description: o.description || '',
                    })),
                  }),
                );
                break;
              }
              case 'points_allocator':
                macroContainer.appendChild(
                  componentFactory.pointsAllocator({
                    page: 'world',
                    field: fieldPath,
                    label: option.label,
                    helpText: option.helpText,
                    totalPoints: option.totalPoints,
                    categories: option.options,
                    value: value || {},
                  }),
                );
                break;
              case 'checkbox_group':
                macroContainer.appendChild(
                  componentFactory.checkboxGroup({
                    page: 'world',
                    field: fieldPath,
                    label: option.label,
                    options: option.options,
                    value: value || {},
                  }),
                );
                break;
              default:
                const unhandled = document.createElement('div');
                unhandled.textContent = `Unhandled macro type: ${option.type}`;
                macroContainer.appendChild(unhandled);
                break;
            }
          });
          body.appendChild(macroContainer);
        }
        // Specific Items
        const specificItemsContainer = document.createElement('div');
        specificItemsContainer.className = 'worldview-card__specific-items';
        if (moduleState.specific_items && moduleState.specific_items.length > 0) {
          moduleState.specific_items.forEach((item, index) => {
            specificItemsContainer.appendChild(this.buildSpecificItemCard(moduleInfo.id, index, item));
          });
          body.appendChild(specificItemsContainer);
        }
        // Add Buttons
        if (moduleInfo.specificItemTypes && moduleInfo.specificItemTypes.length > 0) {
          const addButtonsContainer = document.createElement('div');
          addButtonsContainer.className = 'worldview-card__add-buttons';
          moduleInfo.specificItemTypes.forEach((itemType: any) => {
            const fieldPath = `modules.${moduleInfo.id}.specific_items`;
            addButtonsContainer.appendChild(
              componentFactory.button({
                label: itemType.label,
                style: 'primary',
                onClick: () => this.app.addListItem('world', fieldPath, { itemType: itemType.id }),
              }),
            );
          });
          body.appendChild(addButtonsContainer);
        }
      }
      if (expanded) {
        body.appendChild(componentFactory.createFooterCollapseButton());
      }
      card.appendChild(body);
    }

    return card;
  }

  private buildAestheticsDpa(moduleState: WorldviewModuleState, option: any): HTMLElement {
    const container = document.createElement('div');
    container.className = 'dynamic-points-allocator';

    const totalPoints = moduleState.dpa_total_points || 0;
    const remainingPoints = option.totalPoints - totalPoints;

    // Header
    const header = document.createElement('div');
    header.className = 'dpa-header';
    header.innerHTML = `
      <label class="component-label">${option.label} (共${option.totalPoints}点)</label>
      <div class="points-remaining">剩余点数: <span>${remainingPoints}</span></div>
    `;
    container.appendChild(header);

    if (option.helpText) {
      const help = document.createElement('p');
      help.className = 'component-help';
      help.textContent = option.helpText;
      container.appendChild(help);
    }

    // Controls for adding items
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'dpa-controls';

    const sources = [
      { id: 'culture', label: '基石文化', options: CULTURAL_ARCHETYPE_HIERARCHY },
      { id: 'filter', label: '美学滤镜', options: AESTHETIC_FILTER_HIERARCHY },
    ];

    sources.forEach(source => {
      const group = document.createElement('div');
      group.className = 'dpa-group';

      const parentSelect = document.createElement('select');
      parentSelect.innerHTML = `<option value="">-- 选择${source.label} --</option>`;
      source.options.forEach(opt => {
        parentSelect.innerHTML += `<option value="${opt.id}">${opt.label}</option>`;
      });

      const childSelect = document.createElement('select');
      childSelect.disabled = true;

      const addButton = componentFactory.button({
        label: `添加`,
        style: 'secondary',
        onClick: () => {
          /* This will be handled by the global listener */
        },
      }) as HTMLButtonElement;
      addButton.dataset.action = 'add-aesthetics-item';
      addButton.dataset.source = source.id;
      addButton.disabled = true; // Initially disabled

      parentSelect.addEventListener('change', () => {
        childSelect.innerHTML = `<option value="">-- (可选)选择子项 --</option>`;
        const selectedParentId = parentSelect.value;
        const parentData = source.options.find(p => p.id === selectedParentId);

        addButton.disabled = !selectedParentId; // Enable button if a parent is selected

        if (parentData && parentData.children) {
          parentData.children.forEach(child => {
            const isSelected = moduleState.dpa_items?.some(item => item.id === child.id);
            if (!isSelected) {
              childSelect.innerHTML += `<option value="${child.id}" data-description="${child.description}">${child.label}</option>`;
            }
          });
          childSelect.disabled = false;
        } else {
          childSelect.disabled = true;
        }
      });

      group.appendChild(parentSelect);
      group.appendChild(childSelect);
      group.appendChild(addButton);
      controlsContainer.appendChild(group);
    });

    container.appendChild(controlsContainer);

    // Item List
    const itemList = document.createElement('div');
    itemList.className = 'dpa-item-list';
    moduleState.dpa_items?.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'dpa-item';

      const label = document.createElement('div');
      label.className = 'dpa-item__label';
      label.innerHTML = `<strong>${item.label}</strong><p>${item.description}</p>`;

      const pointControls = document.createElement('div');
      pointControls.className = 'dpa-item__controls';
      pointControls.innerHTML = `
        <button class="point-btn minus" data-item-id="${item.id}" data-amount="-1" ${
        item.points <= 0 ? 'disabled' : ''
      }>-</button>
        <span class="point-value">${item.points}</span>
        <button class="point-btn plus" data-item-id="${item.id}" data-amount="1" ${
        remainingPoints <= 0 ? 'disabled' : ''
      }>+</button>
        <button class="btn btn--secondary btn--small" data-action="remove-aesthetics-item" data-item-id="${
          item.id
        }">删除</button>
      `;

      // Add event listeners directly to the buttons
      pointControls
        .querySelector('.minus')
        ?.addEventListener('click', () => this.app.updateAestheticsItemPoints(item.id, -1));
      pointControls
        .querySelector('.plus')
        ?.addEventListener('click', () => this.app.updateAestheticsItemPoints(item.id, 1));
      pointControls
        .querySelector('[data-action="remove-aesthetics-item"]')
        ?.addEventListener('click', () => this.app.removeAestheticsItem(item.id));

      itemCard.appendChild(label);
      itemCard.appendChild(pointControls);
      itemList.appendChild(itemCard);
    });

    container.appendChild(itemList);

    return container;
  }

  private buildSpecificItemCard(moduleId: string, index: number, item: WorldviewSpecificItem): HTMLElement {
    const card = document.createElement('div');
    card.className = 'specific-item-card'; // Generic class
    if (item.isCollapsed) {
      card.classList.add('is-collapsed');
    }

    // --- Header ---
    const header = document.createElement('div');
    header.className = 'specific-item-card__header';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'card-control-btn collapse-btn';
    collapseBtn.innerHTML = `<span class="icon">${item.isCollapsed ? '▶' : '▼'}</span>`;
    collapseBtn.title = item.isCollapsed ? '展开' : '折叠';
    // This action will be handled by the global listener in index.ts
    header.appendChild(collapseBtn);

    const title = document.createElement('h5');
    title.className = 'specific-item-card__title';
    // Use item name for title, fallback to index
    title.textContent = item.name || `条目 #${index + 1}`;
    header.appendChild(title);

    const controls = document.createElement('div');
    controls.className = 'specific-item-card__controls';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'card-control-btn delete-btn';
    deleteBtn.innerHTML = `&times;`;
    deleteBtn.title = '删除';
    controls.appendChild(deleteBtn);

    header.appendChild(controls);
    card.appendChild(header);

    // --- Body (collapsible) ---
    const body = document.createElement('div');
    body.className = 'specific-item-card__body';
    card.appendChild(body);

    // --- Form elements go inside the body ---

    // 类型下拉菜单
    const categorySelect = document.createElement('select');
    categorySelect.className = 'item-category-select';
    // Add data attributes for the generic listener
    categorySelect.dataset.page = 'world';
    categorySelect.dataset.field = `modules.${moduleId}.specific_items.${index}.category`;
    categorySelect.dataset.action = 'update-select-value'; // Generic action

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '---';
    categorySelect.appendChild(defaultOption);
    const typeOptions = PRESET_TYPE_OPTIONS[item.type || moduleId] || [{ value: '', label: '其他/自定义/空白' }];
    typeOptions.forEach(opt => {
      if (opt.value === '' && opt.label !== '其他/自定义/空白') return;
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (item.category === opt.value && opt.value !== '') option.selected = true;
      categorySelect.appendChild(option);
    });
    if (!item.category) categorySelect.value = '';

    // 名称输入框
    const nameInput = componentFactory.customTextInput({
      page: 'world',
      field: `modules.${moduleId}.specific_items.${index}.name`,
      value: item.name,
      placeholder: '条目名称（例如：永恒之城，陨落之星战役...）',
      hideLabel: true,
    });

    // 类型+名称同一行
    const nameRow = document.createElement('div');
    nameRow.style.display = 'flex';
    nameRow.style.gap = '8px';
    categorySelect.style.flex = '0 0 160px';
    nameInput.style.flex = '1 1 auto';
    nameRow.appendChild(categorySelect);
    nameRow.appendChild(nameInput);

    // 描述输入框
    const descInput = componentFactory.customTextInput({
      page: 'world',
      field: `modules.${moduleId}.specific_items.${index}.description`,
      value: item.description,
      multiline: true,
      placeholder: '条目描述（对此条目的简要描述）',
      hideLabel: true,
    });

    body.appendChild(nameRow);
    body.appendChild(descInput);
    body.appendChild(componentFactory.createFooterCollapseButton());

    return card;
  }

  private buildCustomInputCard(customInputState: any): HTMLElement {
    const card = document.createElement('div');
    card.className = 'worldview-card';
    // 兼容旧数据
    const state = customInputState || { status: 'editing', content: '', expanded: true };
    let status = state.status;
    // Fallback for older data model using 'enabled' boolean
    if (!status) {
      status = state.enabled !== false ? 'editing' : 'disabled';
    }
    const isExpanded = state.expanded !== false;

    if (status === 'locked') card.classList.add('worldview-card--locked');
    if (status === 'disabled') card.classList.add('worldview-card--disabled');
    if (!isExpanded) card.classList.add('collapsed');

    const header = document.createElement('div');
    header.className = 'worldview-card__header';

    // Expansion Arrow Button
    const canExpand = status === 'editing' || status === 'locked';
    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'card-expand-btn';
    arrowBtn.style.border = 'none';
    arrowBtn.style.background = 'none';
    arrowBtn.style.cursor = canExpand ? 'pointer' : 'default';
    arrowBtn.style.fontSize = '18px';
    arrowBtn.style.marginRight = '8px';
    arrowBtn.textContent = isExpanded ? '▼' : '▶';
    arrowBtn.onclick = () => {
      if (canExpand) {
        this.app.updateFormData('world', `custom_input.expanded`, !isExpanded);
      }
    };
    header.appendChild(arrowBtn);

    const title = document.createElement('h4');
    title.className = 'worldview-card__title';
    title.textContent = '12. 自定义输入';
    header.appendChild(title);

    // 右上角状态下拉菜单
    const statusOptions = [
      { value: 'editing', label: '编辑中', level: '1', description: '' },
      { value: 'locked', label: '锁定中', level: '1', description: '' },
    ];
    const statusSelector = componentFactory.dropdownSelector({
      page: 'world',
      field: 'custom_input.status',
      label: '',
      value: status || 'editing',
      options: statusOptions,
    });
    statusSelector.classList.add('dropdown-primary');
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'card-header-controls';
    controlsDiv.style.display = 'flex';
    controlsDiv.style.alignItems = 'center';
    controlsDiv.style.gap = '16px';
    controlsDiv.style.marginLeft = 'auto';
    controlsDiv.appendChild(statusSelector);
    header.appendChild(controlsDiv);
    card.appendChild(header);

    // Body (conditionally rendered)
    if (isExpanded) {
      const isLocked = status === 'locked';
      const body = document.createElement('div');
      body.className = 'worldview-card__body';
      if (isLocked) {
        body.style.opacity = '0.6';
        body.style.pointerEvents = 'none';
      }
      body.appendChild(
        componentFactory.customTextInput({
          page: 'world',
          field: 'custom_input.content',
          label: '自定义世界观说明',
          helpText: '在此处输入任何无法被上述模块覆盖的设定。',
          value: state.content,
          multiline: true,
          placeholder: '例如：这个世界的天空是绿色的，并且有两个月亮。',
        }),
      );
      body.appendChild(componentFactory.createFooterCollapseButton());
      card.appendChild(body);
    }

    return card;
  }

  private buildCharacterPage(container: HTMLElement, data: CharacterFormData) {
    console.log('Building Character Page with data:', JSON.stringify(data, null, 2));
    const modulesContainer = document.createElement('div');
    modulesContainer.className = 'worldview-modules-grid character-page-form'; // Re-use grid layout and add specific class

    // Card 1: 主控角色 (PC)
    modulesContainer.appendChild(this.buildPcCard(data.pc));

    // Card 2: 重要角色管理器
    modulesContainer.appendChild(this.buildKeyCharactersManagerCard(data.key_characters));

    // Card 3: 世界人口管理器
    modulesContainer.appendChild(this.buildWorldPopulationManagerCard(data.world_population));

    container.appendChild(modulesContainer);
  }

  private buildPcCard(pcData: CharacterFormData['pc']): HTMLElement {
    return this.buildModuleCard({
      page: 'character',
      moduleKey: 'pc',
      title: '主控角色 (Player Character)',
      moduleData: pcData,
      contentBuilder: (body: HTMLElement) => {
        // --- Top Row: Template Level & Social Class ---
        const topRow = this.createGridWrapper([
          componentFactory.dropdownSelector({
            page: 'character',
            field: 'pc.template_level',
            label: '模板等级',
            helpText: '定义AI生成该角色时所使用的模板复杂度和细节丰富度。',
            value: pcData.template_level,
            options: CHARACTER_OPTIONS.pc.template_level,
            customClass: 'fixed-height-dropdown',
          }),
          componentFactory.dropdownSelector({
            page: 'character',
            field: `pc.social_class`,
            label: '社会阶层',
            helpText: '定义该角色在社会结构中的基本位置。',
            value: pcData.social_class,
            options: CHARACTER_OPTIONS.key.social_class_options.map(o => ({ ...o, level: '' })),
            customClass: 'fixed-height-dropdown',
          }),
        ]);
        body.appendChild(topRow);

        body.appendChild(
          componentFactory.booleanToggle({
            page: 'character',
            field: 'pc.enable_nsfw_attributes',
            label: '生成NSFW属性',
            helpText: '决定是否为该角色生成与NSFW相关的外貌或背景属性。',
            value: pcData.enable_nsfw_attributes,
          }),
        );

        // --- Psychological Profile ---
        const profileData = pcData.psychological_profile || {};
        const psychologicalTraits = [
          {
            id: 'openness',
            label: '开放性',
            description: '评估想象力、好奇心、对新思想和经验的接纳程度。',
            options: CHARACTER_OPTIONS.key.psychological_profile.openness,
          },
          {
            id: 'conscientiousness',
            label: '尽责性',
            description: '评估自律、条理性、责任感和目标导向行为。',
            options: CHARACTER_OPTIONS.key.psychological_profile.conscientiousness,
          },
          {
            id: 'extraversion',
            label: '外倾性',
            description: '评估精力、社交性、自信以及寻求刺激的倾向。',
            options: CHARACTER_OPTIONS.key.psychological_profile.extraversion,
          },
          {
            id: 'agreeableness',
            label: '宜人性',
            description: '评估信任、利他、合作和同理心。',
            options: CHARACTER_OPTIONS.key.psychological_profile.agreeableness,
          },
          {
            id: 'neuroticism',
            label: '神经质',
            description: '评估情绪稳定性与体验负面情绪的倾向。',
            options: CHARACTER_OPTIONS.key.psychological_profile.neuroticism,
          },
        ];

        body.appendChild(
          componentFactory.formSection({
            title: '心理画像 (大五人格)',
            isSubSection: true,
            children: [
              this.createGridWrapper(
                psychologicalTraits.map(trait =>
                  componentFactory.dropdownSelector({
                    page: 'character',
                    field: `pc.psychological_profile.${trait.id}`,
                    label: trait.label,
                    helpText: trait.description,
                    value: profileData[trait.id as keyof typeof profileData],
                    options: trait.options.map(o => ({ ...o, value: o.value ?? o.label })),
                    customClass: 'fixed-height-dropdown',
                  }),
                ),
              ),
            ],
          }),
        );

        // --- Core Values ---
        const valuesData = pcData.core_values || {};
        const coreValueDimensions = [
          { id: 'care', label: '关爱/伤害', options: CHARACTER_OPTIONS.key.core_values.care },
          { id: 'fairness', label: '公平/欺骗', options: CHARACTER_OPTIONS.key.core_values.fairness },
          { id: 'loyalty', label: '忠诚/背叛', options: CHARACTER_OPTIONS.key.core_values.loyalty },
          { id: 'authority', label: '权威/颠覆', options: CHARACTER_OPTIONS.key.core_values.authority },
          { id: 'sanctity', label: '圣洁/堕落', options: CHARACTER_OPTIONS.key.core_values.sanctity },
          { id: 'liberty', label: '自由/压迫', options: CHARACTER_OPTIONS.key.core_values.liberty },
        ];

        body.appendChild(
          componentFactory.formSection({
            title: '核心价值观 (道德基础)',
            isSubSection: true,
            children: [
              this.createGridWrapper(
                coreValueDimensions.map(dim =>
                  componentFactory.dropdownSelector({
                    page: 'character',
                    field: `pc.core_values.${dim.id}`,
                    label: dim.label,
                    value: valuesData[dim.id as keyof typeof valuesData],
                    options: dim.options.map(o => ({ ...o, level: '' })),
                    customClass: 'fixed-height-dropdown',
                  }),
                ),
              ),
            ],
          }),
        );
        body.appendChild(
          componentFactory.customTextInput({
            page: 'character',
            field: 'pc.custom_concept',
            label: '自定义核心概念',
            helpText: '用一两句话描述你的角色核心设定，这将作为AI生成角色的最重要依据。',
            value: pcData.custom_concept,
            multiline: true,
            placeholder: '一个被流放的贵族，如今靠在地下角斗场取胜为生，并寻找着复仇的机会。',
          }),
        );
      },
    });
  }

  private buildKeyCharactersManagerCard(keyCharsData: CharacterFormData['key_characters']): HTMLElement {
    return this.buildModuleCard({
      page: 'character',
      moduleKey: 'key_characters',
      title: '重要角色 (Key Characters)',
      moduleData: keyCharsData,
      contentBuilder: (body: HTMLElement) => {
        // The main card is now just a container for sub-cards and an "add" button.
        // All macro controls have been moved to individual sub-cards.

        // --- Specific Items (Sub-cards) ---
        const specificItemsContainer = document.createElement('div');
        specificItemsContainer.className = 'worldview-card__specific-items';
        if (keyCharsData.list && keyCharsData.list.length > 0) {
          keyCharsData.list.forEach((item, index) => {
            specificItemsContainer.appendChild(this.buildKeyCharacterCard(index, item));
          });
        }
        body.appendChild(specificItemsContainer);

        // --- Add Button ---
        const addButtonsContainer = document.createElement('div');
        addButtonsContainer.className = 'worldview-card__add-buttons';
        addButtonsContainer.appendChild(
          componentFactory.button({
            label: '添加重要角色',
            style: 'primary',
            onClick: () => this.app.addListItem('character', 'key_characters.list'),
          }),
        );
        body.appendChild(addButtonsContainer);
      },
    });
  }

  private buildKeyCharacterCard(index: number, itemData: any): HTMLElement {
    const card = document.createElement('div');
    card.className = 'specific-item-card key-character-card'; // Add a specific class
    if (itemData.isLocked) {
      card.classList.add('is-locked');
    }
    if (itemData.isCollapsed) {
      card.classList.add('is-collapsed');
    }

    // --- Header ---
    const header = document.createElement('div');
    header.className = 'specific-item-card__header';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'card-control-btn collapse-btn';
    collapseBtn.innerHTML = `<span class="icon">${itemData.isCollapsed ? '▶' : '▼'}</span>`;
    collapseBtn.title = itemData.isCollapsed ? '展开' : '折叠';
    // onclick is now handled by the global event listener
    header.appendChild(collapseBtn);

    const title = document.createElement('h5');
    title.className = 'specific-item-card__title';
    title.textContent = `重要角色 #${index + 1}`;
    header.appendChild(title);

    const controls = document.createElement('div');
    controls.className = 'specific-item-card__controls';

    const lockBtn = document.createElement('button');
    lockBtn.className = 'card-control-btn lock-btn';
    lockBtn.innerHTML = `<span class="icon"></span>`; // Icon will be styled with CSS
    lockBtn.title = itemData.isLocked ? '解锁' : '锁定';
    // onclick is now handled by the global event listener
    controls.appendChild(lockBtn);

    const randomBtn = document.createElement('button');
    randomBtn.className = 'card-control-btn random-btn';
    randomBtn.innerHTML = `<span class="icon"></span>`; // Icon will be styled with CSS
    randomBtn.title = '随机此角色';
    // onclick is now handled by the global event listener
    controls.appendChild(randomBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'card-control-btn delete-btn';
    deleteBtn.innerHTML = `&times;`;
    deleteBtn.title = '删除角色';
    // onclick is now handled by the global event listener
    controls.appendChild(deleteBtn);

    header.appendChild(controls);
    card.appendChild(header);

    // --- Body (collapsible) ---
    const body = document.createElement('div');
    body.className = 'specific-item-card__body';
    card.appendChild(body);

    // --- Basic Settings (in a row) ---
    const topRow = document.createElement('div');
    topRow.className = 'specific-item-top-row';

    // 1. Template Level
    topRow.appendChild(
      componentFactory.dropdownSelector({
        page: 'character',
        field: `key_characters.list.${index}.template_level`,
        label: '模板等级',
        value: itemData.template_level,
        options: CHARACTER_OPTIONS.key.template_level,
      }),
    );

    // 2. Enable NSFW
    topRow.appendChild(
      componentFactory.booleanToggle({
        page: 'character',
        field: `key_characters.list.${index}.enable_nsfw_attributes`,
        label: '生成NSFW属性',
        value: itemData.enable_nsfw_attributes,
      }),
    );
    body.appendChild(topRow);

    // --- Narrative Function ---
    body.appendChild(
      componentFactory.formSection({
        title: '叙事功能',
        isSubSection: true,
        children: [
          this.createGridWrapper([
            componentFactory.dropdownSelector({
              page: 'character',
              field: `key_characters.list.${index}.relational_proximity`,
              label: '关系定位',
              helpText: '定义该角色与PC或故事核心的亲近程度。',
              value: itemData.relational_proximity,
              options: CHARACTER_OPTIONS.key.relational_proximity_options.map(o => ({ ...o, level: '' })),
            }),
            componentFactory.dropdownSelector({
              page: 'character',
              field: `key_characters.list.${index}.social_class`,
              label: '社会阶层',
              helpText: '定义该角色在社会结构中的基本位置。',
              value: itemData.social_class,
              options: CHARACTER_OPTIONS.key.social_class_options.map(o => ({ ...o, level: '' })),
            }),
            componentFactory.dropdownSelector({
              page: 'character',
              field: `key_characters.list.${index}.thematic_role_1`,
              label: '主题作用 1',
              helpText: '该角色的主要剧情功能。',
              value: itemData.thematic_role_1,
              options: CHARACTER_OPTIONS.key.thematic_role_options.map(o => ({ ...o, level: '' })),
            }),
            componentFactory.dropdownSelector({
              page: 'character',
              field: `key_characters.list.${index}.thematic_role_2`,
              label: '主题作用 2 (可选)',
              helpText: '该角色的次要剧情功能。',
              value: itemData.thematic_role_2,
              options: CHARACTER_OPTIONS.key.thematic_role_options.map(o => ({ ...o, level: '' })),
            }),
          ]),
        ],
      }),
    );

    // --- Psychological Profile ---
    const profileData = itemData.psychological_profile || {};
    const psychologicalTraits = [
      {
        id: 'openness',
        label: '开放性',
        description: '评估想象力、好奇心、对新思想和经验的接纳程度。',
        options: CHARACTER_OPTIONS.key.psychological_profile.openness,
      },
      {
        id: 'conscientiousness',
        label: '尽责性',
        description: '评估自律、条理性、责任感和目标导向行为。',
        options: CHARACTER_OPTIONS.key.psychological_profile.conscientiousness,
      },
      {
        id: 'extraversion',
        label: '外倾性',
        description: '评估精力、社交性、自信以及寻求刺激的倾向。',
        options: CHARACTER_OPTIONS.key.psychological_profile.extraversion,
      },
      {
        id: 'agreeableness',
        label: '宜人性',
        description: '评估信任、利他、合作和同理心。',
        options: CHARACTER_OPTIONS.key.psychological_profile.agreeableness,
      },
      {
        id: 'neuroticism',
        label: '神经质',
        description: '评估情绪稳定性与体验负面情绪的倾向。',
        options: CHARACTER_OPTIONS.key.psychological_profile.neuroticism,
      },
    ];

    body.appendChild(
      componentFactory.formSection({
        title: '心理画像 (大五人格)',
        isSubSection: true,
        children: [
          this.createGridWrapper(
            psychologicalTraits.map(trait =>
              componentFactory.dropdownSelector({
                page: 'character',
                field: `key_characters.list.${index}.psychological_profile.${trait.id}`,
                label: trait.label,
                helpText: trait.description,
                value: profileData[trait.id as keyof typeof profileData],
                options: trait.options.map(o => ({ ...o, value: o.value ?? o.label })),
              }),
            ),
          ),
        ],
      }),
    );

    // --- Core Values ---
    const valuesData = itemData.core_values || {};
    const coreValueDimensions = [
      { id: 'care', label: '关爱/伤害', options: CHARACTER_OPTIONS.key.core_values.care },
      { id: 'fairness', label: '公平/欺骗', options: CHARACTER_OPTIONS.key.core_values.fairness },
      { id: 'loyalty', label: '忠诚/背叛', options: CHARACTER_OPTIONS.key.core_values.loyalty },
      { id: 'authority', label: '权威/颠覆', options: CHARACTER_OPTIONS.key.core_values.authority },
      { id: 'sanctity', label: '圣洁/堕落', options: CHARACTER_OPTIONS.key.core_values.sanctity },
      { id: 'liberty', label: '自由/压迫', options: CHARACTER_OPTIONS.key.core_values.liberty },
    ];

    body.appendChild(
      componentFactory.formSection({
        title: '核心价值观 (道德基础)',
        isSubSection: true,
        children: [
          this.createGridWrapper(
            coreValueDimensions.map(dim =>
              componentFactory.dropdownSelector({
                page: 'character',
                field: `key_characters.list.${index}.core_values.${dim.id}`,
                label: dim.label,
                value: valuesData[dim.id as keyof typeof valuesData],
                options: dim.options.map(o => ({ ...o, level: '' })),
              }),
            ),
          ),
        ],
      }),
    );

    // --- Custom Concept ---
    body.appendChild(
      componentFactory.customTextInput({
        page: 'character',
        field: `key_characters.list.${index}.custom_concept`,
        label: '自定义文本',
        helpText: '补充任何上述选项无法涵盖的角色核心设定、背景、或与PC的关系...',
        value: itemData.custom_concept,
        placeholder: '例如：一位表面冷酷但内心渴望认可的皇家护卫队长...',
        multiline: true,
      }),
    );
    body.appendChild(componentFactory.createFooterCollapseButton());

    return card;
  }

  private buildWorldPopulationManagerCard(popData: CharacterFormData['world_population']): HTMLElement {
    return this.buildModuleCard({
      page: 'character',
      moduleKey: 'world_population',
      title: '世界人口 (World Population)',
      moduleData: popData,
      contentBuilder: (body: HTMLElement) => {
        // --- Supporting Characters Section ---
        body.appendChild(
          componentFactory.formSection({
            title: '功能角色设定',
            helpText: '为故事提供特定"服务"的配角，如任务发布人、商人等。',
            children: [
              componentFactory.dropdownSelector({
                page: 'character',
                field: 'world_population.supporting.template_level',
                label: '模板等级',
                value: popData.supporting.template_level,
                options: CHARACTER_OPTIONS.supporting.template_level,
              }),
              componentFactory.booleanToggle({
                page: 'character',
                field: 'world_population.supporting.enable_nsfw_attributes',
                label: '生成NSFW属性',
                value: popData.supporting.enable_nsfw_attributes,
              }),
              componentFactory.pointsAllocator({
                page: 'character',
                field: 'world_population.supporting.role_focus_counts',
                label: '主要职能分配 (填写数量)',
                totalPoints: 99,
                categories: CHARACTER_OPTIONS.supporting.role_focus_counts,
                value: popData.supporting.role_focus_counts,
              }),
              componentFactory.customTextInput({
                page: 'character',
                field: 'world_population.supporting.custom_notes',
                label: '自定义说明',
                value: popData.supporting.custom_notes,
                multiline: true,
              }),
            ],
          }),
        );

        // --- Ambient Groups Section ---
        body.appendChild(
          componentFactory.formSection({
            title: '背景角色组设定',
            helpText: '构成世界"背景板"的匿名群体，如守卫、平民等。',
            children: [
              componentFactory.dropdownSelector({
                page: 'character',
                field: 'world_population.ambient.template_level',
                label: '模板等级',
                value: popData.ambient.template_level,
                options: CHARACTER_OPTIONS.ambient.template_level,
              }),
              componentFactory.booleanToggle({
                page: 'character',
                field: 'world_population.ambient.enable_nsfw_attributes',
                label: '生成NSFW属性',
                value: popData.ambient.enable_nsfw_attributes,
              }),
              componentFactory.pointsAllocator({
                page: 'character',
                field: 'world_population.ambient.group_counts',
                label: '功能群体分配 (填写"组"数)',
                totalPoints: 99,
                categories: CHARACTER_OPTIONS.ambient.group_counts,
                value: popData.ambient.group_counts,
              }),
              componentFactory.customTextInput({
                page: 'character',
                field: 'world_population.ambient.custom_notes',
                label: '自定义说明',
                value: popData.ambient.custom_notes,
                multiline: true,
              }),
            ],
          }),
        );
      },
    });
  }

  private buildModuleCard(props: {
    page: PageType;
    moduleKey: string;
    title: string;
    moduleData: any;
    contentBuilder: (body: HTMLElement) => void;
  }): HTMLElement {
    const { page, moduleKey, title, moduleData, contentBuilder } = props;
    const card = document.createElement('div');
    card.className = 'worldview-card'; // Re-use worldview card styles

    if (!moduleData.expanded) {
      card.classList.add('collapsed');
    }
    if (moduleData.status === 'disabled') {
      card.classList.add('worldview-card--disabled');
    }

    const header = this.buildModuleHeader({
      page: page,
      moduleKey: moduleKey,
      title: title,
      status: moduleData.status,
      randomMode: moduleData.randomMode,
      expanded: moduleData.expanded,
    });
    card.appendChild(header);

    if (moduleData.expanded) {
      const body = document.createElement('div');
      body.className = 'worldview-card__body';
      if (moduleData.status === 'locked') {
        body.style.opacity = '0.6';
        body.style.pointerEvents = 'none';
      }
      if (moduleData.status !== 'disabled') {
        contentBuilder(body);
      }
      body.appendChild(componentFactory.createFooterCollapseButton());
      card.appendChild(body);
    }

    return card;
  }

  private buildModuleHeader(props: {
    page: PageType;
    moduleKey: string;
    title: string;
    status: 'editing' | 'locked' | 'disabled';
    randomMode: 'auto' | 'force' | 'forbid';
    expanded: boolean;
  }): HTMLElement {
    const { page, moduleKey, title, status, randomMode, expanded } = props;
    console.log(`Building header for ${page}.${moduleKey}`, { status, expanded }); // DEBUG
    const header = document.createElement('div');
    header.className = 'worldview-card__header';

    const canExpand = status === 'editing' || status === 'locked';
    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'card-expand-btn';
    arrowBtn.style.border = 'none';
    arrowBtn.style.background = 'none';
    arrowBtn.style.cursor = canExpand ? 'pointer' : 'default';
    arrowBtn.style.fontSize = '18px';
    arrowBtn.style.marginRight = '8px';
    arrowBtn.textContent = expanded ? '▼' : '▶';
    arrowBtn.onclick = () => {
      console.log(`Arrow clicked for ${page}.${moduleKey}`); // DEBUG
      if (canExpand) {
        this.app.updateFormData(page, `${moduleKey}.expanded`, !expanded);
      }
    };
    header.appendChild(arrowBtn);

    const titleEl = document.createElement('h4');
    titleEl.className = 'worldview-card__title';
    titleEl.textContent = title;
    header.appendChild(titleEl);

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'card-header-controls';
    controlsDiv.style.display = 'flex';
    controlsDiv.style.alignItems = 'center';
    controlsDiv.style.gap = '16px';
    controlsDiv.style.marginLeft = 'auto';

    // For 'style.adjustments', we show no controls at all.
    const isStyleAdjustments = page === 'style' && moduleKey === 'adjustments';
    // For plot narrative/sandbox modules, also hide controls.
    const isPlotNarrativeModule = page === 'plot' && (moduleKey === 'narrative_driven' || moduleKey === 'sandbox');

    if (!isStyleAdjustments && !isPlotNarrativeModule) {
      // Conditionally set status options based on the page.
      let statusOptions;
      if (page === 'style' || page === 'plot') {
        statusOptions = [
          { value: 'editing', label: '编辑中', level: '1', description: '' },
          { value: 'locked', label: '锁定中', level: '1', description: '' },
        ];
      } else {
        statusOptions = [
          { value: 'editing', label: '编辑中', level: '1', description: '' },
          { value: 'locked', label: '锁定中', level: '1', description: '' },
          { value: 'disabled', label: '禁用中', level: '1', description: '' },
        ];
      }
      const statusSelector = componentFactory.dropdownSelector({
        page: page,
        field: `${moduleKey}.status`,
        label: '',
        value: status || 'editing',
        options: statusOptions,
      });
      statusSelector.classList.add('dropdown-primary');
      controlsDiv.appendChild(statusSelector);

      const isLocked = status === 'locked';
      // Hide randomMode selector for 'style.mode' and other specific cases
      const hideRandomMode =
        moduleKey === 'custom_notes' ||
        page === 'rules' ||
        (page === 'style' && moduleKey === 'mode') ||
        (page === 'plot' && moduleKey === 'structure');

      if (!hideRandomMode) {
        const randomModeOptions = [
          { value: 'auto', label: '可随机', level: '1', description: '' },
          { value: 'force', label: '必随机', level: '1', description: '' },
          { value: 'forbid', label: '禁随机', level: '1', description: '' },
        ];
        const randomModeSelector = componentFactory.dropdownSelector({
          page: page,
          field: `${moduleKey}.randomMode`,
          label: '',
          value: isLocked ? 'auto' : randomMode || 'auto',
          options: randomModeOptions,
          disabled: isLocked,
        });
        randomModeSelector.classList.add('dropdown-secondary');
        controlsDiv.appendChild(randomModeSelector);
      }
    }

    // Only add the controls container if it has children.
    if (controlsDiv.hasChildNodes()) {
      header.appendChild(controlsDiv);
    } else {
      // Add a class to headers without controls to fix alignment.
      header.classList.add('worldview-card__header--no-controls');
    }
    return header;
  }

  private buildPlotPage(container: HTMLElement, data: PlotFormData) {
    const modulesContainer = document.createElement('div');
    modulesContainer.className = 'worldview-modules-grid'; // Re-use grid layout

    // Card 1: 叙事基础设定
    modulesContainer.appendChild(
      this.buildModuleCard({
        page: 'plot',
        moduleKey: 'structure',
        title: '叙事基础设定',
        moduleData: data.structure,
        contentBuilder: body => {
          body.appendChild(
            componentFactory.dropdownSelector({
              page: 'plot',
              field: 'structure.mode',
              label: '叙事模式',
              helpText: '选择故事的基本结构，是线性的还是开放的沙盒。',
              value: data.structure.mode,
              options: PLOT_OPTIONS.structure.mode,
            }),
          );
          body.appendChild(
            componentFactory.pointsAllocator({
              page: 'plot',
              field: 'structure.driver_points',
              label: '主要剧情驱动力 (共10点)',
              helpText: '分配点数来决定故事的核心矛盾和发展动力来源。',
              totalPoints: 10,
              categories: PLOT_OPTIONS.narrative_driven.driver,
              value: data.structure.driver_points,
            }),
          );
        },
      }),
    );

    // Card 2 & 3: Conditional rendering of the correct list manager
    if (data.structure.mode === '线性/分支叙事') {
      modulesContainer.appendChild(this.buildLinearArcsManagerCard(data.narrative_driven));
    } else if (data.structure.mode === '沙盒叙事') {
      modulesContainer.appendChild(this.buildSandboxManagerCard(data.sandbox));
    }

    // Card 4: 自定义条目
    modulesContainer.appendChild(
      this.buildModuleCard({
        page: 'plot',
        moduleKey: 'custom_notes',
        title: '自定义条目',
        moduleData: data.custom_notes,
        contentBuilder: body => {
          body.appendChild(
            componentFactory.customTextInput({
              page: 'plot',
              field: 'custom_notes.content',
              label: '共通剧情说明',
              helpText: '对剧情设计的任何额外要求，此项对所有叙事模式均有效。',
              value: data.custom_notes.content,
              multiline: true,
              placeholder: '例如：希望加入一个关于失落古代文明的次要线索。',
            }),
          );
        },
      }),
    );

    container.appendChild(modulesContainer);
  }

  private buildLinearArcsManagerCard(narrativeData: PlotFormData['narrative_driven']): HTMLElement {
    return this.buildModuleCard({
      page: 'plot',
      moduleKey: 'narrative_driven',
      title: '线性/分支叙事设计',
      moduleData: narrativeData,
      contentBuilder: body => {
        // Global controls for this mode
        body.appendChild(
          componentFactory.dropdownSelector({
            page: 'plot',
            field: 'narrative_driven.focus',
            label: '核心情节焦点',
            helpText: '故事主要围绕哪个层面的冲突展开。',
            value: narrativeData.focus,
            options: PLOT_OPTIONS.narrative_driven.focus,
          }),
        );

        // Sub-card list
        const specificItemsContainer = document.createElement('div');
        specificItemsContainer.className = 'worldview-card__specific-items';
        if (narrativeData.list && narrativeData.list.length > 0) {
          narrativeData.list.forEach((item, index) => {
            specificItemsContainer.appendChild(this.buildLinearArcCard(index, item));
          });
        }
        body.appendChild(specificItemsContainer);

        // Add button
        const addButtonsContainer = document.createElement('div');
        addButtonsContainer.className = 'worldview-card__add-buttons';
        addButtonsContainer.appendChild(
          componentFactory.button({
            label: '添加故事线',
            style: 'primary',
            onClick: () => this.app.addListItem('plot', 'narrative_driven.list'),
          }),
        );
        body.appendChild(addButtonsContainer);
      },
    });
  }

  private buildLinearArcCard(index: number, itemData: any): HTMLElement {
    const card = document.createElement('div');
    card.className = 'specific-item-card linear-arc-card'; // Add a specific class
    if (itemData.isLocked) {
      card.classList.add('is-locked');
    }
    if (itemData.isCollapsed) {
      card.classList.add('is-collapsed');
    }

    // Header
    const header = document.createElement('div');
    header.className = 'specific-item-card__header';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'card-control-btn collapse-btn';
    collapseBtn.innerHTML = `<span class="icon">${itemData.isCollapsed ? '▶' : '▼'}</span>`;
    collapseBtn.title = itemData.isCollapsed ? '展开' : '折叠';
    header.appendChild(collapseBtn);

    const title = document.createElement('h5');
    title.className = 'specific-item-card__title';
    title.textContent = `故事线 #${index + 1}`;
    header.appendChild(title);

    const controls = document.createElement('div');
    controls.className = 'specific-item-card__controls';

    const lockBtn = document.createElement('button');
    lockBtn.className = 'card-control-btn lock-btn';
    lockBtn.innerHTML = `<span class="icon"></span>`;
    lockBtn.title = itemData.isLocked ? '解锁' : '锁定';
    controls.appendChild(lockBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'card-control-btn delete-btn';
    deleteBtn.innerHTML = `&times;`;
    deleteBtn.title = '删除故事线';
    controls.appendChild(deleteBtn);

    header.appendChild(controls);
    card.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'specific-item-card__body';
    card.appendChild(body);

    body.appendChild(
      componentFactory.dropdownSelector({
        page: 'plot',
        field: `narrative_driven.list.${index}.branch_type`,
        label: '分支路线类型',
        helpText: '定义这条具体故事线的功能或主题。',
        value: itemData.branch_type,
        options: BRANCH_ROUTE_TYPES.map(opt => ({ ...opt, value: opt.label, level: '' })),
      }),
    );

    body.appendChild(
      componentFactory.dropdownSelector({
        page: 'plot',
        field: `narrative_driven.list.${index}.pacing_arc`,
        label: '叙事弧光节奏',
        helpText: '故事整体的节奏变化曲线。',
        value: itemData.pacing_arc,
        options: PLOT_OPTIONS.narrative_driven.pacing_arc.map(opt => ({ ...opt, label: opt.value })),
      }),
    );

    body.appendChild(
      componentFactory.customTextInput({
        page: 'plot',
        field: `narrative_driven.list.${index}.description`,
        label: '故事线简介',
        value: itemData.description,
        multiline: true,
        placeholder: '简要描述这条故事线的内容...',
      }),
    );

    body.appendChild(componentFactory.createFooterCollapseButton());

    return card;
  }

  private buildSandboxManagerCard(sandboxData: PlotFormData['sandbox']): HTMLElement {
    return this.buildModuleCard({
      page: 'plot',
      moduleKey: 'sandbox',
      title: '沙盒叙事设计',
      moduleData: sandboxData,
      contentBuilder: body => {
        // Add the new world tension dropdown
        body.appendChild(
          componentFactory.dropdownSelector({
            page: 'plot',
            field: 'sandbox.world_tension',
            label: '世界张力',
            helpText: '定义沙盒世界的整体气氛和冲突水平。',
            value: sandboxData.world_tension,
            options: PLOT_OPTIONS.sandbox.world_tension,
          }),
        );

        // Sub-card list
        const specificItemsContainer = document.createElement('div');
        specificItemsContainer.className = 'worldview-card__specific-items';
        if (sandboxData.elements && sandboxData.elements.length > 0) {
          sandboxData.elements.forEach((item, index) => {
            specificItemsContainer.appendChild(this.buildSandboxElementCard(index, item));
          });
        }
        body.appendChild(specificItemsContainer);

        // Add button
        const addButtonsContainer = document.createElement('div');
        addButtonsContainer.className = 'worldview-card__add-buttons';
        addButtonsContainer.appendChild(
          componentFactory.button({
            label: '添加沙盒元素',
            style: 'primary',
            onClick: () => this.app.addListItem('plot', 'sandbox.elements'),
          }),
        );
        body.appendChild(addButtonsContainer);
      },
    });
  }

  private buildSandboxElementCard(index: number, itemData: any): HTMLElement {
    const card = document.createElement('div');
    card.className = 'specific-item-card sandbox-element-card'; // Add a specific class
    if (itemData.isLocked) {
      card.classList.add('is-locked');
    }
    if (itemData.isCollapsed) {
      card.classList.add('is-collapsed');
    }

    // Header
    const header = document.createElement('div');
    header.className = 'specific-item-card__header';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'card-control-btn collapse-btn';
    collapseBtn.innerHTML = `<span class="icon">${itemData.isCollapsed ? '▶' : '▼'}</span>`;
    collapseBtn.title = itemData.isCollapsed ? '展开' : '折叠';
    header.appendChild(collapseBtn);

    const title = document.createElement('h5');
    title.className = 'specific-item-card__title';
    title.textContent = `${itemData.type || '元素'} #${index + 1}`;
    header.appendChild(title);

    const controls = document.createElement('div');
    controls.className = 'specific-item-card__controls';

    const lockBtn = document.createElement('button');
    lockBtn.className = 'card-control-btn lock-btn';
    lockBtn.innerHTML = `<span class="icon"></span>`;
    lockBtn.title = itemData.isLocked ? '解锁' : '锁定';
    controls.appendChild(lockBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'card-control-btn delete-btn';
    deleteBtn.innerHTML = `&times;`;
    deleteBtn.title = '删除元素';
    controls.appendChild(deleteBtn);

    header.appendChild(controls);
    card.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'specific-item-card__body';
    card.appendChild(body);

    // Element Type Dropdown
    body.appendChild(
      componentFactory.dropdownSelector({
        page: 'plot',
        field: `sandbox.elements.${index}.type`,
        label: '元素类型',
        value: itemData.type,
        options: PLOT_OPTIONS.sandbox.element_types,
      }),
    );

    // Description Textarea
    body.appendChild(
      componentFactory.customTextInput({
        page: 'plot',
        field: `sandbox.elements.${index}.description`,
        label: '自定义文本',
        value: itemData.description || '',
        multiline: true,
        placeholder: '详细描述这个元素...',
        hideLabel: false,
      }),
    );

    body.appendChild(componentFactory.createFooterCollapseButton());

    return card;
  }

  private buildRulesPage(container: HTMLElement, data: RulesFormData) {
    const modulesContainer = document.createElement('div');
    modulesContainer.className = 'worldview-modules-grid'; // Re-use grid layout

    // Card 1: 状态追踪器 (State Trackers)
    modulesContainer.appendChild(
      this.buildModuleCard({
        page: 'rules',
        moduleKey: 'trackers',
        title: '状态追踪器 (State Trackers)',
        moduleData: data.trackers,
        contentBuilder: body => {
          body.appendChild(
            componentFactory.nestedObjectListEditor({
              page: 'rules',
              field: 'trackers.list',
              list: data.trackers.list,
              schema: trackerSchema,
              addButtonLabel: '添加追踪器',
            }),
          );
        },
      }),
    );

    // Card 2: 叙事描述符 (Narrative Descriptors)
    modulesContainer.appendChild(
      this.buildModuleCard({
        page: 'rules',
        moduleKey: 'descriptors',
        title: '叙事描述符 (Narrative Descriptors)',
        moduleData: data.descriptors,
        contentBuilder: body => {
          body.appendChild(
            componentFactory.nestedObjectListEditor({
              page: 'rules',
              field: 'descriptors.list',
              list: data.descriptors.list,
              schema: descriptorSchema,
              addButtonLabel: '添加描述符',
            }),
          );
        },
      }),
    );

    // Card 3: 因果触发器 (Causal Triggers)
    modulesContainer.appendChild(
      this.buildModuleCard({
        page: 'rules',
        moduleKey: 'causal_triggers',
        title: '因果触发器 (Causal Triggers)',
        moduleData: data.causal_triggers,
        contentBuilder: body => {
          body.appendChild(
            componentFactory.nestedObjectListEditor({
              page: 'rules',
              field: 'causal_triggers.list',
              list: data.causal_triggers.list,
              schema: causalTriggerSchema,
              addButtonLabel: '添加触发器',
            }),
          );
        },
      }),
    );

    container.appendChild(modulesContainer);
  }

  private buildStylePage(container: HTMLElement, data: StyleFormData) {
    const modulesContainer = document.createElement('div');
    modulesContainer.className = 'worldview-modules-grid'; // Re-use grid layout

    // Card 1: Mode Selection
    modulesContainer.appendChild(
      this.buildModuleCard({
        page: 'style',
        moduleKey: 'mode',
        title: '文风模式',
        moduleData: data.mode,
        contentBuilder: body => {
          body.appendChild(
            componentFactory.dropdownSelector({
              page: 'style',
              field: 'mode.selection',
              label: '模式选择',
              helpText: '选择您希望AI如何生成本次游戏的独特文风。',
              value: data.mode.selection,
              options: STYLE_OPTIONS.mode.selection,
            }),
          );
        },
      }),
    );

    // Card 2: Core Adjustments (Conditional)
    const showAdjustments = data.mode.selection === '参考文风融合' || data.mode.selection === '从零定制合成';
    const adjustmentsModuleData = { ...data.adjustments };
    if (!showAdjustments) {
      adjustmentsModuleData.status = 'disabled';
    }

    modulesContainer.appendChild(
      this.buildModuleCard({
        page: 'style',
        moduleKey: 'adjustments',
        title: '核心调整模块',
        moduleData: adjustmentsModuleData,
        contentBuilder: body => {
          // The content is only built if the module is not disabled,
          // which is handled by the buildModuleCard wrapper.
          // Top: 4 Dropdown Selectors
          body.appendChild(
            componentFactory.dropdownSelector({
              page: 'style',
              field: 'adjustments.narrator_stance_spectrum',
              label: '叙事者姿态光谱',
              helpText: '定义叙事声音与故事世界的情感距离。',
              value: data.adjustments.narrator_stance_spectrum,
              options: STYLE_OPTIONS.adjustments.narrator_stance_spectrum,
            }),
          );
          body.appendChild(
            componentFactory.dropdownSelector({
              page: 'style',
              field: 'adjustments.linguistic_texture_spectrum',
              label: '语言质感与词汇选择光谱',
              helpText: '定义语言的精炼程度与正式性。',
              value: data.adjustments.linguistic_texture_spectrum,
              options: STYLE_OPTIONS.adjustments.linguistic_texture_spectrum,
            }),
          );
          body.appendChild(
            componentFactory.dropdownSelector({
              page: 'style',
              field: 'adjustments.rhetorical_strategy_spectrum',
              label: '修辞策略光谱',
              helpText: '定义比喻、象征等修辞手法的运用程度。',
              value: data.adjustments.rhetorical_strategy_spectrum,
              options: STYLE_OPTIONS.adjustments.rhetorical_strategy_spectrum,
            }),
          );
          body.appendChild(
            componentFactory.dropdownSelector({
              page: 'style',
              field: 'adjustments.syntactic_rhythm_spectrum',
              label: '信息密度与句法节奏光谱',
              helpText: '定义文本的微观速度感和复杂度。',
              value: data.adjustments.syntactic_rhythm_spectrum,
              options: STYLE_OPTIONS.adjustments.syntactic_rhythm_spectrum,
            }),
          );

          // Middle: 2 Points Allocators
          body.appendChild(
            componentFactory.pointsAllocator({
              page: 'style',
              field: 'adjustments.descriptive_focus_points',
              label: '描写重心 (共10点)',
              helpText: '分配点数来决定不同描写方式的权重。',
              totalPoints: 10,
              categories: STYLE_OPTIONS.adjustments.descriptive_focus_points,
              value: data.adjustments.descriptive_focus_points,
            }),
          );
          body.appendChild(
            componentFactory.pointsAllocator({
              page: 'style',
              field: 'adjustments.sensory_channels_points',
              label: '感官通道优先级 (共10点)',
              helpText: '请分配10个点数来定义叙事中最常被调用的感官通道。点数越高，该感官的描写越频繁和细腻。',
              totalPoints: 10,
              categories: STYLE_OPTIONS.adjustments.sensory_channels_points,
              value: data.adjustments.sensory_channels_points,
            }),
          );
          body.appendChild(
            componentFactory.customTextInput({
              page: 'style',
              field: 'adjustments.custom_notes',
              label: '自定义条目',
              helpText: '在此填写对文风的任何额外要求或具体想法。',
              value: data.adjustments.custom_notes,
              multiline: true,
              placeholder: '例如："我希望文风在描写战斗时变得更加粗粝，但在描写感情时则变得文学化。"',
            }),
          );
        },
      }),
    );

    container.appendChild(modulesContainer);

    // Card 3: Dynamic Rules
    modulesContainer.appendChild(this.buildDynamicRulesCard(data));
  }

  private getModuleInfoById(moduleId: string) {
    return WORLDVIEW_MODULES.find(mod => mod.id === moduleId);
  }

  private buildNeedsEmotionSection(sectionData: any, fullData: any): HTMLElement {
    const emotionFlavorSubComponents: Record<string, HTMLElement> = {};
    NEEDS_OPTIONS.emotion.points.forEach(emotion => {
      const emotionLabel = emotion.label;
      const options = (NEEDS_OPTIONS.emotion.flavors as any)[emotionLabel];
      const helpText = (NEEDS_OPTIONS.emotion.flavor_descriptions as any)[emotionLabel];
      if (options) {
        emotionFlavorSubComponents[emotionLabel] = componentFactory.dropdownSelector({
          page: 'needs',
          field: `emotion.flavors.${emotionLabel}`,
          label: '情感风味微调',
          helpText: helpText,
          value: sectionData.flavors[emotionLabel] || '',
          options: options,
        });
      }
    });
    const wrapper = document.createElement('div');
    wrapper.appendChild(
      componentFactory.pointsAllocator({
        page: 'needs',
        field: 'emotion.points',
        label: '情感点数分配 (共10点)',
        helpText: '定义核心情感权重，AI据此调配其频率与强度。共10点。',
        totalPoints: 10,
        categories: NEEDS_OPTIONS.emotion.points,
        value: sectionData.points,
        subComponents: emotionFlavorSubComponents,
      }),
    );
    return wrapper;
  }

  private buildNeedsPowerSection(sectionData: any, fullData: any): HTMLElement {
    const wrapper = document.createElement('div');

    // --- 全局关系设定 ---
    const globalSection = componentFactory.formSection({
      title: '全局关系设定',
      children: [
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.objective_spectrum',
          label: '客观权力光谱',
          helpText: '定义PC与核心NPC之间的客观权力高低关系。',
          value: sectionData.objective_spectrum,
          options: NEEDS_OPTIONS.power.objective_spectrum,
        }),
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.dominant_party',
          label: '主要支配方',
          helpText: '明确关系中的主要支配力量来源。',
          value: sectionData.dominant_party,
          options: NEEDS_OPTIONS.power.dominant_party,
        }),
        componentFactory.pointsAllocator({
          page: 'needs',
          field: 'power.dominant_power_sources_points',
          label: '支配方权力来源 (共10点)',
          helpText: '定义"支配方"所使用权力的来源构成。',
          totalPoints: 10,
          categories: NEEDS_OPTIONS.power.dominant_power_sources_points,
          value: sectionData.dominant_power_sources_points,
        }),
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.expression_spectrum',
          label: '权力表达方式光谱',
          helpText: '权力是公开宣告还是秘而不宣。',
          value: sectionData.expression_spectrum,
          options: NEEDS_OPTIONS.power.expression_spectrum,
        }),
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.importance_spectrum',
          label: '玩家世界重要性光谱',
          helpText: '玩家行动对世界宏观走向的影响力。',
          value: sectionData.importance_spectrum,
          options: NEEDS_OPTIONS.power.importance_spectrum,
        }),
      ],
    });
    wrapper.appendChild(globalSection);

    // --- 玩家角色动态 ---
    const pcSection = componentFactory.formSection({
      title: '玩家角色(PC)动态',
      children: [
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.pc_dynamics.interaction_strategy',
          label: '互动策略',
          helpText: 'PC为达成自身目的所采取的行为策略。',
          value: sectionData.pc_dynamics.interaction_strategy,
          options: NEEDS_OPTIONS.power.interaction_strategy_spectrum,
        }),
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.pc_dynamics.initial_subjective_state',
          label: '初始主观状态',
          helpText: 'PC在故事开始时对权力关系的内心感受。',
          value: sectionData.pc_dynamics.initial_subjective_state,
          options: NEEDS_OPTIONS.power.subjective_state_options,
        }),
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.pc_dynamics.target_subjective_state',
          label: '目标主观状态',
          helpText: 'PC内心感受将倾向于变化成的目标状态。',
          value: sectionData.pc_dynamics.target_subjective_state,
          options: NEEDS_OPTIONS.power.target_subjective_state_options,
        }),
      ],
    });
    wrapper.appendChild(pcSection);

    // --- 核心NPC动态 ---
    const npcSection = componentFactory.formSection({
      title: '核心NPC动态',
      children: [
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.npc_dynamics.interaction_strategy',
          label: '互动策略',
          helpText: '核心NPC为达成自身目的所采取的行为策略原型。',
          value: sectionData.npc_dynamics.interaction_strategy,
          options: NEEDS_OPTIONS.power.interaction_strategy_spectrum,
        }),
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.npc_dynamics.initial_subjective_state',
          label: '初始主观状态',
          helpText: '核心NPC在故事开始时对权力关系的内心感受原型。',
          value: sectionData.npc_dynamics.initial_subjective_state,
          options: NEEDS_OPTIONS.power.subjective_state_options,
        }),
        componentFactory.dropdownSelector({
          page: 'needs',
          field: 'power.npc_dynamics.target_subjective_state',
          label: '目标主观状态',
          helpText: '核心NPC内心感受将倾向于变化成的目标状态原型。',
          value: sectionData.npc_dynamics.target_subjective_state,
          options: NEEDS_OPTIONS.power.target_subjective_state_options,
        }),
      ],
    });
    wrapper.appendChild(npcSection);

    return wrapper;
  }

  private buildNeedsNarrativeSection(sectionData: any, fullData: any): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'narrative.world_harmony_spectrum',
        label: '世界和谐度光谱',
        helpText: '世界整体的和谐/冲突程度。',
        value: sectionData.world_harmony_spectrum,
        options: NEEDS_OPTIONS.narrative.world_harmony_spectrum,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'narrative.npc_compliance_spectrum',
        label: 'NPC顺从度光谱',
        helpText: 'NPC对玩家行动的顺从/抗拒程度。',
        value: sectionData.npc_compliance_spectrum,
        options: NEEDS_OPTIONS.narrative.npc_compliance_spectrum,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'narrative.pace_spectrum',
        label: '故事节奏光谱',
        helpText: '故事推进的快慢、紧张/舒缓程度。',
        value: sectionData.pace_spectrum,
        options: NEEDS_OPTIONS.narrative.pace_spectrum,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'narrative.perspective_choice',
        label: '叙事视角选择',
        helpText: '故事采用哪种叙事视角。',
        value: sectionData.perspective_choice,
        options: NEEDS_OPTIONS.narrative.perspective_choice,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'narrative.perspective_switching_mode',
        label: '视角切换方式',
        helpText: '叙事过程中视角如何切换。',
        value: sectionData.perspective_switching_mode,
        options: NEEDS_OPTIONS.narrative.perspective_switching_mode,
      }),
    );
    return wrapper;
  }

  private buildNeedsBoundariesSection(sectionData: any, fullData: any): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'boundaries.consent_tolerance_level',
        label: '同意容忍度光谱',
        helpText: '对角色行为边界的容忍度。',
        value: sectionData.consent_tolerance_level,
        options: NEEDS_OPTIONS.boundaries.consent_tolerance_level,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'boundaries.erotic_level',
        label: '色情程度光谱',
        helpText: '故事中允许出现的色情内容程度。',
        value: sectionData.erotic_level,
        options: NEEDS_OPTIONS.boundaries.erotic_level,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'boundaries.erotic_focus',
        label: '色情内容聚焦',
        helpText: '色情内容主要聚焦于哪些方面。',
        value: sectionData.erotic_focus,
        options: NEEDS_OPTIONS.boundaries.erotic_focus,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'boundaries.violence_level',
        label: '暴力程度光谱',
        helpText: '故事中允许出现的暴力内容程度。',
        value: sectionData.violence_level,
        options: NEEDS_OPTIONS.boundaries.violence_level,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'boundaries.violence_focus',
        label: '暴力内容聚焦',
        helpText: '暴力内容主要聚焦于哪些方面。',
        value: sectionData.violence_focus,
        options: NEEDS_OPTIONS.boundaries.violence_focus,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'boundaries.description_intensity_spectrum',
        label: '描述强度光谱',
        helpText: '故事中对敏感内容的描述强度。',
        value: sectionData.description_intensity_spectrum,
        options: NEEDS_OPTIONS.boundaries.description_intensity_spectrum,
      }),
    );
    wrapper.appendChild(
      componentFactory.dropdownSelector({
        page: 'needs',
        field: 'boundaries.consequence_severity_spectrum',
        label: '后果严重性光谱',
        helpText: '角色行为带来的后果严重性。',
        value: sectionData.consequence_severity_spectrum,
        options: NEEDS_OPTIONS.boundaries.consequence_severity_spectrum,
      }),
    );
    // 标签选择器
    wrapper.appendChild(
      componentFactory.triStateTagSelector({
        page: 'needs',
        field: 'boundaries.tags',
        label: '敏感内容标签',
        availableTags: AVAILABLE_TAGS,
        preferences: sectionData.tags || {},
      }),
    );
    return wrapper;
  }

  private createGridWrapper(elements: HTMLElement[]): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'form-group-grid-2col';
    elements.forEach(el => grid.appendChild(el));
    return grid;
  }

  private buildDynamicRulesCard(data: StyleFormData): HTMLElement {
    const moduleData = data.dynamic_rules;
    const showCard = data.mode.selection === '参考文风融合' || data.mode.selection === '从零定制合成';

    if (!showCard) {
      moduleData.status = 'disabled';
    } else {
      // If it should be shown but was disabled, reset to editing
      if (moduleData.status === 'disabled') {
        moduleData.status = 'editing';
      }
    }

    return this.buildModuleCard({
      page: 'style',
      moduleKey: 'dynamic_rules',
      title: '动态应用规则',
      moduleData: moduleData,
      contentBuilder: body => {
        const help = document.createElement('p');
        help.className = 'component-help';
        help.innerHTML = `定义在特定场景下，文风需要进行的动态调整。这能让AI像导演一样，根据不同场景（如“思考”、“冲突”）智能地调整其“运镜”（叙事风格）。`;
        body.appendChild(help);

        // --- Sub-card list ---
        const listContainer = document.createElement('div');
        listContainer.className = 'worldview-card__specific-items'; // Re-use style
        if (moduleData.list && moduleData.list.length > 0) {
          moduleData.list.forEach((item, index) => {
            listContainer.appendChild(
              componentFactory.dynamicRuleCard({
                page: 'style',
                field: 'dynamic_rules.list',
                index: index,
                item: item,
                sceneLibrary: DYNAMIC_RULE_LIBRARY,
              }),
            );
          });
        }
        body.appendChild(listContainer);

        // --- Add button ---
        const addButtonsContainer = document.createElement('div');
        addButtonsContainer.className = 'worldview-card__add-buttons';
        addButtonsContainer.appendChild(
          componentFactory.button({
            label: '添加场景规则',
            style: 'primary',
            onClick: () => this.app.addStyleScene(),
          }),
        );
        body.appendChild(addButtonsContainer);
      },
    });
  }
}
