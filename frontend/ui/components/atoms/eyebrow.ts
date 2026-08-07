import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StyleController } from '../particles/styleController.js';

export type EyebrowType = 'default' | 'cherry' | 'sparkly';

const ICONS: Record<EyebrowType | string, string> = {
    default: '',
    cherry: '🍒',
    sparkly: '✦',
};

@customElement('ui-eyebrow')
export class UiEyebrow extends LitElement {
    @property({ type: String }) type: EyebrowType = 'default';
    @property({ type: String }) icon = '';
    @property({ type: String }) text = '';

    private styles = new StyleController<string>(this, {
        base: ['inline-flex', 'items-center', 'rounded-full', 'px-3', 'py-1.5', 'text-[.7rem]', 'font-semibold', 'uppercase', 'tracking-widest'],
        presets: {
            default: 'bg-gray-100 text-gray-800',
            cherry: 'bg-cherry/20 text-cherry',
            sparkly: 'bg-purple-100 text-purple-800',
        },
        defaultPreset: 'default',
    });

    protected createRenderRoot() {
        return this;
    }

    render() {
        const activeIcon = this.icon || ICONS[this.type] || '';

        return html`
            ${activeIcon ? html`<span class="mr-2 select-none">${activeIcon}</span>` : ''}
            <span>${this.text}</span>
        `;
    }
}