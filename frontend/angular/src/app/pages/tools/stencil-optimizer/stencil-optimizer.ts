import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, inject } from '@angular/core';

interface UploadedImage {
    id: string;
    file: File;
    url: string;
    name: string;
    size: number;
}

@Component({
    selector: 'app-stencil-optimizer',
    imports: [],
    templateUrl: './stencil-optimizer.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StencilOptimizer {
    private cdr = inject(ChangeDetectorRef);

    selectedTab: string = 'Imagens';
    uploadedImages: UploadedImage[] = [];

    handleTabChange(event: Event) {
        const customEvent = event as CustomEvent;

        console.log('Selected Tab:', customEvent.detail.activeTab);

        this.selectedTab = customEvent.detail.activeTab;

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
                    this.uploadedImages.push({
                        id: Math.random().toString(36).substring(2, 9),
                        file: file,
                        url: result,
                        name: file.name,
                        size: file.size
                    });

                    this.cdr.detectChanges();
                }
            };
            reader.readAsDataURL(file);
        });

        input.value = '';
    }
}