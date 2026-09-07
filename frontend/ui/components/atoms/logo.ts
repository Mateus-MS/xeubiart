import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LightDomMixin } from '../particles/LightDomMixin';

@customElement('ui-logo')
export class UiLogo extends LightDomMixin(LitElement) {
    @property({ type: String }) classes = '';
    
    protected createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <a class="${this.classes} font-brand" href="/">Xeubiart</a>
        `;
    }
}