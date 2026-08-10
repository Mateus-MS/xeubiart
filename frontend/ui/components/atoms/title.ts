import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';

@customElement('ui-title')
export class UiTitle extends LitElement {
    @property({ type: String }) 
    level: string = 'h1';

    @property({ type: String }) 
    text: string = '';

    @property({ type: String }) 
    contrast: string = '';


    protected createRenderRoot() {
        return this;
    }

    render() {
        const tag = unsafeStatic(this.level);

        return html`
            <${tag} class="text-4xl font-contrast [&_em]:text-cherry">
                ${this.text} <em>${this.contrast}</em>
            </${tag}>
        `;
    }
}