import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleController } from '../particles/styleController.js';
import { LightDomMixin } from '../particles/LightDomMixin.js';

export type ButtonType = 'heavy' | 'light';

@customElement('ui-button')
export class UiButton extends LightDomMixin(LitElement) {
    @property({ type: String }) type: ButtonType = 'heavy';
    @property({ type: Boolean }) disabled: boolean = false;

    private styles = new StyleController<string>(this, {
        base: [
            'flex font-contrast items-center gap-2', 
            'rounded-full', 'px-7', 'py-2', 'text-nowrap', 
            'hover:-translate-y-0.5', 'cursor-pointer', 'transition-all',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none'
        ],
        presets: {
            heavy: 'bg-cherry text-white hover:bg-cherry-dark shadow-[0_10px_28px_rgba(139,26,43,0.45)]',
            light: 'bg-white text-primary border-1 border-cherry/15',
        },
        defaultPreset: 'heavy',
    });

    render() {
        return html`
            <button class="flex items-center gap-2">
                ${this.slottedChildren.length > 0 
                    ? this.renderSlottedChildren()
                    : ''}
            </button>
        `;
    }
}