import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, output } from '@angular/core';
import { ImageLibraryService } from '../../services/image-library.service';
import { SizeEditorRow } from '../size-editor-row/size-editor-row';

@Component({
    selector: 'app-image-library-panel',
    standalone: true,
    imports: [SizeEditorRow],
    templateUrl: './image-library-panel.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageLibraryPanel {
    protected readonly library = inject(ImageLibraryService);

    readonly cropRequested = output<string>();

    addSize(id: string): void {
        this.library.addSize(id);
    }
}
