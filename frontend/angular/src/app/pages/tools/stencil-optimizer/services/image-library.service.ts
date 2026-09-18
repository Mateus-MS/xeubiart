import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { CropInfo, SizeConfig, UploadedImage } from '../models/stencil.models';

@Injectable({ providedIn: 'root' })
export class ImageLibraryService {
    private readonly ngZone = inject(NgZone);

    private readonly imagesMap = signal(new Map<string, UploadedImage>());

    readonly entries = computed(() => Array.from(this.imagesMap().entries()));

    readonly isEmpty = computed(() => this.imagesMap().size === 0);

    get(id: string): UploadedImage | undefined {
        return this.imagesMap().get(id);
    }

    addFiles(event: unknown): void {
        const fileList = this.extractFileList(event);
        if (!fileList || fileList.length === 0) return;

        Array.from(fileList).forEach(file => this.addFile(file));

        const target = (event as { target?: unknown })?.target;
        if (target && typeof target === 'object' && 'value' in target) {
            (target as { value: string }).value = '';
        }
    }

    deleteFile(id: string): void {
        const data = this.imagesMap().get(id);
        if (!data) return;

        URL.revokeObjectURL(data.originalUrl);
        if (data.url !== data.originalUrl) {
            URL.revokeObjectURL(data.url);
        }

        const next = new Map(this.imagesMap());
        next.delete(id);
        this.imagesMap.set(next);
    }

    setSizeValue(id: string, index: number, value: number): void {
        this.updateSizes(id, sizes => {
            sizes[index] = { ...sizes[index], value };
        });
    }

    toggleFlip(id: string, index: number, axis: 'x' | 'y'): void {
        this.updateSizes(id, sizes => {
            const current = sizes[index];
            sizes[index] = axis === 'x'
                ? { ...current, flipX: !current.flipX }
                : { ...current, flipY: !current.flipY };
        });
    }

    addSize(id: string, size = 5): void {
        this.updateSizes(id, sizes => {
            sizes.push({ value: size, flipX: false, flipY: false });
        });
    }

    deleteSize(id: string, index: number): void {
        this.updateSizes(id, sizes => {
            sizes.splice(index, 1);
        });
    }

    applyCrop(id: string, cropBox: CropInfo, newUrl: string, newAspectRatio: number): void {
        const data = this.imagesMap().get(id);
        if (!data) return;

        const preloader = new Image();
        preloader.src = newUrl;

        preloader.decode()
            .catch(err => console.error('Failed to decode cropped image', err))
            .finally(() => {
                this.ngZone.run(() => {
                    if (data.url !== data.originalUrl) {
                        URL.revokeObjectURL(data.url);
                    }
                    this.replace(id, { ...data, url: newUrl, aspectRatio: newAspectRatio, cropBox });
                });
            });
    }

    private updateSizes(id: string, mutate: (sizes: SizeConfig[]) => void): void {
        const data = this.imagesMap().get(id);
        if (!data) return;

        const sizes = [...data.sizes];
        mutate(sizes);
        this.replace(id, { ...data, sizes });
    }

    private replace(id: string, data: UploadedImage): void {
        const next = new Map(this.imagesMap());
        next.set(id, data);
        this.imagesMap.set(next);
    }

    private extractFileList(event: any): FileList | File[] | null {
        if (event?.target?.files && event.target.files.length > 0) {
            return event.target.files;
        }
        if (event?.detail) {
            if (event.detail.files) return event.detail.files;
            if (Array.isArray(event.detail) || event.detail instanceof FileList) return event.detail;
            if (event.detail instanceof File) return [event.detail];
        }
        if (Array.isArray(event) || event instanceof FileList) return event;
        return null;
    }

    private addFile(file: File): void {
        if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.heic')) return;

        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;

        img.decode()
            .then(() => {
                const aspectRatio = img.naturalWidth / img.naturalHeight || 1;
                const id = this.generateId();

                this.ngZone.run(() => {
                    const next = new Map(this.imagesMap());
                    next.set(id, {
                        file,
                        originalUrl: url,
                        url,
                        sizes: [{ value: 10, flipX: false, flipY: false }],
                        aspectRatio
                    });
                    this.imagesMap.set(next);
                });
            })
            .catch((err) => {
                console.error('Failed to decode image', err);
                URL.revokeObjectURL(url);
            });
    }

    private generateId(): string {
        return (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
            ? crypto.randomUUID()
            : 'img_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    }
}