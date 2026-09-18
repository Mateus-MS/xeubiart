import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SizeConfig } from '../../models/stencil.models';
import { ImageLibraryService } from '../../services/image-library.service';

@Component({
    selector: 'app-size-editor-row',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './size-editor-row.html',
})
export class SizeEditorRow {
    private readonly library = inject(ImageLibraryService);

    readonly id = input.required<string>();
    readonly index = input.required<number>();
    readonly size = input.required<SizeConfig>();

    onValueChange(value: number): void {
        this.library.setSizeValue(this.id(), this.index(), value);
    }

    toggleFlip(axis: 'x' | 'y'): void {
        this.library.toggleFlip(this.id(), this.index(), axis);
    }

    remove(): void {
        this.library.deleteSize(this.id(), this.index());
    }

    duplicate(){
        this.library.addSize(this.id(), this.size().value)
    }
}
