import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type InputState = 'default' | 'valid' | 'invalid';

@customElement('ui-input')
export class UiInput extends LitElement {
    @property({ type: String }) type: string = 'text';
    @property({ type: String }) icon: string = '';
    @property({ type: String }) placeholder: string = '';
    @property({ type: String }) label: string = '';
    @property({ type: Boolean }) multiline = false;
    @property({ type: String }) value = '';
    @property({ type: String }) classes = '';
    @property({ type: Boolean }) textVisible = false;

    @property({ type: String }) state: InputState = 'default';

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

    private renderIcon() {
        if (!this.icon) {
            return nothing;
        }

        return html`
            <i class="text-muted ${this.icon}"></i>
        `;
    }

    private renderPasswordToggle() {
        if (this.type !== 'password') {
            return nothing;
        }

        return html`
            <i
                @click=${() => {
                    this.textVisible = !this.textVisible;
                }}
                class="icon-eye${this.textVisible ? '' : '-off'} text-muted cursor-pointer"
            ></i>
        `;
    }

    private getStateClasses() {
        switch (this.state) {
            case 'invalid':
                return `
                    !border-red-900
                    !shadow-[0_0_5px_3px]
                    !shadow-red-500/15
                `;

            case 'valid':
                return `
                    !border-green-900
                    !shadow-[0_0_5px_3px]
                    !shadow-green-500/15
                `;

            default:
                return '';
        }
    }

    private getWrapperClasses() {
        return `
            flex items-center
            px-4 py-2
            rounded-xl
            border border-cherry/10
            bg-white
            gap-2
            w-full
            relative

            focus-within:border-blue-900
            focus-within:shadow-[0_0_5px_3px]
            focus-within:shadow-blue-500/15

            focus-within:[&_i]:text-cherry

            transition-colors

            ${this.getStateClasses()}
        `;
    }

    private renderTextarea() {
        return html`
            <textarea
                rows="4"
                class="
                    px-4 py-2
                    rounded-xl
                    border border-cherry/10
                    bg-white
                    w-full
                    focus-within:border-blue-900
                    transition-colors
                    text-sm
                "
                placeholder=${this.placeholder}
                .value=${this.value}
                @input=${this.handleInput}
            ></textarea>
        `;
    }

    private renderInput() {
        return html`
            <div class="${this.getWrapperClasses()}">
                ${this.renderIcon()}

                <input
                    class="text-sm w-full"
                    type=${this.type === 'password' && this.textVisible
                        ? 'text'
                        : this.type}
                    placeholder=${this.placeholder}
                    .value=${this.value}
                    @input=${this.handleInput}
                />

                ${this.renderPasswordToggle()}
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
            <style>
                input[type="password"]::-ms-reveal,
                input[type="password"]::-ms-clear {
                    display: none !important;
                }

                input[type="password"]::-webkit-credentials-auto-fill-button {
                    display: none !important;
                }
            </style>

            <div class="${this.classes}">
                ${this.renderLabel()}

                ${this.multiline
                    ? this.renderTextarea()
                    : this.renderInput()}
            </div>
        `;
    }
}