import { Injectable } from '@angular/core';
import { PackedItem } from '../maxrects/maxRectsPacker';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const RENDER_SCALE = 10;

@Injectable({ providedIn: 'root' })
export class StencilExportService {

    isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || window.innerWidth < 768;
    }

    /** Renders every page and downloads each one, staggered so the browser doesn't block multiple downloads. */
    downloadAllPages(pages: PackedItem[][]): void {
        if (!pages || pages.length === 0) return;

        pages.forEach((pageItems, pageIndex) => {
            if (!pageItems || pageItems.length === 0) return;

            this.renderPage(pageItems).then(dataUrl => {
                setTimeout(() => this.triggerDownload(dataUrl, `stencil-folha-${pageIndex + 1}.png`), pageIndex * 400);
            });
        });
    }

    downloadPage(items: PackedItem[], pageNumber: number): void {
        if (!items || items.length === 0) {
            alert('Não há itens nesta página para gerar.');
            return;
        }

        this.renderPage(items)
            .then(dataUrl => this.triggerDownload(dataUrl, `stencil-folha-${pageNumber}.png`))
            .catch(() => alert('Não foi possível gerar a imagem da folha.'));
    }

    private renderPage(items: PackedItem[]): Promise<string> {
        const canvas = document.createElement('canvas');
        canvas.width = A4_WIDTH_MM * RENDER_SCALE;
        canvas.height = A4_HEIGHT_MM * RENDER_SCALE;
        const ctx = canvas.getContext('2d');

        if (!ctx) return Promise.reject(new Error('Canvas 2D context unavailable'));

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const imagePromises = items.map(item => this.drawItem(ctx, item));

        return Promise.all(imagePromises).then(() => canvas.toDataURL('image/png'));
    }

    private drawItem(ctx: CanvasRenderingContext2D, item: PackedItem): Promise<void> {
        return new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                this.paintItem(ctx, item, RENDER_SCALE, img);
                resolve();
            };
            img.onerror = () => resolve();
            img.src = item.url;
        });
    }

    private paintItem(ctx: CanvasRenderingContext2D, item: PackedItem, scale: number, img: HTMLImageElement): void {
        ctx.save();
        const x = item.x * scale;
        const y = item.y * scale;
        const w = item.width * scale;
        const h = item.height * scale;

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 2 * (scale / 4);
        ctx.setLineDash([6 * (scale / 4), 6 * (scale / 4)]);
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);

        ctx.translate(x + w / 2, y + h / 2);

        if (item.rotated) ctx.rotate((90 * Math.PI) / 180);
        ctx.scale(item.flipX ? -1 : 1, item.flipY ? -1 : 1);

        if (item.rotated) {
            ctx.drawImage(img, -h / 2, -w / 2, h, w);
        } else {
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
        }
        ctx.restore();
    }

    private triggerDownload(dataUrl: string, filename: string): void {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
    }
}
