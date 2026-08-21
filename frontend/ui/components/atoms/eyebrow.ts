import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StyleController } from '../particles/styleController.js';
import { LightDomMixin } from '../particles/LightDomMixin.js';

export type EyebrowType = 'default' | 'cherry' | 'sparkly';

const ICONS: Record<EyebrowType | string, string> = {
    default: '',
    cherry: '🍒',
    sparkly: '✦',
};

@customElement('ui-eyebrow')
export class UiEyebrow extends LightDomMixin(LitElement) {
    @property({ type: String }) type: EyebrowType = 'default';
    @property({ type: String }) icon = '';

    private styles = new StyleController<string>(this, {
        base: ['w-fit', 'inline-flex', 'items-center', 'rounded-full', 'px-3', 'py-1.5', 'text-[.7rem]', 'font-semibold', 'uppercase', 'tracking-widest'],
        presets: {
            default: 'bg-gray-100 text-gray-800',
            cherry: 'bg-cherry/20 text-cherry',
            sparkly: 'bg-cherry/20 text-cherry',
        },
        defaultPreset: 'default',
    });

    render() {
        const activeIcon = this.icon || ICONS[this.type] || '';

        return html`
            ${activeIcon ? html`<span class="mr-2 select-none">${activeIcon}</span>` : ''}
            ${this.slottedChildren.length > 0 
                ? this.renderSlottedChildren()
                : ''}
        `;
    }
}