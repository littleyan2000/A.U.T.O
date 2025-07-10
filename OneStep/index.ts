import { AppController } from './app/AppController';
import { AESTHETIC_FILTER_HIERARCHY, CULTURAL_ARCHETYPE_HIERARCHY } from './constants/culture-options';
import { PAGE_METADATA } from './constants/metadata';
import './index.scss';
import { AppState, ConditionOperator, PageType, ThresholdCondition } from './types/AppTypes';
import { componentFactory } from './view/ComponentFactory';
import { PageBuilder } from './view/PageBuilder';

class OneStepUI {
  private app: AppController;
  private root: HTMLElement;
  private pageBuilder: PageBuilder;
  private elements: { [key: string]: HTMLElement | null };
  private isComposing: boolean;

  constructor(appController: AppController, rootElement: HTMLElement) {
    console.log('OneStepUI: Constructor started.');
    console.log('OneStepUI: Environment check - window:', typeof window);
    console.log('OneStepUI: Environment check - document:', typeof document);
    console.log('OneStepUI: Environment check - rootElement:', rootElement);

    // 显式初始化实例变量，避免使用类字段初始化语法
    this.elements = {};
    this.isComposing = false;

    this.app = appController;
    this.root = rootElement;
    this.pageBuilder = new PageBuilder(this.app);
    console.log('OneStepUI: Caching DOM elements.');
    this.cacheDOMElements();
    console.log('OneStepUI: Binding event listeners.');
    this.bindEventListeners();
    console.log('OneStepUI: Subscribing to state changes.');
    this.app.subscribe(this.render);
    console.log('OneStepUI: Performing initial render.');
    this.render(this.app.getState());
    console.log('OneStepUI: Constructor finished.');
  }

  private cacheDOMElements(): void {
    this.elements.mainNav = this.root.querySelector('#main-nav');
    this.elements.pageActionsToolbar = this.root.querySelector('#page-actions-toolbar');
    this.elements.pageContent = this.root.querySelector('#page-content');
    this.elements.pageControls = this.root.querySelector('#page-controls');
    // Cache the new buttons
    this.elements.saveToLorebookBtn = this.root.querySelector('#save-to-lorebook-btn');
    this.elements.loadFromLorebookBtn = this.root.querySelector('#load-from-lorebook-btn');
  }

