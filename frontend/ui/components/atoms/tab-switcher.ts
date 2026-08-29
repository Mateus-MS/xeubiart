import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

@customElement('ui-tab-switcher')
export class UiTabSwitcher extends LitElement {
    @property({ type: Array }) tabs: string[] = [];
    @state() activeTab: string = '';

    protected createRenderRoot() {
        return this;
    }

    private _handleTabChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.activeTab = input.value;

        this.dispatchEvent(new CustomEvent('tab-change', {
            detail: { activeTab: this.activeTab },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        const selectedTab = this.activeTab || this.tabs[0] || '';

        return html`
            <div class="relative isolate flex items-center bg-white ring-cherry/15 ring rounded-full p-1 w-fit">
                <div 
                    class="absolute bg-cherry rounded-full transition-all duration-300 -z-10 shadow-[0_4px_16px_rgba(139,26,43,0.4)]
                           [position-anchor:--active-tab] 
                           [top:anchor(top)] 
                           [bottom:anchor(bottom)] 
                           [left:anchor(left)] 
                           [right:anchor(right)]"
                ></div>

                ${repeat(
                    this.tabs,
                    (tab) => tab,
                    (tab, index) => html`
                        <label 
                            class="cursor-pointer px-4 py-2 bg-transparent select-none text-sm font-medium transition-colors
                                   has-[:checked]:[anchor-name:--active-tab] 
                                   has-[:checked]:text-white"
                        >
                            <input 
                                id="tab-${index}" 
                                type="radio"
                                name="opts"
                                value="${tab}"
                                .checked="${selectedTab === tab}"
                                @change="${this._handleTabChange}"
                                hidden
                            >
                            <span>${tab}</span>
                        </label>
                    `
                )}
            </div>
        `;
    }
}