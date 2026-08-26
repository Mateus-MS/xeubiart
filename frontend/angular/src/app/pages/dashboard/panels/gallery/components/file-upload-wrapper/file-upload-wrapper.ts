import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface UploadedFile {
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

  	onUploadFile(event: Event){
		const customEvent = event as CustomEvent<{ files: File[] }>;

		this.appendImages(customEvent.detail.files)
	}

	appendImages(files: File[]){
		this.uploadedFiles = [
			...this.uploadedFiles,
			...files.map(file => ({
				file,
				url: URL.createObjectURL(file),
			})),
		];
	}

	ngOnDestroy() {
		for (const item of this.uploadedFiles) {
			URL.revokeObjectURL(item.url);
		}
	}
}
