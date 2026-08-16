import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, inject, NgZone } from '@angular/core';
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
    
    private uploadedImagesMap = new Map<string, UploadedImage>();
    private packer = new MaxRectsPacker(210, 297, 5, true);

    private ngZone = inject(NgZone);

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