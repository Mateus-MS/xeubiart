import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, OnDestroy, signal, ViewChild } from '@angular/core';
import { VisibilityToggler } from '../visibility-toggler/visibility-toggler';
import { UiInputDirective } from '../../../../../../directives/uiInputDirective';
import { FileUploadWrapper } from '../file-upload-wrapper/file-upload-wrapper';

export const TATTOO_STYLES = [
    { value: 'fine-line', label: 'Fine Line' },
    { value: 'blackwork', label: 'Blackwork' },
    { value: 'floral', label: 'Floral' },
    { value: 'red-trace', label: 'Red Trace' },
    { value: 'authoral', label: 'Autorais' },
] as const;

export type TattooStyle = typeof TATTOO_STYLES[number]['value'];

@Component({
	selector: 'app-item-popup',
	imports: [VisibilityToggler, UiInputDirective, FileUploadWrapper],
	templateUrl: './item-popup.html',
	styleUrl: './item-popup.css',
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ItemPopup {
	tattooStyles = TATTOO_STYLES;
	isOpen = signal<boolean>(false);

	title = signal('');
	style = signal<TattooStyle | ''>('');
	description = signal('');

	@ViewChild(FileUploadWrapper)fileUploadWrapper!: FileUploadWrapper;
	@ViewChild(VisibilityToggler)visibilityToggler!: VisibilityToggler;

	open() {
		this.isOpen.set(true);
	}

	close() {
		this.isOpen.set(false);
	}

	canCreateWork(): boolean {
		return (
			this.title().trim().length > 0 &&
			this.style() !== '' &&
			this.description() !== '' &&
			this.fileUploadWrapper?.uploadedFiles.length > 0
		);
	}

	createWork() {
		const formData = new FormData();

		formData.append('title', this.title());
		formData.append('style', this.style());
		formData.append('description', this.description());
		formData.append(
			'visibility',
			String(this.visibilityToggler.isActive)
		);

		for (const item of this.fileUploadWrapper.uploadedFiles) {
			formData.append('images', item.file, item.file.name);
		}

		console.log('Request data:', {
			title: this.title(),
			style: this.style(),
			description: this.description(),
			visibility: this.visibilityToggler.isActive,
			images: this.fileUploadWrapper.uploadedFiles.map(item => item.file),
		});

		// this.http.post('/api/works', formData).subscribe(...)
	}

	toggle() {
		this.isOpen.update(value => !value);
	}
}
