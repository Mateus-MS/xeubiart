import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { LightDomMixin } from '../particles/LightDomMixin';

@customElement('ui-title')
export class UiTitle extends LightDomMixin(LitElement) {
    @property({ type: String }) 
    level: string = 'h1';

    render() {
        const tag = unsafeStatic(this.level);

        return html`
            <${tag} class="text-4xl font-contrast [&_em]:text-cherry">
                ${this.renderSlottedChildren()}
            </${tag}>
        `;
    }
}