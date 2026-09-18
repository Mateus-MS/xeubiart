import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ImageLibraryService } from './services/image-library.service';
import { StencilPackingService } from './services/stencil-packing.service';
import { StencilExportService } from './services/stencil-export.service';
import { ImageLibraryPanel } from './components/image-library-panel/image-library-panel';
import { SheetPreview } from './components/sheet-preview/sheet-preview';
import { CropModal } from './components/crop-modal/crop-modal';

@Component({
    selector: 'app-stencil-optimizer',
    standalone: true,
    imports: [ImageLibraryPanel, SheetPreview, CropModal],
    templateUrl: './stencil-optimizer.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StencilOptimizer implements OnInit {
    private readonly titleService = inject(Title);

    protected readonly library = inject(ImageLibraryService);
    protected readonly packing = inject(StencilPackingService);
    private readonly exportService = inject(StencilExportService);

    protected readonly selectedTab = signal<string>('images');
    protected readonly currentPageIndex = signal(0);
    protected readonly croppingImageId = signal<string | null>(null);

    ngOnInit(): void {
        this.titleService.setTitle('Xeubiart — Otimizador de stencils em A4');
    }

    handleTabChange(event: Event): void {
        const customEvent = event as CustomEvent;
        this.selectedTab.set(customEvent.detail.activeTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onFilesSelected(event: Event): void {
        this.library.addFiles(event);
        this.selectedTab.set('images');
    }

    openCropModal(id: string): void {
        this.croppingImageId.set(id);
    }

    downloadA4Sheet(): void {
        if (this.exportService.isMobile()) {
            const items = this.packing.pages()[this.currentPageIndex()] ?? [];
            this.exportService.downloadPage(items, this.currentPageIndex() + 1);
        } else {
            this.exportService.downloadAllPages(this.packing.pages());
        }
    }
}
