import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-toggler')
export class UiToggler extends LitElement {
    @property({ type: Boolean }) active = false;

    protected createRenderRoot() {
        return this;
    }

    private emitEvent(){
        this.dispatchEvent(new CustomEvent('toggler-change', {
            detail: { 
                state: this.active,
                element: this, 
            },
            bubbles: true,
            composed: true,
        }));
    }

    toggle(){
        this.active = !this.active;

        this.emitEvent();
    }

    get bgColor(): string{
        return this.active ? "bg-green-800" : "bg-gray-500";
    }

    get leftDistance(): string{
        return this.active ? 'left-[calc(100%-20px-3px)]' : 'left-[3px]'
    }

    render() {
        return html`
            <div
                @click=${this.toggle}
                class="w-[40px] h-[26px] p-[3px] ${this.bgColor} rounded-full relative cursor-pointer transition-colors"
            >
                <div class="h-[20px] aspect-square bg-white rounded-full absolute transition-all ${this.leftDistance}"></div>
            </div>
        `;
    }
}