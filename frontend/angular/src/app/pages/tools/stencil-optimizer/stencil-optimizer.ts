import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, inject, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaxRectsPacker, PackedItem, PackingItem } from './maxRectsPacker';

interface UploadedImage {
    file: File;
    url: string;
    sizes: number[];
    aspectRatio: number;
}

@Component({
    selector: 'app-stencil-optimizer',
    imports: [FormsModule],
    templateUrl: './stencil-optimizer.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StencilOptimizer {
    private cdr = inject(ChangeDetectorRef);

    selectedTab: string = 'Imagens';
    currentPageIndex: number = 0;
    
    uploadedImagesMap = new Map<string, UploadedImage>();
    private packer = new MaxRectsPacker(210, 297, 5, true);

    private ngZone = inject(NgZone);

    @ViewChild('previewContainer') previewContainer!: ElementRef;
    downloadA4Sheet() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

        if (isMobile) {
            // --- MOBILE: Download ONLY the current preview page ---
            const items = this.currentPageItems;
            if (!items || items.length === 0) {
                alert('Não há itens nesta página para gerar.');
                return;
            }

            const scale = 10;
            const canvasWidth = 210;  // mm
            const canvasHeight = 297; // mm

            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth * scale;
            canvas.height = canvasHeight * scale;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                alert('Erro ao inicializar o gerador de imagem.');
                return;
            }

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const imagePromises = items.map((item: any) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';

                    img.onload = () => {
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

                        if (item.rotated) {
                            ctx.translate(x + w / 2, y + h / 2);
                            ctx.rotate((90 * Math.PI) / 180);
                            ctx.drawImage(img, -h / 2, -w / 2, h, w);
                        } else {
                            ctx.drawImage(img, x, y, w, h);
                        }

                        ctx.restore();
                        resolve();
                    };

                    img.onerror = () => resolve();
                    img.src = item.url;
                });
            });

            Promise.all(imagePromises).then(() => {
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `stencil-folha-${(this.currentPageIndex ?? 0) + 1}.png`;
                link.href = dataUrl;
                link.click();
            }).catch((err) => {
                console.error('Erro ao gerar canvas:', err);
                alert('Não foi possível gerar a imagem da folha.');
            });

        } else {
            // --- DESKTOP: Multi-download all pages ---
            if (!this.pages || this.pages.length === 0) {
                alert('Não há páginas para gerar.');
                return;
            }

            this.pages.forEach((pageItems: any, pageIndex: number) => {
                if (!pageItems || pageItems.length === 0) return;

                const scale = 10;
                const canvasWidth = 210;
                const canvasHeight = 297;

                const canvas = document.createElement('canvas');
                canvas.width = canvasWidth * scale;
                canvas.height = canvasHeight * scale;
                const ctx = canvas.getContext('2d');

                if (!ctx) return;

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const imagePromises = pageItems.map((item: any) => {
                    return new Promise<void>((resolve) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';

                        img.onload = () => {
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

                            if (item.rotated) {
                                ctx.translate(x + w / 2, y + h / 2);
                                ctx.rotate((90 * Math.PI) / 180);
                                ctx.drawImage(img, -h / 2, -w / 2, h, w);
                            } else {
                                ctx.drawImage(img, x, y, w, h);
                            }

                            ctx.restore();
                            resolve();
                        };

                        img.onerror = () => resolve();
                        img.src = item.url;
                    });
                });

                Promise.all(imagePromises).then(() => {
                    const dataUrl = canvas.toDataURL('image/png');
                    setTimeout(() => {
                        const link = document.createElement('a');
                        link.download = `stencil-folha-${pageIndex + 1}.png`;
                        link.href = dataUrl;
                        link.click();
                    }, pageIndex * 400);
                });
            });
        }
    }

    get uploadedImages(): [string, UploadedImage][] {
        return Array.from(this.uploadedImagesMap.entries());
    }

    get allItems(): PackingItem[] {
        const items: PackingItem[] = [];

        for (const [id, data] of this.uploadedImagesMap.entries()) {
            data.sizes.forEach((size, idx) => {
                const numericSize = Number(size);
                if (numericSize > 0) {
                    const targetMm = numericSize * 10; // Selected size in mm
                    let widthMm: number;
                    let heightMm: number;

                    // Scale based on the longest dimension
                    if (data.aspectRatio >= 1) {
                        // Wide / Landscape Image: 'sizeCm' sets the Target Width
                        widthMm = targetMm;
                        heightMm = targetMm / data.aspectRatio;
                    } else {
                        // Tall / Portrait Image: 'sizeCm' sets the Target Height
                        heightMm = targetMm;
                        widthMm = targetMm * data.aspectRatio;
                    }

                    items.push({
                        id: `${id}-${idx}-${numericSize}`,
                        url: data.url,
                        fileName: data.file.name,
                        sizeCm: numericSize,
                        width: Math.round(widthMm),
                        height: Math.round(heightMm),
                    });
                }
            });
        }

        return items;
    }

    get packedResult() {
        return this.packer.pack(this.allItems);
    }

    get pages(): PackedItem[][] {
        const pages = this.packedResult.pages;
        if (this.currentPageIndex >= pages.length && pages.length > 0) {
            this.currentPageIndex = pages.length - 1;
        }
        return pages.length > 0 ? pages : [[]];
    }

    get currentPageItems(): PackedItem[] {
        return this.pages[this.currentPageIndex] || [];
    }

    get currentEfficiency(): number {
        return this.packedResult.efficiency[this.currentPageIndex] || 0;
    }

    nextPage() {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.currentPageIndex++;
        }
    }

    prevPage() {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
        }
    }

    handleTabChange(event: Event) {
        const customEvent = event as CustomEvent;
        this.selectedTab = customEvent.detail.activeTab;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onFilesSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        Array.from(input.files).forEach(file => {
            if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.heic')) return;

            const url = URL.createObjectURL(file);
            const img = new Image();

            img.onload = () => {
                const aspectRatio = img.naturalWidth / img.naturalHeight || 1;

                // Safe ID generator that won't crash on mobile HTTP local IPs
                const id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
                    ? crypto.randomUUID()
                    : 'img_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

                this.ngZone.run(() => {
                    this.uploadedImagesMap.set(id, {
                        file,
                        url,
                        sizes: [10],
                        aspectRatio
                    });
                    this.selectedTab = 'Imagens';
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                });
            };

            img.onerror = (err) => {
                console.error('Failed to load image on iOS', err);
                URL.revokeObjectURL(url);
            };

            img.src = url;
        });

        input.value = '';
    }

    deleteFile(id: string) {
        if (this.uploadedImagesMap.has(id)) {
            this.uploadedImagesMap.delete(id);
            this.cdr.detectChanges();
        }
    }

    onSizeChange() {
        this.cdr.detectChanges();
    }

    addNewSize(id: string, size: number = 5) {
        const imageData = this.uploadedImagesMap.get(id);
        if (imageData) {
            imageData.sizes = [...imageData.sizes, size];
            this.cdr.detectChanges();
        }
    }

    deleteSize(id: string, index: number) {
        const imageData = this.uploadedImagesMap.get(id);
        if (imageData && index >= 0 && index < imageData.sizes.length) {
            imageData.sizes = imageData.sizes.filter((_, i) => i !== index);
            this.cdr.detectChanges();
        }
    }
}