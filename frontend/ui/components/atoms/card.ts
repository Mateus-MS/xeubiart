import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { StyleController } from '../particles/styleController.js';
import { LightDomMixin } from '../particles/LightDomMixin.js';

export type CardType = 'white';

@customElement('ui-card')
export class UiCard extends LightDomMixin(LitElement) {
    @property({ type: String }) type: CardType = 'white';

    private styles = new StyleController<string>(this, {
        base: ['block', 'w-full', 'shadow-[0_1px_5px_rgba(139,26,43,0.4)]', 'rounded-2xl', 'border', 'border-cherry/10'],
        presets: {
            white: 'bg-white',
        },
        defaultPreset: 'white',
    });

    render() {
        return html`
            ${this.slottedChildren.length > 0 
                ? this.renderSlottedChildren()
                : ''}
        `;
    }
}