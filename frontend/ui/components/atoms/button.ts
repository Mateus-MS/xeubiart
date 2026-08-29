import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleController } from '../particles/styleController.js';
import { LightDomMixin } from '../particles/LightDomMixin.js';

export type ButtonType = 'heavy' | 'light';

@customElement('ui-button')
export class UiButton extends LightDomMixin(LitElement) {
    @property({ type: String }) type: ButtonType = 'heavy';
    @property({ type: Boolean }) disabled = false;
    @property({ type: String }) goTo?: string;
    @property({ type: String }) classes = '';

    private styles = new StyleController<string>(this, {
        base: [
            'flex', 'font-contrast', 'items-center', 'gap-2', 'rounded-full', 'px-7', 'py-2', 'text-nowrap', 'cursor-pointer', 'transition-all',
        ],
        presets: {
            heavy: 'bg-cherry text-white hover:bg-cherry-dark shadow-[0_10px_28px_rgba(139,26,43,0.45)]',
            light: 'bg-white text-primary border-1 border-cherry/15',
            thin: 'bg-transparent text-primary border-1 border-cherry/15 border-white text-white',
        },
        defaultPreset: 'heavy',
    });

    private handleGoTo(){
        if (this.disabled) {
            return;
        }

        if (this.goTo) {
            window.location.href = this.goTo;
        }
    }

    render() {
        return html`
            <button 
                @click="${this.handleGoTo}"
                class="${this.styles.classes} ${this.classes} cursor-pointer flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none transition-all" .disabled=${this.disabled}>
                ${this.slottedChildren.length > 0 
                    ? this.renderSlottedChildren()
                    : ''}
            </button>
        `;
    }
}