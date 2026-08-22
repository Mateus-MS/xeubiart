import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, inject, NgZone, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaxRectsPacker, PackedItem, PackingItem } from './maxRectsPacker';
import { Title } from '@angular/platform-browser';

interface SizeConfig {
    value: number;
    flipX: boolean;
    flipY: boolean;
}

interface CropInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface UploadedImage {
    file: File;
    originalUrl: string; // The untouched, uncropped source image
    url: string;         // The currently visible/cropped image used by the app & packer
    sizes: SizeConfig[];
    aspectRatio: number;
    cropBox?: CropInfo;  // Saves the crop coordinates in natural (original image) pixels
}

@Component({
    selector: 'app-stencil-optimizer',
    imports: [FormsModule],
    templateUrl: './stencil-optimizer.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StencilOptimizer implements OnInit {
    private cdr = inject(ChangeDetectorRef);

    constructor(private titleService: Title) {}

    ngOnInit(): void {
        this.titleService.setTitle('Xeubiart — Otimizador de stencils em A4');
    }

    selectedTab: string = 'Imagens';
    currentPageIndex: number = 0;
    
    uploadedImagesMap = new Map<string, UploadedImage>();
    private packer = new MaxRectsPacker(210, 297, 5, true);

    private ngZone = inject(NgZone);

    @ViewChild('previewContainer') previewContainer!: ElementRef;
    
    isCropping = false;
    cropImageId: string | null = null;
    cropImgUrl = '';
    cropBox = { x: 0, y: 0, w: 0, h: 0 };
    cropImgRect = { width: 0, height: 0 };
    private cropImgElement: HTMLImageElement | null = null;

    dragAction: 'move' | 'tl' | 'tr' | 'bl' | 'br' | null = null;
    dragStartX = 0;
    dragStartY = 0;
    initialCropBox = { x: 0, y: 0, w: 0, h: 0 };

    openCropModal(id: string) {
        const data = this.uploadedImagesMap.get(id);
        if (!data) return;
        this.cropImageId = id;
        
        // Load the ORIGINAL image into the cropper, not the already-cropped version
        this.cropImgUrl = data.originalUrl; 
        this.isCropping = true;
        this.dragAction = null;
        document.body.style.overflow = 'hidden'; // Evita scroll do fundo
    }

    closeCropModal() {
        this.isCropping = false;
        this.cropImageId = null;
        this.cropImgUrl = '';
        this.cropImgElement = null;
        document.body.style.overflow = '';
    }

    initCropBox(imgElement: HTMLImageElement) {
        this.cropImgElement = imgElement;
        this.cropImgRect = {
            width: imgElement.offsetWidth,
            height: imgElement.offsetHeight
        };
        
        const data = this.uploadedImagesMap.get(this.cropImageId!);
        
        if (data && data.cropBox) {
            // Restore the previous crop box by scaling natural pixels down to the modal's display size
            const scaleX = this.cropImgRect.width / imgElement.naturalWidth;
            const scaleY = this.cropImgRect.height / imgElement.naturalHeight;
            
            this.cropBox = {
                x: data.cropBox.x * scaleX,
                y: data.cropBox.y * scaleY,
                w: data.cropBox.width * scaleX,
                h: data.cropBox.height * scaleY
            };
        } else {
            // Initialize covering the whole image
            this.cropBox = {
                x: 0,
                y: 0,
                w: this.cropImgRect.width,
                h: this.cropImgRect.height
            };
        }
    }

    onCropPointerDown(event: MouseEvent | TouchEvent, action: string) {
        event.preventDefault();
        event.stopPropagation();
        this.dragAction = action as any;
        
        const isTouch = 'touches' in event;
        this.dragStartX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
        this.dragStartY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
        
        this.initialCropBox = { ...this.cropBox };
    }

    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onGlobalMove(event: MouseEvent | TouchEvent) {
        if (!this.isCropping || !this.dragAction || !this.cropImgRect.width) return;
        
        const isTouch = 'touches' in event;
        const clientX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
        const clientY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;

        let dx = clientX - this.dragStartX;
        let dy = clientY - this.dragStartY;
        
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

    @HostListener('document:mouseup', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onGlobalUp(event: MouseEvent | TouchEvent) {
        if (this.dragAction) this.dragAction = null;
    }

    applyCrop() {
        if (!this.cropImageId || !this.cropImgElement || !this.cropImgRect.width) return;

        const originalData = this.uploadedImagesMap.get(this.cropImageId);
        if (!originalData) return;

        const scaleX = this.cropImgElement.naturalWidth / this.cropImgRect.width;
        const scaleY = this.cropImgElement.naturalHeight / this.cropImgRect.height;

        const sx = this.cropBox.x * scaleX;
        const sy = this.cropBox.y * scaleY;
        const sw = this.cropBox.w * scaleX;
        const sh = this.cropBox.h * scaleY;

        // Save the crop coordinates for the next time the user opens the modal
        originalData.cropBox = { x: sx, y: sy, width: sw, height: sh };

        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(this.cropImgElement, sx, sy, sw, sh, 0, 0, sw, sh);
        
        canvas.toBlob((blob) => {
            if (!blob) return;
            const newUrl = URL.createObjectURL(blob);
            
            // Free the memory of the OLD cropped image, but KEEP the originalUrl intact!
            if (originalData.url !== originalData.originalUrl) {
                URL.revokeObjectURL(originalData.url);
            }
            
            this.ngZone.run(() => {
                originalData.url = newUrl;
                originalData.aspectRatio = sw / sh;
                this.closeCropModal();
                this.cdr.detectChanges();
            });
        }, 'image/png');
    }
    
    downloadA4Sheet() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

        const drawItem = (ctx: CanvasRenderingContext2D, item: any, scale: number, img: HTMLImageElement) => {
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
        };

        if (isMobile) {
            const items = this.currentPageItems;
            if (!items || items.length === 0) {
                alert('Não há itens nesta página para gerar.');
                return;
            }

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

            const imagePromises = items.map((item: any) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        drawItem(ctx, item, scale, img);
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
            }).catch(() => alert('Não foi possível gerar a imagem da folha.'));

        } else {
            if (!this.pages || this.pages.length === 0) return;

            this.pages.forEach((pageItems: any, pageIndex: number) => {
                if (!pageItems || pageItems.length === 0) return;

                const scale = 10;
                const canvas = document.createElement('canvas');
                canvas.width = 210 * scale;
                canvas.height = 297 * scale;
                const ctx = canvas.getContext('2d');

                if (!ctx) return;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const imagePromises = pageItems.map((item: any) => {
                    return new Promise<void>((resolve) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => {
                            drawItem(ctx, item, scale, img);
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
            data.sizes.forEach((sizeConfig, idx) => {
                const numericSize = Number(sizeConfig.value);
                if (numericSize > 0) {
                    const targetMm = numericSize * 10;
                    let widthMm: number;
                    let heightMm: number;

                    if (data.aspectRatio >= 1) {
                        widthMm = targetMm;
                        heightMm = targetMm / data.aspectRatio;
                    } else {
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
                        flipX: sizeConfig.flipX,
                        flipY: sizeConfig.flipY
                    } as any);
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
        if (this.currentPageIndex < this.pages.length - 1) this.currentPageIndex++;
    }

    prevPage() {
        if (this.currentPageIndex > 0) this.currentPageIndex--;
    }

    handleTabChange(event: Event) {
        const customEvent = event as CustomEvent;
        this.selectedTab = customEvent.detail.activeTab;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onFilesSelected(event: any) {
        let fileList: FileList | File[] | null = null;

        if (event?.target?.files && event.target.files.length > 0) {
            fileList = event.target.files;
        } else if (event?.detail) {
            if (event.detail.files) {
                fileList = event.detail.files;
            } else if (Array.isArray(event.detail) || event.detail instanceof FileList) {
                fileList = event.detail;
            } else if (event.detail instanceof File) {
                fileList = [event.detail];
            }
        } else if (Array.isArray(event) || event instanceof FileList) {
            fileList = event;
        }

        if (!fileList || fileList.length === 0) return;

        Array.from(fileList).forEach(file => {
            if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.heic')) return;

            const url = URL.createObjectURL(file);
            const img = new Image();

            img.onload = () => {
                const aspectRatio = img.naturalWidth / img.naturalHeight || 1;
                const id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
                    ? crypto.randomUUID()
                    : 'img_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

                this.ngZone.run(() => {
                    this.uploadedImagesMap.set(id, {
                        file,
                        originalUrl: url, // Track the original untouched image
                        url: url,         // Starts as the original image
                        sizes: [{ value: 10, flipX: false, flipY: false }],
                        aspectRatio
                        // cropBox is undefined initially
                    });
                    this.selectedTab = 'Imagens';
                    this.cdr.markForCheck();
                    this.cdr.detectChanges();
                });
            };

            img.onerror = (err) => {
                console.error('Failed to load image', err);
                URL.revokeObjectURL(url);
            };

            img.src = url;
        });

        if (event?.target && 'value' in event.target) {
            event.target.value = '';
        }
    }

    deleteFile(id: string) {
        const data = this.uploadedImagesMap.get(id);
        if (data) {
            // Clean up BOTH object URLs to prevent memory leaks
            URL.revokeObjectURL(data.originalUrl);
            if (data.url !== data.originalUrl) {
                URL.revokeObjectURL(data.url); 
            }
            this.uploadedImagesMap.delete(id);
            this.cdr.detectChanges();
        }
    }

    onSizeChange() {
        this.cdr.detectChanges();
    }
    
    toggleFlip(id: string, index: number, axis: 'x' | 'y') {
        const imageData = this.uploadedImagesMap.get(id);
        if (imageData && index >= 0 && index < imageData.sizes.length) {
            if (axis === 'x') {
                imageData.sizes[index].flipX = !imageData.sizes[index].flipX;
            } else if (axis === 'y') {
                imageData.sizes[index].flipY = !imageData.sizes[index].flipY;
            }
            this.cdr.detectChanges();
        }
    }

    addNewSize(id: string, size: number = 5) {
        const imageData = this.uploadedImagesMap.get(id);
        if (imageData) {
            imageData.sizes = [...imageData.sizes, { value: size, flipX: false, flipY: false }];
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