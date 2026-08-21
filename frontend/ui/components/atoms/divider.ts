import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('ui-divider')
export class UiDivider extends LitElement {
    protected createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div class='
                flex gap-4 w-full items-center
                before:bg-linear-to-r before:from-cherry before:to-cherry/0 before:w-full before:h-[1px]
                after:bg-linear-to-l after:from-cherry after:to-cherry/0 after:w-full after:h-[1px]
            '>🍒</div>
        `;
    }
}