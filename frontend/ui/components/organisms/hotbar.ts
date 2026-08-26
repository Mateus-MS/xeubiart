import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface HotBarItem {
  icon: string;
  label: string;
  href?: string;
}

@customElement('ui-hotbar')
export class UiHotbar extends LitElement {
    @property({ type: Number }) selectedIndex = 0;

    @property({ type: Array }) items: HotBarItem[] = [
        { 
            icon: 'icon-home', 
            label: 'Início', 
            href: '/' 
        },
        { 
            icon: 'icon-picture', 
            label: 'Galeria', 
            href: '/gallery' 
        },
        { 
            icon: 'icon-calendar', 
            label: 'Agendar', 
            href: '/appointment' 
        },
        { 
            icon: 'icon-basket-1', 
            label: 'Loja', 
            href: '/shop' 
        },
        { 
            icon: 'icon-login', 
            label: 'Entrar', 
            href: '/login' 
        },
    ];

    protected createRenderRoot() {
        return this;
    }

    private handleSelect(index: number, item: HotBarItem, e: Event) {
        this.selectedIndex = index;

        // Dispatch custom event for client-side routing or HTMX handling
        this.dispatchEvent(
        new CustomEvent('hotbar-select', {
            detail: { index, item },
            bubbles: true,
            composed: true,
        })
        );
    }

    render() {
        return html`
            <nav
                class="lg:hidden flex justify-between w-full h-fit bg-cream sticky bottom-0 border-t border-cherry/30 p-4 items-center py-4 px-8 z-40"
            >
                ${this.items.map((item, i) => {
                const isSelected = i === this.selectedIndex;
                const isHighlight = i === 2; // Center highlighted button (e.g. "Agendar")

                if (isHighlight) {
                    return html`
                    <a
                        href=${item.href || '#'}
                        @click=${(e: Event) => this.handleSelect(i, item, e)}
                        class="flex flex-col items-center cursor-pointer transition-transform active:scale-95 ${isSelected ? 'text-cherry' : ''}"
                    >
                        <span class="font-icon text-lg mb-1 shadow-lg shadow-cherry/50 p-2 bg-cherry aspect-square grid place-items-center rounded-2xl text-white">
                            <i class=${item.icon}></i>
                        </span>
                        <span class="text-xs font-semibold text-cherry">${item.label}</span>
                    </a>
                    `;
                }

                return html`
                    <a
                        href=${item.href || '#'}
                        @click=${(e: Event) => this.handleSelect(i, item, e)}
                        class="w-[40px] h-[40px] flex flex-col items-center cursor-pointer transition-colors ${isSelected ? 'text-cherry font-bold' : 'text-muted hover:text-black/75'}"
                    >
                        <span class="font-icon text-lg">
                            <i class=${item.icon}></i>
                        </span>
                        <span class="text-xs font-semibold">${item.label}</span>
                    </a>
                `;
                })}
            </nav>
        `;
    }
}