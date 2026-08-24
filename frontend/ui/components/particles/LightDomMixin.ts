import { LitElement, html, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

type Constructor<T = {}> = new (...args: any[]) => T;

export interface LightDomInterface {
    slottedChildren: Node[];
    renderSlottedChildren(): TemplateResult;
}

export const LightDomMixin = <T extends Constructor<LitElement>>(superClass: T) => {
    class MixinClass extends superClass {
        @state() slottedChildren: Node[] = [];

        protected createRenderRoot() {
            return this;
        }

        connectedCallback() {
            if (this.slottedChildren.length === 0) {
                this.slottedChildren = Array.from(this.childNodes);
                this.replaceChildren();
            }
            super.connectedCallback();
        }

        renderSlottedChildren(): TemplateResult {
            return this.slottedChildren.length > 0 
                ? html`${this.slottedChildren}` 
                : html``;
        }
    }
    
    return MixinClass as unknown as T & Constructor<LightDomInterface>;
};