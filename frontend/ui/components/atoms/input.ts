import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('ui-input')
export class UiInput extends LitElement {
    @property({ type: String }) type: string = 'text';
    @property({ type: String }) icon: string = '';
    @property({ type: String }) placeholder: string = '';
    @property({ type: String }) label: string = '';
    @property({ type: Boolean }) multiline = false;
    @property({ type: String }) value = '';

    protected createRenderRoot() {
        return this;
    }

    private renderLabel() {
        if (!this.label) {
            return nothing;
        }

        return html`
            <span class="block mb-1 text-sm">
                ${this.label}
            </span>
        `;
    }

    private renderIcon(){
        if (!this.icon) {
            return nothing;
        }

        return html`
            <i class="text-muted ${this.icon}"></i>
        `;
    }

    private renderTextarea(){
        return html`
            <textarea
                rows="4"
                class="px-4 py-2 rounded-xl border border-cherry/10 bg-white w-full focus-within:border-blue-900 transition-colors text-sm"
                placeholder=${this.placeholder}
                .value=${this.value}
                @input=${this.handleInput}
            ></textarea>
        `;
    }

    private renderInput() {
        return html`
            <div class="flex items-center px-4 py-2 rounded-xl border border-cherry/10 bg-white gap-2 w-full focus-within:border-blue-900 focus-within:[&_i]:text-cherry focus-within:shadow-blue-500/15 focus-within:shadow-[0_0_5px_3px] transition-colors">
                ${this.renderIcon()}

                <input
                    class="text-sm w-full"
                    type=${this.type}
                    placeholder=${this.placeholder}
                    .value=${this.value}
                    @input=${this.handleInput}
                />
            </div>
        `;
    }

    private handleInput(event: Event) {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;

        this.value = target.value;

        this.dispatchEvent(
            new CustomEvent('valueChange', {
                detail: this.value,
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        return html`
            ${this.renderLabel()}
            ${this.multiline
                ? this.renderTextarea()
                : this.renderInput()}
        `;
    }
}