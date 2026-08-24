import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StyleController } from '../particles/styleController';
import { LightDomMixin } from '../particles/LightDomMixin';

/**
 * Data structure used by the dropdown options.
 *
 * The dropdown doesn't care what the values represent.
 * The parent component is responsible for giving them meaning.
 *
 * Example:
 *
 * {
 *     value: 'fine-line',
 *     label: 'Fine Line'
 * }
 */
export interface UiDropdownOption {
    value: string;
    label: string;
}

@customElement('ui-dropdown')
export class UiDropdown extends LightDomMixin(LitElement) {

    // Text displayed above the dropdown.
    @property({ type: String })
    placeholder: string = '';

    // Optional label displayed above the dropdown.
    @property({ type: String })
    label: string = '';

    /**
     * Internal UI state.
     *
     * @state tells Lit this property affects rendering but isn't
     * intended to be controlled from outside the component.
     */
    @state()
    isOpen = false;

    /**
     * Options are passed as a JavaScript array rather than an HTML
     * attribute, hence `attribute: false`.
     *
     * Example:
     *
     * <ui-dropdown [options]="tattooStyles">
     */
    @property({ attribute: false })
    options: readonly UiDropdownOption[] = [];

    /**
     * Currently selected value.
     *
     * This is a public property because the parent component controls
     * it through Angular's [(value)] binding.
     */
    @property({ type: String })
    value = '';

    /**
     * We use Light DOM instead of Lit's default Shadow DOM so that
     * the component can use the application's global styles/Tailwind.
     */
    protected createRenderRoot() {
        return this;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    toggle() {
        this.isOpen = !this.isOpen;
    }

    /**
     * Gets the text that should be displayed in the dropdown trigger.
     *
     * `value` stores the actual value used by the application,
     * while the option's `label` is what the user sees.
     *
     * Example:
     *
     * value: "fine-line"
     * label: "Fine Line"
     */
    private get selectedText(): string {
        if (!this.value) {
            return this.placeholder;
        }

        const option = this.options.find(
            option => option.value === this.value
        );

        return option?.label || this.placeholder;
    }

    /**
     * Handles clicks on the options container.
     *
     * Instead of adding a click listener to every <li>, we listen
     * on the parent and use event delegation to find the clicked <li>.
     */
    private handleOptionClick = (event: Event) => {
        const target = event.target as HTMLElement;
        const li = target.closest('li');

        if (!li) return;

        this.value = li.dataset.value ?? '';
        this.close();

        /**
         * Notify the parent that the value changed.
         *
         * `detail` contains the actual selected value.
         *
         * `bubbles` and `composed` allow the event to travel outside
         * the Web Component, which is important when Angular is
         * listening for the event.
         */
        this.dispatchEvent(
            new CustomEvent('valueChange', {
                detail: this.value,
                bubbles: true,
                composed: true,
            })
        );
    };

    /**
     * Closes the dropdown when the user clicks somewhere outside it.
     *
     * This is implemented here instead of in Angular because the
     * dropdown should behave the same regardless of which framework
     * consumes the Web Component.
     */
    private handleDocumentClick = (event: MouseEvent) => {
        const target = event.target;

        if (!(target instanceof Node)) {
            return;
        }

        if (!this.contains(target)) {
            this.close();
        }
    };

    /**
     * Start listening for clicks outside the component when it enters
     * the DOM.
     */
    connectedCallback() {
        super.connectedCallback();

        document.addEventListener(
            'click',
            this.handleDocumentClick,
            true
        );
    }

    /**
     * Remove the document listener when the component leaves the DOM.
     *
     * This is important because we manually registered the listener
     * in connectedCallback().
     */
    disconnectedCallback() {
        document.removeEventListener(
            'click',
            this.handleDocumentClick,
            true
        );

        super.disconnectedCallback();
    }

    /**
     * Generates the <li> elements from the options provided by the
     * parent component.
     *
     * This keeps the dropdown generic — it doesn't need to know
     * anything about tattoo styles, statuses, categories, etc.
     */
    private renderDropdownOptions() {
        return this.options.map(option => html`
            <li data-value=${option.value}>
                ${option.label}
            </li>
        `);
    }

    render() {
        return html`

            ${this.label
                ? html`
                    <span class="block mb-1 text-sm">
                        ${this.label}
                    </span>
                `
                : ''}

            <div class="relative w-full">

                <!--
                    Trigger

                    Clicking the trigger toggles the dropdown.
                -->
                <div
                    @click=${this.toggle}
                    class="
                        flex items-center justify-between
                        px-4 py-2 rounded-xl
                        border border-cherry/10 bg-white
                        gap-2 w-full
                        cursor-pointer
                        transition-colors
                        text-sm
                    "
                >
                    <div class="text-nowrap">${this.selectedText}</div>

                    <i
                        class="
                            icon-arrow-down
                            transition-transform
                            ${this.isOpen ? 'rotate-180' : ''}
                        "
                    ></i>
                </div>

                <!--
                    Options

                    The options are generated from the 'options' property.
                    Their visibility is controlled by 'isOpen'.
                -->
                <div
                    @click=${this.handleOptionClick}
                    class="
                        ${this.isOpen
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'}

                        transition-opacity
                        duration-150
                        ease-out

                        list-none flex flex-col
                        p-2 rounded-xl
                        border border-cherry/10
                        bg-white gap-2 w-full

                        origin-top

                        absolute top-[calc(100%+10px)] left-0

                        [&>li:hover]:bg-cherry/5
                        [&>li:hover]:text-cherry
                        [&>li:hover]:cursor-pointer
                        [&>li]:p-3
                        [&>li]:rounded-lg
                        [&>li]:transition-colors
                    "
                >
                    ${this.renderDropdownOptions()}
                </div>

            </div>
        `;
    }
}