import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';

interface UploadedFile {
	id: string;
	file: File;
	url: string;
}

@Component({
	selector: 'app-file-upload-wrapper',
	imports: [],
	templateUrl: './file-upload-wrapper.html',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileUploadWrapper {
  	uploadedFiles: UploadedFile[] = [];
	draggedIndex: number | null = null;

	@ViewChild('uploader') uploader!: ElementRef;

	openFilePicker() {
		this.uploader.nativeElement.open();
	}

  	onUploadFile(event: Event){
		const customEvent = event as CustomEvent<{ files: File[] }>;

		this.appendImages(customEvent.detail.files)
	}

	appendImages(files: File[]){
		this.uploadedFiles = [
			...this.uploadedFiles,
			...files.map(file => ({
				id: crypto.randomUUID(),
				file,
				url: URL.createObjectURL(file),
			})),
		];
	}

	removeFile(index: number){
		const [removed] = this.uploadedFiles.splice(index, 1);

		if (removed) {
			URL.revokeObjectURL(removed.url);
		}

		this.uploadedFiles = [...this.uploadedFiles];
	}

	setAsCover(index: number){
		this.reorderFile(index, 0);
	}

	reorderFile(fromIndex: number, toIndex: number){
		if (
			fromIndex < 0 ||
			fromIndex >= this.uploadedFiles.length ||
			toIndex < 0 ||
			toIndex >= this.uploadedFiles.length
		){
			return;
		}

		const files = [...this.uploadedFiles];
		const [file] = files.splice(fromIndex, 1);

		files.splice(toIndex, 0, file);

		this.uploadedFiles = files;
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

	onDrop(index: number){
		if (this.draggedIndex === null || this.draggedIndex === index) {
			return;
		}

		this.reorderFile(this.draggedIndex, index);

		this.draggedIndex = null;
	}

	ngOnDestroy(){
		for (const item of this.uploadedFiles) {
			URL.revokeObjectURL(item.url);
		}
	}
}
