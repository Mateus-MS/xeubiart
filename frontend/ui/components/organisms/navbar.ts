import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('ui-navbar')
export class UiNavbar extends LitElement {
    protected createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div 
                class="h-(--spacing-header) lg:px-14 px-8 py-4 flex lg:flex-row flex-row-reverse justify-between border-b-1 border-cherry/30 bg-cream/85 relative sticky top-0 z-200 backdrop-blur-md"
                x-data="{
                    selectedText: 'PT',
                    selectedFlag: '/static/svg/flags/br.svg',
                }"
            >
                <a class="font-brand text-3xl text-cherry lg:absolute lg:left-1/2 lg:-translate-1/2 lg:top-1/2 lg:-transate-1/2" href="/">Xeubiart</a>

                <div class="hidden lg:flex"></div>
            </div>
        `;
    }
}