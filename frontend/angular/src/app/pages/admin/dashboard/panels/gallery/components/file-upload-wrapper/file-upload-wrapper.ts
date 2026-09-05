import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, output, ViewChild } from '@angular/core';
import { UploadedFile } from '../../../../../../../models/uploadedFile';

@Component({
	selector: 'app-file-upload-wrapper',
	imports: [],
	templateUrl: './file-upload-wrapper.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileUploadWrapper {
    files = input<UploadedFile[]>([]);

    filesSelected = output<File[]>();
    fileRemoved = output<number>();
    filesReordered = output<{
        fromIndex: number;
        toIndex: number;
    }>();

    draggedIndex: number | null = null;

    @ViewChild('uploader') uploader!: ElementRef;

    get filesCount(): number {
        return this.files().length;
    }

    openFilePicker() {
        this.uploader.nativeElement.open();
    }

    onUploadFile(event: Event) {
        const customEvent =
            event as CustomEvent<{ files: File[] }>;

        this.filesSelected.emit(customEvent.detail.files);
    }

    removeFile(index: number) {
        this.fileRemoved.emit(index);
    }

    setAsCover(index: number) {
        this.reorderFile(index, 0);
    }

    reorderFile(fromIndex: number, toIndex: number) {
        if (
            fromIndex < 0 ||
            fromIndex >= this.files().length ||
            toIndex < 0 ||
            toIndex >= this.files().length
        ) {
            return;
        }

        this.filesReordered.emit({
            fromIndex,
            toIndex
        });
    }

    onDragStart(index: number) {
        this.draggedIndex = index;
    }

    onDragEnd() {
        this.draggedIndex = null;
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onDrop(index: number) {
        if (
            this.draggedIndex === null ||
            this.draggedIndex === index
        ) {
            return;
        }

        this.reorderFile(this.draggedIndex, index);
        this.draggedIndex = null;
    }
}