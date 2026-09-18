import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, computed, effect, inject, input, output } from '@angular/core';
import { ImageLibraryService } from '../../services/image-library.service';

type DragAction = 'move' | 'tl' | 'tr' | 'bl' | 'br' | null;

@Component({
    selector: 'app-crop-modal',
    standalone: true,
    templateUrl: './crop-modal.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CropModal {
    private readonly library = inject(ImageLibraryService);

    readonly imageId = input<string | null>(null);
    readonly closed = output<void>();

    readonly cropImgUrl = computed(() => {
        const id = this.imageId();
        return id ? (this.library.get(id)?.originalUrl ?? '') : '';
    });

    cropBox = { x: 0, y: 0, w: 0, h: 0 };
    cropImgRect = { width: 0, height: 0 };
    private cropImgElement: HTMLImageElement | null = null;

    private dragAction: DragAction = null;
    private dragStartX = 0;
    private dragStartY = 0;
    private initialCropBox = { x: 0, y: 0, w: 0, h: 0 };

    constructor() {
        effect(() => {
            document.body.style.overflow = this.imageId() !== null ? 'hidden' : '';
        });
    }

    initCropBox(imgElement: HTMLImageElement): void {
        this.cropImgElement = imgElement;
        this.cropImgRect = { width: imgElement.offsetWidth, height: imgElement.offsetHeight };

        const id = this.imageId();
        const data = id ? this.library.get(id) : undefined;

        if (data?.cropBox) {
            const scaleX = this.cropImgRect.width / imgElement.naturalWidth;
            const scaleY = this.cropImgRect.height / imgElement.naturalHeight;

            this.cropBox = {
                x: data.cropBox.x * scaleX,
                y: data.cropBox.y * scaleY,
                w: data.cropBox.width * scaleX,
                h: data.cropBox.height * scaleY
            };
        } else {
            this.cropBox = { x: 0, y: 0, w: this.cropImgRect.width, h: this.cropImgRect.height };
        }
    }

    onPointerDown(event: MouseEvent | TouchEvent, action: Exclude<DragAction, null>): void {
        event.preventDefault();
        event.stopPropagation();
        this.dragAction = action;

        const isTouch = 'touches' in event;
        this.dragStartX = isTouch ? event.touches[0].clientX : (event as MouseEvent).clientX;
        this.dragStartY = isTouch ? event.touches[0].clientY : (event as MouseEvent).clientY;

        this.initialCropBox = { ...this.cropBox };
    }

    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onGlobalMove(event: MouseEvent | TouchEvent): void {
        if (!this.dragAction || !this.cropImgRect.width) return;

        const isTouch = 'touches' in event;
        const clientX = isTouch ? event.touches[0].clientX : (event as MouseEvent).clientX;
        const clientY = isTouch ? event.touches[0].clientY : (event as MouseEvent).clientY;

        const dx = clientX - this.dragStartX;
        const dy = clientY - this.dragStartY;

        let newX = this.initialCropBox.x;
        let newY = this.initialCropBox.y;
        let newW = this.initialCropBox.w;
        let newH = this.initialCropBox.h;

        if (this.dragAction === 'move') {
            newX += dx;
            newY += dy;
        } else {
            if (this.dragAction.includes('l')) { newX += dx; newW -= dx; }
            if (this.dragAction.includes('r')) { newW += dx; }
            if (this.dragAction.includes('t')) { newY += dy; newH -= dy; }
            if (this.dragAction.includes('b')) { newH += dy; }
        }

        const minSize = 40;
        if (newW < minSize) { newW = minSize; if (this.dragAction.includes('l')) newX = this.initialCropBox.x + this.initialCropBox.w - minSize; }
        if (newH < minSize) { newH = minSize; if (this.dragAction.includes('t')) newY = this.initialCropBox.y + this.initialCropBox.h - minSize; }

        if (newX < 0) { if (this.dragAction !== 'move') newW += newX; newX = 0; }
        if (newY < 0) { if (this.dragAction !== 'move') newH += newY; newY = 0; }

        if (newX + newW > this.cropImgRect.width) {
            if (this.dragAction !== 'move') newW = this.cropImgRect.width - newX;
            else newX = this.cropImgRect.width - newW;
        }
        if (newY + newH > this.cropImgRect.height) {
            if (this.dragAction !== 'move') newH = this.cropImgRect.height - newY;
            else newY = this.cropImgRect.height - newH;
        }

        this.cropBox = { x: newX, y: newY, w: newW, h: newH };
    }

    @HostListener('document:mouseup')
    @HostListener('document:touchend')
    onGlobalUp(): void {
        this.dragAction = null;
    }

    applyCrop(): void {
        const id = this.imageId();
        if (!id || !this.cropImgElement || !this.cropImgRect.width) return;

        const scaleX = this.cropImgElement.naturalWidth / this.cropImgRect.width;
        const scaleY = this.cropImgElement.naturalHeight / this.cropImgRect.height;

        const sx = this.cropBox.x * scaleX;
        const sy = this.cropBox.y * scaleY;
        const sw = this.cropBox.w * scaleX;
        const sh = this.cropBox.h * scaleY;

        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(this.cropImgElement, sx, sy, sw, sh, 0, 0, sw, sh);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const newUrl = URL.createObjectURL(blob);
            this.library.applyCrop(id, { x: sx, y: sy, width: sw, height: sh }, newUrl, sw / sh);
            this.close();
        }, 'image/png');
    }

    close(): void {
        this.cropImgElement = null;
        this.closed.emit();
    }
}
