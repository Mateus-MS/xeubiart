import { Injectable, computed, inject } from '@angular/core';
import { MaxRectsPacker, PackedItem, PackingItem } from '../maxrects/maxRectsPacker';
import { ImageLibraryService } from './image-library.service';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PADDING_MM = 5;

@Injectable({ providedIn: 'root' })
export class StencilPackingService {
    private readonly library = inject(ImageLibraryService);
    private readonly packer = new MaxRectsPacker(A4_WIDTH_MM, A4_HEIGHT_MM, PADDING_MM, true);

    readonly items = computed<PackingItem[]>(() => {
        const items: PackingItem[] = [];

        for (const [id, data] of this.library.entries()) {
            data.sizes.forEach((sizeConfig, idx) => {
                const numericSize = Number(sizeConfig.value);
                if (numericSize <= 0) return;

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
                });
            });
        }

        return items;
    });

    private readonly packedResult = computed(() => this.packer.pack(this.items()));

    readonly pages = computed<PackedItem[][]>(() => {
        const pages = this.packedResult().pages;
        return pages.length > 0 ? pages : [[]];
    });

    readonly efficiency = computed<number[]>(() => this.packedResult().efficiency);
}
