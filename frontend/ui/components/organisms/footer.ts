import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../atoms/divider';

interface Link {
  Label: string;
  RedirectTo: string;
}

interface LinkGroup {
    Title: string;
    Links: Link[];
}

interface Contact {
    Label: string;
    RedirectTo: string;
    Icon: string;
}

@customElement('ui-footer')
export class UiFooter extends LitElement {
    @property({ type: Boolean }) includeCTA: boolean = false;

    protected createRenderRoot() {
        return this;
    }

    private linkGroups: LinkGroup[] = [
        // Temporaly disabled
        // {
        //     Title: 'Estúdio',
        //     Links: [
        //         { 
        //             Label: 'Portifólio', 
        //             RedirectTo: '/galery' 
        //         },
        //     ],
        // },
        // {
        //     Title: 'Cuidados',
        //     Links: [
        //         { 
        //             Label: 'FAQ', 
        //             RedirectTo: '/faq' 
        //         },
        //     ],
        // },
        {
            Title: 'Ferramentas',
            Links: [
                { 
                    Label: 'Otimizador de decalque', 
                    RedirectTo: '/tools/stencil-optimizer' 
                },
                { 
                    Label: 'Decalque em multiplas páginas', 
                    RedirectTo: '/tools/multipage-stencil' 
                },
            ],
        },
    ];

    private contacts: Contact[] = [
        { 
            Label: 'xeubiart_', 
            RedirectTo: 'https://www.instagram.com/xeubiart_/', 
            Icon: 'icon-instagram' 
        },
        { 
            Label: 'xeubiart', 
            RedirectTo: 'https://www.tiktok.com/@xeubiart', 
            Icon: 'icon-tiktok' 
        },
        { 
            Label: 'xeubiart', 
            RedirectTo: 'https://www.facebook.com/xeubiart.comercial', 
            Icon: 'icon-facebook' 
        },
        { 
            Label: 'hi@xeubiart.com', 
            RedirectTo: 'mailto:hi@xeubiart.com', 
            Icon: 'icon-mail' 
        },
        { 
            Label: '+351 910 338 381', 
            RedirectTo: 'https://wa.me/351910338381', 
            Icon: 'icon-whatsapp' 
        },
    ];

    private renderLinks() {
        return html`
        <div class="grid lg:grid-cols-3 grid-cols-1 gap-6">
            ${this.linkGroups.map(
            (group) => html`
                <ul>
                <h5 class="text-cherry mb-3 uppercase text-xs tracking-widest">${group.Title}</h5>
                ${group.Links.map(
                    (link) => html`
                    <li class="mb-2">
                        <a
                            class="ml-4 text-muted relative text-sm/1 transition-colors before:transition-opacity before:opacity-0 before:absolute before:left-[-15px] before:top-1/2 before:-translate-y-1/2 before:w-[7px] before:aspect-square before:bg-cherry before:rounded-full hover:before:opacity-100 hover:text-white"
                            href=${link.RedirectTo}
                        >
                        ${link.Label}
                        </a>
                    </li>
                    `
                )}
                </ul>
            `
            )}
        </div>
        `;
    }

    private renderContacts() {
        return html`
        <div>
            <h5 class="text-cherry mb-3 uppercase text-xs tracking-widest">Redes & contato</h5>
            <div class="flex gap-3 flex-wrap">
            ${this.contacts.map(
                (item) => html`
                <a
                    class="border-cherry/75 border text-muted rounded-full px-4 py-2 text-sm/4 flex items-center w-fit gap-2 transition-colors duration-350 hover:bg-cherry/15 hover:border-cherry"
                    href=${item.RedirectTo}
                >
                    <i class=${item.Icon}></i>
                    <span>${item.Label}</span>
                </a>
                `
            )}
            </div>
        </div>
        `;
    }

    private renderCta() {
        return html`
            <div class="w-full lg:justify-between flex flex-col lg:flex-row gap-6 items-center bg-cherry/10 border border-cherry/50 p-8 lg:px-12 rounded-2xl mt-4 mb-4">
                <div class="w-fit flex flex-col gap-4 items-center">
                    <span class="text-cherry bg-cherry/25 px-3 py-1 rounded-full text-xs uppercase tracking-widest font-semibold">✦ próxima sessão ✦</span>
                    <h5 class="text-white text-3xl text-center font-bold">
                        A tua pele merece<br /><em>arte de verdade.</em>
                    </h5>
                    <p class="text-muted text-sm text-center">Agenda uma consulta gratuita — sem compromisso.</p>
                </div>
                <div>
                    <button class="bg-cherry text-white px-6 py-3 rounded-full font-medium hover:bg-cherry/80 transition-colors flex items-center gap-2">
                        Marcar sessão <span class="font-icon">&#xE80A;</span>
                    </button>
                </div>
            </div>
        `;
    }

    render() {
        return html`
            <footer
                class="w-full bg-black px-6 py-10 flex overflow-hidden relative before:block before:absolute before:w-[500px] before:h-[500px] before:rounded-full before:bg-[radial-gradient(circle,_rgba(139,26,43,0.32)_0%,_transparent_65%)] before:bottom-[-200px] before:left-[-200px] before:pointer-events-none before:z-0 after:block after:absolute after:w-[500px] after:h-[500px] after:rounded-full after:bg-[radial-gradient(circle,_rgba(139,26,43,0.32)_0%,_transparent_65%)] after:top-[-200px] after:right-[-200px] after:pointer-events-none after:z-0"
            >
                <div class="w-full lg:max-w-[65%] ml-auto mr-auto flex gap-7 flex-col z-10">
                    <div>
                        <a class="font-brand text-cherry text-5xl block mb-5" href="/">Xeubiart</a>
                        <div class="text-muted text-sm">
                        <p>Arte feita com <em class="text-white/75 font-semibold">intenção</em> tatuada com cuidado.</p>
                        <p>Santo-Tirso, Porto - Portugal</p>
                        </div>
                    </div>

                    <ui-divider></ui-divider>

                    ${this.renderLinks()}
                    ${this.renderContacts()}
                    ${this.includeCTA ? this.renderCta() : ''}

                    <div class="flex flex-col lg:flex-row lg:justify-between gap-3 pt-7 border-t-cherry/50 border-t">
                        <p class="text-muted text-xs text-center">
                            © 2026 <strong class="text-cherry">Xeubiart</strong> — Todos os direitos reservados. Feito com
                            <strong class="animate-pulse">🍒</strong> em Santo-Tirso - Porto.
                        </p>
                        <div class="text-white flex items-center justify-center gap-2">
                            <a href="/legal/privacy" class="text-sm text-muted hover:text-white transition-colors">Privacidade</a>
                            <span class="text-cherry text-sm">✦</span>
                            <a href="/legal/terms" class="text-sm text-muted hover:text-white transition-colors">Termos</a>
                            <span class="text-cherry text-sm">✦</span>
                            <a href="/legal/cookies" class="text-sm text-muted hover:text-white transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}