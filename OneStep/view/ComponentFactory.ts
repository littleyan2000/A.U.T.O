import { STYLE_OPTIONS } from '../constants/style-options';
import {
  ConditionOperator,
  GradientOption,
  HierarchicalOption,
  NestedObjectSchema,
  PageType,
  ThresholdCondition,
} from '../types/AppTypes';

export const componentFactory = {
  button: (props: {
    label: string;
    style: 'primary' | 'secondary' | 'accent' | 'accent-secondary';
    onClick: () => void;
    disabled?: boolean;
  }): HTMLElement => {
    const button = document.createElement('button');
    button.className = `btn btn--${props.style}`;
    button.textContent = props.label;
    if (props.disabled) {
      button.disabled = true;
    }
    button.addEventListener('click', props.onClick);
    return button;
  },

  formSection: (props: {
    title: string;
    children: HTMLElement[];
    helpText?: string;
    isSubSection?: boolean;
  }): HTMLElement => {
    const section = document.createElement('section');
    section.className = 'form-section';
    if (props.isSubSection) {
      section.classList.add('form-section--subsection');
    }

    const titleEl = document.createElement('h3');
    titleEl.className = 'form-section__title';
    titleEl.textContent = props.title;
    section.appendChild(titleEl);

    if (props.helpText) {
      const help = document.createElement('p');
      help.className = 'component-help';
      help.textContent = props.helpText;
      section.appendChild(help);
    }

    const contentContainer = document.createElement('div');
    contentContainer.className = 'form-section__content';
    props.children.forEach(child => contentContainer.appendChild(child));
    section.appendChild(contentContainer);

    return section;
  },

  pointsAllocator: (props: {
    page: PageType;
    field: string;
    label: string;
    helpText?: string;
    totalPoints: number;
    categories: Array<string | { type?: 'separator'; label: string; description?: string }>;
    value: Record<string, number>;
    subComponents?: Record<string, HTMLElement>;
    disabled?: boolean;
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'points-allocator';
    if (props.disabled) {
      container.classList.add('points-allocator--disabled');
    }
    const remaining = props.totalPoints - Object.values(props.value || {}).reduce((s, v) => s + v, 0);

    const header = document.createElement('div');
    header.className = 'allocator-header';
    header.innerHTML = `
        <label class="component-label">${props.label}</label>
        <div class="points-remaining">剩余点数: <span>${remaining}</span></div>
    `;
    container.appendChild(header);

    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'point-items';

    props.categories.forEach(category => {
      const isObj = typeof category === 'object';
      const isSeparator = isObj && category.type === 'separator';

      if (isSeparator) {
        const separator = document.createElement('div');
        separator.className = 'point-item-separator';
        separator.textContent = category.label;
        itemsContainer.appendChild(separator);
        return; // Continue to next item
      }

      // BUGFIX: Prioritize using `id` as the key for robustness. Fallback to `label`.
      const categoryKey = isObj && (category as any).id ? (category as any).id : isObj ? category.label : category;
      const label = isObj ? category.label : category;
      const description = isObj ? category.description : '';

      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'point-item';

      // Create a container for the label and its description
      const labelContainer = document.createElement('div');
      labelContainer.className = 'point-label-container';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'point-label';
      labelSpan.textContent = label;
      labelContainer.appendChild(labelSpan);

      if (description) {
        const descriptionP = document.createElement('p');
        descriptionP.className = 'point-description';
        descriptionP.textContent = description;
        labelContainer.appendChild(descriptionP);
      }

      itemWrapper.appendChild(labelContainer);

      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'point-controls';
      controlsDiv.innerHTML = `
        <button class="point-btn minus" data-page="${props.page}" data-field="${
        props.field
      }" data-category="${categoryKey}" data-amount="-1" data-max-points="${props.totalPoints}" ${
        ((props.value || {})[categoryKey] || 0) <= 0 || props.disabled ? 'disabled' : ''
      }>-</button>
        <span class="point-value">${(props.value || {})[categoryKey] || 0}</span>
        <button class="point-btn plus" data-page="${props.page}" data-field="${
        props.field
      }" data-category="${categoryKey}" data-amount="1" data-max-points="${props.totalPoints}" ${
        remaining <= 0 || props.disabled ? 'disabled' : ''
      }>+</button>
      `;
      itemWrapper.appendChild(controlsDiv);

      if (props.subComponents && props.subComponents[label] && ((props.value || {})[label] || 0) > 0) {
        const subComponentContainer = document.createElement('div');
        subComponentContainer.className = 'point-item-details';
        subComponentContainer.appendChild(props.subComponents[label]);
        itemWrapper.appendChild(subComponentContainer);
      }
      itemsContainer.appendChild(itemWrapper);
    });

    container.appendChild(itemsContainer);
    return container;
  },

  dropdownSelector: (props: {
    page: PageType;
    field: string;
    label: string;
    helpText?: string;
    value: string;
    options: GradientOption[];
    disabled?: boolean;
    customClass?: string;
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'custom-dropdown form-group';
    if (props.customClass) {
      container.classList.add(props.customClass);
    }
    if (props.disabled) {
      container.classList.add('custom-dropdown--disabled');
    }
    container.dataset.page = props.page;
    container.dataset.field = props.field;

    const options = props.options;

    if (props.label) {
      const labelEl = document.createElement('label');
      labelEl.className = 'component-label';
      labelEl.textContent = props.label;
      container.appendChild(labelEl);
    }

    if (props.helpText) {
      const help = document.createElement('p');
      help.className = 'component-help';
      help.textContent = props.helpText;
      container.appendChild(help);
    }

    const selectedOption = options.find(opt => opt.value === props.value) ||
      options[0] || { label: '', description: '' };

    const selectedDisplay = document.createElement('div');
    selectedDisplay.className = 'custom-dropdown__selected';
    if (!props.disabled) {
      selectedDisplay.tabIndex = 0; // Make it focusable
    }
    selectedDisplay.innerHTML = `
      <span class="selected-label">${selectedOption.label || ''}</span>
      <span class="selected-description">${selectedOption.description || ''}</span>
    `;
    container.appendChild(selectedDisplay);

    const optionsList = document.createElement('ul');
    optionsList.className = 'custom-dropdown__options';
    optionsList.setAttribute('role', 'listbox');

    options.forEach(opt => {
      const optionEl = document.createElement('li');
      optionEl.className = `custom-dropdown__option ${opt.value === props.value ? 'selected' : ''}`;
      optionEl.dataset.value = opt.value; // This is the correct value to be stored
      const labelSpan = document.createElement('span');
      labelSpan.className = 'option-label';
      labelSpan.textContent = opt.label || '';
      optionEl.appendChild(labelSpan);
      if (opt.description) {
        const desc = document.createElement('span');
        desc.className = 'option-description';
        desc.textContent = opt.description || '';
        optionEl.appendChild(desc);
      }
      optionsList.appendChild(optionEl);
    });

    container.appendChild(optionsList);
    return container;
  },

  gradientSelector: (props: {
    page: PageType;
    field: string;
    label: string;
    helpText?: string;
    value: string;
    options: GradientOption[];
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'gradient-selector';
    container.innerHTML = `
            <label class="component-label">${props.label}</label>
            ${props.helpText ? `<p class="component-help">${props.helpText}</p>` : ''}
            <div class="gradient-options">
                ${props.options
                  .map(
                    opt => `
                    <button class="gradient-option ${props.value === opt.value ? 'selected' : ''}" data-page="${
                      props.page
                    }" data-field="${props.field}" data-value="${opt.value}">
                        <span class="option-level">${opt.level}</span>
                        <span class="option-label">${opt.label}</span>
                        <span class="option-description">${opt.description}</span>
                    </button>
                `,
                  )
                  .join('')}
            </div>`;
    return container;
  },

  tagSelector: (props: {
    page: PageType;
    field: string;
    label: string;
    helpText?: string;
    availableTags: { name: string; tags: string[] }[];
    selectedTags: string[];
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'tag-selector';
    container.innerHTML = `
            <label class="component-label">${props.label}</label>
            ${props.helpText ? `<p class="component-help">${props.helpText}</p>` : ''}
            <div class="tag-categories">
                ${props.availableTags
                  .map(
                    category => `
                    <div class="tag-category">
                        <h4 class="category-name">${category.name}</h4>
                        <div class="tag-list">
                            ${category.tags
                              .map(
                                tag => `
                                <button class="tag-btn ${
                                  props.selectedTags.includes(tag) ? 'selected' : ''
                                }" data-page="${props.page}" data-field="${
                                  props.field
                                }" data-tag="${tag}">${tag}</button>
                            `,
                              )
                              .join('')}
                        </div>
                    </div>`,
                  )
                  .join('')}
            </div>`;
    return container;
  },

  checkboxGroup: (props: {
    page: PageType;
    field: string;
    label: string;
    helpText?: string;
    options: { id: string; label: string }[];
    value: Record<string, boolean>;
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'form-group';

    const labelEl = document.createElement('label');
    labelEl.className = 'component-label';
    labelEl.textContent = props.label;
    container.appendChild(labelEl);

    if (props.helpText) {
      const help = document.createElement('p');
      help.className = 'component-help';
      help.textContent = props.helpText;
      container.appendChild(help);
    }

    const listContainer = document.createElement('div');
    listContainer.className = 'checkbox-group-list'; // You might want to add styles for this

    props.options.forEach(option => {
      const itemContainer = document.createElement('div');
      itemContainer.className = 'boolean-control'; // Reuse the style for single toggles

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      const fieldPath = `${props.field}.${option.id}`;
      checkbox.id = `checkbox-${props.page}-${fieldPath.replace(/\./g, '-')}`;
      checkbox.checked = props.value[option.id] || false;
      checkbox.dataset.page = props.page;
      checkbox.dataset.field = fieldPath;

      const optionLabel = document.createElement('label');
      optionLabel.htmlFor = checkbox.id;
      optionLabel.textContent = option.label;

      itemContainer.appendChild(checkbox);
      itemContainer.appendChild(optionLabel);
      listContainer.appendChild(itemContainer);
    });

    container.appendChild(listContainer);
    return container;
  },

  triStateTagSelector: (props: {
    page: PageType;
    field: string;
    label: string;
    helpText?: string;
    availableTags: { name: string; tags: string[] }[];
    preferences: Record<string, 'like' | 'dislike' | 'neutral'>;
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'tri-state-tag-selector';
    container.innerHTML = `
      <label class="component-label">${props.label}</label>
      ${props.helpText ? `<p class="component-help">${props.helpText}</p>` : ''}
      <div class="tag-categories">
        ${props.availableTags
          .map(
            category => `
          <div class="tag-category">
            <h4 class="category-name">${category.name}</h4>
            <div class="tag-list">
              ${category.tags
                .map(tag => {
                  const preference = props.preferences[tag] || 'neutral';
                  const tagLabel = tag.split(' (')[0]; // Remove English part for alignment
                  return `
                  <div class="tri-state-tag preference-${preference}" data-tag="${tag}">
                    <span class="tag-label">${tagLabel}</span>
                    <div class="tag-controls">
                      <button
                        class="tag-pref-btn like ${preference === 'like' ? 'selected' : ''}"
                        data-page="${props.page}"
                        data-field="${props.field}"
                        data-tag="${tag}"
                        data-preference="like">喜</button>
                      <button
                        class="tag-pref-btn dislike ${preference === 'dislike' ? 'selected' : ''}"
                        data-page="${props.page}"
                        data-field="${props.field}"
                        data-tag="${tag}"
                        data-preference="dislike">厌</button>
                      <button
                        class="tag-pref-btn neutral ${preference === 'neutral' ? 'selected' : ''}"
                        data-page="${props.page}"
                        data-field="${props.field}"
                        data-tag="${tag}"
                        data-preference="neutral">中</button>
                    </div>
                  </div>
                `;
                })
                .join('')}
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
    return container;
  },

  customTextInput: (props: {
    page: PageType;
    field: string;
    label?: string;
    helpText?: string;
    value: string;
    placeholder?: string;
    multiline?: boolean;
    hideLabel?: boolean;
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'form-group';
    const inputId = `input-${props.page}-${props.field.replace('.', '-')}`;

    if (!props.hideLabel && props.label) {
      const label = document.createElement('label');
      label.htmlFor = inputId;
      label.textContent = props.label;
      container.appendChild(label);
    }

    if (props.helpText) {
      const help = document.createElement('p');
      help.className = 'component-help';
      help.textContent = props.helpText;
      container.appendChild(help);
    }

    const input = props.multiline ? document.createElement('textarea') : document.createElement('input');
    input.id = inputId;
    input.className = 'custom-text-input';
    input.dataset.page = props.page;
    input.dataset.field = props.field;
    input.placeholder = props.placeholder || '';
    input.value = props.value;
    container.appendChild(input);

    return container;
  },

  staticContent: (props: { html: string }): HTMLElement => {
    const container = document.createElement('div');
    container.innerHTML = props.html;
    return container;
  },

  dynamicPointsAllocator: (props: {
    page: PageType;
    field: string;
    label: string;
    helpText?: string;
    totalPoints: number;
    value: Record<string, number>;
    hideHeader?: boolean;
    itemGroups: {
      id: string;
      label: string;
      limit: number;
      options: HierarchicalOption[];
    }[];
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'dynamic-points-allocator';

    const allPoints = Object.values(props.value).reduce((s, v) => s + v, 0);
    const remaining = props.totalPoints - allPoints;

    if (!props.hideHeader) {
      const header = document.createElement('div');
      header.className = 'dpa-header';
      header.innerHTML = `
        <label class="component-label">${props.label}</label>
        <div class="points-remaining">剩余点数: <span>${remaining}</span></div>
      `;
      container.appendChild(header);
    }

    if (props.helpText && !props.hideHeader) {
      const help = document.createElement('p');
      help.className = 'component-help';
      help.textContent = props.helpText;
      container.appendChild(help);
    }

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'dpa-controls';

    props.itemGroups.forEach(group => {
      const allGroupOptions = group.options.flatMap(opt => [opt.value, ...(opt.children?.map(c => c.value) || [])]);
      const selectedCount = Object.keys(props.value).filter(key => allGroupOptions.includes(key)).length;

      if (selectedCount >= group.limit) return;

      const groupContainer = document.createElement('div');
      groupContainer.className = 'dpa-group';

      const parentSelect = document.createElement('select');
      parentSelect.dataset.page = props.page;
      parentSelect.dataset.field = props.field;
      parentSelect.dataset.action = 'dpa-parent-select';
      parentSelect.dataset.groupId = group.id;
      parentSelect.innerHTML = `<option value="">-- ${group.label} --</option>`;
      group.options.forEach(opt => {
        const isAlreadySelected = props.value.hasOwnProperty(opt.value);
        if (!isAlreadySelected) {
          parentSelect.innerHTML += `<option value="${opt.value}">${opt.label}</option>`;
        }
      });
      groupContainer.appendChild(parentSelect);

      const childSelect = document.createElement('select');
      childSelect.dataset.page = props.page;
      childSelect.dataset.field = props.field;
      childSelect.dataset.action = 'dpa-child-select';
      childSelect.dataset.groupId = group.id;
      childSelect.innerHTML = `<option value="">-- 请先选择上级 --</option>`;
      childSelect.disabled = true;
      groupContainer.appendChild(childSelect);

      const addButton = document.createElement('button');
      addButton.textContent = '添加';
      addButton.className = 'btn btn--secondary btn--small';
      addButton.disabled = true;
      addButton.dataset.page = props.page;
      addButton.dataset.field = props.field;
      addButton.dataset.action = 'dpa-add-item';
      addButton.dataset.groupId = group.id;
      groupContainer.appendChild(addButton);

      controlsContainer.appendChild(groupContainer);
    });
    container.appendChild(controlsContainer);

    const itemList = document.createElement('div');
    itemList.className = 'dpa-item-list';
    Object.entries(props.value).forEach(([category, points]) => {
      const item = document.createElement('div');
      item.className = 'dpa-item';
      item.innerHTML = `
        <span class="dpa-item__label">${category}</span>
        <div class="dpa-item__controls">
          <button class="point-btn minus" data-page="${props.page}" data-field="${
        props.field
      }" data-category="${category}" data-amount="-1" data-max-points="${props.totalPoints}" ${
        points <= 0 ? 'disabled' : ''
      }>-</button>
          <span class="point-value">${points}</span>
          <button class="point-btn plus" data-page="${props.page}" data-field="${
        props.field
      }" data-category="${category}" data-amount="1" data-max-points="${props.totalPoints}" ${
        remaining <= 0 ? 'disabled' : ''
      }>+</button>
          <button class="btn btn--secondary btn--small" data-page="${
            props.page
          }" data-action="dpa-remove-item" data-field="${props.field}" data-category="${category}">删除</button>
        </div>
      `;
      itemList.appendChild(item);
    });
    container.appendChild(itemList);

    return container;
  },

  objectListEditor: (props: {
    page: PageType;
    field: string;
    label: string;
    helpText?: string;
    list: any[];
    objectSchema: { key: string; label: string; type: 'text' | 'textarea' | 'select'; options?: string[] }[];
    addButtonLabel: string;
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'object-list-editor';

    const labelEl = document.createElement('label');
    labelEl.className = 'component-label';
    labelEl.textContent = props.label;
    if (props.label) {
      container.appendChild(labelEl);
    }

    if (props.helpText) {
      const help = document.createElement('p');
      help.className = 'component-help';
      help.textContent = props.helpText;
      container.appendChild(help);
    }

    const listContainer = document.createElement('div');
    listContainer.className = 'list-container';
    container.appendChild(listContainer);

    props.list.forEach((item, index) => {
      const itemContainer = document.createElement('div');
      itemContainer.className = 'list-item';

      props.objectSchema.forEach(schema => {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'form-group';

        const fieldLabel = document.createElement('label');
        fieldLabel.textContent = schema.label;
        fieldContainer.appendChild(fieldLabel);

        let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const inputPath = `${props.field}.${index}.${schema.key}`;

        if (schema.type === 'textarea') {
          input = document.createElement('textarea');
          input.value = item[schema.key] || '';
        } else if (schema.type === 'select') {
          input = document.createElement('select');
          (schema.options || []).forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (item[schema.key] === opt) {
              option.selected = true;
            }
            input.appendChild(option);
          });
        } else {
          input = document.createElement('input');
          input.type = 'text';
          input.value = item[schema.key] || '';
        }
        input.className = 'custom-text-input'; // Re-use class
        input.dataset.page = props.page;
        input.dataset.field = inputPath;
        fieldContainer.appendChild(input);
        itemContainer.appendChild(fieldContainer);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '删除';
      deleteButton.className = 'btn btn--secondary btn--small';
      deleteButton.dataset.page = props.page;
      deleteButton.dataset.action = 'delete-list-item';
      deleteButton.dataset.field = props.field;
      deleteButton.dataset.index = String(index);
      itemContainer.appendChild(deleteButton);

      listContainer.appendChild(itemContainer);
    });

    const addButton = document.createElement('button');
    addButton.textContent = props.addButtonLabel;
    addButton.className = 'btn btn--accent';
    addButton.dataset.page = props.page;
    addButton.dataset.action = 'add-list-item';
    addButton.dataset.field = props.field;
    container.appendChild(addButton);

    return container;
  },

  nestedObjectListEditor: (props: {
    page: PageType;
    field: string; // The base path for the data, e.g., "trackers.list"
    list: any[];
    schema: NestedObjectSchema[];
    addButtonLabel: string;
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'nested-object-list-editor';

    const listContainer = document.createElement('div');
    listContainer.className = 'list-container';
    container.appendChild(listContainer);

    // Helper function to render a single field based on its schema
    const renderField = (schema: NestedObjectSchema, path: string, data: any): HTMLElement => {
      const value = data ? data[schema.key] : undefined;

      if (schema.type === 'nested-list') {
        const nestedContainer = document.createElement('div');
        // The title for nested lists is now part of the collapsible card header
        nestedContainer.appendChild(
          componentFactory.nestedObjectListEditor({
            page: props.page,
            field: path,
            list: value || [],
            schema: schema.subSchema!,
            addButtonLabel: schema.addButtonLabel!,
          }),
        );
        return nestedContainer;
      }

      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'form-group';
      fieldContainer.dataset.fieldKey = schema.key;

      const labelElement = document.createElement('label');
      labelElement.textContent = schema.label;

      if (schema.type === 'boolean') {
        fieldContainer.className = 'boolean-control';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `input-${props.page}-${path.replace(/[.\[\]]/g, '-')}`;
        checkbox.checked = value || false;
        checkbox.dataset.page = props.page;
        checkbox.dataset.field = path;
        fieldContainer.appendChild(checkbox);
        fieldContainer.appendChild(labelElement);
        return fieldContainer;
      }

      fieldContainer.appendChild(labelElement);
      if (schema.helpText) {
        const help = document.createElement('p');
        help.className = 'component-help';
        help.textContent = schema.helpText;
        fieldContainer.appendChild(help);
      }

      let inputElement: HTMLElement;
      if (schema.type === 'numeric') {
        inputElement = componentFactory.numericStepper({ page: props.page, field: path, value: value || 0 });
        const input = inputElement.querySelector('input');
        if (input) input.id = `input-${props.page}-${path.replace(/[.\[\]]/g, '-')}`;
      } else if (schema.type === 'range') {
        inputElement = componentFactory.rangeInput({
          page: props.page,
          field: path,
          value: value || { min: 0, max: 0 },
        });
      } else if (schema.type === 'condition') {
        inputElement = componentFactory.conditionBuilder({
          page: props.page,
          field: path,
          value: value || { operator: '>', value: 0 },
        });
      } else {
        let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (schema.type === 'textarea') {
          input = document.createElement('textarea');
        } else if (schema.type === 'select') {
          input = document.createElement('select');
          (schema.options || []).forEach(opt => {
            const option = document.createElement('option');
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            option.value = optValue;
            option.textContent = optLabel;
            if (value === optValue) option.selected = true;
            input.appendChild(option);
          });
        } else {
          input = document.createElement('input');
          input.type = 'text';
        }
        input.value = value || '';
        input.id = `input-${props.page}-${path.replace(/[.\[\]]/g, '-')}`;
        input.className = 'custom-text-input';
        input.dataset.page = props.page;
        input.dataset.field = path;
        inputElement = input;
      }
      fieldContainer.appendChild(inputElement);
      return fieldContainer;
    };

    // Render each item in the list
    props.list.forEach((item, index) => {
      const itemContainer = document.createElement('div');
      // Use the same class as other complex cards for consistent styling
      itemContainer.className = 'specific-item-card rules-item-card';
      if (item.isCollapsed) {
        itemContainer.classList.add('is-collapsed');
      }

      // --- Header ---
      const header = document.createElement('div');
      header.className = 'specific-item-card__header';

      const collapseBtn = document.createElement('button');
      collapseBtn.className = 'card-control-btn collapse-btn';
      collapseBtn.innerHTML = `<span class="icon">${item.isCollapsed ? '▶' : '▼'}</span>`;
      collapseBtn.title = item.isCollapsed ? '展开' : '折叠';
      collapseBtn.dataset.page = props.page;
      collapseBtn.dataset.action = 'toggle-rules-item';
      collapseBtn.dataset.field = props.field;
      collapseBtn.dataset.index = String(index);
      header.appendChild(collapseBtn);

      const title = document.createElement('h5');
      title.className = 'specific-item-card__title';
      // Try to find a 'name' or 'label' field for the title, fallback to a generic name
      const titleKey = props.schema.find(s => s.key === 'name' || s.key === 'system_name' || s.key === 'target');
      const cardTitle =
        titleKey && item[titleKey.key]
          ? item[titleKey.key]
          : `${props.addButtonLabel.replace('添加', '')} #${index + 1}`;
      title.textContent = cardTitle;
      header.appendChild(title);

      const controls = document.createElement('div');
      controls.className = 'specific-item-card__controls';
      const deleteButton = document.createElement('button');
      deleteButton.className = 'card-control-btn delete-btn';
      deleteButton.innerHTML = `&times;`;
      deleteButton.title = `删除此 ${props.addButtonLabel.replace('添加', '')}`;
      deleteButton.dataset.page = props.page;
      deleteButton.dataset.action = 'delete-list-item';
      deleteButton.dataset.field = props.field;
      deleteButton.dataset.index = String(index);
      controls.appendChild(deleteButton);
      header.appendChild(controls);
      itemContainer.appendChild(header);

      // --- Body ---
      const body = document.createElement('div');
      body.className = 'specific-item-card__body';
      itemContainer.appendChild(body);

      // (The rest of the rendering logic from the original function goes here)
      const controlGroups: Record<string, { controller: NestedObjectSchema; controlled: NestedObjectSchema[] }> = {};
      props.schema.forEach(s => {
        if (s.type === 'boolean' && !s.controlledBy) controlGroups[s.key] = { controller: s, controlled: [] };
      });
      props.schema.forEach(s => {
        if (s.controlledBy && controlGroups[s.controlledBy]) controlGroups[s.controlledBy].controlled.push(s);
      });

      const renderedKeys = new Set<string>();
      const topLevelFields: HTMLElement[] = [];
      const groupedFields: HTMLElement[] = [];

      props.schema.forEach(schemaItem => {
        if (renderedKeys.has(schemaItem.key)) return;

        const isController = schemaItem.type === 'boolean' && controlGroups[schemaItem.key];
        const isControlled = !!schemaItem.controlledBy;

        if (isController) {
          const group = controlGroups[schemaItem.key];
          const groupContainer = document.createElement('div');
          groupContainer.className = 'form-group--boolean-controlled';
          groupContainer.dataset.groupKey = schemaItem.key;

          const controllerPath = `${props.field}.${index}.${schemaItem.key}`;
          groupContainer.appendChild(renderField(schemaItem, controllerPath, item));

          if (item[schemaItem.key]) {
            group.controlled.forEach(controlledSchema => {
              const controlledPath = `${props.field}.${index}.${controlledSchema.key}`;
              groupContainer.appendChild(renderField(controlledSchema, controlledPath, item));
              renderedKeys.add(controlledSchema.key);
            });
          }
          groupedFields.push(groupContainer);
          renderedKeys.add(schemaItem.key);
        } else if (!isControlled) {
          const currentPath = `${props.field}.${index}.${schemaItem.key}`;
          topLevelFields.push(renderField(schemaItem, currentPath, item));
          renderedKeys.add(schemaItem.key);
        }
      });

      topLevelFields.forEach(field => body.appendChild(field));

      // --- Post-processing DOM to group initial_value with min/max controls ---
      const initialValueField = body.querySelector('[data-field-key="initial_value"]') as HTMLElement;
      const minGroup = groupedFields.find(g => g.dataset.groupKey === 'has_min_value');
      const maxGroup = groupedFields.find(g => g.dataset.groupKey === 'has_max_value');

      if (initialValueField && (minGroup || maxGroup)) {
        const combinedContainer = document.createElement('div');
        combinedContainer.className = 'form-group-grid-2col'; // Use a 2-column grid for alignment

        if (minGroup) combinedContainer.appendChild(minGroup);
        if (maxGroup) combinedContainer.appendChild(maxGroup);

        // Insert the new container right after the initialValueField
        if (combinedContainer.hasChildNodes()) {
          initialValueField.insertAdjacentElement('afterend', combinedContainer);
        }

        // Remove the groups from the original groupedFields array so they aren't rendered twice
        if (minGroup) groupedFields.splice(groupedFields.indexOf(minGroup), 1);
        if (maxGroup) groupedFields.splice(groupedFields.indexOf(maxGroup), 1);
      }

      if (groupedFields.length > 0) {
        const inlineContainer = document.createElement('div');
        inlineContainer.className = 'form-group-inline';
        groupedFields.forEach(field => inlineContainer.appendChild(field));
        body.appendChild(inlineContainer);
      }

      // Add footer collapse button
      const footerCollapseBtn = document.createElement('button');
      footerCollapseBtn.className = 'card-collapse-footer-btn';
      footerCollapseBtn.title = '折叠此卡片';
      footerCollapseBtn.dataset.page = props.page;
      footerCollapseBtn.dataset.action = 'toggle-rules-item';
      footerCollapseBtn.dataset.field = props.field;
      footerCollapseBtn.dataset.index = String(index);
      body.appendChild(footerCollapseBtn);

      listContainer.appendChild(itemContainer);
    });

    const addControlsContainer = document.createElement('div');
    addControlsContainer.className = 'list-item__controls';
    const addButton = document.createElement('button');
    addButton.textContent = props.addButtonLabel;
    addButton.className = 'btn btn--primary add-main-item-btn';
    addButton.dataset.page = props.page;
    addButton.dataset.action = 'add-list-item';
    addButton.dataset.field = props.field;
    addControlsContainer.appendChild(document.createElement('div')); // Spacer
    addControlsContainer.appendChild(addButton);
    container.appendChild(addControlsContainer);

    return container;
  },

  numericStepper: (props: { page: PageType; field: string; value: number }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'numeric-stepper';

    const minusBtn = document.createElement('button');
    minusBtn.className = 'stepper-btn';
    minusBtn.textContent = '-';
    minusBtn.dataset.page = props.page;
    minusBtn.dataset.field = props.field;
    minusBtn.dataset.action = 'numeric-step';
    minusBtn.dataset.step = '-1';
    container.appendChild(minusBtn);

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `input-${props.page}-${props.field.replace(/[.\[\]]/g, '-')}`;
    input.className = 'custom-text-input';
    input.dataset.page = props.page;
    input.dataset.field = props.field;
    input.value = String(props.value);
    container.appendChild(input);

    const plusBtn = document.createElement('button');
    plusBtn.className = 'stepper-btn';
    plusBtn.textContent = '+';
    plusBtn.dataset.page = props.page;
    plusBtn.dataset.field = props.field;
    plusBtn.dataset.action = 'numeric-step';
    plusBtn.dataset.step = '1';
    container.appendChild(plusBtn);

    return container;
  },

  rangeInput: (props: { page: PageType; field: string; value: { min: number; max: number } }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'range-input';

    const minStepper = componentFactory.numericStepper({
      page: props.page,
      field: `${props.field}.min`,
      value: props.value.min,
    });

    const maxStepper = componentFactory.numericStepper({
      page: props.page,
      field: `${props.field}.max`,
      value: props.value.max,
    });

    const separator = document.createElement('span');
    separator.className = 'range-separator';
    separator.textContent = '至';

    container.appendChild(minStepper);
    container.appendChild(separator);
    container.appendChild(maxStepper);

    return container;
  },

  conditionBuilder: (props: { page: PageType; field: string; value: ThresholdCondition }): HTMLElement => {
    const { page, field, value } = props;
    const container = document.createElement('div');
    container.className = 'condition-builder form-group';
    // The main container holds the reference to the object in the state
    container.dataset.page = page;
    container.dataset.field = field;

    const operatorOptions: { label: string; value: ConditionOperator }[] = [
      { label: '大于 (>)', value: '>' },
      { label: '小于 (<)', value: '<' },
      { label: '大于等于 (>=)', value: '>=' },
      { label: '小于等于 (<=)', value: '<=' },
      { label: '等于 (==)', value: '==' },
      { label: '在...和...之间 (含边界)', value: 'between_inclusive' },
      { label: '在...和...之间 (不含边界)', value: 'between_exclusive' },
      { label: '在...和...之间 (左含右不含)', value: 'between_left_inclusive' },
      { label: '在...和...之间 (右含左不含)', value: 'between_right_inclusive' },
    ];

    const currentValue = value || { operator: '>', value: 0 };

    const controlsHtml = `
      <div class="condition-builder__controls">
        <select class="condition-operator-select" data-sub-field="operator">
          ${operatorOptions
            .map(
              opt =>
                `<option value="${opt.value}" ${currentValue.operator === opt.value ? 'selected' : ''}>${
                  opt.label
                }</option>`,
            )
            .join('')}
        </select>
        <div class="condition-value-wrapper" style="display: none;">
          <input type="number" class="custom-text-input" data-sub-field="value" value="${currentValue.value || 0}" />
        </div>
        <div class="condition-range-wrapper" style="display: none;">
          <input type="number" class="custom-text-input" data-sub-field="min" value="${currentValue.min || 0}" />
          <span class="range-separator">和</span>
          <input type="number" class="custom-text-input" data-sub-field="max" value="${currentValue.max || 0}" />
        </div>
      </div>
    `;

    container.innerHTML = controlsHtml;

    // Logic to show/hide inputs based on operator
    const operatorSelect = container.querySelector('.condition-operator-select') as HTMLSelectElement;
    const valueWrapper = container.querySelector('.condition-value-wrapper') as HTMLElement;
    const rangeWrapper = container.querySelector('.condition-range-wrapper') as HTMLElement;

    const toggleInputs = (operator: string) => {
      const isRange = operator.includes('between');
      valueWrapper.style.display = isRange ? 'none' : 'flex';
      rangeWrapper.style.display = isRange ? 'flex' : 'none';
    };

    // Initial state
    toggleInputs(operatorSelect.value);

    // Add event listener to handle changes
    operatorSelect.addEventListener('change', () => {
      toggleInputs(operatorSelect.value);
    });

    return container;
  },

  booleanToggle: (props: {
    page: PageType;
    field: string;
    label: string;
    value: boolean;
    helpText?: string;
  }): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'form-group'; // Use form-group for consistent layout with help text

    const controlWrapper = document.createElement('div');
    controlWrapper.className = 'boolean-control';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `toggle-${props.page}-${props.field.replace(/\./g, '-')}`;
    input.checked = props.value;
    input.setAttribute('data-page', props.page);
    input.setAttribute('data-field', props.field);

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = props.label;

    controlWrapper.appendChild(input);
    controlWrapper.appendChild(label);
    container.appendChild(controlWrapper);

    if (props.helpText) {
      const help = document.createElement('p');
      help.className = 'component-help';
      help.textContent = props.helpText;
      container.appendChild(help);
    }

    return container;
  },

  dynamicRuleCard: (props: {
    page: PageType;
    field: string; // e.g., "dynamic_rules.list"
    index: number;
    item: any; // The DynamicRule object
    sceneLibrary: Record<string, string[]>;
  }): HTMLElement => {
    const { page, field, index, item, sceneLibrary } = props;
    const basePath = `${field}.${index}`;

    const container = document.createElement('div');
    container.className = 'specific-item-card dynamic-rule-card'; // Re-use styles
    if (item.isCollapsed) {
      container.classList.add('is-collapsed');
    }

    // --- Header ---
    const header = document.createElement('div');
    header.className = 'specific-item-card__header';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'card-control-btn collapse-btn';
    collapseBtn.innerHTML = `<span class="icon">${item.isCollapsed ? '▶' : '▼'}</span>`;
    collapseBtn.title = item.isCollapsed ? '展开' : '折叠';
    collapseBtn.dataset.page = page;
    collapseBtn.dataset.action = 'toggle-style-scene';
    collapseBtn.dataset.index = String(index);
    header.appendChild(collapseBtn);

    const title = document.createElement('h5');
    title.className = 'specific-item-card__title';
    const parentLabel = item.parentCategory || '未选择';
    const childLabel = item.childCategory || '';
    title.textContent = `场景: ${parentLabel}${childLabel ? ` -> ${childLabel.split(':')[0]}` : ''}`;
    header.appendChild(title);

    const controls = document.createElement('div');
    controls.className = 'specific-item-card__controls';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'card-control-btn delete-btn';
    deleteButton.innerHTML = `&times;`;
    deleteButton.title = `删除此场景规则`;
    deleteButton.dataset.page = page;
    deleteButton.dataset.action = 'delete-style-scene';
    deleteButton.dataset.index = String(index);
    controls.appendChild(deleteButton);
    header.appendChild(controls);
    container.appendChild(header);

    // --- Body ---
    const body = document.createElement('div');
    body.className = 'specific-item-card__body';
    container.appendChild(body);

    const dropdownsContainer = document.createElement('div');
    dropdownsContainer.className = 'form-group-grid-2col'; // Two columns for dropdowns

    // Parent Dropdown
    const parentOptions: GradientOption[] = Object.keys(sceneLibrary).map(key => ({
      value: key,
      label: key,
      description: '', // Descriptions can be added later if needed
      level: '',
    }));
    parentOptions.unshift({ value: '', label: '--- 未选择 ---', description: '取消选择', level: '' });

    const parentDropdown = componentFactory.dropdownSelector({
      page,
      field: `${basePath}.parentCategory`,
      label: '父分类',
      value: item.parentCategory || '',
      options: parentOptions,
      customClass: 'fixed-height-dropdown',
    });
    dropdownsContainer.appendChild(parentDropdown);

    // Child Dropdown
    const childOptions: GradientOption[] = [];
    if (item.parentCategory && sceneLibrary[item.parentCategory]) {
      sceneLibrary[item.parentCategory].forEach(child => {
        childOptions.push({ value: child, label: child, description: '', level: '' });
      });
    }
    childOptions.unshift({ value: '', label: '--- 未选择 ---', description: '取消选择', level: '' });

    const childDropdown = componentFactory.dropdownSelector({
      page,
      field: `${basePath}.childCategory`,
      label: '子分类',
      value: item.childCategory || '',
      options: childOptions,
      disabled: !item.parentCategory,
      customClass: 'fixed-height-dropdown',
    });
    dropdownsContainer.appendChild(childDropdown);

    body.appendChild(dropdownsContainer);

    // Points Allocators
    const descriptiveFocusAllocator = componentFactory.pointsAllocator({
      page,
      field: `${basePath}.descriptive_focus_points`,
      label: '描写重心 (场景专用)',
      totalPoints: 10,
      categories: STYLE_OPTIONS.adjustments.descriptive_focus_points,
      value: item.descriptive_focus_points || {},
      disabled: !item.parentCategory,
    });
    body.appendChild(descriptiveFocusAllocator);

    const sensoryChannelsAllocator = componentFactory.pointsAllocator({
      page,
      field: `${basePath}.sensory_channels_points`,
      label: '感官通道 (场景专用)',
      totalPoints: 10,
      categories: STYLE_OPTIONS.adjustments.sensory_channels_points,
      value: item.sensory_channels_points || {},
      disabled: !item.parentCategory,
    });
    body.appendChild(sensoryChannelsAllocator);

    const dialsContainer = document.createElement('div');
    dialsContainer.className = 'form-group-grid-4col'; // 4 columns for dials

    dialsContainer.appendChild(
      componentFactory.dropdownSelector({
        page,
        field: `${basePath}.pacing_dial`,
        label: '叙事节奏',
        value: item.pacing_dial || '',
        options: STYLE_OPTIONS.dynamic_rule_dials.pacing,
        disabled: !item.parentCategory,
      }),
    );
    dialsContainer.appendChild(
      componentFactory.dropdownSelector({
        page,
        field: `${basePath}.syntax_dial`,
        label: '句法结构',
        value: item.syntax_dial || '',
        options: STYLE_OPTIONS.dynamic_rule_dials.syntax,
        disabled: !item.parentCategory,
      }),
    );
    dialsContainer.appendChild(
      componentFactory.dropdownSelector({
        page,
        field: `${basePath}.vocabulary_dial`,
        label: '词汇剖面',
        value: item.vocabulary_dial || '',
        options: STYLE_OPTIONS.dynamic_rule_dials.vocabulary,
        disabled: !item.parentCategory,
      }),
    );
    dialsContainer.appendChild(
      componentFactory.dropdownSelector({
        page,
        field: `${basePath}.emotion_dial`,
        label: '情感表达',
        value: item.emotion_dial || '',
        options: STYLE_OPTIONS.dynamic_rule_dials.emotion,
        disabled: !item.parentCategory,
      }),
    );

    body.appendChild(dialsContainer);

    // Adjustments Textarea
    const adjustmentsTextarea = componentFactory.customTextInput({
      page,
      field: `${basePath}.adjustments`,
      label: '具体调整',
      helpText: '定义此场景下，风格需要进行的具体覆盖或修改。',
      value: item.adjustments || '',
      multiline: true,
      placeholder: '例如: `pacing`极限加速; `sentence_structure`切换为短句...',
    });
    body.appendChild(adjustmentsTextarea);

    const footerCollapseBtn = componentFactory.createFooterCollapseButton();
    footerCollapseBtn.dataset.page = page;
    footerCollapseBtn.dataset.action = 'toggle-style-scene';
    footerCollapseBtn.dataset.index = String(index);
    body.appendChild(footerCollapseBtn);

    return container;
  },

  createFooterCollapseButton: (): HTMLButtonElement => {
    const button = document.createElement('button');
    button.className = 'card-collapse-footer-btn';
    button.title = '折叠此卡片';
    return button;
  },
};
