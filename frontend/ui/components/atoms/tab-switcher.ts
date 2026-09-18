import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state, query, queryAll } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

interface Tab {
    label: string;
    value: string;
}

@customElement('ui-tab-switcher')
export class UiTabSwitcher extends LitElement {
    @property({ type: Array })
    tabs: Tab[] = [];

    @state()
    activeTab: string = '';

    @query('.sliding-indicator')
    private indicator!: HTMLDivElement;

    @queryAll('label')
    private labels!: NodeListOf<HTMLLabelElement>;

    protected createRenderRoot() {
        return this;
    }

    protected updated(changedProperties: PropertyValues) {
        super.updated(changedProperties);
        this._updateIndicator();
    }

    private _updateIndicator() {
        if (!this.indicator) return;

        const selectedTab = this.activeTab || this.tabs[0]?.value || '';
        const activeLabelIndex = this.tabs.findIndex((t) => t.value === selectedTab);

        if (activeLabelIndex !== -1 && this.labels[activeLabelIndex]) {
            const activeEl = this.labels[activeLabelIndex];
            
            // activeEl.offsetLeft matches the label's distance from the parent container's left inner edge
            this.indicator.style.width = `${activeEl.offsetWidth}px`;
            this.indicator.style.transform = `translateX(${activeEl.offsetLeft}px)`;
        }
    }

    private _handleTabChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.activeTab = input.value;

        this.dispatchEvent(new CustomEvent('tab-change', {
            detail: {
                activeTab: this.activeTab
            },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        const selectedTab = this.activeTab || this.tabs[0]?.value || '';

        return html`
            <div class="relative isolate flex items-center bg-white ring-cherry/15 ring rounded-full p-1 w-fit">
                <!-- Safe Sliding Indicator with direct element reference class -->
                <div 
                    class="sliding-indicator absolute top-1 bottom-1 left-0 bg-cherry rounded-full transition-all duration-300 -z-10 shadow-[0_4px_16px_rgba(139,26,43,0.4)]"
                ></div>

                ${repeat(
                    this.tabs,
                    (tab) => tab.value,
                    (tab, index) => html`
                        <label 
                            class="cursor-pointer px-4 py-2 bg-transparent select-none text-sm font-medium transition-colors z-10
                                   ${selectedTab === tab.value ? 'text-white' : 'text-slate-600'}"
                        >
                            <input 
                                id="tab-${index}" 
                                type="radio"
                                name="opts"
                                .value="${tab.value}"
                                .checked="${selectedTab === tab.value}"
                                @change="${this._handleTabChange}"
                                hidden
                            >
                            <span>${tab.label}</span>
                        </label>
                    `
                )}
            </div>
        `;
    }
}