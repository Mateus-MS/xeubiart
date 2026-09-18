import { afterNextRender, Component, computed, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, effect, ElementRef, inject, model, signal, viewChild } from '@angular/core';
import { PackedItem } from '../../maxrects/maxRectsPacker';
import { StencilPackingService } from '../../services/stencil-packing.service';

@Component({
    selector: 'app-sheet-preview',
    standalone: true,
    templateUrl: './sheet-preview.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SheetPreview {
    private readonly packing = inject(StencilPackingService);

    readonly currentPageIndex = model(0);

    protected readonly pages = this.packing.pages;
    protected readonly pageCount = computed(() => this.pages().length);
    protected readonly totalItemCount = computed(() => this.packing.items().length);

    private readonly previewContainerRef = viewChild.required<ElementRef<HTMLDivElement>>('previewContainer');
    private readonly destroyRef = inject(DestroyRef);
    protected readonly containerWidth = signal(0);

    protected readonly currentPageItems = computed<PackedItem[]>(
        () => this.pages()[this.currentPageIndex()] ?? []
    );
    protected readonly currentEfficiency = computed(
        () => this.packing.efficiency()[this.currentPageIndex()] ?? 0
    );

    constructor() {
        afterNextRender(() => {
            const el = this.previewContainerRef().nativeElement;

            const observer = new ResizeObserver(entries => {
                this.containerWidth.set(entries[0]?.contentRect.width ?? el.clientWidth);
            });

            observer.observe(el);
            this.destroyRef.onDestroy(() => observer.disconnect());
            }
        );
    }

    next(): void {
        if (this.currentPageIndex() < this.pageCount() - 1) this.currentPageIndex.update(i => i + 1);
    }

    prev(): void {
        if (this.currentPageIndex() > 0) this.currentPageIndex.update(i => i - 1);
    }

    protected rotatedWidth(item: PackedItem): number {
        return item.height * (this.containerWidth() / 210);
    }

    protected rotatedHeight(item: PackedItem): number {
        return item.width * (this.containerWidth() / 210);
    }
}
