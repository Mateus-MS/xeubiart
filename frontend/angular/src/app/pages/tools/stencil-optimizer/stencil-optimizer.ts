import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UploadedImage {
    file: File;
    url: string;
    sizes: number[];
}

export interface StencilItem {
    id: string;
    url: string;
    fileName: string;
    sizeCm: number;

    heightMm: number;
    widthMm: number; 
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

    get uploadedImages(): [string, UploadedImage][] {
        return Array.from(this.uploadedImagesMap.entries());
    }

    get allItems(): StencilItem[] {
        const items: StencilItem[] = [];
        for (const [id, data] of this.uploadedImagesMap.entries()) {
            data.sizes.forEach((size, idx) => {
                const numericSize = Number(size);
                if (numericSize > 0) {
                    const heightMm = numericSize * 10;
                    const widthMm = heightMm;
                    items.push({
                        id: `${id}-${idx}-${numericSize}`,
                        url: data.url,
                        fileName: data.file.name,
                        sizeCm: numericSize,
                        heightMm,
                        widthMm
                    });
                }
            });
        }
        return items;
    }

    get pages(): StencilItem[][] {
        const A4_WIDTH = 210;
        const A4_HEIGHT = 297;
        const PADDING = 10;
        const GAP = 5;
        
        const usableWidth = A4_WIDTH - (PADDING * 2);
        const usableHeight = A4_HEIGHT - (PADDING * 2);

        const pages: StencilItem[][] = [];
        let currentPage: StencilItem[] = [];
        let currentX = 0;
        let currentY = 0;
        let rowMaxHeight = 0;

        for (const item of this.allItems) {
            const w = Math.min(item.widthMm, usableWidth);
            const h = Math.min(item.heightMm, usableHeight);

            if (currentX + w > usableWidth) {
                currentX = 0;
                currentY += rowMaxHeight + GAP;
                rowMaxHeight = 0;
            }

            if (currentY + h > usableHeight) {
                if (currentPage.length > 0) {
                    pages.push(currentPage);
                }
                currentPage = [];
                currentX = 0;
                currentY = 0;
                rowMaxHeight = 0;
            }

            currentPage.push(item);
            currentX += w + GAP;
            rowMaxHeight = Math.max(rowMaxHeight, h);
        }

        if (currentPage.length > 0) {
            pages.push(currentPage);
        }

        if (this.currentPageIndex >= pages.length && pages.length > 0) {
            this.currentPageIndex = pages.length - 1;
        }

        return pages.length > 0 ? pages : [[]];
    }

    get currentPageItems(): StencilItem[] {
        return this.pages[this.currentPageIndex] || [];
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
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const result = e.target?.result as string;
                if (result) {
                    const id = crypto.randomUUID();
                    this.uploadedImagesMap.set(id, {
                        file,
                        url: result,
                        sizes: [10],
                    });
                    this.cdr.detectChanges();
                }
            };
            reader.readAsDataURL(file);
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
}