import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleController } from '../particles/styleController.js';

export type ButtonType = 'heavy' | 'light';

@customElement('ui-button')
export class UiButton extends LitElement {
    @property({ type: String }) type: ButtonType = 'heavy';
    @property({ type: String }) text = '';

    private styles = new StyleController<string>(this, {
        base: ['flex font-contrast', 'rounded-full', 'px-7', 'py-2', 'text-nowrap', 'hover:-translate-y-0.5', 'cursor-pointer', 'transition-all'],
        presets: {
            heavy: 'bg-cherry text-white hover:bg-cherry-dark shadow-[0_10px_28px_rgba(139,26,43,0.45)]',
            light: 'bg-transparent text-primary',
        },
        defaultPreset: 'heavy',
    });

    protected createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <button>${this.text}</button>
        `;
    }
}