  private bindEventListeners(): void {
    // Bind new global action buttons
    this.elements.saveToLorebookBtn?.addEventListener('click', () => {
      this.app.saveStateToLorebook();
    });

    this.elements.loadFromLorebookBtn?.addEventListener('click', () => {
      this.app.loadStateFromLorebook();
    });

    this.root.addEventListener('click', e => {
      const target = e.target as HTMLElement;

      const collapseFooterBtn = target.closest('.card-collapse-footer-btn') as HTMLElement | null;
      if (collapseFooterBtn) {
        const card = collapseFooterBtn.closest('.worldview-card, .specific-item-card');
        if (card) {
          // Find the header collapse button and trigger a click on it.
          // This is more robust than re-implementing the collapse logic.
          const headerCollapseBtn = card.querySelector('.card-expand-btn, .collapse-btn') as HTMLElement | null;
          if (headerCollapseBtn) {
            headerCollapseBtn.click();
          }
        }
        return;
      }

      const navButton = target.closest('.nav-btn') as HTMLElement | null;
      if (navButton) {
        this.app.nav.navigateTo(navButton.dataset.page as PageType);
        return;
      }

      const pointBtn = target.closest('.point-btn') as HTMLElement | null;
      if (pointBtn) {
        const { page, field, category, amount, maxPoints } = pointBtn.dataset;
        this.app.updatePoints(page as PageType, field!, category!, parseInt(amount!), parseInt(maxPoints || '10', 10));
        return;
      }

      const tagPrefBtn = target.closest('.tag-pref-btn') as HTMLElement | null;
      if (tagPrefBtn) {
        const { page, field, tag, preference } = tagPrefBtn.dataset;
        this.app.updateTagPreference(page as PageType, field!, tag!, preference as 'like' | 'dislike' | 'neutral');
        return;
      }

      // --- Worldview Specific Item Actions ---
      const worldviewItemCard = target.closest('.specific-item-card');
      if (worldviewItemCard && !worldviewItemCard.classList.contains('key-character-card')) {
        const list = worldviewItemCard.parentElement;
        if (list) {
          const index = Array.from(list.children).indexOf(worldviewItemCard);
          const moduleId = (list.closest('.worldview-card') as HTMLElement)?.dataset.moduleId;

          if (index > -1 && moduleId) {
            const controlBtn = target.closest('.card-control-btn');
            if (controlBtn) {
              if (controlBtn.classList.contains('collapse-btn')) {
                this.app.toggleWorldviewItemCollapse(moduleId, index);
                return;
              }
              if (controlBtn.classList.contains('delete-btn')) {
                this.app.deleteWorldviewSpecificItem(moduleId, index);
                return;
              }
            }
          }
        }
      }

      // --- Aesthetics DPA (Dynamic Points Allocator) Actions ---
      const addAestheticsBtn = target.closest('[data-action="add-aesthetics-item"]') as HTMLElement | null;
      if (addAestheticsBtn) {
        const group = addAestheticsBtn.closest('.dpa-group');
        if (!group) return;

        const parentSelect = group.querySelector('select:nth-of-type(1)') as HTMLSelectElement;
        const childSelect = group.querySelector('select:nth-of-type(2)') as HTMLSelectElement;

        let itemToAdd: { id: string; label: string; description: string; source: 'culture' | 'filter' } | null = null;

        // Prefer child selection if available
        if (childSelect && childSelect.value) {
          const selectedOption = childSelect.options[childSelect.selectedIndex];
          itemToAdd = {
            id: selectedOption.value,
            label: selectedOption.text,
            description: selectedOption.dataset.description || '',
            source: addAestheticsBtn.dataset.source as 'culture' | 'filter',
          };
        } else if (parentSelect && parentSelect.value) {
          // Fallback to parent selection
          const selectedOption = parentSelect.options[parentSelect.selectedIndex];
          const parentData = (
            addAestheticsBtn.dataset.source === 'culture' ? CULTURAL_ARCHETYPE_HIERARCHY : AESTHETIC_FILTER_HIERARCHY
          ).find(p => p.id === selectedOption.value);
          itemToAdd = {
            id: selectedOption.value,
            label: selectedOption.text,
            description: parentData?.description || '',
            source: addAestheticsBtn.dataset.source as 'culture' | 'filter',
          };
        }

        if (itemToAdd) {
          this.app.addAestheticsItem(itemToAdd);
        }
        return;
      }

      const removeAestheticsBtn = target.closest('[data-action="remove-aesthetics-item"]') as HTMLElement | null;
      if (removeAestheticsBtn) {
        const itemId = removeAestheticsBtn.dataset.itemId;
        if (itemId) {
          this.app.removeAestheticsItem(itemId);
        }
        return;
      }

      const updateAestheticsPointsBtn = target.closest(
        '[data-action="update-aesthetics-points"]',
      ) as HTMLElement | null;
      if (updateAestheticsPointsBtn) {
        const { itemId, amount } = updateAestheticsPointsBtn.dataset;
        if (itemId && amount) {
          this.app.updateAestheticsItemPoints(itemId, parseInt(amount, 10));
        }
        return;
      }

      // --- Custom Dropdown Logic ---
      const dropdownHeader = target.closest('.custom-dropdown__selected');
      if (dropdownHeader) {
        this.toggleDropdown(dropdownHeader.closest('.custom-dropdown'));
        return;
      }

      const dropdownOption = target.closest('.custom-dropdown__option');
      if (dropdownOption) {
        const parentDropdown = dropdownOption.closest('.custom-dropdown') as HTMLElement;
        const { page, field } = parentDropdown.dataset;
        const value = (dropdownOption as HTMLElement).dataset.value;
        this.app.updateFormData(page as PageType, field!, value!);
        // Re-render will close the dropdown.
        return;
      }

      // --- Nested List Editor Actions ---
      const addListItemBtn = target.closest('[data-action="add-list-item"]') as HTMLElement | null;
      if (addListItemBtn) {
        const { page, field } = addListItemBtn.dataset;
        this.app.addListItem(page as PageType, field!);
        return;
      }

      const deleteListItemBtn = target.closest('[data-action="delete-list-item"]') as HTMLElement | null;
      if (deleteListItemBtn) {
        const { page, field, index } = deleteListItemBtn.dataset;
        this.app.deleteListItem(page as PageType, field!, parseInt(index!, 10));
        return;
      }

      // --- Key Character Card Controls ---
      const keyCharControlBtn = target.closest('.key-character-card .card-control-btn');
      if (keyCharControlBtn) {
        const card = keyCharControlBtn.closest('.key-character-card');
        const list = card?.parentElement;
        if (card && list) {
          const index = Array.from(list.children).indexOf(card);
          if (index > -1) {
            if (keyCharControlBtn.classList.contains('lock-btn')) this.app.toggleKeyCharacterLock(index);
            else if (keyCharControlBtn.classList.contains('collapse-btn')) this.app.toggleKeyCharacterCollapse(index);
            else if (keyCharControlBtn.classList.contains('random-btn')) this.app.randomizeSingleKeyCharacter(index);
            else if (keyCharControlBtn.classList.contains('delete-btn'))
              this.app.deleteListItem('character', 'key_characters.list', index);
            return;
          }
        }
      }

      // --- Linear Arc Card Controls ---
      const linearArcControlBtn = target.closest('.linear-arc-card .card-control-btn');
      if (linearArcControlBtn) {
        const card = linearArcControlBtn.closest('.linear-arc-card');
        const list = card?.parentElement;
        if (card && list) {
          const index = Array.from(list.children).indexOf(card);
          if (index > -1) {
            if (linearArcControlBtn.classList.contains('lock-btn')) this.app.toggleLinearArcLock(index);
            else if (linearArcControlBtn.classList.contains('collapse-btn')) this.app.toggleLinearArcCollapse(index);
            else if (linearArcControlBtn.classList.contains('delete-btn'))
              this.app.deleteListItem('plot', 'narrative_driven.list', index);
            return;
          }
        }
      }

      // --- Sandbox Element Card Controls ---
      const sandboxElementControlBtn = target.closest('.sandbox-element-card .card-control-btn');
      if (sandboxElementControlBtn) {
        const card = sandboxElementControlBtn.closest('.sandbox-element-card');
        const list = card?.parentElement;
        if (card && list) {
          const index = Array.from(list.children).indexOf(card);
          if (index > -1) {
            if (sandboxElementControlBtn.classList.contains('lock-btn')) {
              this.app.toggleSandboxElementLock(index);
            } else if (sandboxElementControlBtn.classList.contains('collapse-btn')) {
              this.app.toggleSandboxElementCollapse(index);
            } else if (sandboxElementControlBtn.classList.contains('delete-btn')) {
              this.app.deleteListItem('plot', 'sandbox.elements', index);
            }
            return;
          }
        }
      }

      // --- Rules Page Card Controls ---
      const rulesItemCollapseBtn = target.closest('[data-action="toggle-rules-item"]');
      if (rulesItemCollapseBtn) {
        const { page, field, index } = (rulesItemCollapseBtn as HTMLElement).dataset;
        if (page && field && index) {
          this.app.toggleRulesItemCollapse(page as PageType, field, parseInt(index, 10));
        }
        return;
      }

      const numericStepBtn = target.closest('[data-action="numeric-step"]') as HTMLElement | null;
      if (numericStepBtn) {
        const { step } = numericStepBtn.dataset;
        const wrapper = numericStepBtn.closest('.numeric-stepper');
        const input = wrapper?.querySelector('input[type="number"]') as HTMLInputElement;

        if (input && step) {
          const { page, field } = input.dataset;
          if (page && field) {
            const currentValue = parseFloat(input.value) || 0;
            const newValue = currentValue + parseInt(step, 10);
            this.app.updateFormData(page as PageType, field, newValue);
          }
        }
        return;
      }

      // --- Style Page: Dynamic Rules ---
      const styleSceneActionBtn = target.closest(
        '[data-action="add-style-scene"], [data-action="delete-style-scene"], [data-action="toggle-style-scene"]',
      );
      if (styleSceneActionBtn) {
        const { action, index } = (styleSceneActionBtn as HTMLElement).dataset;
        if (action === 'add-style-scene') {
          this.app.addStyleScene();
        } else if (index) {
          const idx = parseInt(index, 10);
          if (action === 'delete-style-scene') {
            this.app.deleteStyleScene(idx);
          } else if (action === 'toggle-style-scene') {
            // This requires a new method in AppController to toggle collapse state
            // For now, we can add it to the update method
            const item = this.app.getState().formData.style.dynamic_rules.list[idx];
            if (item) {
              this.app.updateStyleScene(idx, 'isCollapsed', !item.isCollapsed);
            }
          }
        }
        return;
      }
    });

    // Add a new listener for clicks outside to close dropdowns
    document.addEventListener('click', e => {
      const openDropdown = this.root.querySelector('.custom-dropdown.open');
      // If there is an open dropdown and the click was outside of it
      if (openDropdown && !openDropdown.contains(e.target as Node)) {
        openDropdown.classList.remove('open');
      }
    });

    this.root.addEventListener('compositionstart', e => {
      if ((e.target as HTMLElement).matches('.custom-text-input')) {
        this.isComposing = true;
      }
    });

    this.root.addEventListener('compositionend', e => {
      if (e.target && (e.target as HTMLElement).matches('.custom-text-input')) {
        this.isComposing = false;
        // Manually trigger input event for browsers that might not fire it after compositionend
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    this.root.addEventListener('input', e => {
      if (this.isComposing) return;

      const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

      // Handle Checkboxes for boolean values - MOVED to 'change' event listener

      // --- Restored Robust Input Handling ---
      // This approach is more robust for complex nested components. It reconstructs the
      // entire object from the DOM on any change within it, ensuring atomicity.

      // Generic handler for all other inputs
      if (target.matches('.custom-text-input, .numeric-stepper input')) {
        const { page, field } = target.dataset;
        if (page && field) {
          // --- Style Page: Dynamic Rules ---
          const dynamicRuleCard = target.closest('.dynamic-rule-card');
          if (page === 'style' && dynamicRuleCard && field.startsWith('dynamic_rules.list')) {
            const parts = field.split('.');
            const index = parseInt(parts[2], 10);
            const property = parts[3];
            let value: string | number = target.value;
            this.app.updateStyleScene(index, property, value);
          } else {
            let value: string | number = target.value;
            if (target.type === 'number') {
              value = target.value === '' ? 0 : parseFloat(target.value) || 0;
            }
            this.app.updateFormData(page as PageType, field, value);
          }

          // Auto-resize textarea
          if (target.tagName === 'TEXTAREA') {
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }
        }
      }
    });

    this.root.addEventListener('change', e => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;

      // Handle Checkboxes for boolean values
      if (target.type === 'checkbox') {
        const { page, field } = target.dataset;
        if (page && field) {
          this.app.updateFormData(page as PageType, field, (target as HTMLInputElement).checked);
        }
        return; // Stop further processing for checkboxes
      }

      // --- Unified handler for any change within a Condition Builder ---
      // This now handles both the operator dropdown and the numeric inputs.
      // The state is updated only when the change is committed (e.g., on blur).
      const conditionBuilder = target.closest('.condition-builder');
      if (conditionBuilder) {
        const { page, field } = (conditionBuilder as HTMLElement).dataset;
        if (page && field) {
          const operatorSelect = conditionBuilder.querySelector('.condition-operator-select') as HTMLSelectElement;
          const operator = operatorSelect.value as ConditionOperator;

          const newCondition: Partial<ThresholdCondition> = { operator };
          const isRange = operator.includes('between');

          if (isRange) {
            const minInput = conditionBuilder.querySelector('[data-sub-field="min"]') as HTMLInputElement;
            const maxInput = conditionBuilder.querySelector('[data-sub-field="max"]') as HTMLInputElement;
            newCondition.min = parseFloat(minInput.value) || 0;
            newCondition.max = parseFloat(maxInput.value) || 0;
          } else {
            const valueInput = conditionBuilder.querySelector('[data-sub-field="value"]') as HTMLInputElement;
            newCondition.value = parseFloat(valueInput.value) || 0;
          }
          this.app.updateFormData(page as PageType, field, newCondition);
        }
        return; // Stop further processing
      }

      // The DPA component is no longer used in the new worldview page,
      // so the handler is removed. It can be restored if DPA is used elsewhere.

      // BUGFIX: Add a generic handler for select elements that are not part of another component.
      if (target.tagName === 'SELECT') {
        const { page, field } = target.dataset;
        if (page && field) {
          // --- Style Page: Dynamic Rules ---
          const dynamicRuleCard = target.closest('.dynamic-rule-card');
          if (page === 'style' && dynamicRuleCard && field.startsWith('dynamic_rules.list')) {
            const parts = field.split('.');
            const index = parseInt(parts[2], 10);
            const property = parts[3];
            this.app.updateStyleScene(index, property, target.value);
          } else {
            this.app.updateFormData(page as PageType, field, target.value);
          }
        }
        return;
      }
    });
  }

  private toggleDropdown(dropdown: Element | null) {
    if (!dropdown) return;

    const currentlyOpen = this.root.querySelector('.custom-dropdown.open');
    // If another dropdown is open, close it first.
    if (currentlyOpen && currentlyOpen !== dropdown) {
      currentlyOpen.classList.remove('open');
    }
    // Toggle the clicked one
    dropdown.classList.toggle('open');
  }

  // This handler is no longer needed as the DPA component is not used in the new worldview page.

  private render = (state: AppState): void => {
    // --- Preserve Focus & Scroll State ---
    const activeElement = document.activeElement as HTMLElement;
    const activeElementId = activeElement ? activeElement.id : null;
    const scrollPosition = this.elements.pageContent?.scrollTop;
    let selectionStart: number | null = null;
    let selectionEnd: number | null = null;
    if (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement) {
      selectionStart = activeElement.selectionStart;
      selectionEnd = activeElement.selectionEnd;
    }

    const restoreFocusAndScroll = () => {
      if (this.elements.pageContent && scrollPosition !== undefined) {
        this.elements.pageContent.scrollTop = scrollPosition;
      }
      if (activeElementId) {
        const newElementToFocus = document.getElementById(activeElementId);
        if (newElementToFocus) {
          newElementToFocus.focus();
          if (
            (newElementToFocus instanceof HTMLTextAreaElement || newElementToFocus instanceof HTMLInputElement) &&
            selectionStart !== null &&
            selectionEnd !== null
          ) {
            newElementToFocus.setSelectionRange(selectionStart, selectionEnd);
          }
        }
      }
    };

    // --- NEW ASYNC RENDER LOGIC ---
    const isInitialRender = !this.elements.pageContent?.hasChildNodes();

    // 1. Always render the lightweight shell immediately
    this.renderNavigation(state);
    this.renderPageActions(state);
    this.renderFooter(state);

    const contentContainer = this.elements.pageContent;
    if (!contentContainer) {
      console.error('OneStepUI Error: Page content container "#page-content" not found.');
      return;
    }

    if (isInitialRender) {
      // 2. On first load, show a loading message...
      contentContainer.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; min-height: 400px; font-size: 18px; color: #30626c;">正在构建页面...</div>`;

      // 3. ...and defer the heavy content rendering to the next event loop
      setTimeout(() => {
        console.log('--- DEBUG: ASYNC RenderPageContent Start ---');
        this.renderPageContent(state);
        restoreFocusAndScroll(); // Restore focus after async render
        console.log('--- DEBUG: ASYNC RenderPageContent End ---');
      }, 0);
    } else {
      // 4. For subsequent updates, render synchronously as before
      this.renderPageContent(state);
      restoreFocusAndScroll(); // Restore focus after sync render
    }
  };

  private renderNavigation(state: AppState): void {
    const navContainer = this.elements.mainNav;
    if (!navContainer) {
      console.error('OneStepUI Error: Navigation container "#main-nav" not found.');
      return;
    }
    navContainer.innerHTML = '';
    const pageOrder = this.app.nav.getPageOrder();
    console.log(
      'OneStepUI: Rendering navigation. Page order:',
      pageOrder,
      'Current page:',
      state.navigation.currentPage,
    );
    pageOrder.forEach(page => {
      const button = document.createElement('button');
      button.className = 'nav-btn';
      button.textContent = PAGE_METADATA[page].title;
      button.dataset.page = page;
      if (page === state.navigation.currentPage) button.classList.add('active');
      navContainer.appendChild(button);
    });
  }

  private renderFooter(state: AppState): void {
    const controlsContainer = this.elements.pageControls;
    if (!controlsContainer) return;
    controlsContainer.innerHTML = '';
    const { canNavigateBack, canNavigateForward } = state.navigation;
    const isLastPage =
      this.app.nav.getPageOrder().indexOf(state.navigation.currentPage) === this.app.nav.getPageOrder().length - 1;
    controlsContainer.appendChild(
      componentFactory.button({
        label: '上一页',
        style: 'secondary',
        onClick: () => this.app.nav.navigatePrevious(),
        disabled: !canNavigateBack,
      }),
    );
    if (isLastPage) {
      controlsContainer.appendChild(
        componentFactory.button({
          label: '修改/补全',
          style: 'accent-secondary',
          onClick: () => this.app.sendReviewableCharacterCard(),
          disabled: !state.computed.canGenerate,
        }),
      );
      controlsContainer.appendChild(
        componentFactory.button({
          label: '生成角色卡',
          style: 'primary',
          onClick: () => this.app.sendCharacterCard(),
          disabled: !state.computed.canGenerate,
        }),
      );
    } else {
      controlsContainer.appendChild(
        componentFactory.button({
          label: '下一页',
          style: 'primary',
          onClick: () => this.app.nav.navigateNext(),
          disabled: !canNavigateForward,
        }),
      );
    }
  }

  private renderPageContent(state: AppState): void {
    const contentContainer = this.elements.pageContent;
    if (!contentContainer) {
      console.error('OneStepUI Error: Page content container "#page-content" not found.');
      return;
    }
    console.log(
      'OneStepUI: Rendering page content for:',
      state.navigation.currentPage,
      'with data:',
      state.formData[state.navigation.currentPage],
    );
    contentContainer.innerHTML = '';
    contentContainer.appendChild(
      this.pageBuilder.buildPage(state.navigation.currentPage, state.formData[state.navigation.currentPage]),
    );

    // Ensure textareas are resized after render to fit their content
    const textareas = contentContainer.querySelectorAll<HTMLTextAreaElement>('textarea.custom-text-input');
    textareas.forEach(textarea => {
      // Temporarily reset height to calculate the actual scrollHeight
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }

  private renderPageActions(state: AppState): void {
    const toolbar = this.elements.pageActionsToolbar;
    if (!toolbar) return;

    toolbar.innerHTML = ''; // Clear previous buttons
    const currentPage = state.navigation.currentPage;
    const currentPageTitle = PAGE_METADATA[currentPage].title;
    const isDisabled = state.formData[currentPage].disabled;

    // Apply the correct styles as per the final agreed plan
    // Special handling for the 'rules' page
    if (currentPage === 'rules') {
      toolbar.appendChild(
        componentFactory.button({
          label: `随机生成 ${currentPageTitle}`,
          style: 'accent',
          onClick: () => {}, // No-op
          disabled: true, // Always disabled for rules page
        }),
      );
    } else {
      toolbar.appendChild(
        componentFactory.button({
          label: `随机生成 ${currentPageTitle}`,
          style: 'accent', // Accent button: Gold
          onClick: () => this.app.randomizeCurrentPage(),
          disabled: isDisabled,
        }),
      );
    }

    toolbar.appendChild(
      componentFactory.button({
        label: `恢复默认 ${currentPageTitle}`,
        style: 'secondary', // Secondary button: White bg, blueish text/border
        onClick: () => this.app.resetCurrentPageToDefaults(),
        // The reset button should be enabled even if the module is disabled,
        // to allow resetting to a non-disabled default state.
        disabled: false,
      }),
    );

    toolbar.appendChild(
      componentFactory.button({
        label: isDisabled ? `需要生成 ${currentPageTitle}` : `无需生成 ${currentPageTitle}`,
        style: 'secondary', // Secondary button: White bg, blueish text/border
        onClick: () => this.app.togglePageModule(currentPage),
      }),
    );
  }
}

// --- ENTRY POINT ---
// In dynamic environments like TavernAI, we can't rely on DOMContentLoaded.
// We use a MutationObserver to reliably detect when our root element is added to the DOM.
function initializeWhenReady() {
  console.log('OneStepUI: initializeWhenReady() called');
  console.log('OneStepUI: document.readyState:', document.readyState);
  console.log('OneStepUI: document.body:', document.body);

  const init = (rootElement: HTMLElement) => {
    console.log('OneStepUI: Root container "#onestep-container" found. Initializing...');
    try {
      const appController = new AppController();
      new OneStepUI(appController, rootElement);
      console.log('OneStepUI: Initialization completed successfully');
    } catch (error) {
      console.error('OneStepUI: ERROR during initialization:', error);
      console.error('OneStepUI: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
  };

  try {
    // First, check if the element already exists
    const existingRoot = document.querySelector<HTMLElement>('#onestep-container');
    console.log('OneStepUI: Checking for existing root element...', existingRoot);

    if (existingRoot) {
      init(existingRoot);
      return;
    }

    console.log('OneStepUI: Root element not found, setting up MutationObserver...');
    // If not, observe the body for changes
    const observer = new MutationObserver((mutations, obs) => {
      const rootElement = document.querySelector<HTMLElement>('#onestep-container');
      if (rootElement) {
        console.log('OneStepUI: Root element detected by MutationObserver');
        obs.disconnect(); // Stop observing once found
        init(rootElement);
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      console.log('OneStepUI: MutationObserver started');
    } else {
      console.error('OneStepUI: ERROR - document.body is null, waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', () => {
        console.log('OneStepUI: DOMContentLoaded fired, retrying initialization');
        initializeWhenReady();
      });
    }
  } catch (error) {
    console.error('OneStepUI: ERROR in initializeWhenReady:', error);
    console.error('OneStepUI: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
  }
}

// 添加全局错误捕获
window.addEventListener('error', event => {
  if (event.filename && event.filename.includes('OneStep')) {
    console.error('OneStepUI: Global error caught:', event.message);
    console.error('OneStepUI: Error location:', `${event.filename}:${event.lineno}:${event.colno}`);
    console.error('OneStepUI: Error object:', event.error);
  }
});

// 添加兼容性测试
console.log('OneStepUI: Environment compatibility test:');
console.log('- typeof class:', typeof class {});
console.log('- Array.from support:', typeof Array.from);
console.log('- Object.assign support:', typeof Object.assign);
console.log('- Promise support:', typeof Promise);

try {
  console.log('OneStepUI: Starting initialization...');
  initializeWhenReady();
} catch (error) {
  console.error('OneStepUI: ERROR at top level:', error);
}
